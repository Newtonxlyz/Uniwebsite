# lvyz.org 课程子系统架构 (Courses Subsystem)

> **状态**: v1.0 设计阶段 → v2.0 实施中 (2026-09-16)
> **位置**:`public/courses/` + `src/app/learn/`
> **维护者**: Newtonx(产品/内容) + Coder agent(开发协作)
> **关联文档**: `../PLATFORM-HANDOFF.md` §4 (NLFEA)、本文档

---

## 0. 30 秒概览

lvyz.org **课程子系统**是一个**纯静态** + **客户端 localStorage** 的可复用学习平台。**所有 JS 模块与课程内容完全解耦** —— 加新课程只需要新建一个目录 + 写 JSON 数据,不动任何 JS 代码。

**核心价值**:
- 知识库(查询) ≠ 课程(系统学习),两个独立板块
- 每个用户可"拥有"自己的学习进度(跨浏览器不共享,本地优先)
- 可离线:整门课 zip 发给任何人

---

## 1. 课程 vs 知识库

| 维度 | 知识库 (`public/knowledge/`) | 课程 (`public/courses/`) |
|---|---|---|
| **URL** | `/knowledge-base` | `/learn/<course-slug>` |
| **目的** | 随时查询 | 系统掌握 |
| **内容形态** | 单篇文档 /规范 / 摘要 | 多章节 / 顺序学 / 实战 |
| **交互** | Fuse.js 搜索 + 浏览 | 章节导航 + 进度 + 闪卡 + 测验 |
| **学习曲线** | 短 (5-15 分钟) | 长 (5-30 小时) |
| **示例** | TEBS LAH 系列 79 篇 | `pinn-crash-reduction` (6 章 + 35 卡) |
| **权限** | WikiAccess 白名单(私有) | 公开(任何人可学) |
| **数据** | search-index.json(只读) | localStorage(可写) |

---

## 2. 课程子系统架构图

```
┌─────────────────────────────────────────────────────────┐
│ Next.js (服务端) — 仅 1 个门户页                            │
│ src/app/learn/<course-slug>/page.tsx                      │
│   - 渲染课程卡片(简介 + 进度 + 大纲)                  │
│   - 4 个 CTA:开始学习 / 闪卡 / 测验 / 报告            │
│   - 与 NavBar 集成                                       │
└────────────────────────┬────────────────────────────────┘
                         │ link 跳转
                         ▼
┌─────────────────────────────────────────────────────────┐
│ 静态资源(纯 HTML/CSS/JS)                                    │
│ public/courses/<course-slug>/                             │
│   ├── index.html                    ← 课程主页             │
│   ├── 01-chapter-slug.html          ← 章节页(命名 kebab) │
│   ├── 02-chapter-slug.html                                  │
│   ├── data/                                                │
│   │   ├── chapters.json             ← 章节元数据         │
│   │   ├── flashcards.json           ← 闪卡数组             │
│   │   └── quizzes/                                       │
│   │       ├── 01-quiz.json          ← 每章 1 个测验        │
│   │       ├── 02-quiz.json                                 │
│   │       └── final-exam.json       ← 期末综合考试         │
│   └── assets/                                              │
│       ├── imgs/                                            │
│       └── svgs/                                            │
└────────────────────────┬────────────────────────────────┘
                         │ 引用
                         ▼
┌─────────────────────────────────────────────────────────┐
│ 共享 JS 模块(所有课程复用)                                │
│ public/courses/_shared/                                    │
│   ├── course-storage.js          ← localStorage 抽象      │
│   ├── course-progress.js         ← per-chapter 进度      │
│   ├── course-flashcard.js        ← SM-2 间隔重复        │
│   ├── course-quiz.js             ← 测验引擎 5 题型       │
│   ├── course-mistakes.js         ← 错题本              │
│   ├── course-notes.js            ← 笔记              │
│   ├── course-analytics.js        ← 报告 / 数据导出    │
│   ├── course-app.js              ← 通用渲染 / 绑定    │
│   └── course-theme.js            ← 主题 / 频闪防护     │
└─────────────────────────────────────────────────────────┘
```

