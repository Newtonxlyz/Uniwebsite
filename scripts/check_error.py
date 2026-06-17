import re
c = open(r'D:\LvyzWeb\platform\.next\server\app\picturebook\stories\dark-cave.html', 'r', encoding='utf-8').read()
m = re.search(r'digest":"([^"]+)"', c)
if m: print('Error digest:', m.group(1))
print('dark-cave in payload:', 'dark-cave' in c)
print('StoryReader in payload:', 'StoryReader' in c or 'story-reader' in c)
print('notFound in payload:', 'notFound' in c)
print('stories in payload:', 'stories' in c)
# Check for the inline story data
print('太阳落山 in payload:', '太阳落山' in c)
print('Has __next_error__:', '__next_error__' in c)
