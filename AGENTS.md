# AGENTS.md · lvyz.org 项目入口(给后续 AI 工具/agent 看)

> 本文件遵循 OpenCode/Codex/Cursor/Aider 等 AI 工具的 AGENTS.md 规范,会被这些工具在项目打开时**自动加载**。
> 后续任何 agent 接手 lvyz.org 维护,请先读此文件。

---

## 1. 项目速览

**lvyz.org** — 个人主站 + 课程子系统,核心是「**车辆安全 × AI 应用工程师**」的个人品牌站 + 在线学习平台。

- **域名**:lvyz.org(部署在 Vercel,GitHub repo `Newtonxlyz/Uniwebsite`)
- **当前 Next.js 版本**:15.5.19(不是 13 — package.json 里写错了,实际情况见下)
- **数据库**:Prisma + SQLite(开发)/ PostgreSQL(生产,Vercel env 接)
- **认证**:Better Auth(替代老的 NextAuth)
- **课程子系统**:**完全静态 + localStorage**,与 Next.js 应用解耦,可直接双击 `file://` 打开

---

## 2. 用户背景(必须尊重的硬性约束)

**Newtonx** = 一汽大众 车辆安全产品工程师 + 18-19 级华为 Occupant Safety 专家(2026 年 7 月入职鸿蒙智行 BU)。
**Lxecutor** = 用户给 agent 起的代号(Lvyz + Executor)。

### 2.1 工作风格(用户偏好)
- 中文母语,简短直接("挺好的,下一个专题"、"好了,继续")
- 不啰嗦,不要解释显而易见的事
- **公式必须深入推导**(不简化、不跳过),但每个公式配「工程师视角」:这公式表达什么、参数怎么调、为什么这么设计
- 数学不是目的,是 AI 应用的工具

### 2.2 强项目偏好(已沉淀到 User Memory)
| 偏好 | 描述 | 应用时机 |
|------|------|---------|
| **"先填后算"按钮布局** | 所有输入板块下面 + 按钮 sticky 固定底部 | 所有工程工具(碰撞/刚度/NVH/模态) |
| **亮色主题优先** | 默认亮色 `#f8fafc 背景 / #ffffff 面板 / #0f172a 文字`,保留暗色切换 | UI 设计 |
| **批量 JPEG 按板块输出** | JSZip 打包成 zip 下载,不要单一大图 | 截图/导出功能 |
| **E2E 必须真跑** | 改完代码必须 `node <test>.cjs` 跑出真实 pass/fail 数 | 修 bug / 改代码 |
| **KIMI check 工具一比一覆盖源** | "一比一覆盖源"不是"参考" | 修复工具型 bug |
| **sheet 名字要区分** | 正碰 `front_Inputs` / 后碰 `rear_Inputs` | xlsx 工具 |
| **AI 公式/单位 bug 零容忍** | 三件套注释 / 单位链 self-check / 手算典型工况 / `isFinite` 边界断言 | 写任何数学/物理/工程公式 |

### 2.3 沟通习惯
- 短回执如"收到"、"✅"、"OK,继续"
- 不堆 emoji、不列大段步骤清单

---

## 3. 技术栈

| 层 | 技术 | 版本 |
|---|------|------|
| 框架 | Next.js | 15.5.19 |
| UI | React + Tailwind | React 19.2.7 / Tailwind 4.3 |
| 数据库 | Prisma + PostgreSQL/SQLite | prisma 6.1 |
| 认证 | Better Auth | 1.1 |
| Markdown | react-markdown + remark-gfm + rehype-raw | 最新 |
| 数学公式 | KaTeX (CDN) | 0.16.9 |
| 部署 | Vercel | 自动从 git push |
| 内容静态化 | `scripts/build-course.py` | Python |

---

## 4. 文件结构速查

