# NLFEA 本地学习平台 v3

> **Introduction to Nonlinear Finite Element Analysis**
> 教材：Nam-Ho Kim, Springer 2025, 507 页 · 6 章 49 小节
> **本地离线版** · 零依赖 · 纯 HTML/CSS/JavaScript · 含 PDF 关键页面渲染图

---

## 📚 平台包含什么

| 模块 | 路径 | 功能 |
|---|---|---|
| **课程地图** | `index.html` | 6 章进度一览 + 4 大功能入口 + 数据导入导出 |
| **课程正文** | `lesson/ch1.html` ... `ch6.html` | 第 1-6 章系统课程（含 PDF 关键页面 + 公式推导 + 例子） |
| **闪卡复习** | `flashcards.html` | 46 张闪卡 / 翻面 / 4 档评分 / 进度记录 |
| **综合考试** | `exam.html` | 20 题选择题 / 90 分及格 / 交卷评分 + 解析 |
| **数据总览** | `review.html` | 全部进度 + 笔记 + 闪卡统计 + JSON 导入导出 |

### 6 章内容（PDF 嵌入页面渲染图 + 完整公式）

- **第 1 章**（详）：连续体力学 + 张量 + Hooke + 最小势能 + 有限元（**12 渲染图**）
- **第 2 章**（详）：4 大非线性 + Newton-Raphson + 收敛判据 + MATLAB（**11 渲染图**）
- **第 3 章**（详）：几何非线性 + 变形梯度 + 极分解 + 超弹性（**11 渲染图**）
- **第 4 章**（详）：弹塑性 + 返回映射 + von Mises + 客观应力率（**11 渲染图**）
- **第 5 章**（详）：接触 + Lagrange / 罚函数 / 摩擦（**8 渲染图**）
- **第 6 章**（详）：动力学 + CDM / Newmark / 显式 vs 隐式（**5 渲染图**）

合计 **60 张 PDF 关键页面渲染图 + 56 张 PDF 嵌入图**（共 11.36 MB）。

---

## 🚀 怎么用（30 秒上手）

### 1. 打开（任何一种）
- **方法 A**：双击 `index.html`，浏览器打开
- **方法 B**：直接拖入浏览器
- **方法 C**：手机用文件管理器打开

> ⚠️ 推荐用 **Chrome / Edge / Firefox** 最新版。
> ⚠️ 第一次必须从 `index.html` 进入（其他页是子页），相对路径会冲突。

### 2. 开始学习
- 在首页点任意章节 → 进入课程
- 课内：标记状态（未开始 / 进行中 / 已完成）+ 添加笔记 + 学习计时
- 课内有 **PDF 关键页面渲染图** + **公式 + 例子 + 习题**，可以不需要再带 PDF

### 3. 复习巩固
- **闪卡**：翻面看答案 → 给掌握度（再来/困难/掌握/简单）
- **考试**：20 题单选，90 分及格，含详细解析
- **总览**：看所有进度 + 全部笔记 + 备份导出

### 4. 数据备份
- **导出 JSON**（总览页底部）：下载 `nlfea-backup-{日期}.json`
- **导入 JSON**：回到任何设备，导入即恢复所有数据

---

## 💾 数据存哪里

所有数据存在浏览器 `localStorage`，**键前缀 `nlfea_`**：

| Key | 内容 |
|---|---|
| `nlfea_progress_ch1` ... `ch6` | 每章 {status, minutes, lastVisit} |
| `nlfea_notes_ch1` ... `ch6` | 每章笔记数组 |
| `nlfea_flashcards_*` | 闪卡掌握评分 |
| `nlfea_exam_best_score` | 考试最高分 |

**容量**：localStorage 通常 5-10MB，本平台所有数据 < 1MB。

**生命周期**：
- ✅ 不限次重启
- ✅ 关闭浏览器保留
- ⚠️ 清浏览器缓存会丢
- ⚠️ 隐私模式不开留存
- 🔧 推荐每 1-2 周导出 JSON 备份

---

## 📁 目录结构

