const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany({
    select: { slug: true, title: true, category: true, status: true },
    orderBy: { createdAt: "asc" },
  });
  console.log("现有 blog 文章:", posts.length);
  for (const p of posts) {
    console.log(`  ${p.category.padEnd(10)} | ${p.status.padEnd(10)} | ${p.slug.padEnd(35)} | ${p.title}`);
  }
}

main().finally(() => prisma.$disconnect());