```
D:\LvyzWeb\platform\
├── AGENTS.md                    ← 你在读的
├── README.md                    ← 已写(2026-09-18 同步:版本/课程子系统/项目结构)
├── _archive/                    ← 一次性产物归档(Vercel 抓包 dump、旧 gen/parse 脚本,无引用)
├── package.json
├── vercel.json                  ← 强制 npm install/build
├── docs/
│   └── COURSES-ARCHITECTURE.md  ← 课程子系统深度架构(2-3 天前,已部分过时)
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── scripts/
│   ├── build-course.py          ← Python:生成课程静态 HTML
│   ├── templates/
│   │   ├── course-chapter.html  ← 章节正文模板
│   │   ├── course-flashcards.html
│   │   ├── course-home.html     ← 课程主页(index.html)
│   │   ├── course-mistakes.html
│   │   ├── course-quizzes.html  ← 测验列表(三阶段)
│   │   ├── course-report.html
│   │   └── (Course Package v1:正文在 <course>/contents/,不再有 bodies 模块)
│   ├── add_pinn_subsection_quizzes.py  ← 注入 PINN 子节 quiz-section
│   ├── fix_chapter_title.py     ← 一次性脚本:parseInt 章节命名修复
│   ├── audit_quizzes.py         ← 题库分布统计
│   └── append_css.py            ← CSS 追加工具
├── public/
│   ├── courses/                 ← 课程子系统(完全静态 + 解耦)
│   │   ├── _shared/             ← 11 个共享 JS 模块 + CSS
│   │   │   ├── course-storage.js
│   │   │   ├── course-progress.js
│   │   │   ├── course-flashcard.js  (SM-2 算法)
│   │   │   ├── course-quiz.js       (5 题型)
│   │   │   ├── course-subsection.js (子节进度追踪)
│   │   │   ├── course-notes.js
│   │   │   ├── course-mistakes.js
│   │   │   ├── course-theme.js
│   │   │   ├── course-app.js
│   │   │   ├── course-init.js
│   │   │   └── course-css.css       (含 .course-floating-nav + .quiz-option 等)
│   │   ├── pinn-crash-reduction/   ← PINN 课程(Course Package v1)
│   │   │   ├── course.json          # 课程元数据 SSOT(id/slug/title/learnUrl/level)
│   │   │   ├── contents/            # 章节正文 HTML(唯一事实源,一章一个文件)
│   │   │   ├── index.html
│   │   │   ├── flashcards.html
│   │   │   ├── quizzes.html         ← 3 阶段:学 → 测 → 期末
│   │   │   ├── mistakes.html
│   │   │   ├── report.html
│   │   │   ├── chapter-NN-...html   × 6
│   │   │   ├── quiz-NN-...html      × 6
│   │   │   ├── quiz-final.html
│   │   │   └── data/
│   │   │       ├── chapters.json    # 纯元数据(正文已抽离,不再内联)
│   │   │       ├── flashcards.json  # v1 统一字段:chapterId/front/back
│   │   │       └── quizzes.json     # v1:tf=0/1,fill 必须有答案,大题=short
│   │   └── gn-crash-guide/        ← GNN 课程(69 题 / 7 章 + final 13)
│   │       └── (同上结构,Course Package v1)
│   └── (其他资源:images, embeds 等)
├── src/
│   ├── app/                     ← Next.js App Router
│   │   ├── layout.tsx           ← 全局 layout(LearnFloatingNav 已挂载)
│   │   ├── page.tsx             ← 主页
│   │   ├── (auth)/, (main)/     ← 路由组
│   │   ├── api/                 ← auth / blog / admin / crashai / media / posts
│   │   ├── learn/               ← 课程门户(Next 路由)
│   │   │   ├── courses/page.tsx       ← 课程中心 hub(3 张大卡片整体可点)
│   │   │   ├── pinn-crash/page.tsx   ← PINN 课程门户
│   │   │   ├── gn-crash/page.tsx     ← GNN 课程门户
│   │   │   └── crashai/page.tsx      ← 老 crashAI 课程门户
│   │   ├── crashai/             ← 老 crashAI 详情页(动态 Next 渲染)
│   │   │   ├── page.tsx
│   │   │   ├── cards/page.tsx
│   │   │   ├── safety-training/page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── blog/                ← 博客
│   │   ├── kids-ai/             ← Kids AI 演示
│   │   ├── picturebook/         ← 绘本
│   │   ├── knowledge/           ← 知识库
│   │   ├── knowledge-base/      ← 知识库(与 knowledge 并存,待合并)
│   │   ├── merchandise/         ← 商品
│   │   ├── admin/               ← 后台(博客/绘本/访问权限)
│   │   ├── login/, register/    ← 认证
│   │   └── (其他)
│   ├── components/              ← React 组件
│   │   ├── nav-bar.tsx          ← 顶部导航
│   │   ├── learn-floating-nav.tsx ← /learn/* + /crashai 右下角 FAB
│   │   ├── lesson-content.tsx
│   │   ├── lesson-card.tsx
│   │   ├── markdown.tsx
│   │   ├── story-reader.tsx
│   │   ├── post-editor.tsx
│   │   ├── flashcard.tsx
│   │   └── (其他)
│   ├── lib/
│   │   ├── server-data.ts       ← 加载 lessons 数据
│   │   ├── auth.ts, auth-client.tsx, auth-client-helpers.ts
│   │   ├── data.ts, posts.ts, db.ts
│   │   ├── embeds.ts, utils.ts
│   │   └── storage.ts
│   └── ...
```

