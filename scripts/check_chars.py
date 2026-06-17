# -*- coding: utf-8 -*-
import json, os

# Read character cards
path = r'D:\儿童绘本计划\雷迪嘎嘎系列\角色库\character_cards.json'
with open(path, 'r', encoding='utf-8-sig') as f:
    raw = f.read(2000)
print("First 2000 chars of character_cards.json:")
print(repr(raw[:500]))
print("---")

d = json.load(open(path, 'r', encoding='utf-8-sig'))
print("Type of root:", type(d))
if isinstance(d, list):
    print("List length:", len(d))
    for i, item in enumerate(d):
        if isinstance(item, dict):
            print(f"  [{i}] keys:", list(item.keys()))
        else:
            print(f"  [{i}] type:", type(item), "value:", str(item)[:100])
elif isinstance(d, dict):
    print("Dict keys:", list(d.keys()))
    for k, v in d.items():
        if isinstance(v, list):
            print(f"  {k}: list of {len(v)} items")
            if v:
                print(f"    first item keys:", list(v[0].keys()) if isinstance(v[0], dict) else type(v[0]))
        elif isinstance(v, dict):
            print(f"  {k}: dict with keys {list(v.keys())[:5]}")
        else:
            print(f"  {k}: {str(v)[:100]}")
