# lvyz.org 平台 — 交接技术文档

> **目的**：给后续 agent / 协作者 / 接手者阅读，理解平台整体架构后能安全迭代。
> **最后更新**：2026-07-03 · commit `1b004bb` · Vercel production · https://www.lvyz.org
> **维护者**：lvyz（产品 / 内容主理人）+ Coder agent（开发协作）

---

## 0. 30 秒概览

lvyz.org 是一个**多子站一体化平台**，由 1 个主站（首页 + 6 个子站路由）+ 1 套全站账号系统组成：

| 子站 | 路径 | 核心用途 | 内容来源 |
|---|---|---|---|
| 🏠 首页 | `/` | 品牌门面 + 诗《也乡愁》+ BGM | 静态 |
| 🧠 **crashAI** | `/crashai` | AI 闪卡学习（艾宾浩斯 + ANKI SM-2） | `src/content/crashai-expanded/*.json` |
| 🧒 **儿童 AI** | `/kids-ai` | 童趣 AI 课程（10 章 + 6 游戏 + 5 创作工具） | `src/content/kids-ai/*` |
| 📚 **绘本** | `/picturebook` | 雷迪嘎嘎系列（故事 + 角色） | `src/content/picturebook/*` + R2 图 |
| 🔍 **知识库** | `/knowledge-base` | 旧 wiki iframe（待迁移） | `/wiki-legacy/` (94MB) |
| ✍️ **博客** | `/blog` | 诗 / 随笔 / 技术（支持音视频） | Postgres `Post` |
| 🛍️ IP 周边 | `/merchandise` | 周边展示（占位） | 静态 |

**共用基础设施**：Better Auth（账号）+ Prisma Postgres（数据）+ Cloudflare R2（媒体）+ Vercel（部署）+ 全站权限 `SiteAccess`。

---

## 1. 技术栈速览

### 1.1 运行时 / 框架

| 项 | 选型 | 版本 | 备注 |
|---|---|---|---|
| 框架 | **Next.js** | 15.5.19 | ⚠️ 故意降级（16 在 Vercel 有 bug） |
| UI | React 19.2.7 | 19 | App Router + RSC |
| 样式 | Tailwind CSS 4.3 + lucide-react | 1.17 | 全站玻璃拟物（`.glass-card` `.glass-card-strong` `.glass-nav`） |
| 包管理 | pnpm | 11.6（本地）/ 10（Vercel） | |
| Node | 22.x（Vercel）/ 24（本地） | | Vercel 已 PATCH |

### 1.2 数据 / 存储

| 项 | 选型 | 用途 | 路径 |
|---|---|---|---|
| 数据库 | **Prisma + Postgres** | 全部业务数据 | `db.prisma.io:5432` |
| 媒体存储 | **Cloudflare R2**（S3 兼容） | 图片 / 视频 / 音频 | `lvyzorg` bucket / `media.lvyz.org` CDN |
| 认证 | **Better Auth** 1.1 | 全站统一登录（email+password 为主） | scrypt hash |
| 搜索 | 内置 `prisma` where | 简易搜索 | 无独立搜索引擎 |

### 1.3 关键依赖

```jsonc
{
  "next": "15.5.19",
  "react": "19.2.7",
  "@prisma/client": "^6.1.0",
  "better-auth": "^1.1.0",
  "tailwindcss": "^4.3.0",
  "lucide-react": "^1.17.0",
  "react-markdown": "^10.1.0",
  "remark-gfm": "^4.0.1",
  "rehype-raw": "^7.0.0",                 // 解析 <video>/<audio> raw HTML
  "@aws-sdk/client-s3": "^3.703.0",       // R2 SDK
  "@aws-sdk/s3-request-presigner": "^3.703.0",
  "date-fns": "^4.1.0",
  "server-only": "^0.0.1"
}
```

---

## 2. 目录结构

