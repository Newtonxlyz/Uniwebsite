import json

with open('courses-18-24.json', 'r', encoding='utf-8') as f:
    content = f.read()

# Find course 21
start = content.rfind('{', 0, content.find('integration-guide'))
brace_depth = 0
end = start
for i in range(start, len(content)):
    if content[i] == '{': brace_depth += 1
    elif content[i] == '}':
        brace_depth -= 1
        if brace_depth == 0:
            end = i + 1
            break

course_text = content[start:end]
print(f"Course 21 text: {len(course_text)} chars")

# Find all character codes in the text that could be issues
bad_chars = []
for i, c in enumerate(course_text):
    code = ord(c)
    if code < 0x20 and code not in (0x09, 0x0a, 0x0d):
        bad_chars.append((i, code))
    if code > 0x7f and code < 0xa0:
        bad_chars.append((i, code))  # C1 control chars

if bad_chars:
    for pos, code in bad_chars[:10]:
        ctx_start = max(0, pos - 20)
        ctx_end = min(len(course_text), pos + 20)
        print(f"Bad char 0x{code:04X} at offset {pos}: {repr(course_text[ctx_start:ctx_end])}")
else:
    print("No bad characters found")

# Try json.loads with strict=False
try:
    obj = json.loads(course_text, strict=False)
    print(f"SUCCESS with strict=False: {len(obj['sections'])} sections")
    for s in obj['sections']:
        print(f"  - {s['type']}: {s['title'][:50]}")
except json.JSONDecodeError as e:
    print(f"JSON error: {e}")
    # Show context around the error
    line_num = e.lineno
    col_num = e.colno
    lines = course_text.split('\n')
    if line_num <= len(lines):
        line = lines[line_num - 1]
        print(f"Error line {line_num}: {repr(line[:200])}")
        print(f"Column {col_num}: {repr(line[max(0,col_num-20):col_num+20])}")
