import json, os

# Try to parse corrupted files line by line and extract valid course objects
def extract_courses(filepath):
    with open(filepath, 'rb') as f:
        raw = f.read()
    # Strip BOM
    if raw.startswith(b'\xef\xbb\xbf'):
        raw = raw[3:]
    
    # Try utf-8, fallback to errors='replace'
    try:
        txt = raw.decode('utf-8')
    except:
        txt = raw.decode('utf-8', errors='replace')
    
    courses = []
    # Find all { ... } course objects by tracking brace depth
    i = 0
    while i < len(txt):
        # Find next '{'
        brace_start = txt.find('{', i)
        if brace_start == -1:
            break
        # Find matching '}'
        depth = 0
        j = brace_start
        while j < len(txt):
            if txt[j] == '{':
                depth += 1
            elif txt[j] == '}':
                depth -= 1
                if depth == 0:
                    obj_str = txt[brace_start:j+1]
                    try:
                        obj = json.loads(obj_str)
                        courses.append(obj)
                        print('  Extracted: %s (%d sections)' % (obj.get('slug','?'), len(obj.get('sections',[]))))
                    except:
                        pass
                    i = j + 1
                    break
            j += 1
        else:
            i = brace_start + 1
        i += 1
    return courses

for fn in ['course-12.json', 'courses-18-24.json']:
    path = os.path.join(
        r'D:\LvyzWeb\platform\src\content\crashai-expanded', fn)
    if os.path.exists(path):
        print('\n=== %s ===' % fn)
        courses = extract_courses(path)
        print('Extracted %d courses' % len(courses))
        for c in courses:
            print('  %s: %s (%d sections)' % (c.get('order','?'), c['slug'], len(c['sections'])))
