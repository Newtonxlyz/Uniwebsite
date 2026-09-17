"""fix_chapter_title.py · 把 '第 01 章' 改成 '第 1 章'"""
import os
ROOT = r'D:\LvyzWeb\platform\public\courses\pinn-crash-reduction'
for fn in os.listdir(ROOT):
    if fn.startswith('chapter-') and fn.endswith('.html'):
        p = os.path.join(ROOT, fn)
        s = open(p, encoding='utf-8').read()
        # 当前是 ch.id.split('-')[0],改成 parseInt 转 int 去掉前导 0
        new_s = s.replace(
            "ch.id.split('-')[0]",
            "parseInt(ch.id, 10)"
        )
        if new_s != s:
            open(p, 'w', encoding='utf-8').write(new_s)
            print('fixed', fn)
print('done')
