import json, os

for fn in ['course-12.json', 'courses-18-24.json']:
    fp = os.path.join(r'D:\LvyzWeb\platform\src\content\crashai-expanded', fn)
    with open(fp, 'rb') as f:
        raw = f.read()
    if raw.startswith(b'\xef\xbb\xbf'):
        raw = raw[3:]
    txt = raw.decode('utf-8', errors='replace')
    
    # Try to find all valid course objects by looking for patterns
    # "slug": "..." around the error area
    print('=== ' + fn + ' ===')
    
    # Try splitting by "}," which separates courses in an array
    parts = txt.split('}\n,')
    print('Split by "}," count:', len(parts))
    
    # Alternative: try to find valid course objects by searching for "slug" patterns
    import re
    slugs = re.findall(r'"slug":\s*"([^"]+)"', txt)
    print('Found slugs:', slugs)
    
    # Try locating the error area
    for enc in ['utf-8', 'utf-8-sig']:
        try:
            txt2 = raw.decode(enc)
        except:
            continue
        for lineno, line in enumerate(txt2.split('\n')[:20], 1):
            print('  Line %d: %s' % (lineno, line[:120]))
    print()
