# -*- coding: utf-8 -*-
import json

path = r'D:\儿童绘本计划\雷迪嘎嘎系列\角色库\character_cards.json'
d = json.load(open(path, 'r', encoding='utf-8-sig'))

chars = d['characters']
print("Total characters:", len(chars))
for name, info in chars.items():
    en = info.get('en_name', '?')
    sp = info.get('species', '?')
    role = info.get('role', '?')
    desc = info.get('description', '')[:80] if 'description' in info else info.get('personality', '')[:80]
    print(f"  {name} | {en} | {sp} | {role} | {desc.removesuffix('...')}")
