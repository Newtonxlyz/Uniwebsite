import requests
BASE = 'http://localhost:3000'
s = requests.Session()
s.post(f'{BASE}/api/auth/sign-in/email', json={'email': 'admin@lvyz.org', 'password': 'lvyz2026'})

# 找测试文章（slug=postgres）
r = requests.get(f'{BASE}/api/blog/posts').json()
for p in r['items']:
    if p['slug'] in ('postgres', 'test-post', '我的第一篇博客'):
        # delete
        d = s.delete(f"{BASE}/api/blog/posts/{p['id']}")
        print(f"DELETE {p['slug']}: {d.status_code}")