---

## 5. 课程子系统核心架构(最易踩坑)

### 5.1 共享 JS 模块(11 个)API 速查

| 模块 | 关键 API | 作用 |
|------|---------|------|
| `course-storage.js` | `get(key, default)`, `set(key, val)`, `del(key)` | localStorage 包装 + JSON 序列化 |
| `course-progress.js` | `setChapterStatus(id, status)`, `get(id)`, `setLectureTime()` | 章节状态(not_started/in_progress/completed)+ 时长统计 |
| `course-flashcard.js` | `start(deckId)`, `review(card, quality 0-5)` | SM-2 间隔重复算法(Anki 算法) |
| `course-quiz.js` | `start(chapterId, mode)`, `answer(qid, val)`, `submit()` | 5 题型:single/tf/multi/fill/short |
| `course-subsection.js` | `init(courseId, chapterId)`, `bindAll()`, `chapterProgressSummary()` | 章节正文中子节 quiz-section 折叠 + 进度追踪 |
| `course-notes.js` | `addNote(chapterId, content)`, `getNotes()` | 章节笔记 |
| `course-mistakes.js` | `recordMistake(qid)`, `getMistakes()` | 错题本 |
| `course-theme.js` | `toggle()`, `get()` | 暗色/亮色切换 |
| `course-app.js` | `renderTopnav(slug, title, active)`, `bindProgress`, `bindNotes`, `bindTimer` | UI 渲染 + 事件绑定 |
| `course-init.js` | `runInline(courseId, chapters, flashcards, quizzes)` | 通用启动器 |
| `course-cloud.js` | `ready(Promise) / syncNow() / mode() / status()` | 云端同步引擎:挂在 CourseStorage.set/remove 后打补丁,11 个模块零改动。页面加载从 URL 解析 courseId → pull(`/api/courses/state`)→ LWW 合并(ts=Date.now)→ push 脏数据。未登录/离线自动降级纯本地 |
| `course-css.css` | (CSS only) | 含 `.quiz-section`, `.subsection-progress`, `.course-floating-nav`, `.quiz-option`, `.quiz-opt-multi`, `.subsection-quiz-intro` 等 |

### 5.2 解耦设计原则(加新课程 0 改 JS)

```
[课程内容数据]  ─→  [章节 HTML 模板]  ─→  [静态 HTML]
   chapters.json         course-chapter.html
   flashcards.json        course-flashcards.html
   quizzes.json           course-quizzes.html
   original.html          (原始 markdown/HTML)
                          course-mistakes.html
                          course-report.html
                                                 │
                                                 ▼
                              [共享 JS 模块自动接管]
                              (检测 .quiz-section, .flashcard, 等等)
```

**关键约定**:
- `courseId = __COURSE_ID__` 占位符在模板中 → build 时替换
- `__CHAPTERS_DATA_PLACEHOLDER__` 等 → inline 嵌入到 HTML 的 `<script>` 中
- 任何带 `class="quiz-section" data-section="..."` 的元素都被 `course-subsection.js` 自动接管
- 任何带 `class="flashcard"` 的元素都被 `course-flashcard.js` 自动接管
- **不要在 JS 里 hardcode 任何课程特定逻辑**

### 5.1b 云端同步(2026-09-19 上线)

