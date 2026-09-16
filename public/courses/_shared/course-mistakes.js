/* course-mistakes.js · 错题本
   自动收集测验答错的题,用户可"重做"标记掌握。
   API: init / add / getAll / redo / remove / summary
*/
(function() {
  'use strict';

  let _courseId = null;

  function _key() { return `${_courseId}_mistakes`; }

  function init(courseId) {
    _courseId = courseId;
  }

  function add(chapterId, question, userAnswer) {
    const all = CourseStorage.get(_key(), { items: [] });
    const item = {
      id: `${chapterId}-${question.id}-${Date.now()}`,
      chapterId,
      questionId: question.id,
      stem: question.stem,
      type: question.type,
      options: question.options,
      correctAnswer: question.answer,
      userAnswer,
      explanation: question.explanation || '',
      references: question.references || [],
      addedAt: new Date().toISOString(),
      mastered: false,
      mistakeCount: 1
    };
    // 同问题合并
    const existing = all.items.find(i =>
      i.chapterId === chapterId && i.questionId === question.id && !i.mastered
    );
    if (existing) {
      existing.userAnswer = userAnswer;
      existing.mistakeCount += 1;
      existing.addedAt = new Date().toISOString();
    } else {
      all.items.push(item);
    }
    CourseStorage.set(_key(), all);
    return item;
  }

  function getAll() {
    const all = CourseStorage.get(_key(), { items: [] });
    return all.items;
  }

  function getActive() {
    return getAll().filter(i => !i.mastered);
  }

  function redo(questionId) {
    const all = CourseStorage.get(_key(), { items: [] });
    const item = all.items.find(i => i.questionId === questionId);
    if (item) {
      item.mastered = true;
      item.masteredAt = new Date().toISOString();
      CourseStorage.set(_key(), all);
    }
    return item;
  }

  function remove(itemId) {
    const all = CourseStorage.get(_key(), { items: [] });
    all.items = all.items.filter(i => i.id !== itemId);
    CourseStorage.set(_key(), all);
  }

  function summary() {
    const items = getAll();
    const active = items.filter(i => !i.mastered);
    const mastered = items.filter(i => i.mastered);
    const byChapter = {};
    active.forEach(i => {
      byChapter[i.chapterId] = (byChapter[i.chapterId] || 0) + 1;
    });
    return {
      total: items.length,
      active: active.length,
      mastered: mastered.length,
      byChapter
    };
  }

  window.CourseMistakes = {
    init, add, getAll, getActive, redo, remove, summary
  };
})();