```
D:\LvyzWeb\platform\
├── .env                    # 全部 secret（gitignore）
├── next.config.ts          # R2 域名白名单 + build 容忍
├── package.json            # scripts.build = prisma generate + db push + next build
├── prisma/
│   └── schema.prisma       # 11 个 model + 2 个 enum
├── scripts/                # 一次性工具脚本（不入产品代码）
│   ├── upload-*.js         # R2 批量上传
│   ├── extract-*.js        # 内容提取
│   ├── test-pb-api.js      # API 端到端测试
│   └── ...
├── public/                 # 静态资源（favicon, og, 等）
└── src/
    ├── app/                # Next.js App Router（路由 + API）
    │   ├── page.tsx        # 首页（诗 + 6 子站卡 + BGM）
    │   ├── layout.tsx      # 全局 layout（主题 anti-flash script）
    │   ├── login/          # 登录
    │   ├── register/       # 注册
    │   ├── crashai/        # 闪卡
    │   ├── kids-ai/        # 儿童 AI
    │   ├── picturebook/    # 绘本
    │   ├── knowledge-base/ # 旧 wiki iframe
    │   ├── blog/           # 博客
    │   ├── merchandise/    # 周边
    │   ├── admin/          # 后台（绘本管理 / 权限管理）
    │   └── api/            # 后端 API
    ├── components/         # 复用 UI
    │   ├── nav-bar.tsx     # 顶部导航
    │   ├── theme-toggle.tsx
    │   ├── post-editor.tsx # 博客编辑器
    │   ├── markdown.tsx    # 渲染器（支持 video/audio）
    │   ├── story-reader.tsx
    │   ├── text-only-reader.tsx
    │   ├── embeds.tsx      # 小红书 / B站嵌入
    │   ├── comment-section.tsx
    │   └── ...
    ├── content/            # 静态 / 半静态数据源
    │   ├── crashai-expanded/   # 闪卡原始数据（Python 生成）
    │   ├── kids-ai/           # 课程 + 章节
    │   └── picturebook/       # 故事 + 角色 + 系列
    └── lib/                # 工具 / 适配层
        ├── auth.ts         # Better Auth 配置
        ├── auth-client-helpers.ts
        ├── db.ts           # Prisma 单例
        ├── posts.ts        # 文章 server tools
        ├── storage.ts      # R2 通用上传
        ├── server-data.ts  # 闪卡 / 课程数据加载
        ├── utils.ts        # cn() / slugify() / formatBytes()
        └── embeds.ts       # URL → 平台解析
```

---

## 3. 数据库 Schema（11 models / 2 enums）

```prisma
datasource db { provider = "postgresql"; url = env("DATABASE_URL") }
```

### 3.1 认证核心（Better Auth 自动管理）

| Model | 字段要点 | 用途 |
|---|---|---|
| `User` | id / email / name / role (GUEST/USER/EDITOR/ADMIN/SUPERADMIN) / bio / websiteUrl / xhsHandle / biliHandle / banned | 用户 |
| `Session` | userId / token / expiresAt | 登录态 |
| `Account` | userId / providerId / accountId / OAuth token | OAuth 凭据 |
| `Verification` | identifier / value / expiresAt | 邮箱验证 |

### 3.2 权限

```prisma
enum SiteAccessLevel { NONE, READ, COMMENT, EDIT, ADMIN }

model SiteAccess {
  userId  String
  site    String    // "crashai" | "kids-ai" | "picturebook" | "blog" | "knowledge-base" | "merchandise"
  level   SiteAccessLevel
  note    String?
  @@unique([userId, site])
}
```

**API**：`/api/admin/site-access` · UI：`/admin/site-access`

### 3.3 内容

| Model | 关键字段 | 备注 |
|---|---|---|
| `Post` | slug / title / content (markdown) / coverImage / category / tags / status / allowComments / embeds (JSON) / viewCount | 博客 |
| `Comment` | postId / authorId / parentId (嵌套) / content / status | 留言 |
| `Media` | filename / mimeType / size / type (IMAGE/VIDEO/AUDIO/DOCUMENT) / key / url / width / height / duration / thumbnailUrl | R2 文件记录 |
| `PostMedia` | postId / mediaId / role (COVER/CONTENT/GALLERY) / order | 多对多 |

### 3.4 Wiki

```prisma
model WikiAccess {
  userId  String
  page    String   // wiki page path
  @@unique([userId, page])
}
```
现状：保留白名单机制，主站 `/knowledge-base` 已用 Next.js 重写，旧 wiki (`/wiki-legacy/`) iframe 嵌入。

