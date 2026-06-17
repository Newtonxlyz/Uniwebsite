# lvyz.org v3.2 部署操作清单（手把手版）

> 适用：把 `D:\LvyzWeb\platform` 部署到生产环境
> 预计时间：2-3 小时
> 风险：⚠️ 第 5 步 DNS 切换会让 lvyz.org 短暂不可用（5-30 分钟）

---

## 步骤总览

| # | 任务 | 预计 | 需要我？ |
|---|---|---|---|
| 1 | 安全前置（rotate 密码） | 5 min | ❌ |
| 2 | Cloudflare R2 创建 bucket + Token | 15 min | ❌ |
| 3 | Vercel 部署（含环境变量） | 30 min | ❌ |
| 4 | 首次部署后初始化数据库 | 10 min | ❌（我**可以**远程跑） |
| 5 | DNS 切换 lvyz.org → Vercel | 10 min | ❌ |
| 6 | 验证生产环境 | 15 min | ❌ |

---

## 步骤 1：安全前置（必做）

你之前把完整 DATABASE_URL（带密码）贴在了对话里。

**立刻做**：
1. 打开 https://console.prisma.io
2. 你的项目 → **Settings** → **Database** → **Reset Password** 或 **Rotate Credentials**
3. 复制新的 URL（格式相同，但 password 变了）
4. **新 URL 我不会贴回对话**——直接填到 Vercel 和 .env

⚠️ **不要** 给我新 URL。给我一个脱敏版本就行（`postgres://user:***@db.prisma.io:5432/postgres?sslmode=require`）

---

## 步骤 2：Cloudflare R2 创建 bucket + API Token

### 2.1 创建 bucket

1. 打开 https://dash.cloudflare.com → 登录
2. 左侧 **R2** → **Object Storage** → **Create bucket**
   - Bucket name: **`lvyz-media`**
   - Location: **Automatic**（推荐）或 **APAC**（亚洲访问快）
   - 点击 **Create bucket**

### 2.2 创建自定义域（可选但推荐）

1. 进入 `lvyz-media` bucket → **Settings** → **Public Access**
2. 点击 **Custom Domains** → **Connect Domain**
3. 输入 **`media.lvyz.org`** → 继续
4. Cloudflare 自动加 CNAME 记录，等 1-2 分钟生效

### 2.3 创建 API Token

1. 右上角头像 → **My Profile** → **API Tokens**
2. **Create Token** → **Custom token** → **Next**
3. 配置：
   - **Token name**: `lvyz-r2-write`
   - **Permissions**:
     - Account → **Cloudflare R2: Edit**
   - **Account Resources**:
     - Include → Specific account → 你的账号
   - **TTL**: 留空（永不过期；不安全但方便）
4. **Continue to summary** → **Create Token**
5. ⚠️ **立刻复制**：
   - `Access Key ID`
   - `Secret Access Key`
   - **只显示一次**！关掉就没了

### 2.4 找 Account ID

1. R2 → 右上角 **Account ID** （一串 hex）
2. 复制

### 2.5 你现在有 4 个 R2 相关值：

```
R2_ACCOUNT_ID = "abc123def456..."
R2_ACCESS_KEY_ID = "xxx..."
R2_SECRET_ACCESS_KEY = "yyy..."
R2_BUCKET_NAME = "lvyz-media"
R2_PUBLIC_URL = "https://media.lvyz.org"  ← 如果做了 2.2
```

---

## 步骤 3：Vercel 部署

### 3.1 推送代码到 GitHub

⚠️ **先确认** `.env` 没被 commit：

```powershell
cd D:\LvyzWeb\platform
git status
# 应该看不到 .env
```

如果没初始化 git 仓库：

```powershell
cd D:\LvyzWeb\platform
git init
git add -A
git commit -m "feat: lvyz-platform v3.2 - Next.js 16 + Better Auth + Prisma"
# 然后在 GitHub 创建空仓库 Newtonxlyz/MinimaxWeb
git remote add origin https://github.com/Newtonxlyz/MinimaxWeb.git
git branch -M main
git push -u origin main
```

### 3.2 在 Vercel 导入项目

1. 打开 https://vercel.com/dashboard
2. **Add New** → **Project**
3. 选 **Newtonxlyz/MinimaxWeb** → **Import**
4. **Configure Project**：
   - **Framework Preset**: Next.js（自动检测）
   - **Build Command**: `prisma generate && next build`（**手动改**！默认是 `next build`）
   - **Output Directory**: `.next`（默认）
   - **Install Command**: `npm install` 或 `pnpm install`（看你用啥）

### 3.3 加环境变量

在 **Environment Variables** 区域，加 9 个变量（每个都要加 Production / Preview / Development 都勾上）：

| Name | Value |
|---|---|
| `NEXT_PUBLIC_APP_URL` | `https://lvyz.org` |
| `DATABASE_URL` | 你的 Prisma Postgres URL（新 rotate 的） |
| `BETTER_AUTH_SECRET` | `openssl rand -hex 32` 生成的 64 字符 |
| `BETTER_AUTH_URL` | `https://lvyz.org` |
| `R2_ACCOUNT_ID` | 步骤 2.4 |
| `R2_ACCESS_KEY_ID` | 步骤 2.3 |
| `R2_SECRET_ACCESS_KEY` | 步骤 2.3 |
| `R2_BUCKET_NAME` | `lvyz-media` |
| `R2_PUBLIC_URL` | `https://media.lvyz.org` |

### 3.4 点 Deploy

- Vercel 会：
  1. clone 仓库
  2. `pnpm install` (或 npm install)
  3. `prisma generate` (Prisma Client)
  4. `next build`
  5. 部署到 edge
