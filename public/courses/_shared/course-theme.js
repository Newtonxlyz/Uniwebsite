/* course-theme.js · 主题(亮/暗) + 频闪防护
   - 不使用 backdrop-filter (Edge 全屏频闪根因)
   - 不使用 fixed radial-gradient (重绘代价)
   - 跟随系统 prefers-color-scheme + 手动切换
*/
(function() {
  'use strict';

  const STORAGE_KEY = 'course_theme';

  function init() {
    // 读取用户偏好
    let pref = CourseStorage.get(STORAGE_KEY, null);
    if (!pref) pref = 'auto';
    applyTheme(pref);
  }

  function applyTheme(mode) {
    const html = document.documentElement;
    let effective;
    if (mode === 'auto') {
      effective = window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    } else {
      effective = mode;
    }
    html.classList.remove('light', 'dark');
    html.classList.add(effective);
    html.setAttribute('data-theme', effective);
    CourseStorage.set(STORAGE_KEY, mode);
    updateToggleUI(mode);
  }

  function toggle() {
    const current = CourseStorage.get(STORAGE_KEY, 'auto');
    const next = current === 'light' ? 'dark' : current === 'dark' ? 'auto' : 'light';
    applyTheme(next);
    return next;
  }

  function set(mode) {
    if (!['light', 'dark', 'auto'].includes(mode)) return;
    applyTheme(mode);
  }

  function get() {
    return CourseStorage.get(STORAGE_KEY, 'auto');
  }

  function isLight() {
    return document.documentElement.classList.contains('light');
  }

  function updateToggleUI(mode) {
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.setAttribute('data-current', mode);
      btn.title = `主题:${mode} (点击切换)`;
    });
  }

  // 初始化时挂载按钮绑定
  function bindToggleButtons() {
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.addEventListener('click', toggle);
    });
  }

  // 自动初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { init(); bindToggleButtons(); });
  } else {
    init(); bindToggleButtons();
  }

  window.CourseTheme = { init, toggle, set, get, isLight };
})();