import json
import re

with open('courses-18-24.json', 'r', encoding='utf-8') as f:
    content = f.read()

def extract_course(content, slug):
    idx = content.find(slug)
    if idx < 0:
        return None, "slug not found"
    
    start = content.rfind('{', 0, idx)
    if start < 0:
        return None, "start not found"
    
    brace_depth = 0
    end = start
    for i in range(start, len(content)):
        if content[i] == '{': brace_depth += 1
        elif content[i] == '}':
            brace_depth -= 1
            if brace_depth == 0:
                end = i + 1
                break
    
    return content[start:end], None

def fix_json_errors(text):
    """Attempt to fix common JSON errors"""
    # Fix invalid escape sequences (like \L, \s, etc. outside of raw strings)
    # These appear in JSON string values as invalid escapes
    
    # Strategy: try to parse, if fails, fix and retry
    try:
        json.loads(text)
        return text  # Already valid
    except json.JSONDecodeError as e:
        pass
    
    # Find all backslashes that aren't valid JSON escapes
    # Valid JSON escapes: \\, \/, \", \b, \f, \n, \r, \t, \uXXXX
    result = []
    i = 0
    in_string = False
    while i < len(text):
        c = text[i]
        if c == '"' and (i == 0 or text[i-1] != '\\'):
            in_string = not in_string
            result.append(c)
        elif c == '\\' and in_string:
            # Check if next char is a valid JSON escape
            if i + 1 < len(text):
                nxt = text[i+1]
                if nxt in '"\\/bfnrtu':
                    result.append(c)
                    result.append(nxt)
                    i += 1
                else:
                    # Invalid escape - double the backslash
                    result.append('\\\\')
                    result.append(nxt)
                    i += 1
            else:
                result.append(c)
        else:
            result.append(c)
        i += 1
    
    return ''.join(result)

# Fix course 23 (frontier)
course_text, err = extract_course(content, 'frontier')
if course_text:
    fixed = fix_json_errors(course_text)
    try:
        obj = json.loads(fixed)
        print(f"frontier: {len(obj.get('sections', []))} sections")
        with open('extracted_output/course-23.json', 'w', encoding='utf-8') as f:
            json.dump(obj, f, ensure_ascii=False, indent=2)
        print("  Written to extracted_output/course-23.json")
    except json.JSONDecodeError as e:
        print(f"frontier still fails: {e}")
        # Let's examine the problem area
        lines = course_text.split('\n')
        line_num = e.lineno
        col_num = e.colno
        if line_num <= len(lines):
            line = lines[line_num - 1]
            print(f"  Line {line_num}: {line[:200]}")
            print(f"  Char {col_num}: {repr(line[max(0,col_num-10):col_num+30])}")

# Fix course 24 (crashai-resources)
course_text, err = extract_course(content, 'crashai-resources')
if course_text:
    fixed = fix_json_errors(course_text)
    try:
        obj = json.loads(fixed)
        print(f"crashai-resources: {len(obj.get('sections', []))} sections")
        with open('extracted_output/course-24.json', 'w', encoding='utf-8') as f:
            json.dump(obj, f, ensure_ascii=False, indent=2)
        print("  Written to extracted_output/course-24.json")
    except json.JSONDecodeError as e:
        print(f"crashai-resources still fails: {e}")
        lines = course_text.split('\n')
        line_num = e.lineno
        col_num = e.colno
        if line_num <= len(lines):
            line = lines[line_num - 1]
            print(f"  Line {line_num}: {line[:200]}")
            print(f"  Char {col_num}: {repr(line[max(0,col_num-10):col_num+30])}")
