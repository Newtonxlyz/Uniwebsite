import pg from 'pg';
const url = process.env.DATABASE_URL;
const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
await client.connect();

const cols = await client.query(`
  SELECT column_name FROM information_schema.columns
  WHERE table_name = 'posts' ORDER BY ordinal_position
`);
console.log('Posts columns:', cols.rows.map(r => r.column_name).join(', '));

await client.end();
