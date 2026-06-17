// 测试 Prisma 连接 + wiki 白名单 + user 表是否可写
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const count = await prisma.wikiAccess.count();
    console.log("✓ wiki 白名单表 OK, 当前条数:", count);

    const userCount = await prisma.user.count();
    console.log("✓ user 表 OK, 当前条数:", userCount);

    const postCount = await prisma.post.count();
    console.log("✓ post 表 OK, 当前条数:", postCount);
  } catch (e) {
    console.error("✗ 错误:", e.message);
  }
}

main().finally(() => prisma.$disconnect());
