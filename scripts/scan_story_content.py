# -*- coding: utf-8 -*-
import json, os, re

base = r'D:\儿童绘本计划\雷迪嘎嘎系列\绘本'

def find_story_dirs(root):
    """Recursively find dirs containing .md files with story content"""
    results = []
    for dirpath, dirnames, filenames in os.walk(root):
        md_files = [f for f in filenames if f.endswith('.md') and '插图' not in dirpath]
        imgs = [f for f in filenames if f.lower().endswith(('.png','.jpg','.jpeg'))]
        if md_files:
            # Read first md to check if it's a story (contains pinyin or story text)
            results.append((dirpath, md_files, imgs))
    return results

# Find all story directories
all_dirs = find_story_dirs(base)
results = []
for path, mds, imgs in sorted(all_dirs, key=lambda x: -len(x[1])):
    rel = path.replace(base, '')
    sample_md = os.path.join(path, mds[0])
    try:
        with open(sample_md, 'r', encoding='utf-8') as f:
            content = f.read(300)
        is_story = any(c in content for c in ['从前', '故事', '一天', '雷迪', '嘎嘎', '噶巴', '噶丫'])
        results.append({
            "rel_path": rel,
            "md_count": len(mds),
            "img_count": len(imgs),
            "is_story": is_story,
            "sample": content[:200] if is_story else ""
        })
    except:
        pass

# Save results to JSON
out = json.dumps(results, ensure_ascii=False, indent=2)
with open(r'D:\LvyzWeb\platform\scripts\scan_results.json', 'w', encoding='utf-8') as f:
    f.write(out)

print(f"Total dirs: {len(results)}")
print(f"Saved to scan_results.json")

# Stories with images
illustrated = [r for r in results if r["img_count"] >= 4]
print(f"Illustrated stories: {len(illustrated)}")
for r in illustrated:
    print(f"  [{r['img_count']} img] {r['rel_path']}")