- 表:`CourseKv(userId, courseId, key, value:Json, ts:BigInt)`,`@@unique([userId, courseId, key])`,LWW 按客户端 ts
- API:`GET/POST /api/courses/state`(未登录 401;key 必须 `course_` 前缀且含 courseId,防越课写)
- 客户端:`course-cloud.js` 自动从 URL 解析 courseId,所有课程页已注入 script 标签(模板同步改,重建不丢)
- 合并规则:双端冲突(本设备首次同步)服务器为准,本地副本存 `conflict_` 前缀留底;flush 由 meta 驱动(墓碑不在 localStorage 里)
- 覆盖 key 命名不统一:progress 是 `progress_<id>` 前缀式,其余是 `<id>_xxx` —— 同步透明但人看着别扭,格式统一时顺手归一

### 5.3 5 题型支持矩阵

| 题型 | answer 字段 | 渲染(quiz-NN.html) | 渲染(章节正文 quiz-section) |
|------|-----------|--------------------|---------------------------|
| single | `0` (数字索引) | `<button class="quiz-opt">` 点击即判分 | `<div class="quiz-option">` 点击即判分 |
| tf | bool `true`/`false` | 同 single,2 选项 | 同 single,2 选项 |
| multi | 数组 `[0,1,3]` | `<label class="quiz-opt-multi">` + `<input type="checkbox">` + "确认选择"按钮 | **章节正文跳过**(只放 single/tf,更轻量) |
| fill | 字符串答案 | `<textarea>` + "提交答案" | 跳过 |
| short | 字符串答案 | `<textarea>` + "提交答案" | 跳过 |

**章节正文 quiz-section 注入规则**(由 `scripts/add_pinn_subsection_quizzes.py` 实现):
- filter 掉 multi/fill/short
- 只放 single/tf 题目,每节 2 道
- 题目来源是该章 quizData 题目按 h3 顺序分配

### 5.4 题库当前规模

```
PINN (75 题 / 6 章 + final 15):
  single 39 / tf 14 / multi 9 / fill 6 / short 6 + 1 multi final
GNN  (69 题 / 7 章 + final 13):
  single 41 / tf 8  / multi 11 / fill 8 / short 7 + 2 multi final
```

**关键事实**:`scripts/audit_quizzes.py` 可以统计任意题库分布。

---

## 6. 部署流程(Vercel 自动)

```bash
# 本地工作流
git add -A
git commit -m "<type>(<scope>): <subject>"
git push origin main    # 自动触发 Vercel build + deploy
```

### 6.1 Vercel 配置(vercel.json)
```json
{
  "buildCommand": "npm install && npm run build",
  "installCommand": "npm install"
}
```
强制使用 npm,绕开 pnpm-lock.yaml 的兼容问题(以前 pnpm 会失败)。

### 6.2 Vercel API 查询部署状态

```powershell
$token = (Get-Content verceltoken.txt -Raw).Trim()
$headers = @{Authorization = "Bearer $token"}
$r = Invoke-RestMethod `
  -Uri "https://api.vercel.com/v6/deployments?limit=1&target=production" `
  -Headers $headers -Method GET -TimeoutSec 15
$d = $r.deployments[0]
Write-Host "STATE: $($d.state) | UID: $($d.uid)"
```
- `STATE`: BUILDING / READY / ERROR
- `verceltoken.txt` 在项目根(`.gitignore` 内)

### 6.3 Vercel build 时间
- 平均 130-160 秒
- 失败时 `build.log` 留在 Vercel 部署详情页

---

## 7. PowerShell 注意事项(必读!)

