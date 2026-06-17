import json

with open('html_content.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Build evaluate JS: use backtick template literal to avoid escaping issues
# HTML is already escaped for single quotes and newlines
with open('eval_cmd.txt', 'w', encoding='utf-8') as f:
    f.write(data['html'])

print(f'Written eval_cmd.txt: {len(data["html"])} chars')
