import json, re

# Read the file
with open(r'D:\LvyzWeb\platform\src\content\crashai-expanded\courses-18-24.json', 'rb') as f:
    raw = f.read()
if raw.startswith(b'\xef\xbb\xbf'):
    raw = raw[3:]
txt = raw.decode('utf-8')

# Step 1: Find all content string boundaries properly
# A content value looks like: "content": "<p>lots of HTML content</p>"
# The content string starts with "content": " and ends with the next unescaped "
# Any " inside that is not preceded by \ is an issue

# Strategy: Use regex to find "content": followed by a string value
# Then within that string, replace any ASCII " with Unicode curly quotes

# Find all positions of "content": "
pattern = '"content": "'
matches = []
pos = 0
while True:
    idx = txt.find(pattern, pos)
    if idx == -1:
        break
    matches.append(idx)
    pos = idx + 1

print("Found %d 'content' values" % len(matches))

# For each content value, find the string boundaries and fix inner quotes
chars = list(txt)
fix_count = 0

for m in matches:
    # Start of content value (after opening quote)
    start = m + len(pattern) - 1  # position of opening "
    # Now scan forward to find the closing "
    i = start + 1
    depth = 0
    while i < len(chars):
        if chars[i] == '\\':
            i += 2  # skip escaped chars
            continue
        if chars[i] == '"':
            # This could be the closing quote or an inner quote
            # Check if preceded by HTML text - it's inner
            # For safety, assume it's the closing quote only if we exhausted content
            break
        if chars[i] == '"':
            # Unescaped ASCII quote inside content - fix it
            # Look at context to determine if opening or closing
            before = ''.join(chars[max(0,i-20):i])
            after = ''.join(chars[i+1:i+20]) if i+1 < len(chars) else ''
            
            # Decide left or right curly quote
            # If preceded by Chinese char or >, it's probably closing
            # If followed by Chinese char or <, it's probably opening
            import unicodedata
            before_chars = [c for c in before if c not in '\n\r\t ']
            after_chars = [c for c in after if c not in '\n\r\t ']
            
            is_opening = True
            if before_chars:
                last_before = before_chars[-1]
                if not (unicodedata.category(last_before) in ('Lo', 'Po', 'Sc', 'So') or last_before == '>'):
                    is_opening = False
            if is_opening and after_chars:
                first_after = after_chars[0]
                if not (unicodedata.category(first_after) in ('Lo', 'Po', 'Pi', 'Ps') or first_after == '<'):
                    is_opening = False
            
            if is_opening:
                chars[i] = '\u201C'
            else:
                chars[i] = '\u201D'
            fix_count += 1
        
        i += 1

print("Fixed %d inner quotes" % fix_count)

# Write fixed version
fixed_txt = ''.join(chars)
fixed_fn = r'D:\LvyzWeb\platform\src\content\crashai-expanded\courses-18-24-FIXED.json'
with open(fixed_fn, 'w', encoding='utf-8') as f:
    f.write(fixed_txt)

# Validate
try:
    data = json.loads(fixed_txt)
    print("SUCCESS! Parsed %d courses" % len(data))
    for c in data:
        print("  %d: %s (%d sections)" % (c['order'], c['slug'], len(c['sections'])))
except json.JSONDecodeError as e:
    print("FAILED at line %d col %d: %s" % (e.lineno, e.colno, str(e)[:150]))
