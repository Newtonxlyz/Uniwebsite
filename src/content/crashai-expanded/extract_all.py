import json
import os

with open('courses-18-24.json', 'r', encoding='utf-8') as f:
    content = f.read()

target_slugs = ['integration-guide', 'mlops', 'frontier', 'crashai-resources']

# Find all course objects by scanning for slugs and extracting objects
courses = {}

for slug in target_slugs:
    idx = content.find(slug)
    if idx < 0:
        print(f"NOT FOUND in file: {slug}")
        continue
    
    # Find start of this object
    start = content.rfind('{', 0, idx)
    if start < 0:
        print(f"Cannot find object start for: {slug}")
        continue
    
    # Find end of this object by bracket counting
    brace_depth = 0
    end = start
    for i in range(start, len(content)):
        if content[i] == '{':
            brace_depth += 1
        elif content[i] == '}':
            brace_depth -= 1
            if brace_depth == 0:
                end = i + 1
                break
    
    course_text = content[start:end]
    try:
        obj = json.loads(course_text, strict=False)
        courses[slug] = obj
        print(f"SUCCESS: {slug} - {len(obj.get('sections', []))} sections")
    except json.JSONDecodeError as e:
        print(f"FAILED: {slug} - {e}")

# Also try the FIXED version if targets are missing
if not all(slug in courses for slug in target_slugs):
    print("\nTrying FIXED file...")
    try:
        with open('courses-18-24-FIXED.json', 'r', encoding='utf-8') as f:
            content2 = f.read()
        for slug in target_slugs:
            if slug in courses:
                continue
            idx = content2.find(slug)
            if idx < 0:
                continue
            start = content2.rfind('{', 0, idx)
            if start < 0:
                continue
            brace_depth = 0
            end = start
            for i in range(start, len(content2)):
                if content2[i] == '{': brace_depth += 1
                elif content2[i] == '}':
                    brace_depth -= 1
                    if brace_depth == 0: end = i + 1; break
            course_text = content2[start:end]
            try:
                obj = json.loads(course_text, strict=False)
                courses[slug] = obj
                print(f"FIXED SUCCESS: {slug} - {len(obj.get('sections', []))} sections")
            except json.JSONDecodeError as e:
                print(f"FIXED FAILED: {slug} - {e}")
    except FileNotFoundError:
        print("No FIXED file")

# Write to files
os.makedirs('extracted_output', exist_ok=True)

mapping = {
    'integration-guide': 'course-21.json',
    'mlops': 'course-22.json',
    'frontier': 'course-23.json',
    'crashai-resources': 'course-24.json',
}

print("\n--- Writing files ---")
for slug, filename in mapping.items():
    if slug in courses:
        filepath = os.path.join('extracted_output', filename)
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(courses[slug], f, ensure_ascii=False, indent=2)
        size = os.path.getsize(filepath)
        print(f"OK: extracted_output/{filename} ({size} bytes, {len(courses[slug].get('sections',[]))} sections)")
    else:
        print(f"MISSING: {slug}")

print(f"\nDone. {len(courses)}/{len(target_slugs)} courses extracted.")
