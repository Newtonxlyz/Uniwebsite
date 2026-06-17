import json

# Check courses-18-24.json - find the JSON syntax error
with open('courses-18-24.json', 'r', encoding='utf-8', errors='replace') as f:
    lines = f.readlines()

print('=== courses-18-24.json ===')
if len(lines) >= 13:
    line = lines[12]
    print('Line 13 length:', len(line))
    print('Around col 494:')
    start = max(0, 494-50)
    end = min(len(line), 494+50)
    print(line[start:end])
    print('        ' + ' ' * 47 + '^')

# Check courses-12-17.json - find the bad UTF-8 byte
with open('courses-12-17.json', 'rb') as f:
    raw = f.read()

print('\n=== courses-12-17.json ===')
# Try to decode up to 37034
pos = 37034
print('Bytes around position', pos)
for i in range(max(0, pos-20), min(len(raw), pos+20)):
    if i == pos:
        print(f'  [{i}]: {hex(raw[i])} *** BAD BYTE')
    else:
        print(f'  {i}: {hex(raw[i])}')
