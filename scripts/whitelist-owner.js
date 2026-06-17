// 临时脚本：把作者自己邮箱加到 wiki 白名单
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "yuanzhuo.lv@faw-vw.com";
  const result = await prisma.wikiAccess.upsert({
    where: { email },
    update: {},
    create: {
      email,
      note: "Owner: 吕元卓（自动白名单）",
    },
  });
  console.log("白名单已加:", result.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
