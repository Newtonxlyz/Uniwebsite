# -*- coding: utf-8 -*-
import json, os, sys

def u(*codes):
    return ''.join(chr(c) for c in codes)

# ============== COURSE 12: LLM Training ==============
zh = {
    'p': u(0x4f60, 0x597d),  # "你好"
    'b': u(0x9884, 0x8bad, 0x7ec3),  # "预训练"
    'llm': u(0x7684, 0x4e5d, 0x5e74, 0x4e49, 0x52a1, 0x6559, 0x80b2),  # "的九年义务教育"
    # ... this is too tedious
}

# Alternative: write content using a separate UTF-8 file approach
# Read content from a JSON template and write output

# Let me just write the JSON directly with proper encoding
out_dir = r'D:\LvyzWeb\platform\src\content\crashai-expanded'

course_12 = {
    "slug": "llm-training",
    "title": "2.6 LLM\u8bad\u7ec3",
    "description": "\u9884\u8bad\u7ec3\u5168\u6d41\u7a0b\uff1a\u6570\u636e\u6e05\u6d17/Tokenization/\u8bad\u7ec3\u7b56\u7565/\u5206\u5e03\u5f0f\u8bad\u7ec3",
    "category": "llm", "phase": "B", "order": 12,
    "sections": []
}

print("This approach is too slow. Let me write JSON directly.")
print("Writing course 12 using direct JSON construction...")

# Build sections using unicode escapes
s1 = {
    "type": "text",
    "title": "\u4e3a\u4ec0\u4e48\u9700\u8981\u9884\u8bad\u7ec3\uff1f",
    "content": "<p><b>\u9884\u8bad\u7ec3\u662fLLM\u7684\u201c\u4e5d\u5e74\u4e49\u52a1\u6559\u80b2\u201d\u3002</b>\u5728\u6a21\u578b\u5b66\u4f1a\u56de\u7b54\u95ee\u9898\u4e4b\u524d\uff0c\u5b83\u5fc5\u987b\u5148\u201c\u8bfb\u904d\u5929\u4e0b\u4e66\u201d\u3002</p>"
}

course_12["sections"].append(s1)

with open(os.path.join(out_dir, 'course-12.json'), 'w', encoding='utf-8') as f:
    json.dump(course_12, f, ensure_ascii=False, indent=2)

print("Done: course-12.json")
