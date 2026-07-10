// progress.js - 学习进度跟踪
// 状态: 'not_started' | 'in_progress' | 'completed'
// 数据: per-chapter 状态 + notes 数 + 学习时长（分钟） + 最后访问时间

const Progress = {
  // 读所有章节进度
  getAll() {
    return NLStorage.get("progress", {});
  },

  // 读单章节
  get(slug) {
    const all = this.getAll();
    return (
      all[slug] || {
        status: "not_started", // not_started | in_progress | completed
        notesCount: 0,
        studyMinutes: 0,
        lastVisit: null,
        startedAt: null,
        completedAt: null,
      }
    );
  },

  // 更新状态
  setStatus(slug, status) {
    const all = this.getAll();
    const now = new Date().toISOString();
    const cur = all[slug] || {};
    all[slug] = {
      ...cur,
      status,
      lastVisit: now,
      startedAt:
        status !== "not_started" && !cur.startedAt ? now : cur.startedAt,
      completedAt:
        status === "completed"
          ? cur.completedAt || now
          : status !== "completed"
          ? null
          : cur.completedAt,
    };
    NLStorage.set("progress", all);
    return all[slug];
  },

  // 累加学习时长
  addStudyMinutes(slug, mins) {
    const all = this.getAll();
    const cur = all[slug] || {};
    all[slug] = {
      ...cur,
      studyMinutes: (cur.studyMinutes || 0) + mins,
      lastVisit: new Date().toISOString(),
    };
    NLStorage.set("progress", all);
    return all[slug];
  },

  // 笔记数 +1
  incNotes(slug) {
    const all = this.getAll();
    const cur = all[slug] || {};
    all[slug] = {
      ...cur,
      notesCount: (cur.notesCount || 0) + 1,
      lastVisit: new Date().toISOString(),
    };
    NLStorage.set("progress", all);
    return all[slug];
  },

  // 重置
  reset(slug) {
    const all = this.getAll();
    delete all[slug];
    NLStorage.set("progress", all);
  },

  // 全重置
  resetAll() {
    NLStorage.set("progress", {});
  },

  // 统计
  summary() {
    const all = this.getAll();
    const entries = Object.values(all);
    return {
      total: entries.length,
      notStarted: entries.filter((e) => e.status === "not_started").length,
      inProgress: entries.filter((e) => e.status === "in_progress").length,
      completed: entries.filter((e) => e.status === "completed").length,
      totalMinutes: entries.reduce((s, e) => s + (e.studyMinutes || 0), 0),
    };
  },
};

window.NLProgress = Progress;
