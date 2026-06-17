# LvyzWeb Platform

> 吕元卓个人平台 · **lvyz.org** · Next.js 16 + Better Auth + Prisma + R2
> 文档：[部署手册 v3.2](./部署手册-v3.2-平台重构版.md)

## 项目目标

将 lvyz.org 的 5 个子站（crashai / kids-ai / picturebook / kb / blog）和主站，
用**一套 Next.js 16 代码 + 一套 Better Auth 认证 + 一套 PostgreSQL 数据库**承载。

| 子站 | 路径 | 状态 |
|---|---|---|
| 主站（个人简介） | `/` | ✅ 已迁移到 RSC |
| 博客 | `/blog` | ✅ **MVP v2 完成**（发布/编辑/删除/留言/音视频/嵌入） |
| CrashAI | `/crashai` | ⚠️ 占位（用 stub 服务） |
| Kids AI | `/kids-ai` | ⚠️ 占位 |
| 绘本 | `/picturebook` | ⚠️ 占位 |
| 知识库 | `/kb` | ⚠️ 占位 |
| IP 周边 | `/merchandise` | ⚠️ 占位 |

## 技术栈

- **Next.js 16.2.9** (App Router + Turbopack + RSC)
- **TypeScript 5.9** + **React 19.2**
- **Tailwind CSS 4** + 液态玻璃主题
- **Better Auth 1.6.18** (邮箱+密码，可扩 OAuth)
- **Prisma 6.19** + **PostgreSQL**（本地 SQLite）
- **Cloudflare R2** (S3 兼容对象存储)
- **pnpm 11**

## 启动

```bash
# 1. 安装依赖
pnpm install

# 2. 配置环境
cp .env.example .env
# 编辑 .env 填入真实值

# 3. 初始化数据库
pnpm db:generate      # 生成 Prisma Client
pnpm db:push          # 同步 schema 到 DB
pnpm db:seed          # 创建管理员 + 示例文章

# 4. 启动开发服务器
pnpm dev
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
3. 首次部署后，**在本地**用生产 URL 跑 `pnpm db:push && pnpm db:seed` 初始化表

⚠️ **凭据安全**：DATABASE_URL 包含数据库密码。**绝不要** commit 到 Git（已在 .gitignore），**绝不要** 在公开对话中明文发送。
如需分享，脱敏到 `postgres://user:***@host:5432/db?sslmode=require`。

## 项目结构

```
platform/
├── prisma/
│   ├── schema.prisma            # User / Post / Comment / Media 模型
│   ├── seed.ts                   # 种子数据（admin + 4 篇文章）
│   └── dev.db                    # 本地 SQLite
├── src/
│   ├── app/
│   │   ├── layout.tsx, page.tsx, globals.css    # 根布局 + 主页
│   │   ├── blog/
│   │   │   ├── page.tsx                        # 文章列表（搜索/分类/分页）
│   │   │   ├── new/page.tsx                    # 写新文章
│   │   │   ├── edit/[id]/page.tsx              # 编辑
│   │   │   └── [slug]/page.tsx                 # 详情（评论/嵌入/Markdown）
│   │   ├── crashai/, kids-ai/, picturebook/, kb/, merchandise/   # 占位
│   │   ├── login/, register/                    # 认证 UI
│   │   └── api/
│   │       ├── auth/[...all]/route.ts           # Better Auth
│   │       └── blog/
│   │           ├── posts/route.ts                # CRUD
│   │           ├── posts/[id]/route.ts
│   │           ├── posts/[id]/comments/route.ts
│   │           └── upload/route.ts              # R2 上传
│   ├── components/
│   │   ├── post-editor.tsx, comment-section.tsx
│   │   ├── markdown.tsx, embeds.tsx
│   │   ├── nav-bar.tsx, footer.tsx
│   │   └── ...                                   # 老 crashai 组件保留
│   ├── lib/
│   │   ├── auth.ts, auth-client.tsx             # Better Auth
│   │   ├── db.ts                                # Prisma 单例
│   │   ├── posts.ts                             # 文章/留言业务
│   │   ├── storage.ts                           # R2 上传
│   │   ├── embeds.ts                            # 嵌入解析
│   │   ├── server-data.ts                       # crashai stub
│   │   └── utils.ts
│   ├── proxy.ts                                  # Next.js 16 路由保护
│   └── types/
├── 部署手册-v3.2-平台重构版.md                    # 部署文档
├── package.json
├── tsconfig.json
├── next.config.ts
└── .env
```

## 关键脚本

```bash
pnpm dev               # 开发服务器（http://localhost:3000）
pnpm build             # 生产构建
pnpm start             # 启动生产服务
pnpm typecheck         # TypeScript 检查（已通过，0 错）
pnpm db:generate       # Prisma Client 生成
pnpm db:push           # 同步 schema（开发用）
pnpm db:migrate        # 数据库迁移（生产用）
pnpm db:studio         # Prisma Studio GUI
pnpm db:seed           # 种子数据
```

## 博客功能（MVP v2 已完成）

| 功能 | 状态 | 说明 |
|---|---|---|
| 文章发布 | ✅ | Markdown 编辑器 + 实时预览 |
| 文章编辑 | ✅ | 作者 + 管理员可编辑 |
| 文章删除 | ✅ | 作者 + 管理员可删除 |
| 留言 | ✅ | 嵌套回复 + 删除 |
| 分类筛选 | ✅ | 5 分类：诗韵/随笔/技术/生活/行业 |
| 搜索 | ✅ | 标题/摘要/内容全文搜索 |
| 标签 | ✅ | 逗号分隔 |
| 草稿/发布 | ✅ | 两种状态 |
| 评论开关 | ✅ | 每篇文章可独立配置 |
| 音视频上传 | ✅ | /api/blog/upload → R2 |
| 嵌入小红书 | ✅ | 外链卡片 |
| 嵌入 B 站 | ✅ | 官方 player iframe |
| 嵌入 YouTube | ✅ | 官方 embed |
| 嵌入 MP4 | ✅ | 原生 video 标签 |
| 浏览计数 | ✅ | 自动 |
| Markdown 渲染 | ✅ | GFM + 代码高亮 |
| 角色权限 | ✅ | USER / EDITOR / ADMIN / SUPERADMIN |
| 统一认证 | ✅ | Better Auth + Cookie |

## 待完成（v3.3+）

- [ ] CrashAI 课程数据从 JSON 迁到 PostgreSQL
- [ ] 完整 Admin Dashboard
- [ ] Sentry 错误监控
- [ ] Meilisearch 全文搜索
- [ ] AI 自动摘要
- [ ] 多语言（中/英）
- [ ] S3 替代 R2 测试

## 测试账号

- **管理员**: `admin@lvyz.org` / `lvyz2026`
- **测试用户**: `test@lvyz.org` / `test1234`

## 相关文档

- [部署手册 v3.2 - 平台重构版](./部署手册-v3.2-平台重构版.md)
- [Next.js 16 文档](https://nextjs.org/docs)
- [Better Auth 文档](https://www.better-auth.com/docs)
- [Prisma 文档](https://www.prisma.io/docs)

---

最后更新：2026-06-16
