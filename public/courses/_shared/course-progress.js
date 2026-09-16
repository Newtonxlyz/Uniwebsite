/* course-progress.js · 学习进度跟踪
   跟踪 per-chapter + per-section 状态、累计学习时长、streak(连续学习天数)。
   API: init / get / setSection / setChapterStatus / addStudySeconds / summary / startTimer / stopTimer
*/
(function() {
  'use strict';

  const KEY_PREFIX = 'progress_';

  let _courseId = null;
  let _chapters = [];           // [{id, slug, title, sections: []}]
  let _timerChapterId = null;
  let _timerStart = null;
  let _lastTickSec = 0;

  function _key() { return KEY_PREFIX + _courseId; }

  function _load() {
    const data = CourseStorage.get(_key(), null);
    if (!data) {
      return {
        courseId: _courseId,
        startedAt: new Date().toISOString(),
        lastVisit: new Date().toISOString(),
        totalSeconds: 0,
        chapters: {},
        stats: { streak: 0, lastStudyDate: null }
      };
    }
    return data;
  }

  function _save(data) {
    data.lastVisit = new Date().toISOString();
    CourseStorage.set(_key(), data);
  }

  function init(courseId, chaptersJson) {
    _courseId = courseId;
    _chapters = chaptersJson.chapters || chaptersJson || [];
    // ensure progress exists
    _load();
  }

  function get(chapterId, sectionId) {
    const data = _load();
    const ch = data.chapters[chapterId] || { status: 'not_started', seconds: 0, sections: {} };
    if (sectionId) {
      return { ...ch, sectionStatus: ch.sections?.[sectionId] || 'not_started' };
    }
    return ch;
  }

  function setSection(chapterId, sectionId, status) {
    const data = _load();
    if (!data.chapters[chapterId]) data.chapters[chapterId] = { status: 'not_started', seconds: 0, sections: {} };
    if (!data.chapters[chapterId].sections) data.chapters[chapterId].sections = {};
    data.chapters[chapterId].sections[sectionId] = status;
    // 自动升级 chapter 状态
    if (status === 'in_progress' && data.chapters[chapterId].status === 'not_started') {
      data.chapters[chapterId].status = 'in_progress';
    }
    _updateStreak(data);
    _save(data);
  }

  function setChapterStatus(chapterId, status) {
    const data = _load();
    if (!data.chapters[chapterId]) data.chapters[chapterId] = { status, seconds: 0, sections: {} };
    const ch = data.chapters[chapterId];
    ch.status = status;
    if (status === 'completed' && !ch.completedAt) {
      ch.completedAt = new Date().toISOString();
    } else if (status !== 'completed') {
      delete ch.completedAt;
    }
    if (status !== 'not_started' && !ch.startedAt) ch.startedAt = new Date().toISOString();
    _updateStreak(data);
    _save(data);
  }

  function addStudySeconds(chapterId, seconds) {
    if (!seconds || seconds <= 0) return;
    const data = _load();
    if (!data.chapters[chapterId]) data.chapters[chapterId] = { status: 'not_started', seconds: 0, sections: {} };
    data.chapters[chapterId].seconds = (data.chapters[chapterId].seconds || 0) + seconds;
    data.totalSeconds = (data.totalSeconds || 0) + seconds;
    if (data.chapters[chapterId].status === 'not_started') {
      data.chapters[chapterId].status = 'in_progress';
    }
    _updateStreak(data);
    _save(data);
  }

  function _updateStreak(data) {
    const today = new Date().toISOString().slice(0, 10);
    const lastDate = data.stats?.lastStudyDate;
    if (!lastDate) {
      data.stats = { ...(data.stats || {}), streak: 1, lastStudyDate: today };
    } else if (lastDate === today) {
      // same day, no change
    } else {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      if (lastDate === yesterday) {
        data.stats.streak = (data.stats.streak || 0) + 1;
      } else {
        data.stats.streak = 1;
      }
      data.stats.lastStudyDate = today;
    }
  }

  function summary() {
    const data = _load();
    let completed = 0, inProgress = 0;
    for (const ch of _chapters) {
      const s = data.chapters[ch.id]?.status;
      if (s === 'completed') completed++;
      else if (s === 'in_progress') inProgress++;
    }
    return {
      courseId: _courseId,
      totalChapters: _chapters.length,
      completedChapters: completed,
      inProgressChapters: inProgress,
      notStartedChapters: _chapters.length - completed - inProgress,
      totalSeconds: data.totalSeconds || 0,
      streak: data.stats?.streak || 0,
      lastVisit: data.lastVisit,
      startedAt: data.startedAt
    };
  }

  function startTimer(chapterId) {
    if (_timerChapterId) stopTimer();
    _timerChapterId = chapterId;
    _timerStart = Date.now();
    _lastTickSec = 0;
  }

  function stopTimer() {
    if (!_timerChapterId || !_timerStart) return 0;
    const sec = Math.round((Date.now() - _timerStart) / 1000);
    if (sec > 0) addStudySeconds(_timerChapterId, sec);
    _timerChapterId = null;
    _timerStart = null;
    _lastTickSec = sec;
    return sec;
  }

  function tickEvery(seconds) {
    // 后台每 N 秒累加一次,保证关闭页面也能记录
    if (!_timerChapterId || !_timerStart) return;
    const elapsed = Math.round((Date.now() - _timerStart) / 1000);
    if (elapsed - _lastTickSec >= (seconds || 30)) {
      addStudySeconds(_timerChapterId, elapsed - _lastTickSec);
      _lastTickSec = elapsed;
    }
  }

  function resetAll() {
    CourseStorage.remove(_key());
  }

  window.CourseProgress = {
    init, get, setSection, setChapterStatus,
    addStudySeconds, summary,
    startTimer, stopTimer, tickEvery, resetAll
  };
})();