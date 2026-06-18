// 给所有 ADMIN 角色用户默认授权 6 子站 ADMIN 权限
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const SITES = ["crashai", "kids-ai", "picturebook", "blog", "knowledge-base", "merchandise"];

async function main() {
  const admins = await prisma.user.findMany({
    where: { role: { in: ["ADMIN", "SUPERADMIN"] } },
  });
  console.log(`找到 ${admins.length} 个 ADMIN 用户`);

  for (const admin of admins) {
    for (const site of SITES) {
      await prisma.siteAccess.upsert({
        where: { userId_site: { userId: admin.id, site } },
        update: { level: "ADMIN" },
        create: { userId: admin.id, site, level: "ADMIN", note: "Auto: ADMIN role" },
      });
    }
    console.log(`  ✓ ${admin.email} → 6 子站 ADMIN 权限`);
  }
}

main()
  .catch((e) => { console.error("错误:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
