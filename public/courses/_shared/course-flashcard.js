/* course-flashcard.js · SM-2 间隔重复算法
   SM-2 (SuperMemo 2) 经典间隔重复算法:
   - Again (1): 重置序列,interval = 1 天
   - Hard (2): interval *= 1.2, easeFactor -= 0.15
   - Good (3): 标准 SM-2 公式
   - Easy (4): interval *= 1.3, easeFactor += 0.15

   API: init / getAll / getDue / mark / summary / reset
*/
(function() {
  'use strict';

  const KEY = 'flashcards_meta';
  const DAY = 24 * 3600 * 1000;

  let _courseId = null;
  let _allCards = [];

  function _key() { return _courseId + '_' + KEY; }
  function _loadMeta() {
    return CourseStorage.get(_key(), { known: [], learning: [], mastery: {} });
  }
  function _saveMeta(meta) {
    CourseStorage.set(_key(), meta);
  }

  function init(courseId, flashcardsJson) {
    _courseId = courseId;
    _allCards = flashcardsJson.cards || flashcardsJson || [];
    // 给每张卡初始化 SM-2 状态
    const meta = _loadMeta();
    _allCards.forEach(c => {
      if (!meta.mastery[c.id]) {
        meta.mastery[c.id] = {
          repetitions: 0,
          interval: 0,           // 0 = 未学
          easeFactor: 2.5,       // SM-2 起始 ease factor
          lastReview: null,
          nextReview: null,       // Date.now()
          status: 'new'          // new | learning | review | mastered
        };
      }
    });
    _saveMeta(meta);
  }

  function getAll() {
    return _allCards.map(c => ({ ...c, mastery: _loadMeta().mastery[c.id] }));
  }

  function getByChapter(chapterId) {
    return getAll().filter(c => String(c.chapter) === String(chapterId));
  }

  function getDue() {
    const now = Date.now();
    const meta = _loadMeta();
    return _allCards
      .filter(c => {
        const m = meta.mastery[c.id];
        return m && m.nextReview && m.nextReview <= now;
      })
      .map(c => ({ ...c, mastery: meta.mastery[c.id] }));
  }

  function getNewCount() {
    const meta = _loadMeta();
    return _allCards.filter(c => meta.mastery[c.id]?.status === 'new').length;
  }

  /**
   * SM-2 算法核心
   * @param {string} cardId
   * @param {string} rating - 'again' | 'hard' | 'good' | 'easy'
   * @returns {object} 更新后的 mastery 状态
   */
  function mark(cardId, rating) {
    const meta = _loadMeta();
    const m = meta.mastery[cardId];
    if (!m) return null;

    const now = Date.now();
    const quality = { again: 1, hard: 3, good: 4, easy: 5 }[rating] ?? 3;
    let { repetitions, interval, easeFactor } = m;

    // Again: 完全重置
    if (rating === 'again') {
      repetitions = 0;
      interval = 1;  // 明天再复习
      // easeFactor 不变
      if (!meta.learning.includes(cardId)) meta.learning.push(cardId);
      meta.known = meta.known.filter(id => id !== cardId);
    } else {
      // 标准 SM-2: q >= 3
      if (repetitions === 0) interval = 1;
      else if (repetitions === 1) interval = 6;
      else interval = Math.round(interval * easeFactor);

      // 应用 hard/easy modifier
      if (rating === 'hard') interval = Math.max(1, Math.round(interval * 1.2));
      else if (rating === 'easy') interval = Math.round(interval * 1.3);

      // 更新 ease factor: EF' = EF + (0.1 - (5-q) * (0.08 + (5-q) * 0.02))
      const newEF = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
      easeFactor = Math.max(1.3, newEF);

      repetitions += 1;

      // mastered: repetitions >= 3 AND easeFactor >= 1.8
      m.status = repetitions >= 3 && easeFactor >= 1.8 ? 'mastered' : 'review';

      if (m.status === 'mastered') {
        if (!meta.known.includes(cardId)) meta.known.push(cardId);
        meta.learning = meta.learning.filter(id => id !== cardId);
      } else {
        if (!meta.learning.includes(cardId)) meta.learning.push(cardId);
      }
    }

    m.repetitions = repetitions;
    m.interval = interval;
    m.easeFactor = parseFloat(easeFactor.toFixed(2));
    m.lastReview = now;
    m.nextReview = now + interval * DAY;
    m.status = rating === 'again' ? 'learning' : m.status;

    _saveMeta(meta);
    return m;
  }

  function summary() {
    const meta = _loadMeta();
    let mastered = 0, learning = 0, newCards = 0;
    _allCards.forEach(c => {
      const s = meta.mastery[c.id]?.status;
      if (s === 'mastered') mastered++;
      else if (s === 'learning' || s === 'review') learning++;
      else newCards++;
    });
    const due = getDue().length;
    return {
      total: _allCards.length,
      mastered, learning, new: newCards, due,
      known: meta.known.length,
      goodRate: _allCards.length > 0 ? Math.round((mastered / _allCards.length) * 100) : 0
    };
  }

  function reset() {
    CourseStorage.remove(_key());
  }

  window.CourseFlashcard = {
    init, getAll, getByChapter, getDue, getNewCount,
    mark, summary, reset
  };
})();