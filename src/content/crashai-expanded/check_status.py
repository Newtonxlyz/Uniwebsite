import json, os

d = r'D:\LvyzWeb\platform\src\content\crashai-expanded'
for fn in sorted(os.listdir(d)):
    if not fn.endswith('.json'):
        continue
    fp = os.path.join(d, fn)
    size = os.path.getsize(fp)
    if size < 10:
        print('%s: %db EMPTY' % (fn, size))
        continue
    try:
        with open(fp, 'rb') as f:
            raw = f.read()
        if raw.startswith(b'\xef\xbb\xbf'):
            raw = raw[3:]
        txt = raw.decode('utf-8')
        data = json.loads(txt)
        if isinstance(data, list):
            print('%s: %db LIST %d items' % (fn, size, len(data)))
            for c in data:
                print('  %d: %s (%d sections)' % (c['order'], c['slug'], len(c['sections'])))
        else:
            print('%s: %db SINGLE %s (%d sections)' % (fn, size, data['slug'], len(data['sections'])))
    except Exception as e:
        print('%s: %db ERROR: %s' % (fn, size, str(e)[:80]))
