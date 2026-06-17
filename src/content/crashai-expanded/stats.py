import json
with open(r'D:\LvyzWeb\platform\src\content\lessons.json', 'r', encoding='utf-8-sig') as f:
    courses = json.load(f)
print('Total courses:', len(courses))
print('Total sections:', sum(len(c.get('sections', [])) for c in courses))
print()
for c in courses:
    sections = c.get('sections', [])
    types = {}
    for s in sections:
        t = s.get('type', 'text')
        types[t] = types.get(t, 0) + 1
    print('  [%2d] %-25s - %2d sections - %s' % (c['order'], c['slug'], len(sections), str(types)))
