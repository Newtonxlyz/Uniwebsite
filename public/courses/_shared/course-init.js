/* course-init.js · 课程初始化辅助
   通用初始化:加载数据 JSON,初始化所有模块
   使用方式:
     <script src="../_shared/course-init.js"></script>
     <script>CourseInit.run('pinn-crash-reduction', chaptersData, flashcardsData, quizzesData);</script>
*/
(function() {
  'use strict';

  async function run(courseId, chaptersJson, flashcardsJson, quizzesJson) {
    CourseProgress.init(courseId, chaptersJson);
    CourseFlashcard.init(courseId, flashcardsJson);
    CourseNotes.init(courseId);
    CourseMistakes.init(courseId);
    CourseQuiz.init(courseId, quizzesJson || {});
    CourseTheme.init();
  }

  // 便利方法:从 URL 加载数据
  async function loadFromUrls(courseId, urls) {
    const [chRes, fcRes, qRes] = await Promise.all([
      fetch(urls.chapters),
      fetch(urls.flashcards),
      fetch(urls.quizzes).catch(() => ({ ok: false }))
    ]);
    const chapters = await chRes.json();
    const flashcards = await fcRes.json();
    const quizzes = qRes.ok ? await qRes.json() : {};
    await run(courseId, chapters, flashcards, quizzes);
    return { chapters, flashcards, quizzes };
  }

  // 内联数据初始化(用于 file:// 双击打开)
  function runInline(courseId, chaptersData, flashcardsData, quizzesData) {
    CourseProgress.init(courseId, chaptersData);
    CourseFlashcard.init(courseId, flashcardsData);
    CourseNotes.init(courseId);
    CourseMistakes.init(courseId);
    CourseQuiz.init(courseId, quizzesData || {});
    CourseTheme.init();
  }

  window.CourseInit = { run, loadFromUrls, runInline };
})();