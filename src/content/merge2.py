import json, os, glob

with open('lessons.json.bak', 'r', encoding='utf-8') as f:
    original = json.load(f)

expanded = []

# Load combined files
for fn in ['courses-0-5.json', 'courses-6-11.json']:
    path = 'crashai-expanded/' + fn
    if os.path.exists(path):
        with open(path, 'rb') as f:
            raw = f.read()
        if raw.startswith(b'\xef\xbb\xbf'):
            raw = raw[3:]
        data = json.loads(raw.decode('utf-8'))
        if isinstance(data, list):
            expanded.extend(data)
        else:
            expanded.append(data)

# Load individual course files
for fn in glob.glob('crashai-expanded/course-*.json'):
    with open(fn, 'rb') as f:
        raw = f.read()
    if raw.startswith(b'\xef\xbb\xbf'):
        raw = raw[3:]
    try:
        data = json.loads(raw.decode('utf-8'))
        if isinstance(data, dict) and 'slug' in data:
            expanded.append(data)
    except:
        pass

print('Loaded %d expanded courses' % len(expanded))
for c in expanded:
    print('  %d: %s (%d sections)' % (c['order'], c['slug'], len(c['sections'])))

result = []
for orig in original:
    exp = None
    for e in expanded:
        if e['slug'] == orig['slug']:
            exp = e
            break
    if exp:
        result.append(exp)
        print('  [EXPANDED] %d: %s (%d sections)' % (orig['order'], orig['slug'], len(exp['sections'])))
    else:
        result.append(orig)
        print('  [ORIGINAL] %d: %s (%d sections)' % (orig['order'], orig['slug'], len(orig['sections'])))

with open('lessons.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print('\nSaved %d courses to lessons.json' % len(result))
expanded_count = sum(1 for c in result if len(c['sections']) > 10)
print('Expanded courses: %d' % expanded_count)
print('Original courses: %d' % (len(result) - expanded_count))
