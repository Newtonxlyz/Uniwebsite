// 清空 blog posts（删所有 4 篇 seed）
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 先看有几篇
  const posts = await prisma.post.findMany({
    select: { id: true, title: true, slug: true },
  });
  console.log('Current posts:', posts.length);
  posts.forEach(p => console.log(`  - ${p.slug}: ${p.title}`));

  // 删所有
  const result = await prisma.post.deleteMany({});
  console.log('Deleted:', result.count);

  // 也删 comments
  const c = await prisma.comment.deleteMany({});
  console.log('Comments deleted:', c.count);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
