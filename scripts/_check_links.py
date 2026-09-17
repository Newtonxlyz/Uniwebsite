"""检查生成的 HTML 里章节链接是否正确"""
import re, sys
try: sys.stdout.reconfigure(encoding='utf-8')
except: pass

content = open(r'public\courses\gn-crash-guide\index.html', encoding='utf-8').read()
links = re.findall(r'href="(chapter-[^"]+)"', content)
print('index.html 章节链接:', sorted(set(links)))

# 也检查 chapter-01 自身
content2 = open(r'public\courses\gn-crash-guide\chapter-01-crash-basics.html', encoding='utf-8').read()
m = re.search(r'const (prev|next) = .([^;]+);', content2)
print('chapter-01 prev/next:')
for x in re.finditer(r'const (prev|next) = .([^;]+);', content2):
    print(f'  {x.group(1)} = {x.group(2)}')