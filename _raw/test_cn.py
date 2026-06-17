import requests, time
BASE = 'http://localhost:3000'
s = requests.Session()
s.post(f'{BASE}/api/auth/sign-in/email', json={'email': 'test@lvyz.org', 'password': 'test1234'})
r = s.post(f'{BASE}/api/blog/posts', json={
    'title': '我的第一篇博客 - AI 转型之路',
    'content': '# Hello World\n这是中文测试。',
    'excerpt': '测试摘要',
    'category': 'industry',
    'tags': 'AI,转型',
    'status': 'PUBLISHED',
})
print('CREATE:', r.status_code, r.json()['slug'])

r = requests.get(f'{BASE}/api/blog/posts').json()
p = r['items'][0]
slug = p['slug']
print('LIST:', p['title'], '/', slug)

r = requests.get(f'{BASE}/blog/{slug}')
print('DETAIL:', r.status_code)
print('Has title:', p['title'] in r.text)
print('Has content:', 'Hello World' in r.text)
print('Has excerpt:', p['excerpt'] in r.text)
