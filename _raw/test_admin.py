import requests
BASE = 'http://localhost:3000'
s = requests.Session()
r = s.post(f'{BASE}/api/auth/sign-in/email', json={'email': 'admin@lvyz.org', 'password': 'lvyz2026'})
print('ADMIN LOGIN:', r.status_code)
r = s.get(f'{BASE}/api/auth/get-session')
print('SESSION:', r.status_code)
data = r.json()
print('  user:', data.get('user', {}).get('email'), '/ role:', data.get('user', {}).get('role'))

r = requests.get(f'{BASE}/api/blog/posts').json()
print(f'TOTAL POSTS: {r["total"]}')
for p in r['items']:
    print(f'  - {p["title"]} ({p["slug"]}) by {p["author"]["name"]}')
