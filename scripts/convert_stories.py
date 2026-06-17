#!/usr/bin/env python
"""
Batch story converter: reads .md story files from the 绘本 directory
and outputs structured JSON files for the LvyzWeb platform.

Usage:
    python scripts/convert_stories.py
    python scripts/convert_stories.py --series 成语故事系列
    python scripts/convert_stories.py --limit 5

Output:
    platform/src/content/picturebook/stories.json  (all stories)
    platform/src/content/picturebook/stories/       (individual story files)
"""

import os, sys, json, re, hashlib, argparse
from pathlib import Path

BASE_DIR = Path(r"D:\儿童绘本计划\雷迪嘎嘎系列\绘本")
OUTPUT_DIR = Path(r"D:\LvyzWeb\platform\src\content\picturebook")
ALL_STORIES_PATH = OUTPUT_DIR / "stories.json"
INDIVIDUAL_DIR = OUTPUT_DIR / "stories"

# Series mapping: directory name -> series metadata
SERIES_META = {
    "成语故事系列": {
        "category": "classic", "emoji": "📖", "tags": ["成语", "传统文化"],
        "age": "3-8岁", "time": 8, "char_map": {"雷迪嘎嘎": "lady-gaga", "噶巴巴": "gababa", "噶丫丫": "gayaya"}
    },
    "诗歌故事系列": {
        "category": "poetry", "emoji": "🎭", "tags": ["诗歌", "韵律"],
        "age": "3-8岁", "time": 6, "char_map": {"雷迪嘎嘎": "lady-gaga", "噶巴巴": "gababa", "噶丫丫": "gayaya"}
    },
    "儿童情感引导系列": {
        "category": "emotion", "emoji": "💝", "tags": ["情感引导", "亲子"],
        "age": "3-8岁", "time": 8, "char_map": {"雷迪嘎嘎": "lady-gaga", "噶巴巴": "gababa", "噶丫丫": "gayaya"}
    },
    "噶巴巴成长系列": {
        "category": "growth", "emoji": "🌟", "tags": ["成长", "勇气"],
        "age": "3-6岁", "time": 5, "char_map": {"噶巴巴": "gababa", "雷迪嘎嘎": "lady-gaga", "噶丫丫": "gayaya"}
    },
    "噶丫丫成长系列": {
        "category": "growth", "emoji": "🌸", "tags": ["成长", "自信"],
        "age": "3-6岁", "time": 5, "char_map": {"噶丫丫": "gayaya", "雷迪嘎嘎": "lady-gaga", "噶巴巴": "gababa"}
    },
    "噶丫丫领养故事": {
        "category": "growth", "emoji": "💕", "tags": ["领养", "家庭"],
        "age": "3-8岁", "time": 6, "char_map": {"噶丫丫": "gayaya", "雷迪嘎嘎": "lady-gaga", "噶巴巴": "gababa"}
    },
    "俚语歇后语故事系列": {
        "category": "language", "emoji": "💬", "tags": ["俚语", "歇后语", "趣味"],
        "age": "5-10岁", "time": 6, "char_map": {"雷迪嘎嘎": "lady-gaga", "噶巴巴": "gababa", "噶丫丫": "gayaya"}
    },
    "科普系列": {
        "category": "science", "emoji": "🔬", "tags": ["科普", "自然"],
        "age": "4-10岁", "time": 10, "char_map": {"噶巴巴": "gababa", "噶丫丫": "gayaya", "雷迪嘎嘎": "lady-gaga"}
    },
    "思念母亲系列": {
        "category": "emotion", "emoji": "🌙", "tags": ["思念", "亲情"],
        "age": "3-8岁", "time": 7, "char_map": {"噶巴巴": "gababa", "噶丫丫": "gayaya", "雷迪嘎嘎": "lady-gaga"}
    },
    "雷迪嘎嘎诞生成长系列": {
        "category": "origin", "emoji": "🐦", "tags": ["起源", "诞生"],
        "age": "3-8岁", "time": 8, "char_map": {"雷迪嘎嘎": "lady-gaga"}
    },
    "乌鸦喝水系列": {
        "category": "classic", "emoji": "💧", "tags": ["经典改编", "智慧"],
        "age": "3-8岁", "time": 8, "char_map": {"雷迪嘎嘎": "lady-gaga", "噶巴巴": "gababa", "噶丫丫": "gayaya"}
    },
}

