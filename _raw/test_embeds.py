import requests, json
BASE = 'http://localhost:3000'
s = requests.Session()
s.post(f'{BASE}/api/auth/sign-in/email', json={'email': 'admin@lvyz.org', 'password': 'lvyz2026'})

r = requests.get(f'{BASE}/api/blog/posts').json()
post = next((p for p in r['items'] if p['slug'] == 'ai-transition-journey'), None)
if post:
    embeds = [
        'https://www.bilibili.com/video/BV1xx411c7mD',
        'https://www.xiaohongshu.com/explore/abc123',
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    ]
    payload = {'embeds': json.dumps(embeds, ensure_ascii=False)}
    r = s.patch(f'{BASE}/api/blog/posts/{post["id"]}', json=payload)
    print('UPDATE EMBEDS:', r.status_code)
    
    r = requests.get(f'{BASE}/blog/{post["slug"]}')
    print('DETAIL HTTP:', r.status_code)
    print('Has 关联内容:', '关联内容' in r.text)
    print('Has bilibili iframe:', 'player.bilibili' in r.text)
    print('Has xiaohongshu card:', '小红书内容' in r.text)
    print('Has youtube iframe:', 'youtube.com/embed' in r.text)
