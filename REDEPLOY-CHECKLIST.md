# lvyz.org 现有项目 Redeploy 操作清单

> 适用：你已经有 lvyz.org 在 Vercel 上跑（多次部署过）
> 目标：让 `/blog` 子站真正可用（v3.2 Next.js 16 + Prisma Postgres + R2）
> 预计时间：15-30 分钟

---

## 步骤 1：确认代码已 push 到 GitHub

⚠️ **关键前提**：你 Vercel 项目关联的 GitHub 仓库，**必须**包含 v3.2 的代码（blog 重构）。

### 1.1 检查本地 git 状态

```powershell
cd D:\LvyzWeb\platform
git status
# 输出：
#   - "fatal: not a git repository" → 没 git 仓库（跳到 1.2a）
#   - 列出未提交文件 → 有未提交（跳到 1.2b）
#   - "nothing to commit, working tree clean" → 干净（跳到 1.2c）

git log --oneline -3
# 看最近 3 个 commit，确认有 v3.2 相关的 commit
# 应该有 "v3.2" 或 "blog" 或 "prisma" 相关
```

### 1.2 三种情况

#### a) 完全没有 git 仓库（最常见）

```powershell
cd D:\LvyzWeb\platform
git init
git add -A
git commit -m "feat: lvyz-platform v3.2 - Next.js 16 + Better Auth + Prisma + R2"
# 然后在 GitHub 创建空仓库并 push
git remote add origin https://github.com/Newtonxlyz/MinimaxWeb.git
git branch -M main
git push -u origin main
```

#### b) 有 git 仓库但有未提交

```powershell
cd D:\LvyzWeb\platform
# 看哪些文件未提交
git status
# 如果只是 .env / node_modules / .next 等应该被忽略的 → 安全
# 如果有 src/ 等代码文件 → 提交

git add -A
git commit -m "feat: lvyz-platform v3.2 - Next.js 16 + Better Auth + Prisma + R2"
git push origin main
```

#### c) 已经有 git 仓库，干净

```powershell
cd D:\LvyzWeb\platform
# 看最近 commit
git log --oneline -5
# 如果最近的 commit 包含 v3.2 改造 → 直接 push 触发 Vercel redeploy
# 如果不包含 → 在本地改了之后 commit + push

git push origin main
# 如果 "Everything up-to-date" → Vercel 已经最新，啥也不做
# 如果 push 成功 → Vercel 自动检测 + redeploy
```

### 1.3 ⚠️ push 前必须确认 3 件事

1. **`.env` 没在 commit 里**：
   ```powershell
   git ls-files | Select-String '\.env$'
   # 应该没输出（.env 被 .gitignore 排除）
   ```

2. **绘本图片 126MB 是否进 Git**：
   ```powershell
   git ls-files | Select-String 'picturebook' | Measure-Object
   # 数字应该 < 5（如果 0 就把图片 ignore 了）
   # 数字 100+ → 建议先 .gitignore 再 push
   ```

3. **远程仓库地址**：
   ```powershell
   git remote -v
   # 应该显示 Newtonxlyz/MinimaxWeb.git
   ```

### 1.4 Vercel 关联的仓库不对

如果 Vercel 项目关联的仓库**不是**这个：
- Vercel Dashboard → 项目 → Settings → Git
- "Connected Git Repository" → Disconnect
- 重新 Connect 到正确仓库

**注意**：切换仓库**会丢失**之前的部署历史（不影响代码本身）。

---

## 步骤 2：检查 Vercel Build Command

Vercel Dashboard → 你的项目 → **Settings** → **General** → **Build & Development Settings**

- **Build Command**: 必须是 `prisma generate && next build`（**手动改**！默认是 `next build`）
- **Install Command**: `npm install` 或 `pnpm install`（看你用啥）
- **Output Directory**: `.next`（默认）
- **Node.js Version**: 22.x（Next.js 16 要求）

---

## 步骤 3：加 9 个环境变量

Vercel Dashboard → 项目 → **Settings** → **Environment Variables**

**注意**：加到 **Production** 环境（用户访问 lvyz.org 用的）。**别**加到 Preview / Development（除非你想 preview 也能用）。

| Name | Value |
|---|---|
| `NEXT_PUBLIC_APP_URL` | `https://lvyz.org` |
| `DATABASE_URL` | `postgres://你的完整新URL` |
| `BETTER_AUTH_SECRET` | `跑 openssl rand -hex 32 拿到 64 字符` |
| `BETTER_AUTH_URL` | `https://lvyz.org` |
| `R2_ACCOUNT_ID` | `40db864c1bacef0f143a3f860112ba40` |
| `R2_ACCESS_KEY_ID` | `0856288b6ac06eb609f5467e85cb987d` |
| `R2_SECRET_ACCESS_KEY` | `9a9ea829c1cefc1d0764e4305f54b5a7b27f1d5fa68828a02a94fe9a673678b9` |
| `R2_BUCKET_NAME` | `lvyzorg` |
| `R2_PUBLIC_URL` | `https://media.lvyz.org` |

