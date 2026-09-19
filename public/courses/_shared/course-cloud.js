/* course-cloud.js · 学习数据云端同步引擎
   挂在 CourseStorage.set/remove 后面打补丁：11 个课程模块零改动。

   原理:
   - 页面加载时从 URL 解析 courseId,立即发起 pull(早于内联渲染脚本)
   - 所有学习数据本来就走 CourseStorage,补丁把每次写入标记 dirty 并入队推送
   - 合并策略 LWW:每个 key 带客户端 ts(Date.now()),服务器仅接受更新 ts
   - 本设备首次同步且双端都有数据 → 服务器为准,本地副本存 conflict_ 前缀留底
   - 未登录 / 离线 → 纯本地模式,行为与原来完全一致

   API: ready(Promise) / syncNow() / mode() / status()
*/
(function() {
  'use strict';

  const NS = 'course_';
  const META_NAME = 'cloud_meta';      // 模块名,完整 key = course_cloud_meta(不含 courseId,不参与同步)
  const PULL_TIMEOUT = 4000;           // pull 超时:网络差时不阻塞渲染
  const FLUSH_DELAY = 1500;            // 写入防抖
  const RELOAD_GUARD = 'cloud_reload_guard';

  let _courseId = null;
  let _mode = 'unknown';               // cloud | local
  let _serverChanged = false;          // 本次 pull 服务器是否覆盖了本地数据
  let _flushTimer = null;
  let _readyResolve;
  const _ready = new Promise(function(res) { _readyResolve = res; });

  /* ---------- 基础工具 ---------- */

  function _full(name) { return NS + name; }
  function _parse(raw) { try { return JSON.parse(raw); } catch (e) { return null; } }

  function _detectCourseId() {
    // http(s)://.../courses/<slug>/... 与 file:///.../courses/<slug>/... 通用
    const m = location.pathname.match(/courses\/([^\/]+)\//);
    return m ? m[1] : null;
  }

  // 是否属于本课程的学习数据 key(模块名,无 NS 前缀)
  function _matches(name) {
    return !!_courseId && name !== META_NAME && name.indexOf(_courseId) !== -1;
  }

  function _meta() { return CourseStorage.get(META_NAME, {}); }
  function _saveMeta(m) { CourseStorage.set(META_NAME, m); }

  /* ---------- 补丁:在 CourseStorage 写入后标记 dirty ---------- */

  function _patch() {
    if (CourseStorage.__cloudPatched) return;
    const origSet = CourseStorage.set;
    const origRemove = CourseStorage.remove;

    CourseStorage.set = function(name, value) {
      const r = origSet.call(CourseStorage, name, value);
      if (_matches(name)) {
        const meta = _meta();
        meta[_full(name)] = { ts: Date.now(), dirty: true, deleted: false };
        origSet.call(CourseStorage, META_NAME, meta);
        _scheduleFlush();
      }
      return r;
    };

    CourseStorage.remove = function(name) {
      const r = origRemove.call(CourseStorage, name);
      if (_matches(name)) {
        const meta = _meta();
        meta[_full(name)] = { ts: Date.now(), dirty: true, deleted: true };
        origSet.call(CourseStorage, META_NAME, meta);
        _scheduleFlush();
      }
      return r;
    };

    CourseStorage.__cloudPatched = true;
  }

  /* ---------- 推送(flush) ---------- */

  function _scheduleFlush() {
    if (_flushTimer) clearTimeout(_flushTimer);
    _flushTimer = setTimeout(_flush, FLUSH_DELAY);
  }

  async function _flush() {
    if (_mode !== 'cloud' || !_courseId) return;
    if (_flushTimer) { clearTimeout(_flushTimer); _flushTimer = null; }

    const meta = _meta();
    const entries = [];
    const pushed = [];   // [{fullKey, ts, deleted}]
    const orphans = [];  // 脏但本地值已消失的 key,待清理标记

    // 1) meta 里的脏 key —— 墓碑已不在 localStorage,必须从这里驱动
    for (const k of Object.keys(meta)) {
      if (k.indexOf(NS) !== 0 || k.indexOf(_courseId) === -1) continue;
      const m = meta[k];
      if (!m || !m.dirty) continue;
      if (m.deleted) {
        entries.push({ key: k, deleted: true, ts: m.ts });
        pushed.push({ fullKey: k, ts: m.ts, deleted: true });
      } else if (localStorage.getItem(k) !== null) {
        entries.push({ key: k, value: _parse(localStorage.getItem(k)), ts: m.ts });
        pushed.push({ fullKey: k, ts: m.ts, deleted: false });
      } else {
        orphans.push(k);
      }
    }
    // 2) 从未同步过的本地存量(首次迁移 / 首次登录推送)
    for (const k of Object.keys(localStorage)) {
      if (k.indexOf(NS) !== 0 || k.indexOf(_courseId) === -1) continue;
      if (meta[k]) continue;
      const ts = Date.now();
      entries.push({ key: k, value: _parse(localStorage.getItem(k)), ts: ts });
      pushed.push({ fullKey: k, ts: ts, deleted: false });
    }
    if (!entries.length) {
      // 无推送也要清理孤立标记;回写前重读,防覆盖 await 窗口外的新写入
      if (orphans.length) {
        const m2 = _meta();
        orphans.forEach(k => { delete m2[k]; });
        _saveMeta(m2);
      }
      return;
    }

    try {
      const res = await fetch('/api/courses/state', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: _courseId, entries: entries })
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      // 重新读 meta 再合并结果:flush 是 await 的,期间可能有新写入,整体回写会覆盖它们
      const m2 = _meta();
      for (const p of pushed) {
        if (p.deleted) {
          localStorage.removeItem(p.fullKey);
          delete m2[p.fullKey];
        } else {
          m2[p.fullKey] = { ts: p.ts, dirty: false };
        }
      }
      _saveMeta(m2);
    } catch (e) {
      // 保持 dirty,下次 flush / 上线 / 页面隐藏时重试
      console.warn('[CourseCloud] flush failed, will retry:', e.message);
    }
  }

  /* ---------- 拉取 + 合并 ---------- */

  function _applyServer(e) {
    localStorage.setItem(e.key, JSON.stringify(e.value));
  }

  async function _sync() {
    let entries;
    try {
      const res = await Promise.race([
        fetch('/api/courses/state?courseId=' + encodeURIComponent(_courseId), { credentials: 'same-origin' }),
        new Promise(function(_, rej) { setTimeout(function() { rej(new Error('pull timeout')); }, PULL_TIMEOUT); })
      ]);
      if (res.status === 401) { _mode = 'local'; _readyResolve(); return; }
      if (!res.ok) throw new Error('HTTP ' + res.status);
      entries = (await res.json()).entries || [];
    } catch (e) {
      // 离线 / 未部署 API / 超时 → 本地模式,行为同改造前
      _mode = 'local';
      console.warn('[CourseCloud] pull failed, local mode:', e.message);
      _readyResolve();
      return;
    }

    _mode = 'cloud';
    const meta = _meta();
    for (const e of entries) {
      const m = meta[e.key];
      const serverTs = Number(e.ts);
      const localRaw = localStorage.getItem(e.key);
      if (m && m.dirty) {
        // 本地有未推送的写入:LWW,服务器更新才覆盖
        if (serverTs > m.ts) { _applyServer(e); meta[e.key] = { ts: serverTs, dirty: false }; _serverChanged = true; }
      } else if (!m) {
        if (localRaw === null) {
          _applyServer(e); meta[e.key] = { ts: serverTs, dirty: false };
        } else {
          // 双端冲突(本设备首次同步):服务器为准,本地副本留底,不丢数据
          localStorage.setItem('conflict_' + e.key + '_' + Date.now(), localRaw);
          console.warn('[CourseCloud] conflict, server wins, local stashed:', e.key);
          _applyServer(e); meta[e.key] = { ts: serverTs, dirty: false }; _serverChanged = true;
        }
      } else if (serverTs > m.ts) {
        _applyServer(e); meta[e.key] = { ts: serverTs, dirty: false }; _serverChanged = true;
      }
    }
    _saveMeta(meta);

    // 先推送本地存量/脏数据,再宣告 ready
    await _flush();

    // 页面已用旧数据渲染 → 服务器有更新时刷新一次(sessionStorage 防循环)
    if (_serverChanged && !sessionStorage.getItem(RELOAD_GUARD)) {
      sessionStorage.setItem(RELOAD_GUARD, '1');
      location.reload();
      return;
    }
    sessionStorage.removeItem(RELOAD_GUARD);
    _readyResolve({ serverChanged: true });
  }

  /* ---------- 对外 API ---------- */

  function syncNow() { return _flush(); }
  function mode() { return _mode; }
  function status() {
    const meta = _meta();
    let dirty = 0, conflicts = 0;
    for (const k of Object.keys(localStorage)) {
      if (k.indexOf('conflict_' + NS) === 0) conflicts++;
    }
    for (const k of Object.keys(meta)) if (meta[k].dirty) dirty++;
    return { mode: _mode, courseId: _courseId, dirtyKeys: dirty, conflicts: conflicts };
  }

  /* ---------- 启动 ---------- */

  function _start() {
    if (!window.CourseStorage) return;
    _courseId = _detectCourseId();
    _patch();
    if (!_courseId) { _mode = 'local'; _readyResolve(); return; }
    _sync();
    window.addEventListener('online', function() { _flush(); });
    document.addEventListener('visibilitychange', function() {
      if (document.visibilityState === 'hidden') _flush();
    });
  }

  _start();

  window.CourseCloud = { ready: _ready, syncNow: syncNow, mode: mode, status: status };
})();
