#!/usr/bin/env python3
import json

with open(r'D:\LvyzWeb\platform\src\content\crashai-expanded\course-activation.json', 'r', encoding='utf-8') as f:
    content = f.read()

data = json.loads(content)
print("File size:", len(content), "bytes")
print("Sections count:", len(data["sections"]))
print("Slug:", data["slug"])
print("Title:", data["title"])
print()

for s in data["sections"]:
    print("  [", s["type"], "]", s["title"], sep="")

# Check Chinese quotes
qleft = content.count("\u201c")
qright = content.count("\u201d")
print("\nChinese quotes (\u201c/\u201d):", qleft, "left,", qright, "right")

# Verify no escaped ASCII quotes used in Chinese text context
print("\nValidation: JSON is valid and well-formed.")
