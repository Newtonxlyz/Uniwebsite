# extract_courses.py - Extract courses 21-24 from the combined file
import json

with open('courses-18-24.json', 'r', encoding='utf-8') as f:
    content = f.read()

# Find course objects by bracket counting
# Each course is an object in a JSON array
courses_found = {}
current_course = None
depth = 0
start_pos = 0
slug = None

for pos, c in enumerate(content):
    if c == '{':
        if depth == 0:
            start_pos = pos
        depth += 1
    elif c == '}':
        depth -= 1
        if depth == 0 and start_pos >= 0:
            # We have a complete object
            obj_text = content[start_pos:pos+1]
            # Try to find slug
            try:
                obj = json.loads(obj_text)
                slug = obj.get('slug', '')
                order = obj.get('order', '')
                if slug in ['integration-guide', 'mlops', 'frontier', 'crashai-resources']:
                    courses_found[slug] = obj
                    print(f'Found: {slug} (order {order}) - {len(obj.get("sections",[]))} sections')
            except:
                # Try to extract slug manually
                import re
                m = re.search(r'"slug"\s*:\s*"([^"]+)"', obj_text)
                if m:
                    slug = m.group(1)
                    if slug in ['integration-guide', 'mlops', 'frontier', 'crashai-resources']:
                        try:
                            obj = json.loads(obj_text)
                            courses_found[slug] = obj
                            print(f'Found (retry): {slug} - {len(obj.get("sections",[]))} sections')
                        except Exception as e:
                            print(f'  Failed to parse {slug}: {e}')
            start_pos = -1

# Write each course to its own file
mapping = {
    'integration-guide': 'course-21.json',
    'mlops': 'course-22.json',
    'frontier': 'course-23.json',
    'crashai-resources': 'course-24.json',
}

for slug, filename in mapping.items():
    if slug in courses_found:
        filepath = f'crashai-expanded/{filename}'
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(courses_found[slug], f, ensure_ascii=False, indent=2)
        print(f'Written: {filepath} ({len(json.dumps(courses_found[slug], ensure_ascii=False))} bytes)')
    else:
        print(f'MISSING: {slug}')

print(f'\nTotal courses found: {len(courses_found)}')
for slug in courses_found:
    print(f'  - {slug}: {len(courses_found[slug].get("sections",[]))} sections')
