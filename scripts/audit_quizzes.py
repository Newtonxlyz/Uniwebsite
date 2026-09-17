"""audit_quizzes.py · 审计所有课程题库,统计题型分布"""
import json
from collections import Counter
from pathlib import Path

for course_dir in ['pinn-crash-reduction', 'gn-crash-guide']:
    print(f"=== {course_dir} ===")
    qfile = Path(f'public/courses/{course_dir}/data/quizzes.json')
    j = json.load(open(qfile, encoding='utf-8'))
    for k, chap in j.items():
        types = [q.get('type','single') for q in chap['questions']]
        c = Counter(types)
        total = len(chap['questions'])
        multi = c.get('multi', 0)
        fill = c.get('fill', 0)
        short = c.get('short', 0)
        single = c.get('single', 0)
        tf = c.get('tf', 0)
        # 重点关注 multi/fill/short 题
        flag = '[HAS-MULTI]' if multi else ''
        print(f'{k:32s} total={total:3d}  single={single:3d}  tf={tf:3d}  multi={multi:3d} {flag}')
        if multi or fill or short:
            for i, q in enumerate(chap['questions']):
                if q.get('type') in ('multi', 'fill', 'short'):
                    print(f"  #{i+1} [{q['type']:5s}] {q['stem'][:60]}")
    print()