# Known characters for detection
CHARACTER_NAMES = ["雷迪嘎嘎", "噶巴巴", "噶丫丫", "晨光", "奶奶",
                   "伞志", "白攸白", "真咕咕", "丁凌凌", "丁刚冲冲",
                   "花拉拉", "土噜噜"]

# Character emoji mapping
CHAR_EMOJI = {
    "雷迪嘎嘎": "🐦", "噶巴巴": "🐤", "噶丫丫": "🕊️",
    "晨光": "☀️", "奶奶": "👵", "伞志": "🐿️",
    "白攸白": "🐰", "真咕咕": "🦉", "丁凌凌": "🦅",
    "丁刚冲冲": "🦅", "花拉拉": "🦌", "土噜噜": "🦔"
}

# Story emoji by theme
THEME_EMOJI = {
    "成语": "\U0001F4D6", "诗歌": "\U0001F3AD", "情感": "\U0001F49D",
    "成长": "\u2B50", "科普": "\U0001F52C", "俚语": "\U0001F4AC",
    "思念": "\U0001F319", "诞生": "\U0001F426", "乌鸦喝水": "\U0001F4A7",
}

DEFAULT_EMOJI = "\U0001F4D6"

def extract_title(content: str) -> str:
    """Extract story title from the first line (# Title)."""
    m = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    if m:
        title = m.group(1).strip()
        # Remove "成语故事/NNN：" prefix
        title = re.sub(r'^(成语故事\d*|诗歌故事\d*|俚语故事\d*|歇后语故事\d*)[：:]\s*', '', title)
        title = re.sub(r'第\d+[篇章课]?\s*', '', title)
        return title.strip()
    return "未命名故事"

def extract_description(content: str) -> str:
    """Extract the story brief from ## 故事简介 section."""
    m = re.search(r'## 故事简介\s*\n(.+?)(?:\n##|\n---|\Z)', content, re.DOTALL)
    if m:
        desc = m.group(1).strip()
        # Remove **bold** markers
        desc = re.sub(r'\*\*(.+?)\*\*', r'\1', desc)
        return desc.strip()
    return ""

def extract_characters(content: str, series_name: str) -> list:
    """Detect characters used in this story."""
    chars = set()
    for name in CHARACTER_NAMES:
        if name in content:
            chars.add(name)
    # Default characters if none detected
    if not chars and series_name in SERIES_META:
        chars = set(SERIES_META[series_name]["char_map"].keys())
    return sorted(chars)

def extract_tags(content: str, series_name: str, title: str) -> list:
    """Extract/derive tags for the story."""
    tags = []
    meta = SERIES_META.get(series_name, {})
    tags.extend(meta.get("tags", []))
    
    # Check for 成语释义 section
    if "成语释义" in content:
        tags.append("成语")
    if "故事寓意" in content:
        tags.append("寓意")
    if "科学" in content or "科普" in content:
        tags.append("科普")
    
    return list(set(tags))

