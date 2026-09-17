"""append_css.py · 把 CSS 追加到 course-css.css"""
CSS_APPEND = r'''
/* === Floating 返回按钮(chapter / quiz 页右下角) === */
.course-floating-nav {
  position: fixed;
  right: 16px; bottom: 24px;
  display: flex; flex-direction: column; gap: 8px;
  z-index: 100;
}
.cfn-btn {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 999px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  color: var(--text);
  text-decoration: none;
  font-size: 13px; font-weight: 500;
  transition: all 0.15s;
  min-width: 110px;
}
.cfn-btn:hover {
  background: var(--primary-soft);
  color: var(--primary);
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(99,102,241,0.18);
}
.cfn-home { color: var(--text-dim); }
.cfn-hub  { background: var(--primary-soft); color: var(--primary); border-color: var(--primary); }
.cfn-hub:hover { background: var(--primary); color: white; }
.cfn-course { color: var(--success); border-color: var(--success); }
.cfn-course:hover { background: var(--success-soft); }
.cfn-up { color: var(--accent); border-color: var(--accent); }
.cfn-up:hover { background: var(--accent-soft); }
.cfn-icon { font-size: 16px; }
.cfn-label { white-space: nowrap; }
@media (max-width: 600px) {
  .cfn-label { display: none; }
  .cfn-btn { min-width: 0; padding: 10px 12px; }
}

/* === 章节正文 quiz-section 内 .quiz-option 按钮样式 === */
.quiz-section .quiz-option {
  padding: 10px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg-section);
  cursor: pointer;
  font-size: 14px;
  line-height: 1.5;
  margin: 6px 0;
  transition: all 0.15s;
  user-select: none;
  display: block;
}
.quiz-section .quiz-option:hover {
  background: var(--bg-card-hover);
  border-color: var(--primary);
}
.quiz-section .quiz-option.quiz-opt-selected {
  background: var(--primary-soft);
  color: var(--primary);
  border-color: var(--primary);
  font-weight: 600;
}
.quiz-section .quiz-option.quiz-opt-correct {
  background: rgba(34, 197, 94, 0.12);
  border-color: var(--success);
  color: var(--success);
}
.quiz-section .quiz-option.quiz-opt-wrong {
  background: rgba(239, 68, 68, 0.06);
  border-color: var(--danger);
  color: var(--danger);
  text-decoration: line-through;
}
.quiz-section .quiz-option.quiz-opt-correct-hint {
  background: rgba(34, 197, 94, 0.06);
  border-color: var(--success);
  color: var(--success);
  font-weight: 600;
}
.quiz-section .quiz-question-text {
  font-weight: 600;
  font-size: 15px;
  line-height: 1.6;
  margin: 12px 0 8px;
  color: var(--text);
}
.quiz-section .quiz-feedback {
  background: var(--bg-section);
  border-left: 3px solid var(--success);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.6;
}
.quiz-section .quiz-feedback.quiz-feedback-no {
  border-left-color: var(--danger);
}
.quiz-section .quiz-feedback.quiz-feedback-ok {
  border-left-color: var(--success);
}
'''

from pathlib import Path
p = Path(r'D:\LvyzWeb\platform\public\courses\_shared\course-css.css')
s = p.read_text(encoding='utf-8')
if '.course-floating-nav' not in s:
    p.write_text(s.rstrip() + CSS_APPEND, encoding='utf-8')
    print('appended')
else:
    print('already there, skipping')
