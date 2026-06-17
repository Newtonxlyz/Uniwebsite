import json

with open('courses-18-24.json', 'r', encoding='utf-8') as f:
    content = f.read()

def extract_course_text(content, slug):
    idx = content.find(slug)
    if idx < 0:
        print(f"Cannot find: {slug}")
        return None
    
    start = content.rfind('{', 0, idx)
    if start < 0:
        print(f"Cannot find start for: {slug}")
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

# Extract and fix course 23
text = extract_course_text(content, 'frontier')
if text:
    # Try strict=False to allow control chars
    try:
        obj = json.loads(text, strict=False)
        print(f"frontier OK: {len(obj['sections'])} sections")
    except json.JSONDecodeError as e:
        print(f"frontier strict=False failed: {e}")
        # Find the exact problem
        lines = text.split('\n')
        line = lines[e.lineno - 1] if e.lineno <= len(lines) else ''
        col = e.colno
        if col <= len(line):
            # Show the character
            bad_char = line[col-1]
            print(f"  Bad char: U+{ord(bad_char):04X} ('{bad_char}')")
            print(f"  Context: {repr(line[max(0,col-5):col+5])}")
        
        # Try to remove control chars
        import re
        cleaned = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', text)
        try:
            obj = json.loads(cleaned, strict=False)
            print(f"Cleaned OK: {len(obj['sections'])} sections")
            with open('extracted_output/course-23.json', 'w', encoding='utf-8') as f:
                json.dump(obj, f, ensure_ascii=False, indent=2)
            print("Written: extracted_output/course-23.json")
        except json.JSONDecodeError as e2:
            print(f"Cleaned still fails: {e2}")
            
            # Also try patching invalid escape sequences
            # Find lines with backslash issues
            for i, line in enumerate(cleaned.split('\n')):
                if '\\' in line:
                    # Check for invalid escapes in string context
                    pass

# Extract and fix course 24
text = extract_course_text(content, 'crashai-resources')
if text:
    try:
        obj = json.loads(text, strict=False)
        print(f"crashai-resources OK: {len(obj['sections'])} sections")
    except json.JSONDecodeError as e:
        print(f"crashai-resources strict=False failed: {e}")
        lines = text.split('\n')
        line = lines[e.lineno - 1] if e.lineno <= len(lines) else ''
        col = e.colno
        if col <= len(line):
            bad_char = line[col-1]
            print(f"  Bad char: U+{ord(bad_char):04X} ('{bad_char}')")
            print(f"  Context: {repr(line[max(0,col-5):col+5])}")
        
        import re
        cleaned = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', text)
        try:
            obj = json.loads(cleaned, strict=False)
            print(f"Cleaned OK: {len(obj['sections'])} sections")
            with open('extracted_output/course-24.json', 'w', encoding='utf-8') as f:
                json.dump(obj, f, ensure_ascii=False, indent=2)
            print("Written: extracted_output/course-24.json")
        except json.JSONDecodeError as e2:
            print(f"Cleaned still fails: {e2}")
