// 用 Better Auth 自带 scrypt 哈希创建测试账号
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "better-auth/crypto";

const prisma = new PrismaClient();

const TEST_EMAIL = "admin@lvyz.org";
const TEST_PASSWORD = "Lvyz2026!Wiki";
const TEST_NAME = "吕元卓（管理员）";

async function main() {
  const passwordHash = await hashPassword(TEST_PASSWORD);

  const user = await prisma.user.upsert({
    where: { email: TEST_EMAIL },
    update: {
      name: TEST_NAME,
      emailVerified: true,
      role: "ADMIN",
    },
    create: {
      email: TEST_EMAIL,
      name: TEST_NAME,
      emailVerified: true,
      role: "ADMIN",
    },
  });

  await prisma.account.upsert({
    where: {
      providerId_accountId: {
        providerId: "credential",
        accountId: TEST_EMAIL,
      },
    },
    update: {
      password: passwordHash,
      userId: user.id,
    },
    create: {
      providerId: "credential",
      accountId: TEST_EMAIL,
      userId: user.id,
      password: passwordHash,
    },
  });

  await prisma.wikiAccess.upsert({
    where: { email: TEST_EMAIL },
    update: {},
    create: {
      email: TEST_EMAIL,
      note: "Auto-created admin for testing",
    },
  });

  console.log("\n=== 账号已创建/更新 ===");
  console.log("邮箱:", TEST_EMAIL);
  console.log("密码:", TEST_PASSWORD);
  console.log("白名单: 已加入");
  console.log("角色: ADMIN");
  console.log("========================\n");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
