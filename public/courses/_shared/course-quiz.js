/* course-quiz.js · 测验引擎
   支持 5 种题型:single(单选)/multi(多选)/tf(判断)/fill(填空)/short(简答)
   即时反馈 + 总分计算 + 错题收集
   API: init / loadQuiz / start / answer / submit / getCurrent / getMistakes / getBest / reset
*/
(function() {
  'use strict';

  let _courseId = null;
  let _quizCache = {};       // chapterId → quiz json
  let _state = null;         // 当前进行中的测验状态

  function _historyKey(chapterId) {
    return `${_courseId}_quiz_${chapterId}`;
  }

  function init(courseId, quizzesJson) {
    _courseId = courseId;
    // quizzesJson: { chapterId: { questions: [...], passingScore: 70, maxAttempts: 3 } }
    if (Array.isArray(quizzesJson)) {
      quizzesJson.forEach(q => { if (q.chapterId) _quizCache[q.chapterId] = q; });
    } else {
      _quizCache = quizzesJson || {};
    }
  }

  function loadQuiz(chapterId) {
    return _quizCache[chapterId] || null;
  }

  function start(chapterId, mode = 'chapter') {
    const quiz = _quizCache[chapterId] || _quizCache['final'];
    if (!quiz) throw new Error('找不到测验:' + chapterId);
    _state = {
      chapterId,
      mode,
      questions: quiz.questions || [],
      passingScore: quiz.passingScore ?? 70,
      maxAttempts: quiz.maxAttempts ?? 3,
      currentIdx: 0,
      answers: {},            // {questionId: answer}
      feedback: {},           // {questionId: {correct, explanation}}
      startTime: Date.now(),
      submitted: false
    };
    return _state;
  }

  function getCurrent() {
    return _state;
  }

  function getCurrentQuestion() {
    if (!_state || _state.submitted) return null;
    return _state.questions[_state.currentIdx] || null;
  }

  /**
   * 答题 + 即时反馈
   * @returns {object} { correct, correctAnswer, explanation }
   */
  function answer(questionId, userAnswer) {
    if (!_state) return null;
    _state.answers[questionId] = userAnswer;
    const q = _state.questions.find(qq => qq.id === questionId);
    if (!q) return null;
    const result = _evaluate(q, userAnswer);
    _state.feedback[questionId] = result;
    return result;
  }

  function _evaluate(q, userAnswer) {
    const correct = _isCorrect(q, userAnswer);
    return {
      correct,
      correctAnswer: q.answer,
      explanation: q.explanation || '',
      references: q.references || [],
      userAnswer
    };
  }

  function _isCorrect(q, userAnswer) {
    switch (q.type) {
      case 'single':
      case 'tf':
        return Number(userAnswer) === Number(q.answer);
      case 'multi': {
        const a = Array.isArray(userAnswer) ? userAnswer.slice().sort() : [];
        const b = Array.isArray(q.answer) ? q.answer.slice().sort() : [];
        if (a.length !== b.length) return false;
        return a.every((v, i) => Number(v) === Number(b[i]));
      }
      case 'fill':
        return String(userAnswer || '').trim().toLowerCase() === String(q.answer).trim().toLowerCase();
      case 'short':
        // 简答需自评,默认返回 false,用户提交后人工判定
        return false;
      default:
        return false;
    }
  }

  function next() {
    if (!_state) return null;
    if (_state.currentIdx < _state.questions.length - 1) {
      _state.currentIdx++;
      return getCurrentQuestion();
    }
    return null;
  }

  function prev() {
    if (!_state) return null;
    if (_state.currentIdx > 0) {
      _state.currentIdx--;
      return getCurrentQuestion();
    }
    return null;
  }

  function goTo(idx) {
    if (!_state) return null;
    if (idx >= 0 && idx < _state.questions.length) {
      _state.currentIdx = idx;
      return getCurrentQuestion();
    }
    return null;
  }

  function submit() {
    if (!_state) return null;
    const total = _state.questions.length;
    const correctCount = _state.questions.filter(q => {
      return _state.feedback[q.id]?.correct === true;
    }).length;
    const score = Math.round((correctCount / total) * 100);
    const passed = score >= _state.passingScore;
    const seconds = Math.round((Date.now() - _state.startTime) / 1000);
    _state.submitted = true;
    _state.score = score;
    _state.correctCount = correctCount;
    _state.passed = passed;
    _state.seconds = seconds;

    // 保存历史最高分
    const key = _historyKey(_state.chapterId);
    const history = CourseStorage.get(key, { attempts: 0, bestScore: 0 });
    history.attempts += 1;
    history.lastAttempt = new Date().toISOString();
    history.lastScore = score;
    history.lastSeconds = seconds;
    if (score > history.bestScore) history.bestScore = score;
    CourseStorage.set(key, history);

    return { score, total, correctCount, passed, passingScore: _state.passingScore, seconds };
  }

  function getMistakes() {
    if (!_state) return [];
    return _state.questions
      .filter(q => _state.feedback[q.id]?.correct === false)
      .map(q => ({
        question: q,
        feedback: _state.feedback[q.id]
      }));
  }

  function getHistory(chapterId) {
    return CourseStorage.get(_historyKey(chapterId), { attempts: 0, bestScore: 0 });
  }

  function canAttempt(chapterId) {
    const h = getHistory(chapterId);
    const max = (_quizCache[chapterId] || _quizCache['final'])?.maxAttempts ?? 3;
    return h.attempts < max;
  }

  window.CourseQuiz = {
    init, loadQuiz, start, getCurrent, getCurrentQuestion,
    answer, next, prev, goTo, submit,
    getMistakes, getHistory, canAttempt,
    _evaluate // expose for testing
  };
})();