### 3.5 绘本（用户上传后台）

```prisma
enum PicturebookStatus { DRAFT, PUBLISHED, ARCHIVED }

model PicturebookStory {
  slug / title / titleEn / series / seriesCategory / desc / age / time / pageCount
  emoji / cover / videoUrl / tags[] / status / uploadedBy / views / likes
  publishedAt  // status=PUBLISHED 时填
  relations: pages[], characters[]
}

model PicturebookPage {
  storyId / pageNum / imageUrl / thumbUrl / text (markdown)
  width / height / size
  @@unique([storyId, pageNum])
}

model PicturebookCharacter {
  storyId / charId (lady-gaga/gababa/...) / name (冗余)
  @@unique([storyId, charId])
}
```

---

## 4. 关键子系统详解

### 4.1 全站账号 / 权限

- **入口**：`/login` `/register`
- **存储**：scrypt 哈希（`bcryptjs` 已装但 Better Auth 内部用 scrypt，**不要混用**）
- **登录态**：cookie `lvyz.session_token`（httpOnly，30 天）
- **角色**：`User.role`（5 档）+ `SiteAccess`（按子站细粒度）
- **关键 helper**：`src/lib/auth.ts`（server）+ `src/lib/auth-client-helpers.ts`（client，**baseURL 用 `window.location.origin`**，避免跨域 500）
- **创建账号**：`scripts/create-test-account.js`（**必须用 Better Auth 的 `hashPassword`**，不能用 bcryptjs，格式不兼容）

**默认账号**：
- `admin@lvyz.org / Lvyz2026!Wiki`（role=ADMIN，已白名单 6 子站 ADMIN）

### 4.2 媒体上传模式（**全站统一**）

> **核心原则**：**永远走 R2 预签名直传**，不经过 Vercel（4.5MB body 限制）。

```
┌─────────────────────────────────────────────────────────────┐
│ 浏览器                                                      │
│  1. POST /api/{module}/media/presign                        │
│     body: { fileName, fileType, fileSize }                  │
│     ← R2 PUT URL (10 min有效) + publicUrl + key             │
│                                                              │
│  2. PUT 到 R2 (5GB 限制，零代理)                            │
│                                                              │
│  3. POST /api/{module}/media/confirm                        │
│     body: { key, publicUrl, filename, mimeType, size, ... } │
│     → 写 Media 表 + 可选 PostMedia 关联                     │
└─────────────────────────────────────────────────────────────┘
```

**实现**：
- 通用函数：`src/lib/storage.ts`（旧）+ 各 module 自带 presign/confirm
- 当前实现：
  - **绘本**：`/api/admin/picturebook/presign` + `/confirm-upload`（已含 Page/Character 关联）
  - **博客**：`/api/blog/media/presign` + `/confirm`（只写 Media，可选关联 Post）

**R2 路径规范**：

| 模块 | 路径 | 公网 URL |
|---|---|---|
| 绘本 | `picturebook/{series}/{slug}/page_NN.{ext}` | `https://media.lvyz.org/picturebook/...` |
| 绘本封面 | `picturebook/{series}/{slug}/cover.{ext}` | 同上 |
| 绘本视频 | `picturebook/{series}/{slug}/video.{ext}` | 同上 |
| 博客 | `blog/{userId}/{yyyy}/{mm}/{ts}-{rand}-{name}.{ext}` | 同上 |
| 音乐（首页 BGM） | `music/{filename}` | 同上 |
| 通用上传 | `uploads/{userId}/{yyyy}/{mm}/{ts}-{rand}.{ext}` | 同上 |

### 4.3 子站：crashAI（闪卡）

- **路径**：`/crashai` / `/crashai/cards` / `/crashai/[slug]`
- **数据源**：`src/content/crashai-expanded/*.json`（**多份** Python 生成的 JSON，含 24+ 课程）
- **加载**：`src/lib/server-data.ts` `getCards()` 解析 `{cards:[...]}` 包装
- **学习算法**：纯前端 localStorage，**SM-2 + 4 状态机**（new/learning/review/relearning）+ 4 评分按钮（Again/Hard/Good/Easy）
- **API**：`/api/crashai/cards` 返回当前 flashcard set
- **统计**：streak / totalReviewed / retention / mastery

