// 查所有表 + 字段
import pg from 'pg';
const url = process.env.DATABASE_URL;
const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
await client.connect();

const tables = await client.query(`
  SELECT table_name, column_name, data_type
  FROM information_schema.columns
  WHERE table_schema = 'public'
  ORDER BY table_name, ordinal_position
`);

const byTable = {};
for (const r of tables.rows) {
  if (!byTable[r.table_name]) byTable[r.table_name] = [];
  byTable[r.table_name].push(`${r.column_name} (${r.data_type})`);
}

console.log(`Total tables: ${Object.keys(byTable).length}`);
for (const [t, cols] of Object.entries(byTable)) {
  console.log(`\n${t}:`);
  for (const c of cols) console.log(`  - ${c}`);
}

await client.end();
