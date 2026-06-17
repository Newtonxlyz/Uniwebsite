# -*- coding: utf-8 -*-
import json, os

base = r'D:\儿童绘本计划\雷迪嘎嘎系列\绘本'
out_lines = []

def p(text=""):
    out_lines.append(str(text))

# Read 乌鸦喝水-2 story text
target = os.path.join(base, '乌鸦喝水系列', '240408_乌鸦喝水-2')
for f in sorted(os.listdir(target)):
    path = os.path.join(target, f)
    if f.endswith('.md') and os.path.isfile(path):
        with open(path, 'r', encoding='utf-8') as fp:
            content = fp.read()
        p(f"=== {f} ({len(content)} chars) ===")
        p(content[:1500])
        p()

# Also check 黑黑的洞穴我不怕 structure
p("=" * 60)
p("Checking 黑黑的洞穴我不怕 structure:")
target2 = os.path.join(base, '001_儿童情感引导_001_黑黑的洞穴我不怕')
for f in sorted(os.listdir(target2)):
    sub = os.path.join(target2, f)
    if os.path.isdir(sub):
        md_files = [x for x in os.listdir(sub) if x.endswith('.md')]
        img_files = [x for x in os.listdir(sub) if x.lower().endswith(('.png','.jpg','.jpeg'))]
        p(f"  [{f}] {len(md_files)} md, {len(img_files)} img")
        for mf in md_files[:1]:
            with open(os.path.join(sub, mf), 'r', encoding='utf-8') as fp:
                content = fp.read(500)
            p(f"    {content[:200]}...")

with open(r'D:\LvyzWeb\platform\scripts\story_analysis.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(out_lines))
print(f"Written {len(out_lines)} lines to story_analysis.txt")
