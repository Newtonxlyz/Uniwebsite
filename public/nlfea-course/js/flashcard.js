// flashcard.js - Flash 闪卡逻辑
// 数据: per-chapter 闪卡组, 每张: { id, q, a, chapter, difficulty }
// 评分: 'again' (忘了) | 'hard' (难) | 'good' (记得) | 'easy' (轻松)

const Flashcard = {
  // 全局状态
  state: {
    deck: [], // 当前卡组
    index: 0,
    flipped: false,
  },

  // 读所有 cards
  getAll() {
    return NLStorage.get("flashcards_meta", { known: [], learning: [] });
  },

  // 标记结果
  mark(cardId, result) {
    const meta = this.getAll();
    if (result === "good" || result === "easy") {
      if (!meta.known.includes(cardId)) {
        meta.known.push(cardId);
      }
      meta.learning = meta.learning.filter((id) => id !== cardId);
    } else if (result === "hard" || result === "again") {
      if (!meta.learning.includes(cardId)) {
        meta.learning.push(cardId);
      }
    }
    NLStorage.set("flashcards_meta", meta);
  },

  // 启动一组 card
  start(cards) {
    this.state.deck = cards;
    this.state.index = 0;
    this.state.flipped = false;
  },

  current() {
    return this.state.deck[this.state.index] || null;
  },

  flip() {
    this.state.flipped = !this.state.flipped;
  },

  next() {
    if (this.state.index < this.state.deck.length - 1) {
      this.state.index++;
      this.state.flipped = false;
      return true;
    }
    return false;
  },

  prev() {
    if (this.state.index > 0) {
      this.state.index--;
      this.state.flipped = false;
    }
  },

  // 只复习学过的（去重）
  reviewMode() {
    const meta = this.getAll();
    const all = window.NL_DATA.flashcards || [];
    const known = new Set(meta.known);
    const learning = new Set(meta.learning);
    return all.filter((c) => !known.has(c.id));
  },

  // 统计
  summary() {
    const meta = this.getAll();
    const all = window.NL_DATA.flashcards || [];
    return {
      total: all.length,
      known: meta.known.length,
      learning: meta.learning.length,
      remaining: all.length - meta.known.length,
    };
  },

  // 重置
  reset() {
    NLStorage.set("flashcards_meta", { known: [], learning: [] });
  },
};

window.NLFlashcard = Flashcard;
