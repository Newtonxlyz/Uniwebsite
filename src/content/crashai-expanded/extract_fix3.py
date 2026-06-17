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

def fix_inner_quotes(text):
    """Fix unescaped ASCII double quotes inside JSON string values"""
    result = []
    in_string = False
    in_escape = False
    i = 0
    while i < len(text):
        c = text[i]
        if in_escape:
            result.append(c)
            in_escape = False
        elif c == '\\' and in_string:
            result.append(c)
            in_escape = True
        elif c == '"' and not in_escape:
            # Check if this is a structural quote (start/end of string)
            # or a content quote (inside a string)
            # We use the heuristic: a quote preceded by : or , or [ or { or whitespace is likely structural start
            # A quote followed by , or } or ] or : or whitespace is likely structural end
            if not in_string:
                # Opening quote - check if previous non-whitespace char is : or , or [ or {
                prev_nonws = ''
                for j in range(i-1, max(0, i-10)-1, -1):
                    if text[j] not in ' \t\n\r':
                        prev_nonws = text[j]
                        break
                if prev_nonws in ':,[{':
                    in_string = True
                    result.append(c)
                else:
                    # This is likely a content quote - replace with curly quotes
                    result.append('\u201c')
            else:
                # Check if this is a closing structural quote
                # Look ahead for : or , or } or ]
                next_nonws = ''
                for j in range(i+1, min(len(text), i+10)):
                    if text[j] not in ' \t\n\r':
                        next_nonws = text[j]
                        break
                if next_nonws in ',:}]':
                    in_string = False
                    result.append(c)
                else:
                    # Content quote
                    result.append('\u201d')
        else:
            result.append(c)
        i += 1
    return ''.join(result)

def fix_backslashes(text):
    """Fix invalid backslash escapes in JSON - double them"""
    # Walk through the text and when inside a JSON string,
    # if we see a backslash not followed by valid JSON escape char, double it
    result = []
    in_string = False
    in_escape = False
    i = 0
    while i < len(text):
        c = text[i]
        if in_escape:
            if c not in '"\\/bfnrtu':
                # Invalid escape sequence - double the backslash
                result.append('\\')
            result.append(c)
            in_escape = False
        elif c == '\\' and in_string:
            in_escape = True
            result.append(c)
        elif c == '"':
            in_string = not in_string
            result.append(c)
        else:
            result.append(c)
        i += 1
    
    # Handle trailing escape
    if in_escape:
        result.append('\\')
    
    return ''.join(result)

# Fix course 23
text23 = extract_course_text(content, 'frontier')
if text23:
    print(f"Course 23 (frontier) original length: {len(text23)}")
    fixed23 = fix_inner_quotes(text23)
    
    try:
        obj = json.loads(fixed23, strict=False)
        print(f"  Parsed OK: {len(obj.get('sections',[]))} sections")
        with open('extracted_output/course-23.json', 'w', encoding='utf-8') as f:
            json.dump(obj, f, ensure_ascii=False, indent=2)
        print(f"  Written: {len(json.dumps(obj, ensure_ascii=False))} bytes")
    except json.JSONDecodeError as e:
        print(f"  Failed: {e}")
        lines = fixed23.split('\n')
        line = lines[e.lineno - 1] if e.lineno <= len(lines) else ''
        print(f"  Line {e.lineno}: {line[:200]}")

# Fix course 24
text24 = extract_course_text(content, 'crashai-resources')
if text24:
    print(f"Course 24 (crashai-resources) original length: {len(text24)}")
    fixed24 = fix_backslashes(text24)
    
    try:
        obj = json.loads(fixed24, strict=False)
        print(f"  Parsed OK: {len(obj.get('sections',[]))} sections")
        with open('extracted_output/course-24.json', 'w', encoding='utf-8') as f:
            json.dump(obj, f, ensure_ascii=False, indent=2)
        print(f"  Written: {len(json.dumps(obj, ensure_ascii=False))} bytes")
    except json.JSONDecodeError as e:
        print(f"  Failed: {e}")
        lines = fixed24.split('\n')
        line = lines[e.lineno - 1] if e.lineno <= len(lines) else ''
        print(f"  Line {e.lineno}: {repr(line[max(0,e.colno-20):e.colno+20])}")
