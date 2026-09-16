"""build_course.py - 通用课程批量生成脚本
   用法: python build-course.py <course_dir> <course_id> <course_slug> <course_title> <learn_url> [chapter_bodies_module]

   例(PINN):
     python build-course.py pinn-crash-reduction pinn-crash-reduction pinn-crash "AI+DOE+PINN" \
       https://lvyz.org/learn/pinn-crash _chapter_bodies

   例(GNN):
     python build-course.py gn-crash-guide gn-crash-guide gn-crash "GNN碰撞仿真降阶" \
       https://lvyz.org/learn/gn-crash

   课程目录结构:
     <course_dir>/
       data/{chapters,flashcards,quizzes}.json
       index.html  (生成)
       flashcards.html / quizzes.html / mistakes.html / report.html (生成)
       chapter-XX.html (生成)
       quiz-XX.html (生成)
       quiz-final.html (生成)
"""
import os, sys, json, importlib.util, re

# PowerShell GBK 兼容
try: sys.stdout.reconfigure(encoding='utf-8')
except: pass

# === CLI 参数 ===
if len(sys.argv) < 6:
    print(__doc__)
    sys.exit(1)

COURSE_DIR = sys.argv[1]                  # 如 pinn-crash-reduction
COURSE_ID = sys.argv[2]                   # 同上 (用于 JS 内 courseId)
COURSE_SLUG = sys.argv[3]                 # 如 pinn-crash
COURSE_TITLE = sys.argv[4]                # 如 AI+DOE+PINN
LEARN_URL = sys.argv[5]                   # 如 https://lvyz.org/learn/pinn-crash
BODIES_MODULE = sys.argv[6] if len(sys.argv) > 6 else None  # 可选: 章节正文模块名

ROOT = os.path.join(r'D:\LvyzWeb\platform\public\courses', COURSE_DIR)
TEMPLATES = r'D:\LvyzWeb\platform\scripts\templates'
DATA = os.path.join(ROOT, 'data')

if not os.path.isdir(ROOT):
    print(f'错误: 课程目录不存在 {ROOT}')
    sys.exit(1)

# === 读取数据 ===
with open(os.path.join(DATA, 'chapters.json'), encoding='utf-8') as f:
    chapters = json.load(f)
with open(os.path.join(DATA, 'flashcards.json'), encoding='utf-8') as f:
    flashcards = json.load(f)
with open(os.path.join(DATA, 'quizzes.json'), encoding='utf-8') as f:
    quizzes = json.load(f)

def js_data(d):
    return json.dumps(d, ensure_ascii=False, separators=(',', ':'))

CHAPTERS_JSON = js_data(chapters)
FLASHCARDS_JSON = js_data(flashcards)
QUIZZES_JSON = js_data(quizzes)

# === 可选: 加载章节正文模块 ===
BODIES = {}
if BODIES_MODULE:
    mod_path = os.path.join(TEMPLATES, BODIES_MODULE + '.py')
    if os.path.isfile(mod_path):
        spec = importlib.util.spec_from_file_location(BODIES_MODULE, mod_path)
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        BODIES = mod.bodies

# 章节列表 [(id, slug_for_filename), ...]
chapter_contents = {}
for ch in chapters['chapters']:
    chapter_contents[ch['id']] = f'chapter-{ch["id"]}.html'

# === 通用模板替换 helper ===
def apply_placeholders(tpl, **extra):
    base = (tpl
        .replace('__COURSE_ID__', COURSE_ID)
        .replace('__COURSE_SLUG__', COURSE_SLUG)
        .replace('__COURSE_TITLE__', COURSE_TITLE)
        .replace('__LEARN_URL__', LEARN_URL)
        .replace('__CHAPTERS_DATA_PLACEHOLDER__', CHAPTERS_JSON)
        .replace('__FLASHCARDS_DATA_PLACEHOLDER__', FLASHCARDS_JSON)
        .replace('__QUIZZES_DATA_PLACEHOLDER__', QUIZZES_JSON))
    for k, v in extra.items():
        base = base.replace(k, v)
    return base

