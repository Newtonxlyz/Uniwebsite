"""validate_course.py - Course Package v1 校验器(硬门禁)
   用法: python validate_course.py <course_dir> [--json]

   课程包格式 v1:
     <course_dir>/
       course.json            # 课程元数据 SSOT
       chapters.json          # 章节清单(纯元数据,不含正文)
       contents/<ch-id>.html  # 章节正文(唯一事实源)
       data/quizzes.json      # 章测 + 期末
       data/flashcards.json   # 闪卡

   退出码: 0 = 通过(警告允许)  1 = 错误
"""
import os, sys, json, re

try: sys.stdout.reconfigure(encoding='utf-8')
except: pass

COURSES_ROOT = r'D:\LvyzWeb\platform\public\courses'
LEVELS = {'beginner': '入门', 'intermediate': '进阶', 'advanced': '高级'}
QTYPES = {'single', 'tf', 'multi', 'fill', 'short'}
MIN_BODY_BYTES = 200  # 正文至少这么长,防空壳章

errors, warnings = [], []

def err(msg): errors.append(msg)
def warn(msg): warnings.append(msg)

if len(sys.argv) < 2:
    print(__doc__); sys.exit(1)

COURSE_DIR = sys.argv[1]
ROOT = os.path.join(COURSES_ROOT, COURSE_DIR)
if not os.path.isdir(ROOT):
    print(f'错误: 课程目录不存在 {ROOT}'); sys.exit(1)

def load_json(path, required=True):
    if not os.path.isfile(path):
        if required: err(f'缺少文件: {os.path.relpath(path, ROOT)}')
        return None
    try:
        with open(path, encoding='utf-8') as f: return json.load(f)
    except Exception as e:
        err(f'JSON 解析失败 {os.path.relpath(path, ROOT)}: {e}'); return None

# === 1. course.json ===
course = load_json(os.path.join(ROOT, 'course.json'))
if course:
    for f in ['id', 'slug', 'title', 'subtitle', 'learnUrl', 'level', 'estimatedHours']:
        if not course.get(f): err(f'course.json 缺字段: {f}')
    if course.get('level') and course['level'] not in LEVELS:
        err(f"course.json level 非法: {course['level']}(允许 {sorted(LEVELS)})")
    if course.get('id') and course['id'] != COURSE_DIR:
        err(f"course.json id({course['id']})与目录名({COURSE_DIR})不一致")
    if not isinstance(course.get('objectives'), list) or not course.get('objectives'):
        warn('course.json objectives 为空')
    if not isinstance(course.get('prerequisites'), list) or not course.get('prerequisites'):
        warn('course.json prerequisites 为空')

# === 2. chapters.json(data/ 下,与 quizzes/flashcards 同级) ===
chapters_doc = load_json(os.path.join(ROOT, 'data', 'chapters.json'))
chapters, ch_ids = [], []
if chapters_doc:
    chapters = chapters_doc.get('chapters') or []
    if not chapters: err('chapters.json chapters 为空')
    seen = set()
    for ch in chapters:
        cid = ch.get('id', '')
        if not cid: err(f'章节缺 id: {json.dumps(ch, ensure_ascii=False)[:80]}'); continue
        if cid in seen: err(f'章节 id 重复: {cid}')
        seen.add(cid); ch_ids.append(cid)
        for f in ['title', 'subtitle', 'summary']:
            if not ch.get(f): err(f'章节 {cid} 缺字段: {f}')
        em = ch.get('estimatedMinutes')
        if not isinstance(em, int) or em <= 0 or em > 600:
            err(f'章节 {cid} estimatedMinutes 非法: {em}(需 1-600 整数)')
        if ch.get('level') and ch['level'] not in LEVELS:
            err(f"章节 {cid} level 非法: {ch['level']}")
        if 'subsections' in ch or 'body' in ch:
            err(f'章节 {cid} 正文还内联在 chapters.json(应抽到 contents/{cid}.html)')

# === 3. contents/ 正文 ===
contents_dir = os.path.join(ROOT, 'contents')
if not os.path.isdir(contents_dir):
    err('缺少 contents/ 目录')
