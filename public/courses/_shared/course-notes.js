/* course-notes.js · 课程笔记
   仿 NLFEA 笔记模式:每章节独立笔记、标签、全文搜索。
   API: init / add / getAll / remove / search
*/
(function() {
  'use strict';

  let _courseId = null;

  function _key(chapterId) { return `${_courseId}_notes_${chapterId}`; }
  function _globalKey() { return `${_courseId}_notes_all`; }

  function init(courseId) {
    _courseId = courseId;
  }

  function add(chapterId, content, tags = []) {
    if (!content || !content.trim()) return null;
    const all = CourseStorage.get(_key(chapterId), []);
    const note = {
      id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      content: content.trim(),
      tags: Array.isArray(tags) ? tags : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    all.push(note);
    CourseStorage.set(_key(chapterId), all);
    return note;
  }

  function getAll(chapterId) {
    return CourseStorage.get(_key(chapterId), []);
  }

  function remove(chapterId, noteId) {
    const all = CourseStorage.get(_key(chapterId), []);
    CourseStorage.set(_key(chapterId), all.filter(n => n.id !== noteId));
  }

  function edit(chapterId, noteId, content) {
    const all = CourseStorage.get(_key(chapterId), []);
    const idx = all.findIndex(n => n.id === noteId);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], content: content.trim(), updatedAt: new Date().toISOString() };
    CourseStorage.set(_key(chapterId), all);
    return all[idx];
  }

  function search(query) {
    if (!query) return [];
    const q = query.toLowerCase();
    const results = [];
    const seen = new Set();
    // 跨章节搜索
    Object.keys(localStorage)
      .filter(k => k.startsWith(`${_courseId}_notes_`))
      .forEach(k => {
        const chapterId = k.replace(`${_courseId}_notes_`, '');
        const notes = CourseStorage.get(k, []);
        notes.forEach(n => {
          if (n.content.toLowerCase().includes(q) || n.tags.some(t => t.toLowerCase().includes(q))) {
            if (!seen.has(n.id)) {
              seen.add(n.id);
              results.push({ ...n, chapterId });
            }
          }
        });
      });
    return results;
  }

  // ─────────────────────────────────────────────────
  // 讲解就绪 — 一句话总结(每个章节独立)
  // ─────────────────────────────────────────────────
  function _lectureKey(chapterId) { return `${_courseId}_lecture_${chapterId}`; }

  function saveLectureOneLine(chapterId, text) {
    CourseStorage.set(_lectureKey(chapterId), (text || '').trim());
  }

  function getLectureOneLine(chapterId) {
    return CourseStorage.get(_lectureKey(chapterId), '');
  }

  function summary() {
    const total = search('').length;
    return { total };
  }

  window.CourseNotes = {
    init, add, getAll, remove, edit, search, summary,
    saveLectureOneLine, getLectureOneLine
  };
})();