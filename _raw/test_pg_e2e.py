import requests
BASE = 'http://localhost:3000'
s = requests.Session()

# 登录
r = s.post(f'{BASE}/api/auth/sign-in/email', json={
    'email': 'admin@lvyz.org',
    'password': 'lvyz2026'
})
print('LOGIN:', r.status_code)
data = r.json()
print('  user:', data.get('user', {}).get('email'), 'role:', data.get('user', {}).get('role'))

# Session
r = s.get(f'{BASE}/api/auth/get-session')
print('SESSION:', r.status_code)
d = r.json()
print('  session.expiresAt:', d.get('session', {}).get('expiresAt'))
print('  user.role:', d.get('user', {}).get('role'))

# 发文章
r = s.post(f'{BASE}/api/blog/posts', json={
    'title': 'Postgres 测试文章',
    'content': '# 测\n从 Postgres 写入。',
    'category': 'tech',
    'status': 'PUBLISHED'
})
print('CREATE POST:', r.status_code, 'slug:', r.json().get('slug'))

# 列
r = requests.get(f'{BASE}/api/blog/posts').json()
print('TOTAL:', r['total'])
