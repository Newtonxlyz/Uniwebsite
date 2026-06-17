import json, os

for fn in ['courses-0-5.json','courses-6-11.json','courses-12-17.json','courses-18-24.json']:
    if not os.path.exists(fn):
        print(fn + ': NOT FOUND')
        continue
    with open(fn,'rb') as f:
        raw = f.read()
    
    for enc in ['utf-8-sig','utf-8','latin-1','gbk','cp1252']:
        try:
            txt = raw.decode(enc)
            data = json.loads(txt)
            if isinstance(data, list):
                print(fn + ': [' + enc + '] VALID JSON array, ' + str(len(data)) + ' courses')
                for c in data: 
                    print('  ' + str(c['order']) + ': ' + c['slug'] + ' (' + str(len(c['sections'])) + ' sections)')
            else:
                print(fn + ': [' + enc + '] VALID JSON single object, ' + data['slug'] + ' (' + str(len(data['sections'])) + ' sections)')
            break
        except json.JSONDecodeError as e:
            if enc == 'cp1252':
                print(fn + ': JSON syntax error at ' + str(e.lineno) + ':' + str(e.colno) + ' - ' + str(e)[:80])
                lines = txt.split('\n')
                if e.lineno <= len(lines):
                    ctx = lines[e.lineno-1]
                    print('  line: ' + ctx[:100])
        except Exception as e:
            if enc == 'cp1252':
                print(fn + ': Decode error with ' + enc + ' - ' + str(e))
    print()