### 4.4 子站：KidsAI

- **路径**：`/kids-ai` `/map` `/chapter/[id]` `/create` `/games` `/games/[slug]` `/achievements` `/about`
- **角色**（童趣鲜艳）：小智（蓝）、妙妙（粉）、博博（绿）
- **课程数据**：
  - `src/content/kids-ai/chapters.json`（10 章，**主数据源**，从 KidAILearning 提取）
  - `src/content/kids-ai/lessons.ts`（简单课程）
  - `src/content/crashai-expanded/course-*.json`（24 门扩展课，**Python 生成**）
- **互动游戏**（6 个，**纯 JS 模拟**，非真 LLM）：
  - `find-ai` `fruit-sort` `ai-vs-human` `magic-command` `story-chain` `train-ai`
- **创作工具**（5 个，**本地模拟生成**）：story / draw / music / voice / poem

### 4.5 子站：绘本

- **路径**：`/picturebook` `/stories` `/stories/[slug]` `/characters` `/characters/[slug]`
- **数据源**：
  - 静态：`src/content/picturebook/stories.json`（**746 个**故事主索引）/ `characters.ts`（12 角色）/ `index.ts`（10 系列）
  - 动态：Postgres `PicturebookStory` 表（用户上传）
  - 单文件额外：`story-dark-cave.json`（20 页完整页内容）
- **角色**（id 必填）：`lady-gaga` / `gababa` / `gayaya` / `chenguang` / `nainai` / `san-zhi` / `bai-youbai` / `zhen-gugu` / `ding-lingling` / `ding-gang-chongchong` / `hua-lala` / `tu-lulu`
- **系列**（id 必填）：`chengyu` / `shige` / `gababa` / `gayaya` / `emotion` / `science` / `liyu` / `mother` / `origin` / `drinking-water`
- **专属色**：
  ```ts
  "成语故事": "#D4A03D", "诗歌故事": "#5BA4CF", "噶巴巴成长": "#4A9B7F",
  "噶丫丫成长": "#D4778C", "儿童情感引导": "#8B7EC8", "科普系列": "#3D9B8F",
  "俚语歇后语": "#E8923A", "思念母亲": "#E8A4B8", "雷迪嘎嘎诞生": "#5B6BC8"
  ```
- **首页色卡 + 卡片网格 + 故事详情 + 角色详情 + 上传后台**（`/admin/picturebook`）
- **暗坑**：
  - `characters.json` 已被弃用（id 字段缺失），用 `characters.ts`
  - 主 stories.json 里的 dark-cave 是占位（`text:[]`），由 `story-data.ts` 的 `mergeExtra` 覆盖真实文本

### 4.6 子站：博客

- **路径**：`/blog` `/blog/new` `/blog/edit/[id]` `/blog/[slug]`
- **数据源**：Postgres `Post`（**唯一动态源**，无静态）
- **API**：
  - `GET/POST /api/blog/posts`（list/create）
  - `GET/PATCH/DELETE /api/blog/posts/[id]`
  - `POST /api/blog/media/presign` + `/confirm`（R2 直传）
  - `POST /api/blog/posts/[id]/comments`（留言）
- **编辑器**：`src/components/post-editor.tsx`
  - 封面图：拖拽 + URL 兜底
  - 媒体按钮 3 分类（图片 10MB / 音频 50MB / 视频 500MB）
  - 嵌入：小红书 / B站 URL（`src/lib/embeds.ts` 解析）
- **渲染器**：`src/components/markdown.tsx`（**已加 `rehype-raw`** 解析 `<video>`/`<audio>`）
- **限制**：仅登录用户可写；作者本人 / EDITOR / ADMIN 可改

### 4.7 首页 BGM（《也乡愁》）

- **当前状态**：⚠️ **R2 上的 .aac 文件 ADTS 头损坏**（sr_idx=0x3F 非法）
  - 浏览器播不出 → **前端已做 3 格式 fallback**（mp3 → aac → m4a）+ 错误状态
  - 修复需用户提供**原始音频源文件**（mp3/m4a/wav 任一）
- **代码**：`src/app/page.tsx`（用 `new Audio()` + DOM 监听首次点击触发，音量 0.35，循环）

