import json

with open(r'D:\LvyzWeb\platform\src\content\lessons.json.bak', 'r', encoding='utf-8') as f:
    data = json.load(f)
for c in data:
    if c['order'] >= 12:
        print("%d: %s - %s (%d sections)" % (c['order'], c['slug'], c['title'], len(c.get('sections',[]))))
        for s in c.get('sections', []):
            print("  [%s] %s" % (s.get('type','?'), s.get('title','?')))
