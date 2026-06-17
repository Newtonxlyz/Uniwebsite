import sqlite3
conn = sqlite3.connect(r'D:\LvyzWeb\platform\prisma\dev.db')
cur = conn.cursor()
cur.execute('SELECT id, slug, title FROM posts')
for row in cur.fetchall():
    print(row)
conn.close()