---

## 5. 部署

### 5.1 Vercel

- **Project ID**：`prj_ddagWLE1q2XsqflDmMKAKoq1P05I`
- **生产域名**：`www.lvyz.org`（`lvyz.org` 已 301 重定向）
- **Build command**：`pnpm run build`（已 PATCH）
- **Install command**：`pnpm install`（已 PATCH）
- **Framework preset**：`nextjs`（已 PATCH，**自动检测失灵**）
- **Node version**：`22.x`（已 PATCH）
- **Region**：默认
- **每次 build 自动执行**：`prisma generate` → `prisma db push --accept-data-loss` → `next build`（**Vercel 端会推 schema 到生产库**）

### 5.2 环境变量（`.env` / Vercel env）

```bash
# 数据库
DATABASE_URL=postgresql://...

# Better Auth
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=https://www.lvyz.org
NEXT_PUBLIC_APP_URL=https://www.lvyz.org

# R2 / S3
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=lvyzorg
R2_PUBLIC_URL=https://media.lvyz.org
```

> ⚠️ **安全**：所有 secret 已写进 `.env` 和 Vercel env（加密）。**不要 commit 到 git**。本地 `.env` 在 `.gitignore`。

### 5.3 GitHub

- **仓库**：`Newtonxlyz/Uniwebsite`（**注意**：原 `lvyz.org` 仓库已 -f 覆盖）
- **主分支**：`main`
- **部署触发**：push to main → Vercel 自动 build

---

## 6. 开发工作流

### 6.1 改代码 → 部署

```bash
# 1. 本地改代码
pnpm dev                 # http://localhost:3000 调

# 2. schema 改了？先本地推
pnpm exec prisma db push --accept-data-loss

# 3. 提交
git add -A
git commit -m "feat(模块): 描述"
git push -f origin main   # 触发 Vercel 自动部署

# 4. 监控
# - 用 Vercel API 看部署状态（API token 存 verceltoken.txt）
# - 设 cron 监控 READY（成功时 mavis 自动清 cron）
```

### 6.2 加新子站流程

1. 在 `prisma/schema.prisma` 加 model（如需）
2. `pnpm exec prisma db push --accept-data-loss`（Vercel build 时也会推）
3. `src/app/{子站slug}/page.tsx` 主页
4. `src/app/{子站slug}/[其他路由]/page.tsx`
5. `src/app/api/{子站slug}/...` API
6. `src/components/nav-bar.tsx` 加 NAV_ITEMS 条目
7. `src/content/{子站slug}/` 静态数据
8. push → Vercel 部署

### 6.3 一次性的内容/上传脚本

放在 `scripts/` 下，不入产品代码。**模式**：
```js
// 1. 读 .env 手动（不要装 dotenv）
if (fs.existsSync(".env")) {
  for (const line of fs.readFileSync(".env", "utf-8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*"?([^"]*)"?/);
    if (m) process.env[m[1]] = m[2];
  }
}
// 2. 走 R2 SDK 上传（bucket 名是 R2_BUCKET_NAME 不是 R2_BUCKET！）
// 3. node scripts/xxx.js 跑
```

---

## 7. 重要"暗坑"清单（**接任必读**）

| # | 坑 | 解决 |
|---|---|---|
| 1 | **PowerShell 不能用 `&&` `head` `tail` `grep` `curl` `ls -la`** | 用 `;` / `Select-Object` / `node fetch` / `Get-ChildItem` |
| 2 | PowerShell 中文乱码（GBK 解码 UTF-8） | 用 `read` 工具或 `webfetch` 验证 |
| 3 | `prisma.adapter` provider 必须是 `postgresql` | 别用 sqlite（500） |
| 4 | `auth-client-helpers.ts` baseURL 用 `window.location.origin` | 改 Next router 会卡 |
| 5 | Next.js 16 + Vercel 有 bug → 锁 15.5.19 | 升级前先看 Vercel 状态 |
| 6 | Vercel project 必须手 PATCH framework=nextjs | 自动检测失灵 |
| 7 | Vercel build 命令必须含 `prisma db push` | schema 才推到生产 |
| 8 | 4.5MB body 限制 → **永远走 R2 预签名直传** | 不要用 `/api/.../upload` 走 multipart |
| 9 | **Better Auth 必须用 scrypt hash** | 不要用 bcryptjs 生成的 hash 登录 |
| 10 | 登录后跳转用 `window.location.href` | 避免 client router 卡住 |
| 11 | `rehype-raw` 必须装 | 否则 `<video>/<audio>` raw HTML 被忽略 |
| 12 | `characters.json` 弃用 | 用 `characters.ts`（有 id 字段） |
| 13 | `story-data.ts` mergeExtra 覆盖主 stories.json | dark-cave 等"占位+真实数据"双源故事 |
| 14 | R2 上 .aac ADTS 头损坏 | 需用户供新源文件 |
| 15 | 媒体删除 → 同步删 R2 + DB + PostMedia 关联 | 走 cascade + 显式 R2 批量删 |

