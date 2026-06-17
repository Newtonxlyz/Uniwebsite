# -*- coding: utf-8 -*-
import json, os

# Extract character data properly
path = r'D:\儿童绘本计划\雷迪嘎嘎系列\角色库\character_cards.json'
d = json.load(open(path, 'r', encoding='utf-8-sig'))
chars = d['characters']

# Build clean character data
output = []
for name, info in chars.items():
    c = {
        "name": name,
        "en_name": info.get("en_name", ""),
        "species": info.get("species", ""),
        "role": info.get("role", ""),
        "key_features": info.get("key_features", ""),
        "description": info.get("description", ""),
        "personality": info.get("personality", ""),
        "appearance": info.get("appearance", ""),
        "image_url": "",
    }
    # Check for reference image
    img_dir = r'D:\儿童绘本计划\雷迪嘎嘎系列\角色库'
    for f in os.listdir(img_dir):
        if name in f and f.lower().endswith(('.png', '.jpg', '.jpeg')):
            c["image_url"] = f"/picturebook/characters/{f}"
            break
    output.append(c)
    print(f"OK: {name} ({c['en_name']}) - {c['species']}")

# Save as JSON
out = json.dumps({"characters": output, "style": d.get("style_unified", "")}, 
                 ensure_ascii=False, indent=2)
out_path = r'D:\LvyzWeb\platform\src\content\picturebook\characters.json'
with open(out_path, 'w', encoding='utf-8') as f:
    f.write(out)
print(f"\nSaved to {out_path}")
print(f"Total: {len(output)} characters")
