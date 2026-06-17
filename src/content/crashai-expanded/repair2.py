import json, re

# Load the file
with open(r'D:\LvyzWeb\platform\src\content\crashai-expanded\courses-18-24.json', 'rb') as f:
    raw = f.read()
if raw.startswith(b'\xef\xbb\xbf'):
    raw = raw[3:]
txt = raw.decode('utf-8')

# Strategy: Find ALL unescaped ASCII quotes inside "content" string values
# A "content" value looks like: "content": "<p>...</p>"
# Inside the <p>...</p> there may be unescaped " that break JSON

# Step 1: Try to fix by replacing problematic ASCII quotes with Unicode curly quotes
# We'll work character by character with proper JSON state tracking
# but fix the issue: when inside content string, replace ASCII " with \u201C/\u201D

result = list(txt)
i = 0
inside_content_value = False
inside_p_tag = False
quote_pair = False  # False = next quote is opening, True = closing

while i < len(txt):
    # Track whether we're inside a "content":"..." value
    # Look for "content" followed by ":"
    if txt[i:i+10] == '"content":':
        # We're about to enter the content value
        # Skip to the opening quote
        j = i + 10
        while j < len(txt) and txt[j] != '"':
            j += 1
        if j < len(txt):
            i = j + 1  # Skip past opening quote
            # Now we're inside the content string value
            while i < len(txt):
                if txt[i] == '\\':
                    i += 2  # Skip escaped characters
                    continue
                if txt[i] == '"':
                    # This is the closing quote of the content value
                    # But first check: could it be unescaped inner quote?
                    break
                if txt[i] == '"':
                    # Unescaped quote - replace it
                    print("  Fixing quote at position %d (inside content value)" % i)
                    if quote_pair:
                        result[i] = '\u201D'  # Right curly quote
                        quote_pair = False
                    else:
                        result[i] = '\u201C'  # Left curly quote
                        quote_pair = True
                i += 1
            # i should now point at the closing quote
            continue
    
    i += 1

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
except json.JSONDecodeError as e:
    print("STILL FAILED at line %d col %d: %s" % (e.lineno, e.colno, str(e)[:200]))
    # Show error context
    lines = fixed_txt.split('\n')
    if e.lineno <= len(lines):
        error_line = lines[e.lineno-1]
        start = max(0, e.colno-50)
        end = min(len(error_line), e.colno+50)
        print("Context: %s" % repr(error_line[start:end]))
