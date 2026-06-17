import requests
BASE = 'http://localhost:3000'
s = requests.Session()
s.post(f'{BASE}/api/auth/sign-in/email', json={'email': 'admin@lvyz.org', 'password': 'lvyz2026'})

# 拿最新文章
r = requests.get(f'{BASE}/api/blog/posts').json()
post = r['items'][0]
print(f"Post: {post['title']}")

# 加留言
r = s.post(f'{BASE}/api/blog/posts/{post['id']}/comments', json={'content': 'Postgres 留言测试'})
print('COMMENT:', r.status_code)

# 列
r = requests.get(f'{BASE}/api/blog/posts/{post['id']}/comments').json()
print('COMMENTS:', r['total'])
for c in r['items']:
    print(f"  - {c['author']['name']}: {c['content']}")