```
nlfea-course/
├── index.html              # 首页（从这里进入）
├── flashcards.html         # 闪卡
├── exam.html               # 考试
├── review.html             # 总览
├── README.md               # 本文件
├── css/
│   └── style.css           # 全局样式（浅色 + 高对比度，无 backdrop-filter）
├── js/
│   ├── storage.js          # NLStorage（localStorage + 导入导出）
│   ├── progress.js         # NLProgress（3 状态 + 计时）
│   ├── notes.js            # NLNotes（笔记增删改查）
│   ├── flashcard.js        # NLFlashcard（4 档评分）
│   ├── app.js              # NLApp（章节渲染 + data 装载）
│   └── inline-data.js      # 内嵌数据（25 KB）- 双击 file:// 也能用
├── data/
│   ├── chapters.json       # 6 章结构（49 小节）
│   ├── flashcards.json     # 46 张闪卡
│   └── exam.json           # 20 道考试题
├── lesson/
│   ├── ch1.html ... ch6.html  # 6 章课程正文（含 PDF 渲染图）
└── assets/
    ├── manifest.json       # PDF 图片清单
    ├── img/                # PDF 原图（56 张）
    └── pages/              # PDF 关键页面渲染图（60 张）
```

---

## 🎯 设计原则

1. **零依赖**：纯静态 HTML + CSS + JS，无 npm、无 webpack、无任何构建
2. **离线优先**：断网、可移动、可 U 盘拷走
3. **隐私优先**：数据全在你本机，不上传任何服务器
4. **可备份**：JSON 一键导入导出
5. **跨设备**：JSON 通用，可在任何浏览器使用
6. **响应式**：手机 / 平板 / 桌面都能用
7. **浅色 + 高对比度**：长时间阅读不刺眼（深色主题自动适配系统设置）
8. **频闪修复**：去掉了 backdrop-filter 和 fixed radial-gradient

---

## 🧪 测试清单

打开 `index.html` 后检查：

- [ ] 首页能看到 6 章卡片
- [ ] 点击任一章能进入对应课程（看到 PDF 图片）
- [ ] 在课程内能切换状态（未开始/进行中/已完成）
- [ ] 添加笔记并保存，刷新后笔记还在
- [ ] 闪卡能翻面、评分正确记录
- [ ] 考试 20 题能提交，显示分数与解析
- [ ] 导出 JSON 能下载，重新导入后数据恢复

---

## 📖 教材原参考

```
Nam-Ho Kim
Introduction to Nonlinear Finite Element Analysis
2nd Edition, Springer, 2025
507 pages, 6 chapters
PDF 关键页面渲染图：assets/pages/ (60 张)
PDF 嵌入原图：assets/img/ (56 张)
```

教材包含 50+ 例子、60+ 习题。本平台**含 PDF 关键页面渲染图 + 完整公式 + 完整例子**，可作为主要学习资料，教材作为参考即可。

---

## ⚠️ 已知限制

1. **公式显示**：使用 Unicode 数学符号；如需完美数学排版，可后续升级到 MathJax
2. **课程覆盖**：6 章全部覆盖，但每章深度有差异（ch1-2 最详，ch3-6 含核心 + 例子）
3. **PDF 渲染图**：只覆盖教材关键页面，未覆盖全部 507 页（避免包过大）

---

## 🔧 进阶定制

想修改内容？三个文件即可：
- `data/chapters.json` — 章节元数据
- `data/flashcards.json` — 闪卡内容
- `data/exam.json` — 考试题

CSS 在 `css/style.css`。JS 在 `js/`。

新增功能可基于 `NLStorage` / `NLProgress` / `NLNotes` / `NLFlashcard` 四个核心类扩展。

---

## 📝 License

教材版权归属原作者（Nam-Ho Kim, Springer）。
本平台**所有课程内容、闪卡、考试题原创中文整理**，与教材原文不重叠。
适合个人学习使用。

PDF 关键页面渲染图源自教材原版，仅供学习参考。

---

> 学习时间建议：每周 5 小时 · 6 周完成全部课程 + 闪卡 + 考试。
> 祝学习顺利 🚀