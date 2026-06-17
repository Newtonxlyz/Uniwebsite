import json

with open('courses-18-24.json', 'r', encoding='utf-8') as f:
    content = f.read()

def extract_course_text(content, slug):
    idx = content.find(slug)
    if idx < 0:
        return None
    start = content.rfind('{', 0, idx)
    if start < 0:
        return None
    brace_depth = 0
    end = start
    for i in range(start, len(content)):
        if content[i] == '{': brace_depth += 1
        elif content[i] == '}':
            brace_depth -= 1
            if brace_depth == 0:
                end = i + 1
                break
    return content[start:end]

# Fix course 23 (frontier) - line 56 issue
text23 = extract_course_text(content, 'frontier')
if text23:
    lines = text23.split('\n')
    print("=== Course 23 (frontier) ===")
    
    # Show context around line 56
    for i in range(53, 61):
        if i < len(lines):
            print(f"Line {i+1}: {lines[i][:150]}")
        print()
    
    # The error is at line 56, col 30
    # Let's see more context
    print("\n--- Line 56 full ---")
    print(repr(lines[55]))

print()
print("=" * 60)
print()

# Fix course 24 (crashai-resources) - line 79 issue
text24 = extract_course_text(content, 'crashai-resources')
if text24:
    lines = text24.split('\n')
    print("=== Course 24 (crashai-resources) ===")
    
    # Show context around line 79
    for i in range(76, 82):
        if i < len(lines):
            print(f"Line {i+1}: {repr(lines[i])[:200]}")
        print()
    
    print("\n--- Line 79 full ---")
    print(repr(lines[78]))
