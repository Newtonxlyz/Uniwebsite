// app.js - 通用工具 + 首页/课程页/数据装载

const App = {
  // 数据装载到 window.NL_DATA
  // 优先使用 inline-data.js（data/inline-data.js）注入的数据，
  // 这样在 file:// 协议下（双击 index.html）也能工作。
  // 若 inline 数据存在则跳过 fetch；否则从 fetch 获取。
  async loadData() {
    if (!window.NL_DATA) window.NL_DATA = {};
    if (window.NL_DATA.chapters && window.NL_DATA.flashcards && window.NL_DATA.exam) {
      return window.NL_DATA;
    }
    try {
      const [chRes, fcRes, exRes] = await Promise.all([
        fetch('data/chapters.json'),
        fetch('data/flashcards.json'),
        fetch('data/exam.json'),
      ]);
      const ch = await chRes.json();
      const fc = await fcRes.json();
      const ex = await exRes.json();
      window.NL_DATA.chapters = ch.chapters || ch;
      window.NL_DATA.flashcards = fc.flashcards || fc;
      window.NL_DATA.exam = ex.exam || ex;
    } catch (e) {
      console.error('Failed to load data and no inline data present.', e);
    }
    return window.NL_DATA;
  },

  getChapters() {
    return (window.NL_DATA && window.NL_DATA.chapters) || [];
  },
  getCards() {
    return (window.NL_DATA && window.NL_DATA.flashcards) || [];
  },
  getExam() {
    return (window.NL_DATA && window.NL_DATA.exam) || { questions: [], passingScore: 90 };
  },

  // 渲染首页章节卡片
  renderChapters() {
    const grid = document.getElementById("chapterGrid");
    if (!grid) return;
    const chapters = this.getChapters();
    if (!chapters.length) return;
    grid.innerHTML = chapters.map((c) => {
      const p = NLProgress.get(c.slug);
      const statusBadge = p.status === "completed"
        ? '<span class="badge badge-emerald">已完成</span>'
        : p.status === "in_progress"
        ? '<span class="badge badge-cyan">学习中</span>'
        : '<span class="badge badge-dim">未开始</span>';
      const pct = p.status === "completed" ? 100 : p.status === "in_progress" ? 50 : 0;
      return `
        <a href="lesson/${c.slug}.html" class="chapter-card">
          <div class="ch-num">第 ${c.num} 章 · ${c.startPage}–${c.endPage} 页</div>
          <div class="ch-title">${c.title}</div>
          <p class="text-dim text-sm">${c.titleEn}</p>
          <p class="text-dimmer text-sm mt-2">${(c.sections || []).length} 个小节</p>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">
            ${statusBadge}
            <span class="text-dimmer text-sm">${p.studyMinutes || 0} 分钟</span>
          </div>
          <div class="ch-progress"><div class="ch-progress-bar" style="width:${pct}%"></div></div>
        </a>`;
    }).join("");
  },

  // 渲染顶部统计
  renderStats() {
    const sum = NLProgress.summary();
    const total = this.getChapters().length;
    const completed = sum.completed;
    const inProgress = sum.inProgress;
    const notStarted = total - completed - inProgress;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    if (document.getElementById("statCompleted"))
      document.getElementById("statCompleted").textContent = completed;
    if (document.getElementById("statInProgress"))
      document.getElementById("statInProgress").textContent = inProgress;
    if (document.getElementById("statNotStarted"))
      document.getElementById("statNotStarted").textContent = notStarted;
    if (document.getElementById("statMinutes"))
      document.getElementById("statMinutes").textContent = sum.totalMinutes;
    if (document.getElementById("totalBar"))
      document.getElementById("totalBar").style.width = pct + "%";
    if (document.getElementById("totalPct"))
      document.getElementById("totalPct").textContent = pct + "% 完成";
  },

  bindStorageTools() {
    const exp = document.getElementById("exportBtn");
    const imp = document.getElementById("importBtn");
    if (exp) exp.onclick = () => { NLStorage.downloadBackup(); };
    if (imp) imp.onclick = async () => {
      try {
        const n = await NLStorage.uploadBackup();
        alert('导入成功：已恢复 ' + n + ' 块数据');
        location.reload();
      } catch (e) {
        alert('导入失败：' + e.message);
      }
    };
  },

  // 状态按钮 HTML
  statusButtonsHTML(slug) {
    const p = NLProgress.get(slug);
    return `
      <div class="status-buttons">
        <button class="status-btn ${p.status === 'not_started' ? 'active-not' : ''}" data-status="not_started">未开始</button>
        <button class="status-btn ${p.status === 'in_progress' ? 'active-prog' : ''}" data-status="in_progress">学习中</button>
        <button class="status-btn ${p.status === 'completed' ? 'active-done' : ''}" data-status="completed">已完成</button>
      </div>
      <div class="btn-row">
        <span class="text-dim text-sm">学习时长：<strong id="studyMin">${p.studyMinutes || 0}</strong> 分钟</span>
        <button class="btn" data-addmin="15">+15 分</button>
        <button class="btn" data-addmin="30">+30 分</button>
        <button class="btn" data-addmin="60">+60 分</button>
        <button class="btn" id="resetChBtn">重置本章</button>
      </div>
    `;
  },

  notesHTML(slug) {
    const notes = NLNotes.getAll(slug);
    return `
      <h4 style="margin-top:18px;">📝 笔记 (${notes.length})</h4>
      <textarea class="note-area" id="noteInput" placeholder="记录要点、疑问、灵感..."></textarea>
      <div class="btn-row">
        <button class="btn btn-primary" id="addNoteBtn">添加笔记</button>
      </div>
      <div class="comment-list" id="notesList">
        ${notes.map(n => `
          <div class="comment-item">
            <div>${escapeHtml(n.content).replace(/\n/g, '<br>')}</div>
            <div class="comment-meta">${new Date(n.createdAt).toLocaleString('zh-CN')}</div>
          </div>
        `).join('')}
        ${notes.length === 0 ? '<p class="text-dimmer text-sm">还没有笔记，开始记录吧。</p>' : ''}
      </div>
    `;
  },

  bindLesson(slug) {
    document.querySelectorAll('.status-btn').forEach(btn => {
      btn.onclick = () => {
        const status = btn.dataset.status;
        NLProgress.setStatus(slug, status);
        const container = document.getElementById('statusSection');
        if (container) container.innerHTML = this.statusButtonsHTML(slug);
        this.bindLesson(slug);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
    });
    document.querySelectorAll('[data-addmin]').forEach(btn => {
      btn.onclick = () => {
        const m = parseInt(btn.dataset.addmin);
        NLProgress.addStudyMinutes(slug, m);
        const container = document.getElementById('statusSection');
        if (container) container.innerHTML = this.statusButtonsHTML(slug);
        this.bindLesson(slug);
      };
    });
    const resetBtn = document.getElementById('resetChBtn');
    if (resetBtn) resetBtn.onclick = () => {
      if (confirm('确认重置本章所有进度和笔记？')) {
        NLProgress.reset(slug);
        NLStorage.remove('notes_' + slug);
        location.reload();
      }
    };
    const addBtn = document.getElementById('addNoteBtn');
    const noteInput = document.getElementById('noteInput');
    if (addBtn && noteInput) {
      addBtn.onclick = () => {
        const v = noteInput.value.trim();
        if (!v) return alert('请输入笔记内容');
        NLNotes.add(slug, v);
        noteInput.value = '';
        const sec = document.getElementById('notesSection');
        if (sec) {
          sec.innerHTML = this.notesHTML(slug);
          document.getElementById('addNoteBtn').onclick = addBtn.onclick;
        }
      };
    }
  },
};

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[c]);
}

window.NLApp = App;
window.escapeHtml = escapeHtml;
