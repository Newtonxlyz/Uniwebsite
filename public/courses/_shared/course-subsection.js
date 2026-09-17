/* course-subsection.js · 子节级进度追踪
   处理章节正文里的 .quiz-section(小节检测):
   - 默认折叠,只显示问题 + 选项
   - 点选项立即判分,显示反馈
   - 全部答对 → 自动标记该子节完成
   - 子节进度写到 localStorage
   API: init / bindAll / getSubsections / getSubsectionProgress / isSubsectionDone
*/
(function() {
  'use strict';

  let _courseId = null;
  let _chapterId = null;

  function _key(sectionId) {
    return `${_courseId}_${_chapterId}_subsec_${sectionId}`;
  }

  function init(courseId, chapterId) {
    _courseId = courseId;
    _chapterId = chapterId;
  }

  // 存储结构: { sectionId: { answers: {qId: idx}, done: bool, score: number } }
  function _loadSection(sectionId) {
    try {
      return JSON.parse(localStorage.getItem(_key(sectionId))) || {
        answers: {},
        done: false,
        score: 0,
        total: 0,
      };
    } catch {
      return { answers: {}, done: false, score: 0, total: 0 };
    }
  }

  function _saveSection(sectionId, data) {
    localStorage.setItem(_key(sectionId), JSON.stringify(data));
  }

  function isSubsectionDone(sectionId) {
    return _loadSection(sectionId).done;
  }

  function getSubsectionProgress(sectionId) {
    return _loadSection(sectionId);
  }

  function getAllSubsectionsProgress() {
    const map = {};
    document.querySelectorAll('.quiz-section[data-section]').forEach(el => {
      const id = el.getAttribute('data-section');
      map[id] = _loadSection(id);
    });
    return map;
  }

  function getSubsections() {
    const list = [];
    document.querySelectorAll('.quiz-section[data-section]').forEach(el => {
      list.push({
        sectionId: el.getAttribute('data-section'),
        element: el,
        totalQuestions: el.querySelectorAll('.quiz-question').length,
      });
    });
    return list;
  }

  // 进度聚合:整章进度 = (子节已完成数 / 子节总数) + 章节测验通过
  function chapterProgressSummary() {
    const subs = getSubsections();
    const completedSubs = subs.filter(s => _loadSection(s.sectionId).done).length;
    return {
      totalSubsections: subs.length,
      completedSubsections: completedSubs,
      subPercent: subs.length ? Math.round(completedSubs / subs.length * 100) : 100,
    };
  }

  // 绑定单个 quiz-section:默认折叠 + 即时判分
  function bindQuizSection(sectionEl) {
    if (!sectionEl) return;
    const sectionId = sectionEl.getAttribute('data-section');
    if (!sectionId) return;

    // 已经有答案了:显示完整答题态
    const savedData = _loadSection(sectionId);
    const hasSaved = savedData && savedData.total > 0;

    if (!hasSaved) {
      // 默认折叠 quiz-question 和 quiz-feedback,只显示标题
      const savedState = _loadSection(sectionId);
      // 在 section 顶部注入"开始本节小测"按钮
      const intro = document.createElement('div');
      intro.className = 'subsection-quiz-intro';
      intro.innerHTML = `
        <button class="btn btn-primary" id="startBtn">▶ 开始本节小测</button>
        <span class="text-dim" style="margin-left:12px;font-size:13px;">${sectionEl.querySelectorAll('.quiz-question').length} 道题 · 学完正文后再来</span>
      `;
      sectionEl.insertBefore(intro, sectionEl.firstChild.nextSibling);

      // 隐藏题目
      sectionEl.querySelectorAll('.quiz-question').forEach(q => q.style.display = 'none');

      // 绑定按钮:点击展开
      intro.querySelector('#startBtn').addEventListener('click', () => {
        sectionEl.querySelectorAll('.quiz-question').forEach(q => q.style.display = '');
        intro.style.display = 'none';
      });
    }

    // 把 feedback 隐藏(展开后作答时显示)
    const feedbacks = sectionEl.querySelectorAll('.quiz-feedback');
    feedbacks.forEach(fb => fb.style.display = 'none');

    // 给 question 加编号 + 给 option 加点击事件
    const questions = sectionEl.querySelectorAll('.quiz-question');
    questions.forEach((q, idx) => {
      // 找数据点(answer),支持 "0" / "true" / "false" / 字符串
      const correctAttr = q.getAttribute('data-answer');
      if (correctAttr === null) return;
      const correct = ['true', 'false'].includes(correctAttr)
          ? (correctAttr === 'true')
          : (isNaN(Number(correctAttr)) ? correctAttr : Number(correctAttr));

      q.setAttribute('data-qid', sectionId + '-q' + idx);
      q.classList.add('quiz-q-interactive');

      const opts = q.querySelectorAll('.quiz-option');
      opts.forEach((opt, optIdx) => {
        opt.classList.add('quiz-option-interactive');
        opt.addEventListener('click', () => {
          if (q.getAttribute('data-answered') === '1') return;
          q.setAttribute('data-answered', '1');
          opts.forEach(o => o.classList.remove('quiz-opt-selected'));
          opt.classList.add('quiz-opt-selected');

          // 判分
          const isCorrect = correct === optIdx || correct === opt.getAttribute('data-correct');
          q.setAttribute('data-correct', isCorrect ? '1' : '0');

          // 显示 feedback
          const fb = q.querySelector('.quiz-feedback');
          if (fb) {
            fb.style.display = 'block';
            fb.classList.add(isCorrect ? 'quiz-feedback-ok' : 'quiz-feedback-no');
          }

          // 标记对/错颜色
          if (isCorrect) opt.classList.add('quiz-opt-correct');
          else {
            opt.classList.add('quiz-opt-wrong');
            // 高亮正确选项
            if (typeof correct === 'number' && opts[correct]) {
              opts[correct].classList.add('quiz-opt-correct-hint');
            }
          }

          // 写入 storage
          const data = _loadSection(sectionId);
          data.answers[idx] = optIdx;
          data.total = questions.length;
          // 重新计算 score(简单计数:当前已答对的题)
          let correctCount = 0;
          questions.forEach((qq, ii) => {
            if (qq.getAttribute('data-correct') === '1') correctCount++;
          });
          data.score = correctCount;
          data.done = correctCount === questions.length && questions.length > 0;
          _saveSection(sectionId, data);

          // 更新进度 UI
          updateChapterProgressUI();
        });
      });
    });

    // 恢复已答状态
    const saved = _loadSection(sectionId);
    if (saved.answers) {
      questions.forEach((q, idx) => {
        const chosen = saved.answers[idx];
        if (chosen !== undefined) {
          q.setAttribute('data-answered', '1');
          const opts = q.querySelectorAll('.quiz-option');
          if (opts[chosen]) opts[chosen].classList.add('quiz-opt-selected');
          const fb = q.querySelector('.quiz-feedback');
          if (fb) fb.style.display = 'block';
          const correctAttr = q.getAttribute('data-answer');
          const correct = ['true', 'false'].includes(correctAttr)
              ? (correctAttr === 'true')
              : (isNaN(Number(correctAttr)) ? correctAttr : Number(correctAttr));
          const isCorrect = chosen === correct;
          if (isCorrect) {
            if (opts[chosen]) opts[chosen].classList.add('quiz-opt-correct');
          } else {
            if (opts[chosen]) opts[chosen].classList.add('quiz-opt-wrong');
            if (typeof correct === 'number' && opts[correct]) opts[correct].classList.add('quiz-opt-correct-hint');
          }
        }
      });
    }
  }

  // 顶部显示章节进度条
  function updateChapterProgressUI() {
    const summary = chapterProgressSummary();
    const bar = document.getElementById('subsectionProgressBar');
    const text = document.getElementById('subsectionProgressText');
    if (bar) bar.style.width = summary.subPercent + '%';
    if (text) text.textContent = `${summary.completedSubsections}/${summary.totalSubsections} 子节完成`;

    // 如果全部子节完成,弹个小提示
    if (summary.totalSubsections > 0 && summary.completedSubsections === summary.totalSubsections) {
      const note = document.getElementById('subsectionAllDone');
      if (note) note.style.display = 'flex';
    }
  }

  function bindAll() {
    const sections = document.querySelectorAll('.quiz-section[data-section]');
    sections.forEach(s => bindQuizSection(s));
    updateChapterProgressUI();
  }

  // 重置子节进度(供排查)
  function reset() {
    document.querySelectorAll('.quiz-section[data-section]').forEach(el => {
      localStorage.removeItem(_key(el.getAttribute('data-section')));
    });
  }

  window.CourseSubsection = {
    init, bindAll, isSubsectionDone, getSubsectionProgress,
    getAllSubsectionsProgress, getSubsections, chapterProgressSummary,
    reset,
  };
})();