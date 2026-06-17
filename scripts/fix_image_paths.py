# Fix story JSON image paths
import json

path = r'D:\LvyzWeb\platform\src\content\picturebook\story-dark-cave.json'
with open(path, 'r', encoding='utf-8') as f:
    story = json.load(f)

for p in story['pages']:
    pn = p['page_number']
    if pn >= 1 and pn <= 20:
        p['image'] = f'/picturebook/stories/dark-cave/page_{pn:02d}.png'
    else:
        p['image'] = ''

with open(path, 'w', encoding='utf-8') as f:
    json.dump(story, f, ensure_ascii=False, indent=2)

print(f"Fixed {sum(1 for p in story['pages'] if p['image'])} image paths")
