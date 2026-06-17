import json, os, glob

src_dir = r'D:\LvyzWeb\platform\src\content\crashai-expanded'
tgt = r'D:\LvyzWeb\platform\src\content\lessons.json'

all_courses = []

# 1. Read multi-course files (courses-0-5.json, courses-6-11.json)
# Skip courses-18-24-FIXED.json as it has JSON errors
multi_files = ['courses-0-5.json', 'courses-6-11.json']
for fn in multi_files:
    fp = os.path.join(src_dir, fn)
    if os.path.exists(fp):
        try:
            with open(fp, 'r', encoding='utf-8-sig') as f:
                data = json.load(f)
                if isinstance(data, list):
                    all_courses.extend(data)
                    print(f'  {fn}: {len(data)} courses')
                else:
                    print(f'  {fn}: not a list (type={type(data).__name__})')
        except Exception as e:
            print(f'  {fn}: ERROR - {e}')
    else:
        print(f'  {fn}: NOT FOUND')

# 2. Read individual course files (course-*.json) - these are known good
individual_files = sorted(glob.glob(os.path.join(src_dir, 'course-*.json')))
for fp in individual_files:
    fn = os.path.basename(fp)
    try:
        with open(fp, 'r', encoding='utf-8-sig') as f:
            data = json.load(f)
            if isinstance(data, dict):
                all_courses.append(data)
                print(f'  {fn}: 1 course ({data.get("slug", "?")})')
            elif isinstance(data, list):
                all_courses.extend(data)
                print(f'  {fn}: {len(data)} courses')
            else:
                print(f'  {fn}: unknown type {type(data).__name__}')
    except Exception as e:
        print(f'  {fn}: ERROR - {e}')

# 3. Sort by order
all_courses.sort(key=lambda c: c.get('order', 999))

# 4. Check coverage
orders = {c.get('order', -1) for c in all_courses}
missing = set(range(25)) - orders
if missing:
    print(f'\nWARNING: Missing orders: {sorted(missing)}')
else:
    print(f'\nAll 25 orders covered!')

# 5. Deduplicate by slug (keep first)
seen = set()
unique = []
for c in all_courses:
    slug = c.get('slug', '')
    if slug and slug not in seen:
        seen.add(slug)
        unique.append(c)
    elif slug:
        print(f'  Duplicate skipped: {slug}')

print(f'\nTotal courses: {len(unique)}')
for c in unique:
    print(f'  [{c.get("order", "?"):2d}] {c["slug"]:25s} - {c.get("title", "?")[:40]}... ({len(c.get("sections", []))} sections)')

# 6. Write final lessons.json
with open(tgt, 'w', encoding='utf-8') as f:
    json.dump(unique, f, ensure_ascii=False, indent=2)

print(f'\nWritten to {tgt}')