---

## 3. 共享 JS 模块 (11 个)

所有模块都是**纯前端**,通过 `window.Course*` 全局暴露,**不依赖任何 npm 包**。

### 3.1 `course-storage.js` (P0)

**职责**: 抽象 localStorage,所有模块都用它读写。

**API**:
```js
CourseStorage.get(key, fallback)       // 读
CourseStorage.set(key, value)           // 写
CourseStorage.remove(key)               // 删
CourseStorage.exportAll(courseId)       // 导出 JSON
CourseStorage.importBackup(json)        // 恢复
CourseStorage.clearAll()                // 清空
```

**localStorage key 规范**:
- `course_progress_<courseId>` — 课程进度
- `course_notes_<courseId>_<chapterId>` — 笔记
- `course_flashcards_<courseId>` — 闪卡评分
- `course_mistakes_<courseId>` — 错题
- `course_quiz_<courseId>_<chapterId>` — 测验历史

---

### 3.2 `course-progress.js` (P0)

**职责**: 学习进度跟踪(章节 / 节 / 时长)。

**API**:
```js
CourseProgress.init(courseId, chaptersJson)
CourseProgress.get(chapterId, sectionId?) → {status, completedAt, seconds}
CourseProgress.setSection(chapterId, sectionId, status)
CourseProgress.setChapterStatus(chapterId, status) // not_started|in_progress|completed
CourseProgress.addStudySeconds(chapterId, seconds)
CourseProgress.summary() → {completedChapters, totalSeconds, streak, ...}
CourseProgress.startTimer(chapterId) / stopTimer()
```

**数据模型**:
```js
{
  courseId: "pinn-crash-reduction",
  startedAt: ISO,
  lastVisit: ISO,
  totalSeconds: 18900,
  chapters: {
    "01-tech-foundations": {
      status: "completed",
      completedAt: ISO,
      seconds: 4500,
      sections: { "1.1": "completed", "1.2": "completed", ... }
    },
    ...
  },
  stats: { chaptersCompleted: 2, streak: 5, ... }
}
```

**计时策略**: 章节页加载 → startTimer; 离开 → stopTimer + addStudySeconds。

---

### 3.3 `course-flashcard.js` (P0)

**职责**: 闪卡 + SM-2 间隔重复算法。

**API**:
```js
CourseFlashcard.init(courseId, flashcardsJson)
CourseFlashcard.getAll() → 全部卡
CourseFlashcard.getDue() → 今日到期
CourseFlashcard.mark(cardId, rating) // again|hard|good|easy
CourseFlashcard.summary() → {total, mastered, learning, due}
CourseFlashcard.reset()
```

**SM-2 算法** (SuperMemo 2):
- rating 1 (Again): 重置,明天复习
- rating 2 (Hard): interval × 1.2
- rating 3 (Good): 标准 SM-2 公式
- rating 4 (Easy): interval × 1.3

每次评级更新 `easeFactor`,最低 1.3。

---

### 3.4 `course-quiz.js` (P0)

**职责**: 测验引擎,支持 5 种题型。

**API**:
```js
CourseQuiz.init(courseId, quizJson)
CourseQuiz.start(chapterId) → 开始测验
CourseQuiz.answer(questionId, answer) → 即时反馈
CourseQuiz.submit() → 总分 + 通过/未通过
CourseQuiz.getMistakes() → 错题列表
CourseQuiz.getAttempt(chapterId) → 历史最高分
```

**5 种题型**:
1. `single` — 单选
2. `multi` — 多选
3. `tf` — 判断(对/错)
4. `fill` — 填空(文本匹配)
5. `short` — 简答(自评对照)

**题目 schema**:
```js
{
  id: "q3-1",
  type: "single",
  difficulty: "easy|medium|hard",
  stem: "HOMS-PINN 的核心创新是?",
  options: ["...", "...", "...", "..."],  // single/multi/tf
  answer: 1,                               // single/multi:索引;tf:0/1;fill:字符串
  explanation: "HOMS-PINN 通过多尺度渐近分析...",
  references: ["chapter:3.2"],
  tags: ["HOMS-PINN", "多尺度"]
}
```

