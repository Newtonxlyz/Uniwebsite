/* course-storage.js · localStorage 抽象
   所有 course_* 模块都用它读写。NLFEA 用 nlfea_ 前缀,本系统用 course_ 前缀。
   API: get / set / remove / getObject / exportAll / importBackup / clearAll / size
*/
(function() {
  'use strict';

  const NS = 'course_';

  function key(name) { return NS + name; }

  function get(name, fallback) {
    try {
      const raw = localStorage.getItem(key(name));
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.error('[CourseStorage.get]', name, e);
      return fallback;
    }
  }

  function getObject(name, fallback) {
    return get(name, fallback);
  }

  function set(name, value) {
    try {
      localStorage.setItem(key(name), JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('[CourseStorage.set]', name, e);
      return false;
    }
  }

  function remove(name) {
    localStorage.removeItem(key(name));
  }

  function exportAll(courseId) {
    const prefix = courseId ? NS + courseId + '_' : NS;
    const data = {};
    Object.keys(localStorage)
      .filter(k => k.startsWith(prefix))
      .forEach(k => { data[k] = localStorage.getItem(k); });
    return {
      _meta: {
        exportedAt: new Date().toISOString(),
        version: '1.0',
        app: 'Lvyz Course System',
        courseId: courseId || 'all'
      },
      data
    };
  }

  function importBackup(payload) {
    if (!payload || !payload.data) throw new Error('无效的备份文件');
    let count = 0;
    for (const [k, v] of Object.entries(payload.data)) {
      if (k.startsWith(NS)) {
        localStorage.setItem(k, v);
        count++;
      }
    }
    return count;
  }

  function downloadBackup(courseId) {
    const data = exportAll(courseId);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    a.download = `${courseId || 'all-courses'}-${ts}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function uploadBackup() {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json';
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return reject(new Error('未选择文件'));
        try {
          const text = await file.text();
          const data = JSON.parse(text);
          const count = importBackup(data);
          resolve(count);
        } catch (err) {
          reject(err);
        }
      };
      input.click();
    });
  }

  function clearAll(courseId) {
    const prefix = courseId ? NS + courseId : NS;
    Object.keys(localStorage)
      .filter(k => k.startsWith(prefix))
      .forEach(k => localStorage.removeItem(k));
  }

  function size() {
    let total = 0;
    Object.keys(localStorage)
      .filter(k => k.startsWith(NS))
      .forEach(k => { total += (localStorage.getItem(k) || '').length; });
    return total;
  }

  window.CourseStorage = {
    get, getObject, set, remove,
    exportAll, importBackup,
    downloadBackup, uploadBackup,
    clearAll, size,
    _NS: NS
  };
})();