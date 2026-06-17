# -*- coding: utf-8 -*-
import json, os

# Find 5 completed stories
base = r'D:\儿童绘本计划\雷迪嘎嘎系列\绘本'
found = []

# Check crow drinking water series
water_base = os.path.join(base, '乌鸦喝水系列')
if os.path.isdir(water_base):
    for d in sorted(os.listdir(water_base)):
        path = os.path.join(water_base, d)
        if os.path.isdir(path):
            md_files = [f for f in os.listdir(path) if f.endswith('.md')]
            imgs = [f for f in os.listdir(path) if f.lower().endswith(('.png','.jpg','.jpeg'))]
            found.append(('water', d, len(md_files), len(imgs)))

# Check 黑黑的洞穴我不怕 (情感引导系列)
emotion_base = os.path.join(base, '儿童情感引导系列')
if os.path.isdir(emotion_base):
    for d in sorted(os.listdir(emotion_base)):
        path = os.path.join(emotion_base, d)
        if os.path.isdir(path):
            md_files = [f for f in os.listdir(path) if f.endswith('.md')]
            imgs = [f for f in os.listdir(path) if f.lower().endswith(('.png','.jpg','.jpeg'))]
            if len(imgs) > 0:  # Only show those with images
                found.append(('emotion', d, len(md_files), len(imgs)))

# Check origin stories
origin_base = os.path.join(base, '雷迪嘎嘎诞生成长系列')
if os.path.isdir(origin_base):
    for d in sorted(os.listdir(origin_base)):
        path = os.path.join(origin_base, d)
        if os.path.isdir(path):
            md_files = [f for f in os.listdir(path) if f.endswith('.md')]
            imgs = [f for f in os.listdir(path) if f.lower().endswith(('.png','.jpg','.jpeg'))]
            found.append(('origin', d, len(md_files), len(imgs)))

print("Found completed stories:")
for cat, name, md, img in found:
    print(f"  [{cat}] {name}: {md} .md, {img} images")

# Now let's look at the story text for the first completed one
if found:
    first = found[0]
    if first[2] > 0:
        dir_path = os.path.join(base, 
            '乌鸦喝水系列' if first[0]=='water' else 
            '儿童情感引导系列' if first[0]=='emotion' else
            '雷迪嘎嘎诞生成长系列', 
            first[1])
        for f in os.listdir(dir_path):
            if f.endswith('.md'):
                md_path = os.path.join(dir_path, f)
                with open(md_path, 'r', encoding='utf-8') as mf:
                    content = mf.read()
                print(f"\n--- {f} ({len(content)} chars) ---")
                print(content[:500])
                break