**通过标准**: 70%(可配)。**最多 3 次**(防作弊)。

---

### 3.5 `course-mistakes.js` (P1)

**职责**: 错题自动收集 + 重做 + 标记掌握。

**API**:
```js
CourseMistakes.init(courseId)
CourseMistakes.add(courseId, chapterId, question, userAnswer, correctAnswer)
CourseMistakes.getAll() → 错题列表
CourseMistakes.redo(questionId) → 标记为已掌握
CourseMistakes.summary() → {total, mastered, byChapter}
```

---

### 3.6 `course-notes.js` (P0)

**职责**: 笔记(每章节独立),仿 NLFEA 模式。

**API**:
```js
CourseNotes.init(courseId)
CourseNotes.add(chapterId, content, tags?)
CourseNotes.getAll(chapterId) → 笔记数组
CourseNotes.remove(noteId)
CourseNotes.search(query) → 全文搜索
```

---

### 3.7 `course-analytics.js` (P1)

**职责**: 学习报告 + 数据导出。

**API**:
```js
CourseAnalytics.generateReport(courseId) → 报告对象
CourseAnalytics.exportJSON(courseId) → 下载 JSON 文件
CourseAnalytics.downloadMistakesCSV(courseId)
```

**报告包含**:
- 完成度环图
- 章节掌握度雷达图(SVG)
- 累计时长 + 本周时长 + streak
- 闪卡统计
- 测验平均分 + 错题数

---

### 3.8 `course-app.js` (P0)

**职责**: 通用渲染 + 绑定。提供所有页面的标准 UI 组件。

**导出**:
```js
CourseApp.renderCourseHome(json)        // 课程主页布局
CourseApp.renderChapterPage(json)      // 章节页布局
CourseApp.statusButtonsHTML(slug, status)  // 3 状态按钮
CourseApp.notesHTML(chapterId)          // 笔记区 HTML
CourseApp.bindProgress(slug)            // 绑定章节状态切换
CourseApp.bindTimer(chapterId)          // 启动/停止计时器
```

---

### 3.9 `course-theme.js` (P0)

**职责**: 主题切换(亮/暗) + 频闪防护。

**API**:
```js
CourseTheme.init()                       // 读取用户偏好
CourseTheme.toggle()                     // 切换
CourseTheme.set(mode)                    // light|dark|auto
CourseTheme.isLight()                    // 当前是否亮色
```

**防频闪**: 不使用 `backdrop-filter` + fixed radial-gradient(已在 NLFEA 验证)。

---

### 3.10 `course-bookmarks.js` (P2 远期)

段级书签收藏,跳转到指定段。

### 3.11 `course-router.js` (P0)

章节跳转 + 状态管理 + URL query 处理。

---

## 4. 课程目录结构(标准模板)

每门课是**自包含**目录,可单独打包。

```
public/courses/<course-slug>/
├── index.html                       ← 课程主页
├── 01-chapter-slug.html            ← 章节页(kebab-case)
├── 02-chapter-slug.html
├── ...
├── data/
│   ├── chapters.json                ← 章节元数据 + 顺序
│   ├── flashcards.json              ← 闪卡数组
│   ├── quiz-meta.json               ← 测验配置(通过标准、答题次数)
│   ├── quizzes/
│   │   ├── 01-quiz.json             ← 每章 1 个测验(文件名对齐章节号)
│   │   ├── 02-quiz.json
│   │   ├── ...
│   │   └── final-exam.json          ← 期末综合考试
│   └── evidence.json                ← 证据库(可选,PINN 课程有)
└── assets/
    ├── imgs/                        ← 章节插图
    └── svgs/                        ← 重画的图表
```

---

## 5. 复用约定(添加新课程)

