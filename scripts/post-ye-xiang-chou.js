// 录 KW16 也乡愁诗到 blog + 配套音频链接
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const YE_XIANG_CHOU = `好久没回家了。

有时候突然想回去看看，但想想，还是算了吧。怕回去，怕看到那些熟悉的人和事，心里难受。

想起这首诗

🌸

也乡愁

故乡啊故乡
不想回头望
少不经事
未曾理会
久久伫立的爹娘
和那一握尘土的芬芳

故乡啊故乡
经不住回想
岁月荣枯
牵挂离肠
桀骜偷偷的消弭
而惆怅却悄悄的膨胀

故乡啊故乡
默默的徜徉
人生苦短
光阴难长
多了些鲜嫩的声线
却少了些旧识的面庞

故乡啊故乡
不要回头望
人老珠黄
眉酸泪烫
怕冲散了精致的容妆
还是留下了伤心的模样

故乡啊故乡
已无法回望
明日不在
今时已殇
听不见无助的叹息
停不下羸弱的心房

故乡啊故乡
请你
把我相忘

🌸

这首诗写到最后，让我想起那句"请你，把我相忘"。

你说，一个人得多绝望，才能说出"请把我相忘"？

不是不爱了，是爱不动了。不是不想回，是回不去了。故乡还在，爹娘还在，可你变了，你也回不去那个少不经事的自己了。

"多了些鲜嫩的声线，却少了些旧识的面庞"，这话听着揪心。你长大了，声音嫩了，可认识你的人都老了，走了。

"明日不在，今时已殇"，明天不是明天，今天也不是今天了。一切都变了，你只能往前走。

最后那句"请你，把我相忘"，说得多硬啊。硬到让人心疼。

咱们东北有句话：落叶归根。但有时候，你就是落不回去。那就忘了吧，忘了也好。至少不用天天惦记，不用天天难受。

---

*诗歌 · 2026年4月14日 · 雷迪嘎嘎小红书*

🎵 配乐：《也乡愁》原声朗读 · <audio src="https://media.lvyz.org/music/ye-xiang-chou.aac" controls></audio>

#情感共鸣 #治愈文字 #女性成长 #古风诗词 #原创诗歌`;

async function main() {
  // 1. 检查已存在
  const existing = await prisma.post.findUnique({ where: { slug: 'poem-ye-xiang-chou' } });
  if (existing) {
    console.log("已存在，跳过:", existing.title);
    return;
  }

  // 2. 找作者 user id
  const author = await prisma.user.findFirst({ where: { email: 'admin@lvyz.org' } });
  if (!author) {
    console.error("找不到 admin 账号");
    process.exit(1);
  }

  // 3. 创建
  const post = await prisma.post.create({
    data: {
      slug: 'poem-ye-xiang-chou',
      title: '也乡愁',
      excerpt: '好久没回家了。有时候突然想回去看看，但想想，还是算了吧。请你，把我相忘。',
      content: YE_XIANG_CHOU,
      category: 'poetry',
      tags: '诗,也乡愁,故乡,情感,小红书',
      status: 'PUBLISHED',
      allowComments: true,
      publishedAt: new Date(),
      authorId: author.id,
    },
  });
  console.log('✓ 录 blog:', post.title, '(', post.slug, ')');
}

main()
  .catch((e) => { console.error('错误:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
