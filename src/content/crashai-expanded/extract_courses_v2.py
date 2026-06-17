# extract_courses_v2.py - Extract courses with control char cleanup
import json
import re

with open('courses-18-24.json', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove control characters (except tab, newline, carriage return)
cleaned = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', '', content)

# Find course objects by bracket counting
courses_found = {}
depth = 0
start_pos = -1
target_slugs = ['integration-guide', 'mlops', 'frontier', 'crashai-resources']

for pos, c in enumerate(cleaned):
    if c == '{':
        if depth == 0:
            start_pos = pos
        depth += 1
    elif c == '}':
        depth -= 1
        if depth == 0 and start_pos >= 0:
            obj_text = cleaned[start_pos:pos+1]
            try:
                obj = json.loads(obj_text)
                slug = obj.get('slug', '')
                if slug in target_slugs:
                    courses_found[slug] = obj
                    print(f'OK: {slug} (order {obj.get("order","")}) - {len(obj.get("sections",[]))} sections')
            except json.JSONDecodeError as e:
                # Check if this is one of our targets
                m = re.search(r'"slug"\s*:\s*"([^"]+)"', obj_text)
                if m and m.group(1) in target_slugs:
                    print(f'FAIL (unfixable): {m.group(1)} - {e}')
            start_pos = -1

print(f'\nTotal found: {len(courses_found)}')

# Write to files
mapping = {
    'integration-guide': 'course-21.json',
    'mlops': 'course-22.json',
    'frontier': 'course-23.json',
    'crashai-resources': 'course-24.json',
}

import os
os.makedirs('extracted_output', exist_ok=True)

for slug, filename in mapping.items():
    if slug in courses_found:
        filepath = f'extracted_output/{filename}'
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(courses_found[slug], f, ensure_ascii=False, indent=2)
        size = os.path.getsize(filepath)
        print(f'Written: {filepath} ({size} bytes)')
    else:
        print(f'MISSING: {slug}')
