// 重新录 3 篇用 poetry
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const posts = [
  {
    title: '青楼女子',
    slug: 'poem-blue-building-woman',
    category: 'poetry',
    excerpt: '昨晚重温《艺妓回忆录》，小百合望向会长的眼神让我心头一颤。',
    content: `昨晚重温《艺妓回忆录》🌙
小百合望向会长的眼神，让我心头一颤。
那种"一生只为你一人起舞"的执念，明知身份悬殊，却仍交出全部真心。
忽然想起历史上的青楼女子。
她们也在逢场作戏的烟火中，偷偷藏着一份"愿君心似我心"的期待。
于是写下这首诗。

**青楼女子**
**轻摇小梦不几时**
**睡眼能观心却识**
**君若戏言勿戏我**
**只为真心留款意**

这个时代，连喜欢都可以群发。
我们用表情包掩饰心动，用"哈哈哈"遮盖失落。
可笨拙的真诚，才最珍贵。
谁愿意沦落红尘呢？谁不愿被真心对待呢？

---

*诗歌 · 2026年3月24日 · 雷迪嘎嘎小红书*`,
    tags: '诗,青楼,情感,小红书',
    status: 'PUBLISHED',
    allowComments: true,
  },
  {
    title: '江城子·十年生死两茫茫',
    slug: 'poem-jiang-cheng-zi-ten-years',
    category: 'poetry',
    excerpt: '有些再见，再也不见。很喜欢的词，不能多读。十年生死两茫茫，不思量，自难忘。',
    content: `有些再见，再也不见。
很喜欢的词，不能多读。

🌸

**江城子·十年生死两茫茫**  
（苏轼）

十年生死两茫茫，不思量，自难忘。  
千里孤坟，无处话凄凉。  
纵使相逢应不识，尘满面，鬓如霜。  

夜来幽梦忽还乡，小轩窗，正梳妆。  
相顾无言，惟有泪千行。  
料得年年肠断处，明月夜，短松冈。

🌸

十年，能把一个人从小年轻变成白发老头。
这一辈子，活着就是为了见见谁，送送谁。
所以别等了，想见就去见，想说就说。
别等到只能对着月亮说话。

---

*读诗明志 · 2026年4月2日 · 雷迪嘎嘎小红书*

【读诗明志】✨`,
    tags: '诗,江城子,苏轼,思念',
    status: 'PUBLISHED',
    allowComments: true,
  },
  {
    title: '黄道·纸钱',
    slug: 'poem-yellow-road-paper-money',
    category: 'poetry',
    excerpt: '今天给你们读这首小诗。录音的时候放得很慢，每一句都想读清楚。这不是在念诗，是在跟走了的人说话。',
    content: `今天给你们读这首小诗。
录音的时候放得很慢，每一句都想读清楚。
这不是在念诗，是在跟走了的人说话。

🌸

**黄道·纸钱**

熊熊炉中火，烧尽辛酸纸，  
不流伤心泪，默述相思语。  
我自不说苦，心意通彼此，  
问妳今如何，身轻如燕子？  
亭台有几落，花树有几许？  
三界必超脱，五行再难拘！  
依稀回旧时，谈笑风生起，  
夜里观星宿，斗转星亦移。  
生死离别事，都是世间痴，  
痛又能几日，哀莫过心死。

🌸

"问妳今如何，身轻如燕子"，这话说得真好。走的人轻了，像燕子一样飞走了，但活着的人心里沉。

"痛又能几日，哀莫过心死"，这话听着硬，但实在。人走了，心死了，那才是真完了。但只要心还活着，日子就得接着过。

咱们东北人有个毛病，难受不爱说，憋在心里头自己消化。但这首诗不一样，它把心里的话都说出来了。

你不流泪，不代表你不难受。  
你不说，不代表你不想。

走了的人，换了个地方看着咱们呢。咱们活好了，他们就安心了。

---

*为你读诗 · 2026年4月4日 · 雷迪嘎嘎小红书*

【为你读诗】✨`,
    tags: '诗,黄道,纸钱,思念,东北',
    status: 'PUBLISHED',
    allowComments: true,
  },
];

async function main() {
  const admin = await prisma.user.findFirst({ where: { role: 'SUPERADMIN' } });
  if (!admin) {
    console.error('No SUPERADMIN user');
    process.exit(1);
  }
  console.log('Admin:', admin.email);

  const r = await prisma.post.deleteMany({});
  console.log('Deleted:', r.count);

  for (const p of posts) {
    const c = await prisma.post.create({
      data: { ...p, authorId: admin.id, publishedAt: new Date() },
    });
    console.log(`+ ${c.slug} (${c.category}) - ${c.title}`);
  }
  console.log('Total:', await prisma.post.count());
}

main()
  .catch(e => { console.error('ERR:', e.message.substring(0,500)); process.exit(1); })
  .finally(() => prisma.$disconnect());