def extract_pages(content: str) -> list:
    """Extract page-by-page text from the story."""
    pages = []
    
    # Chinese numeral to number mapping
    CN_NUM = {
        '\u4e00': 1, '\u4e8c': 2, '\u4e09': 3, '\u56db': 4, '\u4e94': 5,
        '\u516d': 6, '\u4e03': 7, '\u516b': 8, '\u4e5d': 9, '\u5341': 10,
        '\u5341\u4e00': 11, '\u5341\u4e8c': 12, '\u5341\u4e09': 13,
        '\u5341\u56db': 14, '\u5341\u4e94': 15, '\u5341\u516d': 16,
        '\u5341\u4e03': 17, '\u5341\u516b': 18, '\u5341\u4e5d': 19,
        '\u4e8c\u5341': 20, '\u4e8c\u5341\u4e00': 21, '\u4e8c\u5341\u4e8c': 22,
        '\u4e8c\u5341\u4e09': 23, '\u4e8c\u5341\u56db': 24, '\u4e8c\u5341\u4e94': 25,
        '\u4e8c\u5341\u516d': 26, '\u4e8c\u5341\u4e03': 27, '\u4e8c\u5341\u516b': 28,
        '\u4e8c\u5341\u4e5d': 29, '\u4e09\u5341': 30,
    }
    
    def cn_to_num(s):
        """Convert Chinese numeral string to integer."""
        s = s.strip()
        if s.isdigit():
            return int(s)
        return CN_NUM.get(s, 0)
    
    # Pattern: **第N页** or ### 第N页 (N can be Chinese or numeric)
    page_pattern = re.compile(
        r'(?:\*\*)?\s*\u7b2c\s*([\u4e00-\u4e9f0-9]+)\s*[\u9875\u7bc7]\s*(?:\*\*)?\s*\n+(.*?)'
        r'(?=(?:\*\*)?\s*\u7b2c\s*[\u4e00-\u4e9f0-9]+\s*[\u9875\u7bc7]|\Z)',
        re.DOTALL
    )
    
    matches = page_pattern.findall(content)
    if matches:
        for i, (num_str, text) in enumerate(matches):
            page_num = cn_to_num(num_str)
            body = text.strip()
            # Remove ** markers
            body = re.sub(r'\*\*', '', body)
            # Collapse multiple newlines
            body = re.sub(r'\n{2,}', '\n', body)
            body = body.strip()
            if body and page_num > 0:
                pages.append({
                    "page": page_num,
                    "body": body
                })
    
    return pages

def extract_id(content: str, title: str, series_name: str) -> str:
    """Generate a short, stable unique ID for the story."""
    import hashlib
    base = f"{series_name}-{title}"
    # Use first 8 chars of MD5 as stable short ID
    short_hash = hashlib.md5(base.encode('utf-8')).hexdigest()[:10]
    # Also include a shortened title slug for readability
    clean_title = re.sub(r'[^\w\u4e00-\u9fff]', '-', title[:20])
    clean_title = re.sub(r'-+', '-', clean_title).strip('-')
    if clean_title:
        return f"{clean_title}-{short_hash}"
    return f"story-{short_hash}"

