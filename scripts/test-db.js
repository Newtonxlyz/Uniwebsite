// 测 prisma 连接
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.user.findFirst({ where: { role: 'SUPERADMIN' } })
  .then(u => {
    console.log('User:', u ? u.email : 'NOT FOUND');
    prisma.$disconnect();
  })
  .catch(e => {
    console.error('ERR:', e.message.substring(0, 500));
    prisma.$disconnect();
    process.exit(1);
  });
