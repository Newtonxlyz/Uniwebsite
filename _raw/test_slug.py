import requests, time
BASE = 'http://localhost:3000'
s = requests.Session()
s.post(f'{BASE}/api/auth/sign-in/email', json={'email': 'test@lvyz.org', 'password': 'test1234'})
# 用 ASCII slug
slug = f"test-post-{int(time.time())}"
r = s.post(f'{BASE}/api/blog/posts', json={
    'title': 'Test Post',
    'content': '# Hello\nThis is content.',
    'category': 'tech',
    'tags': 'test,ascii',
    'status': 'PUBLISHED',
})
print('CREATE:', r.status_code)
created = r.json()
print('Slug:', created.get('slug'))

# 访问详情
r = requests.get(f'{BASE}/blog/{created["slug"]}')
print('DETAIL:', r.status_code)
print('Has title:', 'Test Post' in r.text)
print('Has content:', 'Hello' in r.text)
print('Has tag:', 'test' in r.text and 'ascii' in r.text)
