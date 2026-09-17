#!/usr/bin/env python3
"""
add_pinn_subsection_quizzes.py · 给 PINN 6 个章节 HTML 注入 quiz-section
- 解析章节正文里 <h3> 子节标题
- 从 chaptersData.quizzes 取该章题目,按顺序每 N 道均分给 M 个 h3 子节
- 每个 h3 后面插入 <div class="quiz-section" data-section="chN-secM">...</div>
- 让 course-subsection.js 自动接管判分 + 进度追踪

用法:python scripts/add_pinn_subsection_quizzes.py
"""
import json, re, os, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
COURSE = ROOT / "public" / "courses" / "pinn-crash-reduction"

# 1. 读 chaptersData(含 quizzes)
chapters_json = json.loads((COURSE / "data" / "chapters.json").read_text(encoding="utf-8"))
chapters = {c["id"]: c for c in chapters_json["chapters"]}

# chaptersData 实际是章节 HTML 里 inline 嵌的,所以我们直接读 HTML
# 简化:用 chapters.json 找 questions 来源 — 通过 HTML 里嵌入的 quizzesJson
# 看 course-init.js 加载:window.__COURSE_QUIZZES = {...}
# 我们直接读 chapter 文件,从 inline JSON 抽题

def extract_quizzes_from_html(html_path: Path):
    """从 HTML 内嵌的 quizzesData JSON 抽 {chapterId: {questions:[...]}}"""
    txt = html_path.read_text(encoding="utf-8")
    # 找 const quizzesData = {...};
    m = re.search(r"const quizzesData = (\{.*?\});", txt, re.DOTALL)
    if not m:
        return {}
    try:
        return json.loads(m.group(1))
    except json.JSONDecodeError:
        # 可能不严格 — 直接尝试用 json 解析去掉尾部分号
        s = m.group(1)
        # 容错:去掉可能的尾逗号
        s = re.sub(r",\s*\}", "}", s)
        try:
            return json.loads(s)
        except:
            return {}

def extract_section_questions_for_chapter(all_quizzes, chapter_id):
    """返回该章所有题目 questions list"""
    q = all_quizzes.get(chapter_id, {})
    return q.get("questions", [])

QUIZ_TEMPLATE = '''
        <div class="quiz-section" data-section="{section_id}">
          <h4>📝 本节检测题</h4>
          {questions_html}
        </div>
'''

def render_quiz_question(q, qid):
    """从题目对象渲染成 HTML — 子节小测只用 single/tf,跳过 multi/fill/short"""
    qtype = q.get("type", "single")
    stem = q.get("stem", "")
    options = q.get("options")
    answer = q.get("answer", 0)
    explanation = q.get("explanation", "")

    # 子节小测需要轻量,过滤掉 multi / fill / short,只保留 single / tf
    if qtype in ("multi", "fill", "short"):
        return None

    # 没有选项的(简答题) — 改成判断题占位
    if options is None:
        options = ["对", "错"]
        answer = 0
        qtype = "tf"

    # 单选/判断:渲染 4 个 quiz-option 按钮(id 化让 JS 判分)
    if qtype == "tf":
        opt_html = "".join([
            f'<div class="quiz-option" data-idx="{i}">{o}</div>'
            for i, o in enumerate(options)
        ])
    else:
        opt_html = "".join([
            f'<div class="quiz-option" data-idx="{i}">{chr(65 + i)}. {o}</div>'
            for i, o in enumerate(options[:6])
        ])
    ans_attr = answer if not isinstance(answer, list) else 0
    return f'''
          <div class="quiz-question" data-answer="{ans_attr}">
            <div class="quiz-question-text">{stem}</div>
            <div class="quiz-options">
              {opt_html}
            </div>
            <div class="quiz-feedback">
              <strong>参考答案:</strong> {explanation}
            </div>
          </div>'''

def add_subsection_quizzes_to_chapter(chapter_path: Path, chapter_id: str, all_quizzes):
    """给单个章节 HTML 在每个 h3 后插入 quiz-section"""
    questions = extract_section_questions_for_chapter(all_quizzes, chapter_id)
    txt = chapter_path.read_text(encoding="utf-8")

    # 找 <h3> 标题 (章节正文里)
    h3_pattern = re.compile(r'(<h3[^>]*>.*?</h3>)', re.DOTALL)
    matches = list(h3_pattern.finditer(txt))
    if not matches:
        print(f"  {chapter_path.name}: no <h3> found, skipping")
        return False

    # 给每个 h3 分题 — 每节 2 道
    PER_SUB = 2
    new_txt = txt
    for i, m in enumerate(matches):
        # 取该节的题目,过滤掉 multi/fill/short 保留 single/tf
        all_single_tf = [q for q in questions if q.get("type", "single") in ("single", "tf") and q.get("options")]
        if not all_single_tf:
            sub_questions = []
        else:
            sub_questions = all_single_tf[i*PER_SUB : (i+1)*PER_SUB]
            # 不足的话循环用
            while len(sub_questions) < 2 and all_single_tf:
                sub_questions.append(all_single_tf[len(sub_questions) % len(all_single_tf)])

        if not sub_questions:
            sub_questions = [{
                "type": "single",
                "stem": "本节你学到了什么?能否用自己的话复述要点?",
                "options": ["A. 已学完本节", "B. 还需再读一遍", "C. 需要看例子", "D. 跳过"],
                "answer": 0,
                "explanation": "请结合本节内容自检。如果选了 A 就可以继续,否则建议重读本节。"
            }]
        # 渲染
        sec_no = i + 1
        section_id = f"ch{chapter_id.split('-')[0]}-sec{sec_no}"
        q_html_parts = []
        for j, q in enumerate(sub_questions):
            rendered = render_quiz_question(q, f"{section_id}-q{j}")
            if rendered is None:
                continue
            q_html_parts.append(rendered)
        if not q_html_parts:
            continue
        q_html = "\n".join(q_html_parts)
        block = QUIZ_TEMPLATE.format(section_id=section_id, questions_html=q_html)

        # 插入 h3 后(寻找下一个 </h3> 结束位置之后的下一个 </section> 或下个 h3 前)
        insert_pos = m.end()
        # 检查紧邻 — 如果已经有 quiz-section 跳过
        next_60 = new_txt[insert_pos:insert_pos+200]
        if 'class="quiz-section"' in next_60[:120]:
            # 已存在则跳过
            continue
        new_txt = new_txt[:insert_pos] + "\n" + block + new_txt[insert_pos:]

    if new_txt != txt:
        chapter_path.write_text(new_txt, encoding="utf-8")
        print(f"  [OK] {chapter_path.name}: injected {len(matches)} quiz-sections")
        return True
    return False

# 主流程
print("=== adding PINN subsection quizzes ===")
# 从 chapter-01 抓 quizzes (其他章节共享同一 quizzesData,因 quizzes 来自 chapters.json)
ch1_path = COURSE / "chapter-01-tech-foundations.html"
all_quizzes = extract_quizzes_from_html(ch1_path)
print(f"found {len(all_quizzes)} chapters with quizzes")

for chap_file in sorted(COURSE.glob("chapter-*.html")):
    chapter_id = chap_file.stem.replace("chapter-", "")
    add_subsection_quizzes_to_chapter(chap_file, chapter_id, all_quizzes)

print("=== done ===")
