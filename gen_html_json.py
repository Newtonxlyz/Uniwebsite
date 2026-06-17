import json

with open('preview.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Escape for JavaScript string
escaped = html.replace('\\', '\\\\').replace("'", "\\'").replace('\n', '\\n').replace('\r', '\\r')

# Create a JSON file with the escaped HTML
with open('html_content.json', 'w', encoding='utf-8') as f:
    json.dump({'html': escaped}, f, ensure_ascii=False)

print(f'Written html_content.json, HTML length: {len(html)}, escaped: {len(escaped)}')