---

## 8. 内容运营（重要！）

### 8.1 博客发文章（最常用）

1. 登录 https://www.lvyz.org/login
2. 顶部 nav 点 **✍️ 写文章**（或直接 /blog/new）
3. 填标题、分类、标签、封面图
4. 写正文 → 点 **🖼️ / 🎵 / 🎬** 上传媒体（自动插入正文）
5. 点 **🔗 嵌入** 粘小红书/B站
6. 点 **发布**

### 8.2 绘本上传

1. 登录后点 nav bar **📚 管理**（或 /admin/picturebook）
2. **+ 上传新绘本** 3 步向导
3. 拖图/上传（支持视频）→ 自动入 R2
4. 发布

### 8.3 闪卡进度

- 纯 localStorage（不同浏览器/设备**不共享**）
- 想清空进度：闪卡页底部有"重置"按钮
- 长期建议：迁到 Postgres（**待办**）

### 8.4 知识库（旧 wiki）

- 当前 `/knowledge-base` 主页是 Next.js，但点子链接仍走旧 wiki iframe
- 旧 wiki 文件在 `/wiki-legacy/`（94MB，未进 git，建议迁移到 DokuWiki/Wiki.js）
- **短期**：保留 iframe
- **长期**：迁移 + 全文搜索（Meilisearch）

---

## 9. 当前已知 TODO

| # | 模块 | 内容 | 难度 |
|---|---|---|---|
| 1 | 知识库 | 扫描 D 盘文件入库 + 全文搜索 + AI 问答 | 中 |
| 2 | 首页 BGM | 替换损坏的 .aac 源文件 | 易（用户提供源） |
| 3 | 闪卡 | 进度迁 Postgres（多设备同步） | 易 |
| 4 | Wiki | 旧 wiki 迁移到现代 CMS | 中 |
| 5 | 绘本 | process-story-assets.js 批量转 WebP + 多尺寸 | 中 |
| 6 | 全局 | rotate Prisma 旧密码（之前贴过明文） | 易 |
| 7 | 全局 | Sentry 错误监控 | 易 |
| 8 | blog | 自动草稿保存（每 30s） | 易 |
| 9 | 绘本 | 批量 zip 上传 + 自动解压 | 中 |
| 10 | 绘本 | 从 R2 已存在路径导入（不重传） | 易 |

---

## 10. 给新 agent 的协作建议

1. **先读本文档 + 项目根 `AGENTS.md`**（如果存在）
2. **改任何 module 前**先用 `explore` subagent 摸清现有代码
3. **不破坏 schema 兼容**：加字段用 `@default` 或 `Optional`
4. **不在生产数据上跑 migration**：用 `prisma db push --accept-data-loss`（Vercel 同步）
5. **任何 R2 上传**走预签名，不要改 `/api/.../upload` 这种 4.5MB 限制接口
6. **改前端前先 dev 看**：不要直接在 main 上 push
7. **push 后设 cron 监控部署**，READY 后自动清
8. **遇到 .aac ADTS 损坏 / 数据库连不上 / 跨域 500** 等老问题，看 §7 暗坑
9. **完成后给用户简明报告**：✅ 什么上线 / URL 路径 / 怎么用

---

**最后维护**：2026-07-03
**版本**：v3.2+
**部署**：https://www.lvyz.org
**仓库**：github.com/Newtonxlyz/Uniwebsite