def process_story_file(file_path: Path, series_name: str) -> dict | None:
    """Process a single .md story file into a structured story dict."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"  [ERROR] Reading {file_path}: {e}")
        return None

    if not content.strip():
        return None

    title = extract_title(content)
    pages = extract_pages(content)
    
    if not pages:
        print(f"  [SKIP] No pages found in {file_path.name}")
        return None

    desc = extract_description(content)
    chars = extract_characters(content, series_name)
    tags = extract_tags(content, series_name, title)
    
    # Determine emoji
    emoji = DEFAULT_EMOJI
    for keyword, e in THEME_EMOJI.items():
        if keyword in series_name or keyword in title:
            emoji = e
            break
    
    story_id = extract_id(content, title, series_name)
    page_count = len(pages)
    
    meta = SERIES_META.get(series_name, {})
    
    story = {
        "id": story_id,
        "title": title,
        "emoji": emoji,
        "series": series_name,
        "series_category": meta.get("category", "other"),
        "desc": desc or f"雷迪嘎嘎系列{series_name}中的故事",
        "pages": page_count,
        "age": meta.get("age", "3-8岁"),
        "time": meta.get("time", 8),
        "status": "即将上线",
        "chars": chars,
        "tags": tags,
        "text": pages,
        "illustrated": False,
        "image_dir": None,
        "source": str(file_path.relative_to(BASE_DIR).as_posix()),
    }
    
    return story

def scan_story_dirs() -> dict:
    """Scan all series directories for story text files."""
    all_stories = {}
    
    for series_name in sorted(os.listdir(BASE_DIR)):
        series_path = BASE_DIR / series_name
        if not series_path.is_dir() or series_name.startswith('_') or series_name.startswith('001_'):
            # Skip template and individual story directories
            if series_name == '_TEMPLATE_':
                continue
            if series_name.startswith('001_'):
                # Individual story already processed - handled separately
                continue
        
        # Check if this is a known series
        if series_name not in SERIES_META:
            print(f"  [NOTE] Unknown series directory: {series_name}")
            continue
        
        # Look for 故事文本 subfolder
        story_text_dir = series_path / "故事文本"
        if not story_text_dir.is_dir():
            # Check if there are .md files directly in the series dir
            direct_files = list(series_path.glob("*.md"))
            if direct_files:
                story_text_dir = series_path
            else:
                print(f"  [SKIP] No 故事文本 dir: {series_name}")
                continue
        
        md_files = sorted(story_text_dir.glob("*.md"))
        if not md_files:
            print(f"  [SKIP] No .md files in {series_name}")
            continue
        
        print(f"  {series_name}: {len(md_files)} files")
        stories_for_series = []
        
        for md_file in md_files:
            story = process_story_file(md_file, series_name)
            if story:
                stories_for_series.append(story)
        
        all_stories[series_name] = stories_for_series
        print(f"    -> {len(stories_for_series)} stories extracted")
    
    return all_stories

def scan_individual_dirs() -> list:
    """Scan individual story directories (like 001_xxx, 乌鸦喝水系列 subdirs)."""
    stories = []
    ignored = {'_TEMPLATE_', '001_儿童情感引导_001_黑黑的洞穴我不怕'}
    
    for item in os.listdir(BASE_DIR):
        if item.startswith('_') or item in ignored:
            continue
        
        item_path = BASE_DIR / item
        if not item_path.is_dir():
            continue
        
        # Check if it looks like a multi-story series (has subdirs)
        subdirs = [d for d in item_path.iterdir() if d.is_dir()]
        if not subdirs:
            continue
        
        # Check for 乌鸦喝水系列-like structure
        series_name = item
        if series_name not in SERIES_META:
            continue
        
        story_files = []
        for subdir in sorted(subdirs):
            # Look for 故事脚本 or 01_故事脚本
            script_dir = subdir / "01_故事脚本"
            if script_dir.is_dir():
                story_files.extend(sorted(script_dir.glob("*.md")))
            else:
                # Try direct .md files
                story_files.extend(sorted(subdir.glob("*.md")))
                # Try subdir's subdir
                for subsub in sorted(subdir.iterdir()):
                    if subsub.is_dir():
                        story_files.extend(sorted(subsub.glob("*.md")))
        
        for md_file in story_files:
            story = process_story_file(md_file, series_name)
            if story:
                stories.append(story)
        
        if stories:
            print(f"  {series_name} (individual): {len(stories)} stories")
    
    return stories

def main():
    parser = argparse.ArgumentParser(description="Convert .md stories to JSON")
    parser.add_argument("--series", help="Only process this series")
    parser.add_argument("--limit", type=int, help="Limit stories per series")
    parser.add_argument("--output", choices=["single", "individual", "both"], default="both",
                       help="Output format: single file, individual files, or both")
    parser.add_argument("--dry-run", action="store_true", help="Scan only, no output")
    args = parser.parse_args()
    
    print("=" * 60)
    print("  LvyzWeb 故事批量转换工具")
    print("=" * 60)
    print(f"  来源: {BASE_DIR}")
    print(f"  输出: {OUTPUT_DIR}")
    print()
    
    # Scan series-based story text directories
    print("[1/3] 扫描系列故事目录...")
    all_series = scan_story_dirs()
    
    # Scan individual story directories (disabled - duplicates main series scanning)
    print("[2/3] ...")
    individual_stories = []
    
    # Flatten and merge
    print("[3/3] \u6574\u7406\u8f93\u51fa...")
    all_stories = []
    
    # MANUAL: Add the dark-cave story
    manual_stories = [
        {
            "id": "dark-cave",
            "title": "\u9ed1\u9ed1\u7684\u6d1e\u7a74\u6211\u4e0d\u6015",
            "emoji": "\U0001F49D",
            "series": "\u513f\u7ae5\u60c5\u611f\u5f15\u5bfc\u7cfb\u5217",
            "series_category": "emotion",
            "desc": "\u66b4\u98ce\u96e8\u7684\u591c\u665a\uff0c\u6811\u6d1e\u91cc\u7684\u8721\u70db\u7184\u706d\u4e86\uff0c\u560e\u5df4\u5df4\u548c\u560e\u4e2b\u4e2b\u88ab\u56f0\u5728\u9ed1\u6697\u4e2d\u3002",
            "pages": 20,
            "age": "3-8\u5c81",
            "time": 8,
            "status": "\u5df2\u4e0a\u7ebf",
            "chars": ["\u96f7\u8fea\u560e\u560e", "\u560e\u5df4\u5df4", "\u560e\u4e2b\u4e2b"],
            "tags": ["\u52c7\u6c14", "\u6050\u60e7", "\u4eb2\u5b50", "\u60c5\u611f\u5f15\u5bfc"],
            "text": [],
            "illustrated": True,
            "image_dir": "dark-cave",
            "source": "manual"
        }
    ]
    
    for series_name, stories in all_series.items():
        if args.series and series_name != args.series:
            continue
        if args.limit:
            stories = stories[:args.limit]
        all_stories.extend(stories)
    
    all_stories.extend(individual_stories)
    all_stories.extend(manual_stories)
    
    # Remove duplicates by ID
    seen = set()
    unique_stories = []
    for s in all_stories:
        if s["id"] not in seen:
            seen.add(s["id"])
            unique_stories.append(s)
    
    # Post-process: detect illustrated stories by scanning public image dirs
    public_stories_dir = Path(r"D:\LvyzWeb\platform\public\picturebook\stories")
    if public_stories_dir.is_dir():
        print("\n[4/3] 检测已有插图...")
        for img_dir in sorted(public_stories_dir.iterdir()):
            if not img_dir.is_dir():
                continue
            page_files = sorted(img_dir.glob("page_*.png"))
            if not page_files:
                continue
            # Try to match by directory name = story id, or by title
            dir_name = img_dir.name
            matched = False
            for story in unique_stories:
                if story["id"] == dir_name:
                    story["illustrated"] = True
                    story["image_dir"] = dir_name
                    story["status"] = "已上线"
                    matched = True
                    break
            if matched:
                print(f"  [OK] {dir_name} -> matched by ID, {len(page_files)} pages")
            else:
                print(f"  [WARN] {dir_name} has {len(page_files)} images but no matching story ID")
    
    print(f"\n  [OK] Total: {len(unique_stories)} stories")
    print(f"  [OK] Series: {len(all_series)}")
    
    if args.dry_run:
        print("\n  Preview:")
        for s in unique_stories[:5]:
            print(f"    [{s['emoji']}] {s['title']} ({s['series']}, {s['pages']} pages)")
        return
    
    # Output
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    INDIVIDUAL_DIR.mkdir(parents=True, exist_ok=True)
    
    if args.output in ("single", "both"):
        with open(ALL_STORIES_PATH, 'w', encoding='utf-8') as f:
            json.dump(unique_stories, f, ensure_ascii=False, indent=2)
        print(f"  [OK] Saved: {ALL_STORIES_PATH}")
    
    if args.output in ("individual", "both"):
        for story in unique_stories:
            filepath = INDIVIDUAL_DIR / f"{story['id']}.json"
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(story, f, ensure_ascii=False, indent=2)
        print(f"  [OK] Saved: {INDIVIDUAL_DIR}/ ({len(unique_stories)} files)")
    
    print("\n  [OK] Conversion complete!")

if __name__ == "__main__":
    main()
