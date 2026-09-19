"""migrate_to_package_v1.py - 旧格式课程 → Course Package v1 迁移
   用法: python migrate_to_package_v1.py <course_dir> --slug <learn-slug> --title <短标题> [--bodies-module <name>]

   做什么:
   - chapters.json 内联 subsections 正文 → contents/<ch-id>.html(唯一事实源)
   - chapters.json 瘦身(只留元数据),补齐 subtitle/estimatedMinutes/level
   - _chapter_bodies.py(PINN 路线,--bodies-module)→ contents/
   - 生成 course.json(历史 CLI 参数 --slug/--title + chapters.json course 块)

   迁移前请确保 git 工作区干净(可回滚)。
"""
import os, sys, json, re, importlib.util

try: sys.stdout.reconfigure(encoding='utf-8')
except: pass

COURSES_ROOT = r'D:\LvyzWeb\platform\public\courses'
TEMPLATES = r'D:\LvyzWeb\platform\scripts\templates'
LEVELS = {'beginner': '入门', 'intermediate': '进阶', 'advanced': '高级'}

if len(sys.argv) < 2 or '--slug' not in sys.argv or '--title' not in sys.argv:
    print(__doc__); sys.exit(1)

COURSE_DIR = sys.argv[1]
SLUG = sys.argv[sys.argv.index('--slug') + 1]
TITLE = sys.argv[sys.argv.index('--title') + 1]
BODIES_MODULE = sys.argv[sys.argv.index('--bodies-module') + 1] if '--bodies-module' in sys.argv else None

ROOT = os.path.join(COURSES_ROOT, COURSE_DIR)
DATA = os.path.join(ROOT, 'data')
CONTENTS = os.path.join(ROOT, 'contents')

with open(os.path.join(DATA, 'chapters.json'), encoding='utf-8') as f:
    doc = json.load(f)
course_meta = doc.get('course', {})
chapters = doc.get('chapters', [])

os.makedirs(CONTENTS, exist_ok=True)

def strip_html(s):
    return re.sub(r'<[^>]+>', '', s)

def derive_subtitle(ch):
    subs = ch.get('subsections') or []
    if subs:
        # "1.1 为什么要做碰撞仿真降阶" → 去掉小节编号
        t = re.sub(r'^\d+(\.\d+)?\s*', '', subs[0].get('title', '')).strip()
        if t: return t[:30]
    return (ch.get('summary') or '')[:30]

def derive_minutes(ch):
    chars = len(strip_html(''.join(s.get('body', '') for s in (ch.get('subsections') or []))))
    return max(20, min(120, round(chars / 550 / 5) * 5))

# level 归一:中文 → 英文枚举
def norm_level(lv, default='intermediate'):
    if lv in LEVELS: return lv
    rev = {v: k for k, v in LEVELS.items()}
    return rev.get(lv, default)

migrated = 0
bodies = {}
if BODIES_MODULE:
    mod_path = os.path.join(TEMPLATES, BODIES_MODULE + '.py')
    spec = importlib.util.spec_from_file_location(BODIES_MODULE, mod_path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    bodies = mod.bodies

for ch in chapters:
    cid = ch['id']
    body = None
    if BODIES_MODULE:
        body = bodies.get(cid)
    elif ch.get('subsections'):
        # GNN 路线:subsections 拼接
        parts = []
        for sub in ch['subsections']:
            parts.append(f'<h3>{sub["title"]}</h3>')
            parts.append(sub.get('body', '').strip())
        body = '\n'.join(parts)

    if body and len(body.strip()) > 200:
        with open(os.path.join(CONTENTS, cid + '.html'), 'w', encoding='utf-8') as f:
            f.write(body.strip() + '\n')
        migrated += 1

    # 元数据补齐 + 正文摘除
    ch.setdefault('subtitle', derive_subtitle(ch))
    ch.setdefault('estimatedMinutes', derive_minutes(ch))
    ch.setdefault('level', norm_level(course_meta.get('level', 'intermediate')))
    ch.pop('subsections', None)
    ch.pop('body', None)

# course.json
course_json = {
    'id': COURSE_DIR,
    'slug': SLUG,
    'title': TITLE,
    'subtitle': course_meta.get('subtitle', ''),
    'learnUrl': f'https://lvyz.org/learn/{SLUG}',
    'level': norm_level(course_meta.get('level', 'intermediate')),
    'estimatedHours': course_meta.get('estimatedHours', 0),
    'audience': course_meta.get('audience', ''),
    'objectives': course_meta.get('objectives', []),
    'prerequisites': course_meta.get('prerequisites', []),
}
with open(os.path.join(ROOT, 'course.json'), 'w', encoding='utf-8') as f:
    json.dump(course_json, f, ensure_ascii=False, indent=2)

# chapters.json 回写(瘦身版,level 枚举一并归一)
doc['course']['level'] = norm_level(course_meta.get('level', 'intermediate'))
with open(os.path.join(DATA, 'chapters.json'), 'w', encoding='utf-8') as f:
    json.dump(doc, f, ensure_ascii=False, indent=2)

# === 数据归一化(v1 统一 schema) ===
# quizzes: tf bool→0/1;fill 空答案→short(空 fill 永远判错);single 无选项→short(大题自评)
qpath = os.path.join(DATA, 'quizzes.json')
with open(qpath, encoding='utf-8') as f:
    quizzes = json.load(f)
norm_q = 0
for quiz in quizzes.values():
    for q in quiz.get('questions', []):
        if q.get('type') == 'tf' and isinstance(q.get('answer'), bool):
            q['answer'] = 1 if q['answer'] else 0; norm_q += 1
        elif q.get('type') == 'fill' and not str(q.get('answer') or '').strip():
            q['type'] = 'short'; norm_q += 1
        elif q.get('type') == 'single' and not q.get('options'):
            q['type'] = 'short'; norm_q += 1
if norm_q:
    with open(qpath, 'w', encoding='utf-8') as f:
        json.dump(quizzes, f, ensure_ascii=False, indent=2)

# flashcards: chapter(int)→chapterId(str 章 id);q/a→front/back
fpath = os.path.join(DATA, 'flashcards.json')
with open(fpath, encoding='utf-8') as f:
    fc = json.load(f)
id_by_num = {i + 1: ch['id'] for i, ch in enumerate(chapters)}
norm_f = 0
for c in fc.get('cards', []):
    if 'chapterId' not in c and 'chapter' in c:
        n = c.pop('chapter')
        c['chapterId'] = id_by_num.get(n, str(n)); norm_f += 1
    if 'front' not in c and 'q' in c:
        c['front'] = c.pop('q'); norm_f += 1
    if 'back' not in c and 'a' in c:
        c['back'] = c.pop('a'); norm_f += 1
if norm_f:
    with open(fpath, 'w', encoding='utf-8') as f:
        json.dump(fc, f, ensure_ascii=False, indent=2)

print(f'✓ {COURSE_DIR}: {migrated}/{len(chapters)} 章正文抽到 contents/, course.json 已生成, 归一化 {norm_q} 题 / {norm_f} 闪卡字段')
