import json, re

with open(r'D:\LvyzWeb\platform\src\content\crashai-expanded\courses-18-24.json', 'rb') as f:
    raw = f.read()
if raw.startswith(b'\xef\xbb\xbf'):
    raw = raw[3:]
txt = raw.decode('utf-8')

# Track JSON parsing state to identify string boundaries
i = 0
in_string = False
escaped = False
fixes = []

while i < len(txt):
    ch = txt[i]
    
    if not in_string:
        if ch == '"':
            in_string = True
            # Check if this string value is a "content" value
            # Look backwards for "content": pattern
            before = txt[max(0,i-20):i]
            is_content = bool(re.search(r'"content"\s*:\s*"$', before))
        i += 1
        continue
    
    # We're inside a string
    if escaped:
        escaped = False
        i += 1
        continue
    
    if ch == '\\':
        if i+1 < len(txt) and txt[i+1] == '"':
            escaped = False  # It's an escaped quote, skip both
            i += 2
            continue
        escaped = True
        i += 1
        continue
    
    if ch == '"':
        # This is a string terminator
        in_string = False
        i += 1
        continue
    
    i += 1

# Print findings
if fixes:
    print("Found %d potential fixes:" % len(fixes))
    for pos, fix in fixes:
        print("  Pos %d: %s" % (pos, repr(fix)))
else:
    print("No unescaped quotes found in JSON strings")

# Check: how does JSON parse fail? Let's try to check for specific byte patterns
# that can cause issues, like unescaped quotes in content
  
# Alternative approach: try to use json5 for parsing
try:
    import json5
    data = json5.loads(txt)
    print("json5 parsing: SUCCESS! %d courses" % len(data))
    for c in data:
        print("  %d: %s (%d sections)" % (c['order'], c['slug'], len(c['sections'])))
except ImportError:
    print("json5 not available")
except Exception as e:
    print("json5 also failed: %s" % str(e)[:200])
    
# Another approach: try manual fix at known positions
# Replace ASCII " with Unicode curly quotes at the problematic spots
# Known issues: chars 758 and 762 (from previous analysis)
print("\nKnown problematic positions: 758, 762")
print("Chars 758:", repr(txt[758]) if 758 < len(txt) else "N/A")
print("Chars 762:", repr(txt[762]) if 762 < len(txt) else "N/A")

# Try to fix chars 758 and 762 specifically
chars = list(txt)
if 758 < len(chars) and chars[758] == '"':
    chars[758] = '\u201C'
    print("Fixed char 758")
if 762 < len(chars) and chars[762] == '"':
    chars[762] = '\u201D'
    print("Fixed char 762")
    
fixed_txt = ''.join(chars)
try:
    data = json.loads(fixed_txt)
    print("AFTER FIX 1: Parsed %d courses" % len(data))
except json.JSONDecodeError as e:
    print("AFTER FIX 1: Still failed at line %d col %d" % (e.lineno, e.colno))
    lines = fixed_txt.split('\n')
    error_line = lines[e.lineno-1]
    print("Context: %s" % repr(error_line[max(0,e.colno-40):e.colno+40]))
