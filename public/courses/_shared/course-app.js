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

  // ─────────────────────────────────────────────────
  // 讲解模板(学会并能讲解:每章节末自动生成讲解骨架)
  // 从 chapter.subsections[].title 提取要点,用户笔记作为"我的讲法"
  // ─────────────────────────────────────────────────
  function lectureTemplateHTML(chapterId, chaptersData) {
    const ch = chaptersData.chapters.find(c => c.id === chapterId);
    if (!ch) return '<p class="text-dim">章节数据未加载</p>';
    const subsections = ch.subsections || [];
    const userLecture = CourseNotes.getAll(chapterId).filter(n => n.tags?.includes('讲解'));
    return `
      <div class="lecture-template">
        <h3 style="margin-top:0;">🎙️ 讲解就绪模板</h3>
        <p class="text-dim" style="font-size: 13px; margin-bottom: 16px;">
          <strong style="color: var(--text);">目标:</strong>读完本节后,能用 3 分钟向他人讲清楚本章核心。
          下方要点自动从章节标题提取,你在笔记中加 <code style="background: var(--bg-elev); padding: 1px 6px; border-radius: 3px;">#讲解</code> 标签会出现在"我的讲法"区。
        </p>

        <div class="lecture-section">
          <h4 style="margin: 16px 0 8px;">📌 本章核心要点(自动)</h4>
          <ol style="padding-left: 20px; line-height: 1.8;">
            ${subsections.map((s, i) => `<li><strong>${s.title}</strong></li>`).join('')}
          </ol>
        </div>

        <div class="lecture-section">
          <h4 style="margin: 16px 0 8px;">💡 一句话总结(填空)</h4>
          <textarea class="note-area" id="lectureOneLine" placeholder="用一句话讲清本章:____ 是 ____,通过 ____ 实现 ____"
            style="min-height: 60px;"></textarea>
        </div>

        <div class="lecture-section">
          <h4 style="margin: 16px 0 8px;">📝 我的讲法(${userLecture.length} 条)</h4>
          ${userLecture.length === 0
            ? '<p class="text-dimmer" style="font-size: 13px;">还没有讲解笔记。添加笔记时输入 <code style="background: var(--bg-elev); padding: 1px 6px; border-radius: 3px;">#讲解</code> 标签即可归入这里。</p>'
            : userLecture.map(n => `
                <div class="lecture-note">
                  <div style="white-space: pre-wrap;">${escapeHtml(n.content)}</div>
                  <div class="text-dimmer" style="font-size: 11px; margin-top: 4px;">
                    ${new Date(n.createdAt).toLocaleString('zh-CN')}
                  </div>
                </div>
              `).join('')}
        </div>

        <div style="margin-top: 16px;">
          <button class="btn btn-primary" id="exportLectureBtn" style="margin-right: 8px;">⬇ 导出讲解模板 Markdown</button>
          <button class="btn" id="markLectureDoneBtn">✓ 标记讲解就绪</button>
        </div>
      </div>
    `;
  }

  function bindLectureTemplate(chapterId, chaptersData) {
    const ch = chaptersData.chapters.find(c => c.id === chapterId);
    if (!ch) return;
    // 恢复一句话总结
    const savedOneLine = CourseNotes.getLectureOneLine(chapterId);
    const oneLine = document.getElementById('lectureOneLine');
    if (oneLine && savedOneLine) oneLine.value = savedOneLine;
    if (oneLine) {
      oneLine.addEventListener('blur', () => CourseNotes.saveLectureOneLine(chapterId, oneLine.value));
    }
    // 导出
    const exportBtn = document.getElementById('exportLectureBtn');
    if (exportBtn) exportBtn.addEventListener('click', () => exportLectureMarkdown(chapterId, ch));
    // 标记讲解就绪
    const markBtn = document.getElementById('markLectureDoneBtn');
    if (markBtn) markBtn.addEventListener('click', () => {
      const st = CourseProgress.get(chapterId);
      CourseProgress.setChapterStatus(chapterId, 'completed');
      alert('✅ 已标记"讲解就绪",并把章节状态推进到"已完成"');
      // 刷新 statusSection
      const sec = document.getElementById('statusSection');
      if (sec) {
        sec.innerHTML = statusButtonsHTML(chapterId);
        bindProgress(chapterId);
      }
    });
  }

  function exportLectureMarkdown(chapterId, ch) {
    const subsections = ch.subsections || [];
    const userLecture = CourseNotes.getAll(chapterId).filter(n => n.tags?.includes('讲解'));
    const oneLine = CourseNotes.getLectureOneLine(chapterId) || '_(待填写)_';
    const md = [
      `# 讲解模板 · ${ch.title}`,
      ``,
      `> 课程:${ch.section || 'N/A'} · 章节:${ch.id} · 导出时间:${new Date().toLocaleString('zh-CN')}`,
      ``,
      `## 🎯 一句话总结`,
      oneLine,
      ``,
      `## 📌 本章核心要点`,
      ...subsections.map((s, i) => `${i + 1}. **${s.title}**`),
      ``,
      `## 💼 我的讲法`,
      ...(userLecture.length === 0
        ? ['_(暂无讲解笔记,加 #讲解 标签的笔记会自动归入这里)_']
        : userLecture.map(n => `- **"${new Date(n.createdAt).toLocaleDateString('zh-CN')}"**\n\n  ${n.content.split('\n').join('\n  ')}`)),
      ``,
      `---`,
      ``,
      `## 📚 应用案例(待补充)`,
      `_用一段话讲完本章在真实工程 / 学术场景里的用法_`,
    ].join('\n');
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chapterId}-lecture.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
        <a href="chapter-${c.slug}.html" class="chapter-row ${p.status}">
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
    lectureTemplateHTML, bindLectureTemplate, exportLectureMarkdown,
    escapeHtml
  };
})();