// lvyz-platform 数据库种子数据
// 跑：pnpm db:seed
import { PrismaClient } from "@prisma/client";
import { auth } from "../src/lib/auth";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 种子数据初始化...");

  // 1. 创建超级管理员
  try {
    const adminEmail = "admin@lvyz.org";
    const adminPassword = "lvyz2026";

    // 用 Better Auth 注册管理员
    try {
      await auth.api.signUpEmail({
        body: {
          email: adminEmail,
          password: adminPassword,
          name: "吕元卓",
        },
      });
      console.log(`✅ 管理员已创建: ${adminEmail} / ${adminPassword}`);
      console.log("   ⚠️  请登录后立即修改密码！");
    } catch (e: unknown) {
      const msg = (e as Error).message;
      if (msg.includes("already exists") || msg.includes("USER_EMAIL_EXISTS")) {
        console.log(`ℹ️  管理员已存在: ${adminEmail}`);
      } else {
        throw e;
      }
    }

    // 升级为 SUPERADMIN
    await prisma.user.update({
      where: { email: adminEmail },
      data: { role: "SUPERADMIN" },
    });
    console.log("✅ 管理员角色已设为 SUPERADMIN");
  } catch (e) {
    console.error("❌ 管理员创建失败:", e);
  }

  // 2. 创建示例博客文章
  const admin = await prisma.user.findUnique({ where: { email: "admin@lvyz.org" } });
  if (!admin) {
    console.log("⚠️  跳过示例博客（未找到管理员）");
    return;
  }

  const samplePosts = [
    {
      title: "从一汽大众到华为：14年车辆安全工程师的 AI 转型之路",
      slug: "ai-transition-journey",
      excerpt: "2026年7月，我即将以 18-19 级身份加入华为鸿蒙智行 BU Occupant Safety 专家岗位。这是一篇关于我从传统工程向 AI 转型的心路历程。",
      content: `# 从一汽大众到华为：14年车辆安全工程师的 AI 转型之路

## 起点：为什么是 AI？

我在汽车安全领域深耕 14 年，做过 CNCAP / C-IASI 法规、约束系统开发、碰撞仿真。

2026 年，**AI 不再是选项**——它是所有工程师的必答题。

## 我的 5 周冲刺计划

参考用户档案里的 24 主题路线图，我给自己定了**5 周冲刺**计划：

- **D 方向**：碰撞数据分析 + 机器学习
- **E 方向**：安全规范 RAG + Agent

## 副业：做 AI 工具给其他主机厂

我观察到 80% 的主机厂安全团队还在用 Excel + Word。我要做 SaaS 工具。

---
*持续更新中...*`,
      category: "industry",
      tags: "AI,转型,华为,车辆安全",
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
    {
      title: "C-IASI 2023+2024 全量汇总：58 款车的安全指数真相",
      slug: "ciasi-2023-2024-summary",
      excerpt: "C-IASI 2023+2024 年发布的所有 58 款车的 5 大指数完整数据，含耐撞性、车内乘员、车外行人、车辆辅助的 G/A/M/P 分布。",
      content: `# C-IASI 2023+2024 全量汇总：58 款车的安全指数真相

本文基于 58 款车的官方评测数据...

## 5 大指数分布

| 5 大指数 | G | A | M | P |
|---|---|---|---|---|
| 耐撞性 | 30 | 6 | 12 | 9 |
| 车内乘员 | 46 | 10 | 0 | 2 |
| 车外行人 | 40 | 9 | 4 | 5 |
| 车辆辅助 | 26 | 15 | 13 | 4 |
| 新能源 | 0 | 0 | 0 | 0 |`,
      category: "industry",
      tags: "C-IASI,车辆安全,数据分析",
      status: "PUBLISHED",
      publishedAt: new Date(Date.now() - 86400000),
    },
    {
      title: "诗韵 · 夏夜",
      slug: "summer-night-poem",
      excerpt: "一首关于长春夏夜的小诗。",
      content: `# 夏夜

蝉鸣
穿过窗帘的缝隙
是故乡的月色
`,
      category: "poetry",
      tags: "诗,夏夜,长春",
      status: "PUBLISHED",
      publishedAt: new Date(Date.now() - 2 * 86400000),
    },
    {
      title: "AI 工程师视角：C-IASI 仿真如何用 LLM 加速",
      slug: "ai-simulation-acceleration",
      excerpt: "结合车辆安全仿真与 LLM，探索 AI 辅助安全设计的可能性。",
      content: `# AI 工程师视角：C-IASI 仿真如何用 LLM 加速

## 现状

车辆安全仿真依赖：
- ANSA / HyperMesh 前处理
- LS-DYNA / Pamcrash 求解
- META / HyperView 后处理

## AI 加速点

1. 几何清理自动化
2. 仿真结果异常检测
3. 法规符合性自动检查`,
      category: "tech",
      tags: "AI,仿真,车辆安全,LS-DYNA",
      status: "DRAFT",
    },
  ];

  for (const post of samplePosts) {
    const existing = await prisma.post.findUnique({ where: { slug: post.slug } });
    if (existing) {
      console.log(`  ℹ️  文章已存在: ${post.slug}`);
      continue;
    }
    await prisma.post.create({
      data: { ...post, authorId: admin.id },
    });
    console.log(`  ✅ 文章已创建: ${post.slug}`);
  }

  console.log("🎉 种子数据完成！");
  console.log(`   - 管理员: admin@lvyz.org / lvyz2026`);
  console.log(`   - 博客文章: ${samplePosts.length} 篇`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