1. **写文件用 UTF-8**:Write/Out-File 默认 GBK → 中文乱码。用 `[IO.File]::WriteAllText($path, $content, [Text.UTF8Encoding]::new($false))`。
2. **路径分隔符**:Windows 用 `\`,Node/Python 用 `/` 自动适配。
3. **here-string 转义问题**:含 CSS/HTML 中 `}` 或 `)` 的 here-string 会让 PowerShell 报错。改用 Python 脚本写文件。
4. **删除用 mavis-trash**:不要 `Remove-Item -Recurse`,自动移到 OS 回收站。
   ```powershell
   C:\Users\lvyua\.minimax\bin\mavis-trash.cmd <path>
   ```
5. **不要用 `&&`**:`cd dir && cmd` 在 PowerShell 里直接挂掉。用 `;` 或 `if ($?)`。
6. **不要用 `head`/`tail`/`grep`/`wc`**:用 `Select-Object -First`, `Select-String`, `Measure-Object`。
7. **正则模式单引号**:`Select-String -Pattern 'foo|bar'` 不要用双引号,PowerShell 会先解析 `$var`。

---

## 8. 关键约定 / 已知坑

### 8.1 章节命名 parseInt 修复
**坑**:`ch.id.slice(-2)` 对 `"01-tech-foundations"` 取 `"ns"`,显示「第 ns 章」。
**修复**:`parseInt(ch.id, 10)`。脚本 `scripts/fix_chapter_title.py` 自动修。
**新加章节时**:必须在 `chapters.json` 给每个章节加 `subtitle / estimatedMinutes / level / audience / objectives / prerequisites`,否则 `/learn/<slug>` 渲染 undefined。

### 8.2 KaTeX 公式渲染
- 每个课程 HTML head 必须含:
  ```html
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" crossorigin="anonymous">
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js" crossorigin="anonymous"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js" crossorigin="anonymous"
    onload="renderMathInElement(document.body, {delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false});"></script>
  ```
- **不要换 MathJax**(慢 ~1 MB)。KaTeX 90 KB CDN 即可。
- 模板:`course-chapter.html`, `course-quizzes.html`, build-course.py 的 `QUIZ_PAGE_TPL` 都已加。

### 8.3 Sticky / Floating 返回按钮
**静态课程页**(chapter-XX.html / quiz-XX.html / quizzes.html / flashcards.html):
- 右下角 4 个按钮:主页 / 课程中心 / 课程页 / 章节地图(或测验列表)
- CSS class:`.course-floating-nav` + `.cfn-btn`,模板里 inline JS 创建
- href 用相对路径 `../../../` 跳转 Next.js 路由

**Next.js 路由页**(`/learn/*`, `/crashai/*`):
- 全局 `<LearnFloatingNav>` 组件在 `src/app/layout.tsx` 挂载
- 路径前缀判断:`pathname.startsWith('/learn/') || pathname === '/crashai' || pathname?.startsWith('/crashai/')`

### 8.4 multi 题型渲染细节
- quiz-NN.html:**所有**题型都能用(multi → checkbox + 确认按钮)
- 章节正文 quiz-section:**只用 single/tf**(filter 掉了 multi)
- 模板代码见 `scripts/build-course.py` 的 `renderOptions` 函数 ~L227 起

### 8.5 浏览器缓存
用户经常报告"线上没改",**99% 是缓存**:
- `Ctrl+Shift+R`(Windows/Linux)/ `Cmd+Shift+R`(Mac) 强制刷新
- 或 Vercel edge cache miss,加 `?cb=<timestamp>` cache-bust query
- 重要变更后建议等 5 分钟再让用户验证(Vercel CDN 同步)

---

## 9. 数据源 / 内容输入

### 9.1 课程源材料(用户提供的 Markdown / HTML)

```
D:\LvyzWeb\testPINN\
├── PINN仿真降阶_report.md            (51KB UTF-8/GBK 混合,已切 6 章)
├── PINN仿真降阶_evidence.md          (39 条证据)
├── GNN碰撞降阶学习指南.html         (270KB 自包含,完整 GNN 课程)
├── GNN碰撞降阶学习指南_part1-4.html  (重复文件,不用)
└── _plan.md                          (调研记录,不入 wiki)
```

**注意**:这些是 git 外文件,只在本地。

### 9.2 章节正文(Course Package v1 起)
- **唯一事实源:`<course>/contents/<ch-id>.html`**(一章一个文件,含 quiz-section 由 PINN 后注入)
- 旧源已归档:`_archive/course-v1-migration/`(_chapter_bodies.py / gn-original.html)
- 加新课 SOP:写 contents/ + 三份 data json → `validate_course.py` → `build-course.py <slug>`

---

## 10. 常用命令速查

```bash
# 1. 重建 PINN 课程所有静态 HTML
cd D:\LvyzWeb\platform
cd scripts
python build-course.py pinn-crash-reduction pinn-crash-reduction pinn-crash "AI+DOE+PINN" "https://lvyz.org/learn/pinn-crash" _chapter_bodies
python ..\scripts\fix_chapter_title.py
python ..\scripts\add_pinn_subsection_quizzes.py
cd ..

# 2. 重建 GNN 课程(无 chapter body)
cd scripts
python build-course.py gn-crash-guide
cd ..

# 3. 审计题库分布
python scripts\audit_quizzes.py

# 4. 部署
git add -A; git commit -m "..."; git push origin main

# 5. 等 Vercel 构建
Start-Sleep -Seconds 130
$token = (Get-Content verceltoken.txt -Raw).Trim()
$headers = @{Authorization = "Bearer $token"}
Invoke-RestMethod -Uri "https://api.vercel.com/v6/deployments?limit=1&target=production" -Headers $headers

# 6. 浏览器验证(Chrome DevTools MCP)
# new_page → navigate_page(url) → evaluate_script → take_screenshot
```

---

## 11. 测试 / 验证习惯

### 11.1 修代码后必须真跑

用户原话:**"E2E 必须真跑(不能'宣称'修复但代码没改)"**。每次改完必须:
1. `python build-course.py ...` 真跑(确认无报错)
2. `git push` 真部署
3. `curl / Invoke-WebRequest` 真请求(确认 200 + 字段存在)
4. **Chrome DevTools MCP** 真打开(确认渲染、按钮、交互都正常)

### 11.2 修 AI 公式 bug 的防御清单

**用户原话**:"已经有很多次出现了核心算法/数学公式/单位问题"。

修任何公式必须做 4 件事:
1. **三件套注释**:来源 + 物理含义 + 单位(写在代码上方)
2. **单位链 self-check**:确认每个变量单位一致(kg-m-s vs ton-mm-...)
3. **手算典型工况**:用真实数值代入公式算一遍,跟代码对照
4. **isFinite 边界断言**:除零 / 负数 / 极大值 sanity check

源标准:`// Source: Shigley / MIL-HDBK / 等`

---

## 12. Recent commits(最近 25 条,从最新到旧)

```
6d7beb1  docs(agents): 写一份 AGENTS.md 项目入口(深度档案)
ab06e5d  fix(courses): 章节正文 quiz-option 按钮样式 + sticky/floating 返回按钮
296d954  fix(courses): 公式渲染 + 章节正文 quiz 多选支持
6463e9b  fix(courses): 章节命名修正 + 子节小测默认折叠
2c8c4e7  refactor(courses): quizzes.html 重构成 3 阶段学习流程
dcccaae  fix(courses): AI+DOE+PINN 课程全方位重构
f88e0d7  feat(courses/pinn): 给 PINN 6 章注入小节检测题(按 h3 顺序分题)
c352537  fix(courses): 课程主页章节数改读 chapters 数组实际长度
70d529d  feat(courses): static topnav 加课程中心链接
4a2db13  feat(courses): 子节进度追踪 + 小节测验折叠交互
01b2f78  refactor(courses): crashAI 并入 /learn/courses · 视觉统一三门户
f0b4508  fix(courses): 把 icon 函数改成 iconName 字符串
cfb42b8  fix(deploy): 加 vercel.json 强制 npm install/build
f2d712a  fix(deploy): 删除 pnpm-lock.yaml,强制 Vercel 用 npm install
6a5c587  fix(build): 去掉 prisma db push,schema 未变更时 Vercel 无需
f3d0e57  refactor(courses): 课程大改造 · 顶级 /learn/courses 板块 + 讲解模板
f6bb78d  feat(nav): Lvyz 后面加水平子站导航条 + hover 弹出该子站 list
912d163  fix(courses/gn): 章节卡点击 404 (chapter-undefined.html)
d389d01  fix(courses): 主页'加载中...'卡死 + continueBtn 链接 404
eeb93a6  feat(courses/gn): 部署源 HTML 一比一原始版(270 KB)
2cb1417  fix(courses): 章节正文只显示'待补充',从源 markdown 重切
0dc6d3f  fix(courses): prev/next 章节链接多拼了 .html(再次)
5c02ec8  fix(courses): 章节链接补 chapter- 前缀
7c16a20  feat(courses): PINN + GNN 课程子系统上线,完全解耦的 8 JS 模块架构
b3be8ea  feat(nlfea): 整合 NLFEA 学习平台到 lvyz.org
266d37e  Revert "feat(crashai): 学习进度跟踪 (DB+API+UI)"
```

---

## 13. AI 公式 / 单位 bug 历史案例

**问题模式**(用户多次反馈):
- `parseInt('01') → 1` 字符错位 → 显示"第 ns 章"
- `slice(-2)` 截错位置
- KaTeX 未加载 → 数学符号 raw 显示
- multi 题按 single 题判分 → 错乱
- 章节卡片 `.map((c, idx))` 用 `c.title` 字符串模板而不是反引号 → 不解析

**防御**:
- 任何字符串模板用**反引号** + `${expr}`,不要单引号
- 任何字段访问先用 `console.log(typeof)` 或 `getBoundingClientRect()` 验证类型
- 任何数学公式写到代码里,必须 4 件套注释(来源/含义/单位/边界)

---

## 14. 用户记忆约定(Mavis memory)

为了下次开新会话能延续本项目的认知,以下条目已写入 User Memory:

```
- "AI+DOE+PINN" 课程中心 (commits dcccaae / 2c8c4e7 / 296d954 / ab06e5d)
- 章节命名 parseInt 修复 (6463e9b)
- 子节小测折叠 (6463e9b)
- KaTeX 公式渲染 (296d954)
- sticky/floating 返回按钮 (ab06e5d)
- multi checkbox + 确认按钮 (296d954 / ab06e5d)
- AI 公式/单位 bug 零容忍 + 三件套注释 (历史)
- 简单够用就好,别堆依赖链 (历史)
```

**写入约定**:每次大改造后,把"项目级"的事实用 `mavis memory append` 写到 User Memory,而不是 Project Memory(因为 Project Memory 只对本项目有效,User Memory 跨项目同步用户偏好)。

---

## 15. 紧急救援(用户报告问题时的标准响应)

### 15.1 「线上没改」 / 「还是没看到」
1. **强刷**:`Ctrl+Shift+R`
2. **Vercel CDN 缓存**:加 `?cb=<unix_timestamp>` 强制 cache miss
3. **Vercel 部署状态**:用上面的 API 查询,确认 `state: READY` + UID = 期望的 commit
4. **如仍未变**:检查 commit 是否 push(本地 git log HEAD vs origin/main)
5. **检查浏览器控制台**:DevTools → Console 看 JS 报错

### 15.2 「报错了」 / 「X 不能用」
1. **抓真错误**:DevTools → Console → 复制 stack trace
2. **检查线 HTML**:`Invoke-WebRequest $url | grep -E 'error|undefined'`,或 Chrome DevTools MCP `evaluate_script`
3. **不要靠"应该是这样"推断**,要靠实际 stack trace 推理

### 15.3 「公式不渲染」 / 「题目显示错」
1. KaTeX CDN 可访问性 → 看 Network 是否 200
2. 公式定界符 → 确认是 `$$...$$` 而不是 `\(...\)`(KaTeX 0.16.9 auto-render 的默认 delimiters)
3. 题目类型 → `scripts/audit_quizzes.py` 看是否真的渲染出 checkbox

---

## 16. 项目级 AGENTS.md 维护

本文档**会过期**。下次大改造后,更新要点:
- Section 5(架构):若新增共享 JS 模块或题型,补全 API 速查表
- Section 8(已知坑):新增遇到的问题和修复方案
- Section 12(commits):保留最近 25 条,过期删掉
- Section 14(memory 约定):保留已写入 User Memory 的事实

更新后 commit 信息用 `docs(agents): 同步项目状态至 commit <hash> + 新增/修复 <feature>`。

---

## 17. 与其他 agent 协作的提示

如果这是一个 multi-agent session(子任务),你需要:
1. **不要改 src/lib/auth.ts 和 prisma/schema.prisma** — 用户认证核心,改坏了要重新登录
2. **不要 commit `.env` 或 `verceltoken.txt`** — 都在 `.gitignore`
3. **大文件 (>250MB)**:Vercel output tracing 限制,改 `next.config.js` 加 `outputFileTracingExcludes`
4. **新建博客/章节** 优先用现有的 React 组件,不要重新发明样式
5. **不要拆掉 LearnFloatingNav** — 用户依赖它做跨页面跳转

---

**TL;DR**:这是一个 Next.js + Vercel 部署的个人品牌站,核心是课程子系统(11 JS 模块 + 2 门静态课 + KaTeX 公式渲染 + multi 题型)。所有课程 JS 模块解耦,加新课程 0 改 JS。改完代码必须真跑真部署真验证,不能"宣称修复"。PowerShell 环境,UTF-8 写入。commit message 中文,git push 触发 Vercel 自动部署。

**项目级文档维护者**:每次大改造后,把变更点更新到 Section 5 / 8 / 12 / 14。