# === 1. 主页 ===
with open(os.path.join(TEMPLATES, 'course-home.html'), encoding='utf-8') as f:
    home_tpl = f.read()
home = apply_placeholders(home_tpl)
with open(os.path.join(ROOT, 'index.html'), 'w', encoding='utf-8') as f:
    f.write(home)
print(f'✓ index.html')

# === 2. 闪卡页 ===
with open(os.path.join(TEMPLATES, 'course-flashcards.html'), encoding='utf-8') as f:
    fc_tpl = f.read()
fc = apply_placeholders(fc_tpl)
with open(os.path.join(ROOT, 'flashcards.html'), 'w', encoding='utf-8') as f:
    f.write(fc)
print(f'✓ flashcards.html')

# === 3. 测验聚合页 ===
with open(os.path.join(TEMPLATES, 'course-quizzes.html'), encoding='utf-8') as f:
    q_tpl = f.read()
quiz_list = apply_placeholders(q_tpl)
with open(os.path.join(ROOT, 'quizzes.html'), 'w', encoding='utf-8') as f:
    f.write(quiz_list)
print(f'✓ quizzes.html')

# === 4. 错题本 ===
with open(os.path.join(TEMPLATES, 'course-mistakes.html'), encoding='utf-8') as f:
    m_tpl = f.read()
mistakes = apply_placeholders(m_tpl)
with open(os.path.join(ROOT, 'mistakes.html'), 'w', encoding='utf-8') as f:
    f.write(mistakes)
print(f'✓ mistakes.html')

# === 5. 报告 ===
with open(os.path.join(TEMPLATES, 'course-report.html'), encoding='utf-8') as f:
    r_tpl = f.read()
report = apply_placeholders(r_tpl)
with open(os.path.join(ROOT, 'report.html'), 'w', encoding='utf-8') as f:
    f.write(report)
print(f'✓ report.html')

# === 6. 章节页 ===
with open(os.path.join(TEMPLATES, 'course-chapter.html'), encoding='utf-8') as f:
    ch_tpl = f.read()

chs = chapters['chapters']
for idx, ch_id in enumerate(chapter_contents.keys()):
    body_html = BODIES.get(ch_id, '<p>章节内容待补充</p>')
    prev_ch = chs[idx-1] if idx > 0 else None
    next_ch = chs[idx+1] if idx+1 < len(chs) else None
    prev_slug = f'chapter-{prev_ch["id"]}' if prev_ch else ''
    next_slug = f'chapter-{next_ch["id"]}' if next_ch else ''
    prev_title = f'第 {idx} 章 · {prev_ch["title"][:8]}' if prev_ch else ''
    next_title = f'第 {idx+2} 章 · {next_ch["title"][:8]}' if next_ch else ''
    ch_html = apply_placeholders(ch_tpl,
        __CHAPTER_ID__=ch_id,
        __PREV_SLUG__=prev_slug,
        __PREV_TITLE__=prev_title,
        __NEXT_SLUG__=next_slug,
        __NEXT_TITLE__=next_title,
        __CHAPTER_BODY__=body_html,
    )
    out_name = f'chapter-{ch_id}.html'
    with open(os.path.join(ROOT, out_name), 'w', encoding='utf-8') as f:
        f.write(ch_html)
    print(f'✓ {out_name}')

