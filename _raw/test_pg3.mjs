// 验证 seed 后数据
import pg from 'pg';
const url = process.env.DATABASE_URL;
const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
await client.connect();

console.log('=== USERS ===');
const users = await client.query('SELECT id, email, name, role, "createdAt" FROM users ORDER BY "createdAt"');
for (const r of users.rows) console.log(`  ${r.email} | ${r.name} | ${r.role}`);

console.log('\n=== POSTS ===');
const posts = await client.query('SELECT id, slug, title, category, status, "viewCount" FROM posts ORDER BY "publishedAt" DESC');
for (const r of posts.rows) console.log(`  [${r.status}] ${r.title} (${r.slug}) - ${r.category} - ${r.viewcount} views`);

console.log('\n=== COMMENTS ===');
const cs = await client.query('SELECT COUNT(*) as c FROM comments');
console.log(`  Total: ${cs.rows[0].c}`);

console.log('\n=== ACCOUNTS (auth method) ===');
const accts = await client.query('SELECT "userId", "providerId", "accountId" FROM accounts');
for (const r of accts.rows) console.log(`  provider=${r.providerid} accountId=${r.accountid}`);

await client.end();
