import json, os

with open('lessons.json.bak', 'r', encoding='utf-8') as f:
    original = json.load(f)

expanded = []

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

print('Loaded ' + str(len(expanded)) + ' expanded courses')
for c in expanded:
    print('  ' + str(c['order']) + ': ' + c['slug'] + ' (' + str(len(c['sections'])) + ' sections)')

result = []
for orig in original:
    exp = None
    for e in expanded:
        if e['slug'] == orig['slug']:
            exp = e
            break
    if exp:
        result.append(exp)
        print('  [EXPANDED] ' + str(orig['order']) + ': ' + orig['slug'] + ' (' + str(len(exp['sections'])) + ' sections)')
    else:
        result.append(orig)
        print('  [ORIGINAL] ' + str(orig['order']) + ': ' + orig['slug'] + ' (' + str(len(orig['sections'])) + ' sections)')

with open('lessons.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print('\nSaved ' + str(len(result)) + ' courses to lessons.json')
expanded_count = sum(1 for c in result if len(c['sections']) > 10)
print('Expanded courses: ' + str(expanded_count))
print('Original courses: ' + str(len(result) - expanded_count))
