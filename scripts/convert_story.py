# -*- coding: utf-8 -*-
import json, os

# Read scan results
with open(r'D:\LvyzWeb\platform\scripts\scan_results.json', 'r', encoding='utf-8') as f:
    results = json.load(f)

# Write detailed report to a file
lines = []
lines.append(f"Total dirs with .md: {len(results)}\n")
lines.append(f"Illustrated (>=4 img): {sum(1 for r in results if r['img_count']>=4)}\n\n")

# Show all dirs sorted by img count
for r in sorted(results, key=lambda x: (-x['img_count'], -x['md_count'])):
    lines.append(f"[md:{r['md_count']:2d} img:{r['img_count']:2d}] {r['rel_path']}\n")
    if r['is_story'] and r['sample']:
        lines.append(f"  Sample: {r['sample'][:100]}\n")

with open(r'D:\LvyzWeb\platform\scripts\scan_report.txt', 'w', encoding='utf-8') as f:
    f.write(''.join(lines))

print("Report saved to scan_report.txt")

# Now let's convert the illustrated story to JSON
# Find dirs with images
for r in sorted(results, key=lambda x: -x['img_count']):
    if r['img_count'] >= 4:
        # This is our target - let's read all .md files in this dir
        base = r'D:\儿童绘本计划\雷迪嘎嘎系列\绘本'
        dir_path = os.path.join(base, r['rel_path'].lstrip('\\'))
        
        print(f"\n--- Converting story dir ---")
        
        story_json = {
            "id": "story-001",
            "title": "",
            "pages": [],
            "images": []
        }
        
        # Read each .md file
        for fname in sorted(os.listdir(dir_path)):
            fpath = os.path.join(dir_path, fname)
            if fname.endswith('.md'):
                with open(fpath, 'r', encoding='utf-8') as f:
                    content = f.read()
                story_json['pages'].append({
                    "file": fname,
                    "content": content
                })
                print(f"  [MD] {fname} ({len(content)} chars)")
            elif fname.lower().endswith(('.png','.jpg','.jpeg')):
                story_json['images'].append(fname)
                print(f"  [IMG] {fname}")
        
        # Save as JSON
        out_path = r'D:\LvyzWeb\platform\scripts\converted_story.json'
        with open(out_path, 'w', encoding='utf-8') as f:
            json.dump(story_json, f, ensure_ascii=False, indent=2)
        print(f"\nSaved to {out_path}")
        print(f"  Pages: {len(story_json['pages'])}")
        print(f"  Images: {len(story_json['images'])}")
        break  # Only convert first one for now
