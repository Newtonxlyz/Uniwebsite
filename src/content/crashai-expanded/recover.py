import json, re, os

def fix_and_extract_courses(filepath, output_prefix):
    with open(filepath, 'rb') as f:
        raw = f.read()
    if raw.startswith(b'\xef\xbb\xbf'):
        raw = raw[3:]
    txt = raw.decode('utf-8')
    
    # Strategy: extract course objects by brace counting
    # This is robust against unescaped quotes inside strings
    
    in_string = False
    escaped = False
    depth = 0
    course_start = None
    courses_str = []
    
    for i, ch in enumerate(txt):
        if escaped:
            escaped = False
            continue
        if ch == '\\':
            escaped = True
            continue
        if ch == '"':
            in_string = not in_string
            continue
        if in_string:
            continue
        
        if ch == '{':
            depth += 1
            if depth == 1:
                course_start = i
        elif ch == '}':
            depth -= 1
            if depth == 0 and course_start is not None:
                courses_str.append(txt[course_start:i+1])
    
    print("File: %s" % filepath)
    print("  Found %d course objects" % len(courses_str))
    
    valid_courses = []
    for idx, cstr in enumerate(courses_str):
        try:
            course = json.loads(cstr)
            valid_courses.append(course)
            print("  Course %d: %s (%d sections) OK" % (course['order'], course['slug'], len(course['sections'])))
        except json.JSONDecodeError as e:
            print("  Course %d: JSON error at line %d col %d - attempting fix..." % (idx, e.lineno, e.colno))
            
            # Fix: find all " inside content strings and replace with curly quotes
            # Approach: state machine that tracks content string boundaries
            fixed = []
            state = 'key'  # key|in_key|after_key|value_start|in_value|value_end
            key_re = re.compile(r'^"([a-z_]+)"\s*:\s*$')
            
            lines = cstr.split('\n')
            fixed_lines = []
            for line in lines:
                # Check if this line starts a content value: "content": "
                m = re.match(r'^\s+"content":\s+"', line)
                if m:
                    # Extract the content part (after opening quote)
                    prefix = m.group()
                    content_part = line[len(prefix):]
                    # Find the closing quote at the end of this or later lines
                    # This is tricky with multiline content...
                    # For now, just append and handle later
                    fixed_lines.append(line)
                else:
                    fixed_lines.append(line)
            
            # Simpler approach: just try replacing all " that look like Chinese quotes
            # Pattern: " followed by Chinese character, or Chinese character followed by "
            new_cstr = cstr
            # Only replace quotes that are inside the content value (after "content": ")
            # We'll use a greedy approach: find the first "content": " and then scan
            
            # Actually, let's try the simplest approach: remove all problematic "
            # by replacing them with Unicode curly quotes
            new_cstr = cstr[:e.pos] + _fix_remaining(cstr[e.pos:])
            
            try:
                course = json.loads(new_cstr)
                valid_courses.append(course)
                print("    -> FIXED! %s (%d sections)" % (course['slug'], len(course['sections'])))
            except:
                print("    -> Still broken, skipping")
    
    # Save valid courses
    if valid_courses:
        outpath = output_prefix + '-RECOVERED.json'
        with open(outpath, 'w', encoding='utf-8') as f:
            json.dump(valid_courses, f, ensure_ascii=False, indent=2)
        print("  Saved %d courses to %s" % (len(valid_courses), outpath))
    return valid_courses

def _fix_remaining(text):
    """Replace unescaped ASCII quotes with curly quotes"""
    # Only fix quotes that are between Chinese/HTML content
    result = []
    i = 0
    while i < len(text):
        if text[i] == '"' and (i == 0 or text[i-1] != '\\'):
            # Check if this is a JSON structural quote or content quote
            # If preceded by Chinese or HTML, it's a content quote
            if i > 0 and (ord(text[i-1]) > 127 or text[i-1] in ('>', '\u201D')):
                result.append('\u201C') if i==0 or text[i-1] != '\u201C' else result.append('\u201D')
            else:
                result.append('"')
        else:
            result.append(text[i])
        i += 1
    return ''.join(result)

# Process files
base = r'D:\LvyzWeb\platform\src\content\crashai-expanded'
fix_and_extract_courses(os.path.join(base, 'courses-18-24.json'), os.path.join(base, 'courses-18-24'))