# === 7. 每章测验页 ===
QUIZ_PAGE_TPL = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>第 __QUIZ_ID_NAKED__ 章测验 · __COURSE_TITLE__</title>
<link rel="stylesheet" href="../_shared/course-css.css">
</head>
<body>
<nav id="topnav"></nav>
<main class="container">
<div id="quizContainer"></div>
</main>
<script src="../_shared/course-storage.js"></script>
<script src="../_shared/course-progress.js"></script>
<script src="../_shared/course-flashcard.js"></script>
<script src="../_shared/course-notes.js"></script>
<script src="../_shared/course-mistakes.js"></script>
<script src="../_shared/course-quiz.js"></script>
<script src="../_shared/course-theme.js"></script>
<script src="../_shared/course-app.js"></script>
<script src="../_shared/course-init.js"></script>
<script>
(async () => {
  const courseId = '__COURSE_ID__';
  CourseInit.runInline(courseId, __CHAPTERS_JSON__, __FLASHCARDS_JSON__, __QUIZZES_JSON__);
  document.getElementById('topnav').innerHTML = CourseApp.renderTopnav('__COURSE_SLUG__', '__COURSE_TITLE__', 'quizzes');
  const quiz = CourseQuiz.loadQuiz('__QUIZ_ID__');
  if (!quiz) { document.getElementById('quizContainer').innerHTML = '<div class="card">找不到测验数据</div>'; return; }
  CourseQuiz.start('__QUIZ_ID__');
  renderQuiz();

  function renderQuiz() {
    const st = CourseQuiz.getCurrent();
    if (!st) return;
    const q = st.questions[st.currentIdx];
    const fb = st.feedback[q.id];
    const html = `
      <div class="quiz-card">
        <div class="quiz-progress">
          <span>📝 ${st.mode === 'final' ? '期末考试' : '第 __QUIZ_ID_NAKED__ 章测验'} · 第 ${st.currentIdx + 1} / ${st.questions.length} 题</span>
          <span>⏱ ${Math.round(st.seconds / 60)} 分钟</span>
        </div>
        <div class="quiz-stem">${q.stem}</div>
        ${renderOptions(q, fb, st.answers[q.id])}
        ${fb ? renderFeedback(q, fb) : ''}
        <div class="btn-row" style="margin-top: 24px;">
          <button class="btn" id="prevBtn" ${st.currentIdx === 0 ? 'disabled' : ''}>← 上一题</button>
          <button class="btn" id="nextBtn" ${st.currentIdx === st.questions.length - 1 ? 'disabled' : ''}>下一题 →</button>
          <button class="btn btn-primary" id="submitBtn" style="margin-left:auto;">交卷</button>
        </div>
      </div>`;
    document.getElementById('quizContainer').innerHTML = html;
    bindQuizEvents();
  }

  function renderOptions(q, fb, saved) {
    if (q.type === 'fill' || q.type === 'short') {
      return `<textarea class="note-area" id="answerArea" placeholder="输入你的答案">${saved || ''}</textarea>
              <button class="btn btn-primary" id="answerBtn" style="margin-top: 8px;">提交答案</button>`;
    }
    const opts = q.options || ['对','错'];
    return `<div class="quiz-options">${
      opts.map((o, i) => {
        const selected = saved !== undefined && Number(saved) === i;
        const cls = selected ? (fb ? (fb.correct ? 'correct' : 'wrong') : 'selected') : '';
        return `<button class="quiz-opt ${cls}" data-idx="${i}">${String.fromCharCode(65 + i)}. ${o}</button>`;
      }).join('')
    }</div>`;
  }

  function renderFeedback(q, fb) {
    const cls = fb.correct ? 'correct' : 'wrong';
    return `<div class="quiz-feedback ${cls}">
      <div class="quiz-feedback-title">${fb.correct ? '✓ 正确!' : '✗ 答错了'}</div>
      ${!fb.correct && q.answer !== undefined ? `<div>正确答案:${Array.isArray(q.answer) ? q.answer.map(i => String.fromCharCode(65+i)).join(', ') : (q.options ? String.fromCharCode(65 + q.answer) + ' - ' + q.options[q.answer] : q.answer)}</div>` : ''}
      ${q.explanation ? `<div style="margin-top:6px;">💡 ${q.explanation}</div>` : ''}
    </div>`;
  }

  function bindQuizEvents() {
    const st = CourseQuiz.getCurrent();
    const q = st.questions[st.currentIdx];
    document.querySelectorAll('.quiz-opt').forEach(btn => btn.addEventListener('click', e => {
      const idx = parseInt(e.currentTarget.dataset.idx);
      CourseQuiz.answer(q.id, idx);
      renderQuiz();
    }));
    const ansBtn = document.getElementById('answerBtn');
    if (ansBtn) ansBtn.addEventListener('click', () => {
      const v = document.getElementById('answerArea').value;
      CourseQuiz.answer(q.id, v);
      renderQuiz();
    });
    document.getElementById('prevBtn')?.addEventListener('click', () => { CourseQuiz.prev(); renderQuiz(); });
    document.getElementById('nextBtn')?.addEventListener('click', () => { CourseQuiz.next(); renderQuiz(); });
    document.getElementById('submitBtn').addEventListener('click', submitQuiz);
  }

  function submitQuiz() {
    const st = CourseQuiz.getCurrent();
    const unanswered = st.questions.filter(q => st.feedback[q.id] === undefined);
    if (unanswered.length > 0) {
      if (!confirm(`还有 ${unanswered.length} 题未答,确认交卷?`)) return;
    }
    const result = CourseQuiz.submit();
    CourseQuiz.getMistakes().forEach(m => CourseMistakes.add(st.chapterId, m.question, m.feedback.userAnswer));
    renderResult(result);
  }

  function renderResult(r) {
    const cls = r.passed ? 'pass' : 'fail';
    const msg = r.passed ? '🎉 通过!' : '未通过,再接再厉';
    const st = CourseQuiz.getCurrent();
    let html = `<div class="quiz-result">
      <h2>${msg}</h2>
      <div class="quiz-score ${cls}">${r.score}/100</div>
      <p style="color:var(--text-dim);">通过标准: ${r.passingScore} 分 · 用时 ${Math.round(r.seconds/60)} 分钟</p>
    `;
    const mistakes = CourseQuiz.getMistakes();
    if (mistakes.length > 0) {
      html += '<h3 style="margin-top:24px;">📋 错题列表</h3>';
      mistakes.forEach(m => {
        html += `<div class="mistakes-card">
          <div style="font-weight: 600;">${m.question.stem}</div>
          <div style="color: var(--text-dim); margin-top: 6px; font-size: 14px;">正确答案:${m.feedback.correctAnswer}</div>
          <div style="margin-top: 6px; font-size: 14px;">💡 ${m.question.explanation || ''}</div>
        </div>`;
      });
    }
    html += `<div class="btn-row" style="margin-top: 24px;">
      <a class="btn" href="quizzes.html">← 返回测验列表</a>
      <a class="btn btn-primary" href="mistakes.html">查看错题本 →</a>
    </div></div>`;
    document.getElementById('quizContainer').innerHTML = html;
    if (r.passed && st.chapterId !== 'final') {
      CourseProgress.setChapterStatus(st.chapterId, 'completed');
    }
  }
})();
</script>
</body>
</html>'''

for ch_id in chapter_contents.keys():
    quiz_id = ch_id
    q_html = (QUIZ_PAGE_TPL
        .replace('__COURSE_ID__', COURSE_ID)
        .replace('__COURSE_SLUG__', COURSE_SLUG)
        .replace('__COURSE_TITLE__', COURSE_TITLE)
        .replace('__CHAPTERS_JSON__', CHAPTERS_JSON)
        .replace('__FLASHCARDS_JSON__', FLASHCARDS_JSON)
        .replace('__QUIZZES_JSON__', QUIZZES_JSON)
        .replace('__QUIZ_ID__', quiz_id)
        .replace('__QUIZ_ID_NAKED__', quiz_id[3:]))
    out_name = f'quiz-{quiz_id}.html'
    with open(os.path.join(ROOT, out_name), 'w', encoding='utf-8') as f:
        f.write(q_html)
    print(f'✓ {out_name}')

# === 8. 期末考试 ===
final_html = (QUIZ_PAGE_TPL
    .replace('__COURSE_ID__', COURSE_ID)
    .replace('__COURSE_SLUG__', COURSE_SLUG)
    .replace('__COURSE_TITLE__', COURSE_TITLE)
    .replace('__CHAPTERS_JSON__', CHAPTERS_JSON)
    .replace('__FLASHCARDS_JSON__', FLASHCARDS_JSON)
    .replace('__QUIZZES_JSON__', QUIZZES_JSON)
    .replace('__QUIZ_ID__', 'final')
    .replace('__QUIZ_ID_NAKED__', '期末综合'))
with open(os.path.join(ROOT, 'quiz-final.html'), 'w', encoding='utf-8') as f:
    f.write(final_html)
print(f'✓ quiz-final.html')

print('\n=== ALL DONE ===')