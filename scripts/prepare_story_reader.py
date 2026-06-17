# -*- coding: utf-8 -*-
import json, os, shutil

# Source: 黑黑的洞穴我不怕 - the most complete story
src_dir = r'D:\儿童绘本计划\雷迪嘎嘎系列\绘本\001_儿童情感引导_001_黑黑的洞穴我不怕'
dst_dir = r'D:\LvyzWeb\platform\public\picturebook\stories\dark-cave'

# Find the story text
text_file = os.path.join(src_dir, '01_故事文本')
text_content = ""
for f in os.listdir(text_file):
    if f.endswith('.md'):
        with open(os.path.join(text_file, f), 'r', encoding='utf-8') as fp:
            text_content = fp.read()
        break

# Find images
img_sources = {
    '03_生图素材': '素材',
    '04_排版输出': '排版'
}

img_files = []
for subdir, label in img_sources.items():
    full = os.path.join(src_dir, subdir)
    if os.path.isdir(full):
        for f in sorted(os.listdir(full)):
            if f.lower().endswith(('.png', '.jpg', '.jpeg')):
                img_files.append((os.path.join(full, f), f, label))

print(f"Story text: {len(text_content)} chars")
print(f"Images found: {len(img_files)}")

# Copy images to public dir
os.makedirs(dst_dir, exist_ok=True)
copied = 0
for src_f, name, label in img_files:
    # Extract page number from filename
    dst_name = f"page_{copied+1:02d}_{name}"
    # Only copy layout images (排版的), they're the final output
    if label == '排版':
        shutil.copy2(src_f, os.path.join(dst_dir, dst_name))
        copied += 1
        print(f"  Copied: {name} -> {dst_name}")

print(f"\nTotal images copied: {copied}")

# Extract pages from text
pages = []
current_page = {"num": 0, "text": "", "image": ""}

for line in text_content.split('\n'):
    stripped = line.strip()
    # Check for page markers like "**第1页**" or "## 第1页"
    if stripped.startswith('**第') and stripped.endswith('**'):
        page_num = stripped.replace('**', '').replace('第', '').replace('页', '')
        if page_num.isdigit():
            if current_page["text"]:
                pages.append(current_page)
            current_page = {"num": int(page_num), "text": "", "image": f"/picturebook/stories/dark-cave/page_{len(pages)+1:02d}_" if copied > len(pages) else ""}
    elif stripped.startswith('#') and stripped != line:
        # Skip section headers
        pass
    else:
        if stripped:
            current_page["text"] += stripped + "\n"

# Don't forget last page
if current_page["text"]:
    pages.append(current_page)

print(f"\nExtracted {len(pages)} pages from story text:")

# Build story JSON
story_json = {
    "id": "dark-cave",
    "title": "黑黑的洞穴我不怕",
    "title_en": "I'm Not Afraid of the Dark Cave",
    "series_id": "emotion",
    "story_number": "001",
    "age_range": "3-8",
    "reading_time": 8,
    "description": "暴风雨的夜晚，树洞里的蜡烛熄灭了，噶巴巴和噶丫丫被困在黑暗中。两个孩子互相陪伴，在爸爸回来之前，学会了在黑暗中找到彼此的光。",
    "education_value": "帮助孩子认识和克服对黑暗的恐惧，学习在困难中互相支持",
    "emotion_focus": "恐惧与焦虑 — 怕黑",
    "pages": []
}

for p in pages:
    page_data = {
        "page_number": p["num"],
        "text": p["text"].strip(),
        "image": f"/picturebook/stories/dark-cave/page_{p['num']:02d}_" if p["num"] <= copied else ""
    }
    story_json["pages"].append(page_data)
    print(f"  Page {p['num']}: {p['text'][:60].strip()}...")
    if p["num"] <= copied:
        # Show the first matching image filename
        pass

# Save story JSON to content dir
out_path = r'D:\LvyzWeb\platform\src\content\picturebook\story-dark-cave.json'
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(story_json, f, ensure_ascii=False, indent=2)

print(f"\nSaved story JSON to {out_path}")
print(f"  Total pages: {len(story_json['pages'])}")
print(f"  With images: {min(copied, len(story_json['pages']))}")

# Also export the story text for verification
txt_path = r'D:\LvyzWeb\platform\scripts\dark_cave_text.txt'
with open(txt_path, 'w', encoding='utf-8') as f:
    for p in story_json['pages']:
        f.write(f"=== 第{p['page_number']}页 ===\n")
        f.write(p['text'])
        f.write("\n\n")
print(f"Text preview saved to {txt_path}")
