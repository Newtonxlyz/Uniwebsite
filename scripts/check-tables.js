// 列出 Better Auth 期望的表 + 实际数据库的表
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1. 查 users 表
  const users = await prisma.user.findMany({ take: 5 });
  console.log("users 表内容:", JSON.stringify(users, null, 2));

  // 2. 查 sessions 表
  const sessions = await prisma.session.findMany({ take: 3 });
  console.log("sessions 表条数:", sessions.length);

  // 3. 查 accounts 表
  const accounts = await prisma.account.findMany({ take: 3 });
  console.log("accounts 表条数:", accounts.length);

  // 4. Better Auth 通常用 snake_case 表名
  // 让我查所有表
  const result = await prisma.$queryRawUnsafe(`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `);
  console.log("数据库所有表:", result);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
