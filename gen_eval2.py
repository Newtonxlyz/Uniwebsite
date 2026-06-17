import base64

with open('preview.html', 'rb') as f:
    raw = f.read()

b64 = base64.b64encode(raw).decode('ascii')

js = f'''() => {{
  const bytes = Uint8Array.from(atob('{b64}'), c => c.charCodeAt(0));
  const html = new TextDecoder().decode(bytes);
  document.open();
  document.write(html);
  document.close();
}}'''

with open('eval_script.txt', 'w', encoding='ascii') as f:
    f.write(js)

print(f'Base64: {len(b64)} chars, JS: {len(js)} chars')
print('OK')
