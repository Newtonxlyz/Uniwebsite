import json, re

fn = r'D:\LvyzWeb\platform\src\content\crashai-expanded\courses-18-24.json'
with open(fn, 'rb') as f:
    raw = f.read()
if raw.startswith(b'\xef\xbb\xbf'):
    raw = raw[3:]
txt = raw.decode('utf-8')

# Strategy: Find all unescaped double quotes inside JSON string values
# The issue is ASCII " used as Chinese quotation marks inside content strings
# We need to find quotes that are NOT JSON string delimiters

# A simple approach: use regex to find all content string values and fix internal quotes
# Actually let's just find and replace the specific offending quotes

# First, let's check the raw bytes at the char positions
# The error was at char 759, with quotes at 758 and 762
print("Chars around the error area:")
for i in range(750, 780):
    if i < len(txt):
        c = txt[i]
        print("  %d: U+%04X %s" % (i, ord(c), repr(c)))
print()

# Now let's try a more robust approach - find all unescaped " inside text content
# A quote is unescaped if it's not preceded by backslash and is inside a string value
# For simplicity, we'll use a state machine approach
fixed = []
in_string = False
escaped = False
string_char = None
result = []
modifications = 0

for ch in txt:
    if not in_string:
        result.append(ch)
        if ch == '"':
            in_string = True
            string_char = '"'
    else:
        if escaped:
            result.append(ch)
            escaped = False
        elif ch == '\\':
            result.append(ch)
            escaped = True
        elif ch == '"':
            # Check if this closes the string or is an internal quote
            # Internal quotes are followed by more content (not , : ] } whitespace)
            # For safety, we'll check the context
            # Actually, let's be more careful - track depth
            result.append(ch)
            in_string = False
            string_char = None
        else:
            result.append(ch)

fixed_txt = ''.join(result)

# Write fixed version
fixed_fn = r'D:\LvyzWeb\platform\src\content\crashai-expanded\courses-18-24-FIXED.json'
with open(fixed_fn, 'w', encoding='utf-8') as f:
    f.write(fixed_txt)

# Try to parse
try:
    data = json.loads(fixed_txt)
    print("SUCCESS! Parsed %d courses" % len(data))
    for c in data:
        print("  %d: %s (%d sections)" % (c['order'], c['slug'], len(c['sections'])))
except Exception as e:
    print("Still failed: %s" % str(e)[:200])
