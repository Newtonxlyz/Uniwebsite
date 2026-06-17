# -*- coding: utf-8 -*-
import json, os, re

base = r'D:\儿童绘本计划\雷迪嘎嘎系列\绘本'
out_base = r'D:\LvyzWeb\platform\src\content\picturebook'

def read_story_text(story_dir):
    """Read a story text.md and extract pages"""
    text_dir = os.path.join(story_dir, '01_故事文本')
    if not os.path.isdir(text_dir):
        text_dir = story_dir  # fallback: story text is directly in dir
    
    for f in sorted(os.listdir(text_dir)):
        if f.endswith('.md') and f not in ['07_生成记录.md', 'README.md']:
            path = os.path.join(text_dir, f)
            with open(path, 'r', encoding='utf-8') as fp:
                return fp.read()
    return None

def extract_pages(text):
    """Extract pages from story text (## 第N页 or **第N页**)"""
    pages = []
    # Try to split by page markers
    parts = re.split(r'(?:\*{0,2}\*\*?\s*第(\d+)页\s*\**\n?)', text)
    if len(parts) < 3:
        # Try alternative format
        parts = re.split(r'(?:##\s*第(\d+)页)', text)
    
    if len(parts) >= 3:
        pages.append({"page": 1, "text": parts[0].strip()})
        for i in range(1, len(parts)-1, 2):
            if i+1 < len(parts):
                pn = int(parts[i]) if parts[i].isdigit() else len(pages)+1
                pages.append({"page": pn, "text": parts[i+1].strip()})
    
    if not pages:
        # Fallback: treat whole text as one page
        pages.append({"page": 1, "text": text.strip()})
    
    return pages

def extract_title(text):
    """Extract title from markdown"""
    lines = text.split('\n')
    for line in lines:
        if line.startswith('# ') and '生图' not in line and '视频' not in line:
            return line.replace('# ', '').strip()
    return ""

def extract_series_id(story_dir):
    """Extract series identifier from path"""
    rel = os.path.relpath(story_dir, base)
    parts = rel.split(os.sep)
    for p in parts:
        if '情感引导' in p: return 'emotion'
        if '成语' in p: return 'chengyu'
        if '诗歌' in p: return 'shige'
        if '噶巴巴' in p and '成长' in p: return 'gababa'
        if '噶丫丫' in p and '成长' in p: return 'gayaya'
        if '噶丫丫' in p and '领养' in p: return 'gayaya'
        if '乌鸦喝水' in p: return 'drinking-water'
        if '科普' in p: return 'science'
        if '俚语' in p: return 'liyu'
        if '思念母亲' in p: return 'mother'
        if '诞生' in p or '雷迪嘎嘎的' in p: return 'origin'
    return 'unknown'

# Target directories with story text
targets = [
    # 黑黑的洞穴我不怕 - the most complete story
    os.path.join(base, '001_儿童情感引导_001_黑黑的洞穴我不怕'),
    # 乌鸦喝水系列 - each story
    os.path.join(base, '乌鸦喝水系列', '240408_乌鸦喝水-1'),
    os.path.join(base, '乌鸦喝水系列', '240408_乌鸦喝水-2'),
    os.path.join(base, '乌鸦喝水系列', '240408_乌鸦喝水-3'),
    os.path.join(base, '乌鸦喝水系列', '240408_乌鸦喝水-4'),
    # Origin stories
    os.path.join(base, '雷迪嘎嘎诞生成长系列', '240427_雷迪嘎嘎的智慧_v1'),
    os.path.join(base, '雷迪嘎嘎诞生成长系列', '260416_雷迪嘎嘎的诞生_v1'),
]

os.makedirs(out_base, exist_ok=True)

stories = []

for target in targets:
    if not os.path.isdir(target):
        continue
    
    text = read_story_text(target)
    if not text:
        # Try reading directly from the dir
        for f in sorted(os.listdir(target)):
            if f.endswith('.md') and '提示' not in f and '记录' not in f:
                path = os.path.join(target, f)
                with open(path, 'r', encoding='utf-8') as fp:
                    text = fp.read()
                break
    
    if not text:
        continue
    
    title = extract_title(text)
    pages = extract_pages(text)
    series_id = extract_series_id(target)
    rel_name = target.replace(base, '').lstrip('\\')
    
    story = {
        "id": f"story-{len(stories)+1}",
        "title": title or rel_name,
        "series_id": series_id,
        "page_count": len(pages),
        "pages": [{
            "page_number": p["page"],
            "text": p["text"]
        } for p in pages],
        "source": rel_name
    }
    stories.append(story)
    print(f"[S{len(stories)}] {title or rel_name}")
    print(f"      Series: {series_id}, Pages: {len(pages)}")
    if pages:
        print(f"      First: {pages[0]['text'][:80]}...")

# Save combined stories
output = json.dumps({"stories": stories}, ensure_ascii=False, indent=2)
out_path = os.path.join(out_base, 'stories.json')
with open(out_path, 'w', encoding='utf-8') as f:
    f.write(output)
print(f"\nSaved {len(stories)} stories to {out_path}")
