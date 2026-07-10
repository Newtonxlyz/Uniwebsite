// notes.js - 笔记 / 评论
// 数据结构: { slug: [{ id, type: 'note'|'comment', content, createdAt, updatedAt }] }

const Notes = {
  // 读某章所有 notes
  getAll(slug) {
    return NLStorage.get(`notes_${slug}`, []);
  },

  // 加 note
  add(slug, content) {
    const all = this.getAll(slug);
    const now = new Date().toISOString();
    const note = {
      id: "n_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8),
      type: "note",
      content: content.trim(),
      createdAt: now,
      updatedAt: now,
    };
    all.push(note);
    NLStorage.set(`notes_${slug}`, all);
    NLProgress.incNotes(slug);
    return note;
  },

  // 删
  remove(slug, id) {
    const all = this.getAll(slug).filter((n) => n.id !== id);
    NLStorage.set(`notes_${slug}`, all);
  },

  // 编辑
  edit(slug, id, content) {
    const all = this.getAll(slug);
    const idx = all.findIndex((n) => n.id === id);
    if (idx === -1) return null;
    all[idx] = {
      ...all[idx],
      content: content.trim(),
      updatedAt: new Date().toISOString(),
    };
    NLStorage.set(`notes_${slug}`, all);
    return all[idx];
  },

  // 全部 notes
  all() {
    const result = [];
    for (const k of Object.keys(localStorage)) {
      if (k.startsWith("nlfea_notes_")) {
        const slug = k.replace("nlfea_notes_", "");
        const notes = JSON.parse(localStorage.getItem(k) || "[]");
        notes.forEach((n) => result.push({ slug, ...n }));
      }
    }
    return result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
};

window.NLNotes = Notes;