else:
    for cid in ch_ids:
        p = os.path.join(contents_dir, cid + '.html')
        if not os.path.isfile(p):
            err(f'缺少正文: contents/{cid}.html'); continue
        size = os.path.getsize(p)
        if size < MIN_BODY_BYTES: err(f'contents/{cid}.html 过小({size}B),疑似空壳')
        with open(p, encoding='utf-8') as f: body = f.read()
        leftovers = re.findall(r'__[A-Z_]+__', body)
        if leftovers: err(f'contents/{cid}.html 有未替换占位符: {set(leftovers)}')
        if body.count('<h3') < 2: warn(f'contents/{cid}.html h3 少于 2 个,正文可能不完整')

# === 4. data/quizzes.json ===
quizzes = load_json(os.path.join(ROOT, 'data', 'quizzes.json'))
if quizzes:
    qid_seen = set()
    for key, quiz in quizzes.items():
        if key != 'final' and key not in ch_ids:
            err(f'quizzes.json key "{key}" 没有对应章节')
        qs = quiz.get('questions') or []
        if not qs: err(f'测验 {key} 没有题目')
        if not isinstance(quiz.get('passingScore'), int): warn(f'测验 {key} 缺 passingScore')
        for i, q in enumerate(qs):
            tag = f'测验 {key} 第 {i+1} 题({q.get("id", "?")})'
            qid = q.get('id', '')
            if not qid: err(f'{tag} 缺 id')
            elif qid in qid_seen: err(f'题目 id 重复: {qid}')
            else: qid_seen.add(qid)
            qt = q.get('type')
            if qt not in QTYPES: err(f'{tag} type 非法: {qt}')
            if not q.get('stem'): err(f'{tag} 缺题干 stem')
            ans, opts = q.get('answer'), q.get('options') or []
            if qt == 'single':
                if not opts: err(f'{tag} single 必须有选项')
                elif not isinstance(ans, int) or not (0 <= ans < len(opts)):
                    err(f'{tag} single 答案索引越界: answer={ans}, options={len(opts)}')
            elif qt == 'tf':
                # 渲染层 Number() 比较,bool 或 0/1 索引均可
                if isinstance(ans, bool): pass
                elif ans not in (0, 1): err(f'{tag} tf 答案必须是布尔或 0/1: {ans}')
            elif qt == 'multi':
                if not opts: err(f'{tag} multi 必须有选项')
                elif (not isinstance(ans, list) or not ans
                        or not all(isinstance(x, int) and 0 <= x < len(opts) for x in ans)):
                    err(f'{tag} multi 答案非法: {ans}, options={len(opts)}')
            elif qt == 'fill':
                # fill 精确匹配,空答案 = 永远判错的坏题
                if not isinstance(ans, str) or not ans.strip():
                    err(f'{tag} fill 答案必须是非空字符串(开放题请用 short)')
            elif qt == 'short':
                if not isinstance(ans, str): err(f'{tag} short 答案必须是字符串(可空,自评题)')
            if qt in ('single', 'multi') and len(opts) < 2:
                err(f'{tag} 选项少于 2 个')
            if not q.get('explanation'): warn(f'{tag} 缺 explanation 解析')

# === 5. data/flashcards.json ===
flashcards = load_json(os.path.join(ROOT, 'data', 'flashcards.json'))
if flashcards:
    cards = flashcards.get('cards') or []
    if not cards: err('flashcards.json cards 为空')
    fc_seen = set()
    for c in cards:
        cid = c.get('id', '')
        if not cid: err(f'闪卡缺 id: {str(c)[:60]}')
        elif cid in fc_seen: err(f'闪卡 id 重复: {cid}')
        else: fc_seen.add(cid)
        front = c.get('front') or c.get('q')
        back = c.get('back') or c.get('a')
        if not front or not back: err(f'闪卡 {cid} 缺 front/back(旧字段 q/a 需迁移)')
        ch = c.get('chapterId') or c.get('chapter')
        if ch is None: err(f'闪卡 {cid} 缺 chapterId')
        elif ch_ids and str(ch) not in [str(x) for x in ch_ids]:
            err(f'闪卡 {cid} chapterId={ch} 没有对应章节')

# === 输出 ===
for w in warnings: print(f'⚠ {w}')
if errors:
    for e in errors: print(f'✗ {e}')
    print(f'\n✗ 校验失败:{len(errors)} 错误 / {len(warnings)} 警告')
    sys.exit(1)
print(f'✓ {COURSE_DIR} 校验通过({len(chapters)} 章, 警告 {len(warnings)})')
sys.exit(0)