```js
// 1. 在 public/courses/ 新建课程目录
// 2. 写 chapters.json
// 3. 写 flashcards.json
// 4. 写 quizzes/01-quiz.json 等
// 5. 写 index.html (用 CourseApp.renderCourseHome)
// 6. 写 01-chapter-slug.html (用 CourseApp.renderChapterPage)
// 7. 在 src/app/learn/ 新建 page.tsx (客户端门户)
// 8. 更新 NavBar / 主页(可选)
// 9. 完成!无需改任何 JS 模块
```

---

## 6. Next.js 集成

### 6.1 路由

```
src/app/learn/
├── nlfea/page.tsx              ← 已存在(NLFEA 离线版)
├── pinn-crash/page.tsx          ← 新增
├── gn-crash/page.tsx            ← 新增
└── page.tsx                      ← "课程中心"聚合(可选)
```

### 6.2 模板 (page.tsx)

```tsx
"use client";
import Link from "next/link";
// 显示课程卡片 + 进度 + 入口(纯展示,不交互)
export default function PinnCrashPortal() {
  return (
    <div className="...">
      <Link href="/courses/pinn-crash-reduction/index.html"
            target="_blank" rel="noopener">
        开始学习 →
      </Link>
    </div>
  );
}
```

### 6.3 NavBar

`SUBSITES` 数组添加课程入口(沿用子站模式):

```tsx
{ href: "/learn/pinn-crash", label: "PINN", icon: Brain, desc: "AI+DOE+PINN 仿真降阶" }
```

---

## 7. 安全 / 限制

| 项 | 限制 | 原因 |
|---|---|---|
| 单课程大小 | < 5 MB | Vercel 函数 250 MB 限制下留余量 |
| 总课程数 | < 20 | public/ 总大小可控 |
| localStorage | 5-10 MB/域 | 浏览器原生限制 |
| 闪卡数 / 课 | < 100 | 复习计划性能 |
| 测验题数 / 章 | < 30 | 学习曲线合理 |

---

## 8. 已知暗坑

| # | 坑 | 解决 |
|---|---|---|
| 1 | **`localStorage` file:// 下部分浏览器禁用** | NLFEA 已验证 Chrome/Edge OK,Firefox 默认禁用 |
| 2 | **`backdrop-filter` Edge 全屏频闪** | 不使用(见 course-theme) |
| 3 | **SM-2 interval 暴涨失控** | `easeFactor` 最低 1.3 限制 |
| 4 | **测验答错自动跳错题本 → 挫败感** | 答对 1 次即从错题本移除 |
| 5 | **跨浏览器 localStorage 不共享** | 一键 JSON 导入导出 |
| 6 | **进度 100% 后如何"复习"** | 重新点章节进入"复习模式"(可显示掌握度) |

---

## 9. 测试清单

添加新课程后必须验证:

- [ ] 课程主页显示正确大纲 + 进度
- [ ] 每章节可标记"已完成"
- [ ] 闪卡翻面 + 4 档评分 → SM-2 正确更新
- [ ] 章节测验 5 种题型都能用
- [ ] 错题自动加入错题本
- [ ] 答对 1 次后从错题本移除
- [ ] 笔记保存 + 刷新后还在
- [ ] 数据导出 JSON 可下载
- [ ] 数据导入 JSON 恢复
- [ ] 主题切换(亮/暗)
- [ ] 移动端响应式(手机能看)

---

## 10. 给新 agent 的协作建议

1. **优先阅读本文档 + `PLATFORM-HANDOFF.md`**
2. **加新课程无需改 JS 模块**: 新建目录 + 写 JSON + 写 HTML
3. **课程子系统独立于 NLFEA**: 共享 localStorage 但 key 前缀不同(`course_` vs `nlfea_`)
4. **不要直接改 `_shared/`**: 修改前先看是否影响现有课程(用 grep 测试)
5. **新题型/新卡片格式先在 `course-quiz.js` 扩展**: 设计时考虑向后兼容

---

**版本**: v1.0 (2026-09-16)
**最后维护**: Newtonx + Coder agent
**仓库**: github.com/Newtonxlyz/Uniwebsite