// 测 Prisma Postgres 连接 — 不修改任何文件
// 用法：DATABASE_URL=postgres://... node _raw/test_pg.mjs
import pg from 'pg';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('ERROR: 请设置 DATABASE_URL 环境变量');
  process.exit(1);
}

const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});

try {
  console.log('正在连接:', url.replace(/:[^:@]+@/, ':***@'));
  await client.connect();
  console.log('✅ 连接成功');

  const version = await client.query('SELECT version()');
  console.log('Server:', version.rows[0].version);

  const tables = await client.query(`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `);
  console.log('现有表 (', tables.rows.length, '):', tables.rows.map(r => r.table_name).join(', ') || '(空)');

  const dbs = await client.query('SELECT current_database() AS db, current_user AS "user"');
  console.log('DB / User:', dbs.rows[0]);

  await client.end();
} catch (e) {
  console.error('❌ 连接失败:', e.message);
  process.exit(1);
}
