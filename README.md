# LvyzWeb Platform

> 吕元卓个人平台 · **lvyz.org** · Next.js 15.5 + Better Auth + Prisma + R2
> 文档：[部署手册 v3.2](./部署手册-v3.2-平台重构版.md) · [AGENTS.md](./AGENTS.md)（项目入口，给 AI agent 看）

## 项目目标

将 lvyz.org 的多个子站（blog / crashai / kids-ai / picturebook / knowledge / merchandise）和主站，
用**一套 Next.js 代码 + 一套 Better Auth 认证 + 一套 PostgreSQL 数据库**承载。

| 子站 | 路径 | 状态 |
|---|---|---|
| 主站（个人简介） | `/` | ✅ 已迁移到 RSC |
| 博客 | `/blog` | ✅ MVP v2（发布/编辑/删除/留言/音视频/嵌入） |
| 课程中心 | `/learn/courses` | ✅ PINN + GNN 两门课上线（静态 + localStorage，见 AGENTS.md §5） |
| CrashAI | `/crashai` | ✅ 已并入 /learn/courses，三门户视觉统一 |
| Kids AI | `/kids-ai` | 路由已建 |
| 绘本 | `/picturebook` | 路由已建（资源走 R2，不入 git） |
| 知识库 | `/knowledge`、`/knowledge-base` | 路由已建（两个目录并存，待合并） |
| IP 周边 | `/merchandise` | 路由已建 |

## 技术栈

- **Next.js 15.5.19** (App Router + RSC)
- **TypeScript 5.9** + **React 19.2**
- **Tailwind CSS 4**
- **Better Auth 1.1** (邮箱+密码，可扩 OAuth)
- **Prisma 6.1** + **PostgreSQL**（Prisma Postgres，开发/生产同一个）
- **Cloudflare R2** (S3 兼容对象存储)
- **npm**（⚠️ 不是 pnpm；Vercel 用 `vercel.json` 强制 npm install/build）

## 启动

```bash
# 1. 安装依赖
npm install

# 2. 配置环境
cp .env.example .env
# 编辑 .env 填入真实值

# 3. 初始化数据库
npm run db:generate    # 生成 Prisma Client
npm run db:push        # 同步 schema 到 DB
npm run db:seed        # 创建管理员 + 示例文章

# 4. 启动开发服务器
npm run dev
# 访问 http://localhost:3000

# 默认账号: admin@lvyz.org / lvyz2026
```

### 数据库：Prisma Postgres

本项目使用 [Prisma Postgres](https://console.prisma.io) 作为统一数据库（开发 + 生产都用同一个）。

- 免费层：1GB 存储
- 内置连接池
- 跟 Prisma ORM 集成最好

**本地开发**：直接用 `.env` 里的 `DATABASE_URL` 即可。

**部署到 Vercel**：
1. 创建 Prisma Postgres 数据库（推荐 Singapore region）
2. Vercel 项目 → Environment Variables → 添加 `DATABASE_URL`
3. 首次部署后，**在本地**用生产 URL 跑 `npm run db:push && npm run db:seed` 初始化表

⚠️ **凭据安全**：DATABASE_URL 包含数据库密码。**绝不要** commit 到 Git（已在 .gitignore），**绝不要** 在公开对话中明文发送。
如需分享，脱敏到 `postgres://user:***@host:5432/db?sslmode=require`。

## 项目结构

```
platform/
├── AGENTS.md                     # ← 项目入口（AI agent 必读，含课程子系统架构）
├── prisma/
│   ├── schema.prisma             # User / Post / Comment / Media 模型
│   └── seed.ts                   # 种子数据（admin + 示例文章）
├── public/courses/               # 课程子系统（完全静态 + localStorage，与 Next 解耦）
│   ├── _shared/                  # 11 个共享 JS 模块 + CSS（SM-2 闪卡 / 5 题型 / 子节进度）
│   ├── pinn-crash-reduction/     # PINN 课程（75 题 / 6 章 + final 15）
│   └── gn-crash-guide/           # GNN 课程（69 题 / 7 章 + final 13）
├── scripts/
│   ├── build-course.py           # 课程静态 HTML 生成器（加新课程主入口）
│   ├── templates/                # 课程 HTML 模板 + _chapter_bodies.py
│   └── audit_quizzes.py          # 题库分布审计
├── src/
│   ├── app/
│   │   ├── layout.tsx, page.tsx, globals.css
│   │   ├── learn/                # 课程门户（courses hub + pinn/gn/crashai 三门户）
│   │   ├── blog/                 # 文章列表 / new / edit / [slug]
│   │   ├── crashai/              # 老 crashAI 详情页
│   │   ├── kids-ai/, picturebook/, knowledge/, knowledge-base/, merchandise/
│   │   ├── admin/                # 后台
│   │   ├── login/, register/     # 认证 UI
│   │   └── api/                  # auth / blog / admin / crashai / media / posts
│   ├── components/               # nav-bar / learn-floating-nav / markdown 等
│   ├── lib/                      # auth / db / posts / storage / embeds / server-data
│   └── middleware.ts             # 路由保护
├── _archive/                     # 一次性产物归档（Vercel 抓包 dump、旧脚本，无引用）
├── 部署手册-v3.2-平台重构版.md
├── package.json
├── tsconfig.json
├── next.config.ts
└── vercel.json                   # 强制 npm install/build
```

## 关键脚本

```bash
npm run dev            # 开发服务器（http://localhost:3000）
npm run build          # 生产构建（prisma generate + next build）
npm run typecheck      # TypeScript 检查
npm run db:generate    # Prisma Client 生成
npm run db:push        # 同步 schema（开发用）
npm run db:migrate     # 数据库迁移（生产用）
npm run db:seed        # 种子数据

# 课程子系统（详见 AGENTS.md §10）
python scripts/build-course.py ...
python scripts/audit_quizzes.py
```

## 课程子系统（已完成）

- PINN「AI+DOE+PINN 仿真降阶」：75 题 / 6 章 + 期末 15 题
- GNN「GNN 碰撞仿真降阶」：69 题 / 7 章 + 期末 13 题
- 共享能力：SM-2 闪卡、5 题型（single/tf/multi/fill/short）、子节小测、错题本、章节笔记、亮暗主题、KaTeX 公式渲染
- 架构：静态 HTML + localStorage，共享 JS 模块自动接管，**加新课程 0 改 JS**

## 待完成（v3.3+）

- [ ] CrashAI 课程数据从 JSON 迁到 PostgreSQL
- [ ] 完整 Admin Dashboard
- [ ] Sentry 错误监控
- [ ] Meilisearch 全文搜索
- [ ] AI 自动摘要
- [ ] 多语言（中/英）
- [ ] `/knowledge` 与 `/knowledge-base` 合并
- [ ] S3 替代 R2 测试

## 测试账号

- **管理员**: `admin@lvyz.org` / `lvyz2026`
- **测试用户**: `test@lvyz.org` / `test1234`

## 相关文档

- [AGENTS.md](./AGENTS.md) — 项目入口 + 课程子系统深度架构（agent 必读）
- [部署手册 v3.2 - 平台重构版](./部署手册-v3.2-平台重构版.md)
- [Next.js 文档](https://nextjs.org/docs)
- [Better Auth 文档](https://www.better-auth.com/docs)
- [Prisma 文档](https://www.prisma.io/docs)

---

最后更新：2026-09-18（同步课程子系统上线 + 根目录清理）
