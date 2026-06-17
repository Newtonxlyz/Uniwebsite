import json

with open(r'D:\LvyzWeb\platform\src\content\crashai-expanded\courses-18-24.json', 'rb') as f:
    raw = f.read()
if raw.startswith(b'\xef\xbb\xbf'):
    raw = raw[3:]
txt = raw.decode('utf-8')

# Find character at error position 759
near = txt[730:790]
print("Chars 730-790:")
print(repr(near))
print()

# Try to find the JSON issue
# Check for unescaped quotes
for i in range(759-20, 759+20):
    if i >= len(txt): break
    c = txt[i]
    if c == '"':
        context = txt[max(0,i-10):i+10]
        print("  Quote at %d: ...%s..." % (i, repr(context)))

# Also look for lines around the error
lines = txt.split('\n')
print("\nLine 13 (the error line):")
print(repr(lines[12][:200]))
print()
print("Line 13 near col 494:")
print(repr(lines[12][460:510]))