**关键**：
- ⚠️ `DATABASE_URL` 用 **rotate 后的新 URL**（不是之前 `sk_JUbzmesrunCK5ExtNZeG6` 那个）
- ⚠️ `BETTER_AUTH_SECRET` 必须**重新生成**（dev 的别用）
- ⚠️ 每个变量加完**点 Save**

---

## 步骤 4：触发 Redeploy

环境变量加完**不会自动**重新部署。你需要：

1. Vercel Dashboard → 项目 → **Deployments** 标签
2. 找最新一次部署 → 右侧 **⋮** 菜单 → **Redeploy**
3. 或：直接 push 一个空 commit 触发

```powershell
cd D:\LvyzWeb\platform
git commit --allow-empty -m "chore: redeploy with new env"
git push
```

**等 1-3 分钟**（Vercel 会自动检测 push → build → deploy）

---

## 步骤 5：首次部署后初始化数据库

⚠️ Vercel build 流程**不会**自动建表（`prisma db push` 不在 build 里）。

**在本地用生产 URL 初始化**：

```powershell
cd D:\LvyzWeb\platform
# 临时把 .env 的 DATABASE_URL 切到生产
$env:DATABASE_URL = "postgres://生产URL"
npx prisma db push --accept-data-loss --schema=./prisma/schema.prisma
npx tsx prisma/seed.ts
# 不需要的话 unset
Remove-Item Env:DATABASE_URL
```

**会创建**：
- 1 个 admin: `admin@lvyz.org` / `lvyz2026` (SUPERADMIN)
- 4 篇示例文章

---

## 步骤 6：验证

部署完成后测：

| URL | 应该看到 |
|---|---|
| `https://lvyz.org/` | 你的主页（吕元卓 + 4 profile + 6 子站卡） |
| `https://lvyz.org/blog` | 博客列表（4 篇文章） |
| `https://lvyz.org/blog/ai-transition-journey` | 文章详情 |
| `https://lvyz.org/login` | 登录页 |

**如果 `/blog` 还是 404**：
- 部署完没等够 1 分钟（Vercel CDN 缓存）→ 等或用无痕模式
- `DATABASE_URL` 填错 → 看 Vercel Logs
- 代码没 push → 重新 git push

---

## 常见错误

### `Prisma Client did not initialize`
→ 检查 `prisma generate` 在 build 里（Build Command）

### `P1001: Can't reach database server`
→ `DATABASE_URL` 不对或 Vercel 不能连到 db.prisma.io

### `401 Unauthorized` 在 /api/auth
→ `BETTER_AUTH_SECRET` 没设或 `BETTER_AUTH_URL` 不是 lvyz.org

### `/blog` 404 但 `/` 200
→ Vercel deploy 的是旧代码，git push 失败

---

## 常见问题

**Q1: 加 env 之后会自动 redeploy 吗？**
不会。要手动 Redeploy 或 push commit。

**Q2: 我能把所有 env 加到 Production + Preview + Development 吗？**
可以，每个变量**勾选** 3 个环境。但 Production 必须有，Preview/Dev 可选。

**Q3: env 改了多久生效？**
Save 后立即生效，但需要 Redeploy 才能用上新值。

**Q4: Redeploy 会丢数据吗？**
不会。只重新 build + 部署代码。数据库在外部，不受影响。

**Q5: 我可以同时 deploy 多个 branch 吗？**
可以，但需要给 Preview env 单独配 DATABASE_URL 等。**建议只配 Production**。

---

## 完整操作时间线

```
1. 改 .env 本地           (2 min) ← 你已经做
2. db push 本地验证        (1 min) ← 你已经做（用 --schema）
3. db seed 本地            (1 min) ← 你已经做
4. git push 代码           (1 min)
5. Vercel 加 9 env         (5 min) ← 现在做
6. Redeploy                (3 min) ← 现在做
7. 首次部署后 db init     (2 min) ← 在本地用生产 URL
8. 验证 lvyz.org/blog      (1 min) ← 完事
```

总时间：~15 分钟（如果你**不**卡在任何一步）

---

## 我可以远程帮你做的

- ✅ 检查 Vercel build 日志（你贴错误信息）
- ✅ 跑 `db:push && db:seed` 连生产 URL（你贴脱敏 URL）
- ❌ 改 Vercel 配置（要你点 UI）

**你**告诉我**当前卡在哪步**：
- "代码还没 push"
- "Vercel env 加完，触发 redeploy 了"
- "Build 失败 + [错误信息]"
- "部署成功但 /blog 404"
- "其他"

我**根据情况**给具体修复。