- 等 1-3 分钟
- **首次部署会成功**（即使数据库是空的，build 不依赖 DB）

### 3.5 看部署状态

- **Vercel Dashboard** → 你的项目 → **Deployments** 标签
- 看 **Build Logs** 确认无 error
- 部署成功 → 看到 **Visit** 按钮 → 给你一个临时 URL（`xxx.vercel.app`）

---

## 步骤 4：初始化生产数据库

⚠️ Vercel 部署**不会**自动建表（prisma db push 不在 build 流程里）。

**方案 A：本地连生产 DB 初始化（推荐）**

```powershell
cd D:\LvyzWeb\platform
# 临时把 DATABASE_URL 切到生产（你 rotate 后的新 URL）
$env:DATABASE_URL = "postgres://新URL..."
pnpm db:push       # 建表
pnpm db:seed       # 创建 admin + 4 篇文章
# 不需要的话 unset
Remove-Item Env:DATABASE_URL
```

**方案 B：Vercel build 时自动 db push（不推荐）**

在 `package.json` 的 `build` 脚本里加 `&& prisma db push`，但**这不安全**（build 时改生产 DB）。

我用方案 A 帮你跑过 dev 环境的同样流程，已经验证可用。

### 验证

数据库应该有 1 个 admin + 4 篇文章：
```powershell
# 切到生产 URL 后跑这个 Python 脚本（我会帮你写）
python _raw\test_pg.py
# 应该输出 admin + 4 篇文章
```

---

## 步骤 5：DNS 切换

⚠️ **这一步会让 lvyz.org 短暂不可用**（5-30 分钟）。建议在**非高峰时段**做。

### 5.1 在 Vercel 加域名

1. Vercel Dashboard → 你的项目 → **Settings** → **Domains**
2. 输入 **`lvyz.org`** → **Add**
3. 输入 **`www.lvyz.org`** → **Add**（会跳到主域）
4. Vercel 会显示需要加的 DNS 记录：
   - `lvyz.org` → A 记录 `76.76.21.21`（Vercel IP）
   - `www.lvyz.org` → CNAME `cname.vercel-dns.com`

### 5.2 在 Cloudflare DNS 加记录

1. https://dash.cloudflare.com → 选 `lvyz.org` 域
2. **DNS** → **Records** → **Add record**
3. 加 2 条（如果已有同名记录，先删旧的）：

| Type | Name | Target | Proxy |
|---|---|---|---|
| A | `@` | `76.76.21.21` | **DNS only** (灰云) |
| CNAME | `www` | `cname.vercel-dns.com` | **DNS only** (灰云) |

⚠️ **Proxy 必须关掉**（灰云）！Cloudflare 代理会让 Vercel 看到错误 IP，SSL 也会断。

### 5.3 等 DNS 生效

- 用 `nslookup lvyz.org 8.8.8.8` 看是否解析到 `76.76.21.21`
- 通常 5-30 分钟
- Cloudflare 控制台会显示 "Active"

### 5.4 在 Vercel 验证 SSL

- Vercel Dashboard → Domains → 看到 ✅
- 自动签发 Let's Encrypt 证书

---

## 步骤 6：验证生产

部署完成后测：

| URL | 应该看到 |
|---|---|
| `https://lvyz.org/` | 你之前写的主页（吕元卓 + 4 profile + 6 子站卡） |
| `https://lvyz.org/blog` | 博客列表（4 篇示例） |
| `https://lvyz.org/blog/ai-transition-journey` | 文章详情 |
| `https://lvyz.org/login` | 登录页 |
| `https://lvyz.org/api/auth/sign-in/email` | POST → 200 |
| `https://lvyz.org/api/blog/posts` | GET → 4 篇文章 JSON |

---

## 常见问题

**Q1: 部署后页面 500？**
- Vercel → Deployments → Logs → 看 error
- 90% 是环境变量没填对

**Q2: 登录失败？**
- 检查 `BETTER_AUTH_URL` 是否等于实际域名
- 检查 `BETTER_AUTH_SECRET` 在 Vercel 是否设置了

**Q3: 上传图片 401/403？**
- 检查 R2 token 是否 `Edit` 权限（不是 `Read`）
- 检查 `R2_PUBLIC_URL` 是否能访问（`https://media.lvyz.org`）

**Q4: 之前 Prisma 密码泄露过，怎么补救？**
- ✅ 你已经在第 1 步 rotate 了——足够了
- 不需要清表，密码换了之后旧密码就失效

**Q5: v3.1 旧站还在？**
- lvyz.org DNS 切换后**自动下线**（指向 Vercel 新的 platform）
- 旧代码仓库（如果独立）保留 GitHub 即可，不需要删

---

## 我能帮你做的

✅ **可以远程**：
- 帮你跑 `pnpm db:push && pnpm db:seed` 连生产 DB（你贴脱敏的 URL 给我 + 确认 rotate 后）
- 写一个 `pnpm deploy:prod` 一键脚本（git push + 跑 db push）

❌ **不能**：
- 替你在 Cloudflare / Vercel / GitHub 点 UI
- 替你 rotate 密码
- 替你看 lvyz.org 是否真的能打开

---

## 推荐执行顺序

```
1. Rotate Prisma 密码 (5 min)
2. Cloudflare R2: bucket + token + 域 (15 min)
3. Vercel: 导入项目 + 加 9 个 env (20 min)
4. Deploy (3-5 min) ← 等
5. 告诉我新 DATABASE_URL（脱敏）+ 我帮你跑 db:push + seed (10 min)
6. Vercel: 加 lvyz.org 域名 (5 min)
7. Cloudflare: 加 2 条 DNS 记录 (5 min)
8. 等 DNS 生效 + 验证 (10-30 min)
9. ✅ 部署完成
```
