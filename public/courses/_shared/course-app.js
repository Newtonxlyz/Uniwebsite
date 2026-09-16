/* course-app.js · 课程子系统通用 UI 渲染 + 绑定
   提供所有页面的标准 UI 组件,解耦课程内容。
   API: statusButtonsHTML / notesHTML / bindProgress / bindTimer / renderTopnav / renderChapterNav
*/
(function() {
  'use strict';

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  }

  function statusButtonsHTML(chapterId) {
    const p = CourseProgress.get(chapterId);
    return `
      <div class="status-buttons">
        <button class="status-btn ${p.status === 'not_started' ? 'active-not' : ''}" data-status="not_started">未开始</button>
        <button class="status-btn ${p.status === 'in_progress' ? 'active-prog' : ''}" data-status="in_progress">学习中</button>
        <button class="status-btn ${p.status === 'completed' ? 'active-done' : ''}" data-status="completed">已完成</button>
      </div>
      <div class="btn-row">
        <span class="text-dim text-sm">本章时长:<strong id="studyMin">${p.seconds || 0}</strong> 分</span>
        <button class="btn" data-addmin="15">+15 分</button>
        <button class="btn" data-addmin="30">+30 分</button>
        <button class="btn" data-addmin="60">+60 分</button>
        <button class="btn" id="resetChBtn">重置本章</button>
      </div>
    `;
  }

  function notesHTML(chapterId) {
    const notes = CourseNotes.getAll(chapterId);
    return `
      <h3 style="margin-top:18px;">📝 笔记 (${notes.length})</h3>
      <textarea class="note-area" id="noteInput" placeholder="记录要点、疑问、灵感…"></textarea>
      <div class="btn-row" style="margin-top:8px;">
        <button class="btn btn-primary" id="addNoteBtn">添加笔记</button>
        <button class="btn" id="exportNotesBtn">导出 Markdown</button>
      </div>
      <div class="comment-list" id="notesList">
        ${notes.map(n => `
          <div class="comment-item">
            <div>${escapeHtml(n.content).replace(/\n/g, '<br>')}</div>
            <div class="comment-meta">${new Date(n.createdAt).toLocaleString('zh-CN')} ${n.tags.length ? '· ' + n.tags.map(t => '#' + t).join(' ') : ''}</div>
            <div style="margin-top:6px;">
              <button class="btn btn-danger" data-note-id="${n.id}" style="padding:3px 10px;font-size:12px;">删除</button>
            </div>
          </div>
        `).join('')}
        ${notes.length === 0 ? '<p class="text-dimmer text-sm">还没有笔记,开始记录吧。</p>' : ''}
      </div>
    `;
  }

  function bindProgress(chapterId) {
    document.querySelectorAll('.status-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        CourseProgress.setChapterStatus(chapterId, btn.dataset.status);
        const sec = document.getElementById('statusSection');
        if (sec) sec.innerHTML = statusButtonsHTML(chapterId);
        bindProgress(chapterId);
      });
    });
    document.querySelectorAll('[data-addmin]').forEach(btn => {
      btn.addEventListener('click', () => {
        const m = parseInt(btn.dataset.addmin);
        CourseProgress.addStudySeconds(chapterId, m * 60);
        const sec = document.getElementById('statusSection');
        if (sec) sec.innerHTML = statusButtonsHTML(chapterId);
        bindProgress(chapterId);
      });
    });
    const resetBtn = document.getElementById('resetChBtn');
    if (resetBtn) resetBtn.addEventListener('click', () => {
      if (confirm('确认重置本章进度和笔记?')) {
        CourseProgress.setChapterStatus(chapterId, 'not_started');
        CourseNotes.remove(chapterId, '_all_'); // 失效,改为...
        location.reload();
      }
    });
  }

  function bindNotes(chapterId) {
    const addBtn = document.getElementById('addNoteBtn');
    const noteInput = document.getElementById('noteInput');
    if (addBtn && noteInput) {
      addBtn.addEventListener('click', () => {
        const v = noteInput.value.trim();
        if (!v) return alert('请输入笔记内容');
        CourseNotes.add(chapterId, v);
        noteInput.value = '';
        refreshNotes(chapterId);
      });
    }
    const exportBtn = document.getElementById('exportNotesBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const notes = CourseNotes.getAll(chapterId);
        const md = notes.map(n => `## ${new Date(n.createdAt).toLocaleString('zh-CN')}\n\n${n.content}`).join('\n\n---\n\n');
        const blob = new Blob([md], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `${chapterId}-notes.md`;
        document.body.appendChild(a); a.click();
        document.body.removeChild(a); URL.revokeObjectURL(url);
      });
    }
    document.querySelectorAll('#notesList [data-note-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('删除这条笔记?')) {
          CourseNotes.remove(chapterId, btn.dataset.noteId);
          refreshNotes(chapterId);
        }
      });
    });
  }

  function refreshNotes(chapterId) {
    const sec = document.getElementById('notesSection');
    if (sec) {
      sec.innerHTML = notesHTML(chapterId);
      bindNotes(chapterId);
    }
  }

  function bindTimer(chapterId) {
    CourseProgress.startTimer(chapterId);
    setInterval(() => CourseProgress.tickEvery(30), 30000);
    // 离开页面时累加
    window.addEventListener('beforeunload', () => CourseProgress.stopTimer());
    window.addEventListener('pagehide', () => CourseProgress.stopTimer());
  }

  function renderTopnav(courseSlug, courseTitle, activeNav) {
    return `
      <nav class="topnav">
        <div class="topnav-inner">
          <a href="../../../learn/${courseSlug}/" target="_blank" class="brand">${escapeHtml(courseTitle)}</a>
          <a href="index.html" class="nav-link ${activeNav === 'home' ? 'active' : ''}">课程主页</a>
          <a href="flashcards.html" class="nav-link ${activeNav === 'flashcards' ? 'active' : ''}">闪卡</a>
          <a href="quizzes.html" class="nav-link ${activeNav === 'quizzes' ? 'active' : ''}">章节测验</a>
          <a href="mistakes.html" class="nav-link ${activeNav === 'mistakes' ? 'active' : ''}">错题本</a>
          <a href="report.html" class="nav-link ${activeNav === 'report' ? 'active' : ''}">学习报告</a>
          <span class="nav-spacer"></span>
          <button class="nav-btn" data-theme-toggle title="切换主题">🌓</button>
          <button class="nav-btn" id="exportBtn">⬇ 导出</button>
          <button class="nav-btn" id="importBtn">⬆ 导入</button>
        </div>
      </nav>
    `;
  }

  function renderProgressRing(pct, label) {
    const radius = 50, circ = 2 * Math.PI * radius;
    const offset = circ * (1 - pct / 100);
    return `
      <div class="progress-ring">
        <svg width="120" height="120">
          <circle class="ring-bg" cx="60" cy="60" r="${radius}"></circle>
          <circle class="ring-fg" cx="60" cy="60" r="${radius}"
                  stroke-dasharray="${circ}" stroke-dashoffset="${offset}"></circle>
        </svg>
        <div class="ring-text">${Math.round(pct)}%<small>${label || ''}</small></div>
      </div>
    `;
  }

  function renderChapterList(chaptersJson) {
    const sum = CourseProgress.summary();
    return chaptersJson.chapters.map((c, idx) => {
      const p = CourseProgress.get(c.id);
      const statusLabel = p.status === 'completed' ? '✓ 已完成' : p.status === 'in_progress' ? '⋯ 学习中' : '○ 未开始';
      return `
        <a href="${c.slug}.html" class="chapter-row ${p.status}">
          <div class="chapter-num">${idx + 1}</div>
          <div class="chapter-info">
            <div class="chapter-info-title">${escapeHtml(c.title)}</div>
            <div class="chapter-info-meta">${escapeHtml(c.subtitle || '')} · ${c.estimatedMinutes || 0} 分钟 · ${p.seconds > 0 ? Math.round(p.seconds / 60) + ' 分已学' : '未开始'}</div>
          </div>
          <span class="chapter-status ${p.status}">${statusLabel}</span>
        </a>
      `;
    }).join('');
  }

  window.CourseApp = {
    statusButtonsHTML, notesHTML,
    bindProgress, bindNotes, bindTimer,
    renderTopnav, renderProgressRing, renderChapterList,
    escapeHtml
  };
})();