import re

with open('.next/server/app/index.html', 'r', encoding='utf-8') as f:
    html = f.read()
with open('.next/static/chunks/0vq7jdmzt66tp.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Inline CSS
html = re.sub(r'<link rel="stylesheet" href="/[^"]+\.css"[^>]*>', '<style>' + css + '</style>', html)
# Remove all script tags
html = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL)
html = re.sub(r'<script[^>]*>', '', html)
html = re.sub(r'</script>', '', html)
# Remove preload links
html = re.sub(r'<link rel="preload"[^>]*>', '', html)

with open('preview.html', 'w', encoding='utf-8') as f:
    f.write(html)
print(f'Written preview.html: {len(html)} bytes')
