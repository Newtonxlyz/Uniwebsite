// /crashai/safety-training - 汽车安全 AI 模型训练 4 大路径
import Link from "next/link";
import { ArrowLeft, Brain, Cog, Sparkles, Rocket, CheckCircle2, Clock, Target, Wrench, BookOpen, AlertCircle } from "lucide-react";
import { getLessons, getCards } from "@/lib/server-data";

export const dynamic = "force-dynamic";

const PATHS = [
  {
    id: "transformer-math",
    icon: Brain,
    color: "#A78BFA",
    bg: "linear-gradient(135deg, rgba(167,139,250,0.15) 0%, rgba(124,58,237,0.05) 100%)",
    title: "Path 1 · Transformer 数学原理",
    subtitle: "自底向上 · 工程师思维",
    duration: "3 小时",
    level: "⭐⭐ 中级",
    goal: "能手写 Self-Attention（20 行 PyTorch），理解为什么 d_k 要开根号",
    prerequisite: "线性代数（矩阵乘法）+ Python 基础",
    tools: ["PyTorch", "Google Colab", "纸笔"],
    chapters: ["线性代数基础", "Q/K/V 矩阵投影", "Softmax 归一化", "Multi-Head 拆分", "LayerNorm + 残差"],
    deliverable: "GitHub repo my-tiny-transformer + README",
    painkiller: "✓ 看完后能讲清楚 Attention 工作原理\n✓ 不再把数学当黑盒",
  },
  {
    id: "pytorch-engineer",
    icon: Cog,
    color: "#60A5FA",
    bg: "linear-gradient(135deg, rgba(96,165,250,0.15) 0%, rgba(29,78,216,0.05) 100%)",
    title: "Path 2 · PyTorch 全栈训练工程师",
    subtitle: "实操派 · 7 天从零到分布式",
    duration: "7 天 × 3 小时 = 21 小时",
    level: "⭐⭐⭐ 高级",
    goal: "能独立训练、调试、优化任何 PyTorch 模型",
    prerequisite: "Python 基础 + 1 块消费级 GPU（RTX 3090/4090）",
    tools: ["PyTorch 2.x", "torchrun", "WandB", "TensorBoard"],
    chapters: ["Tensor + Autograd", "nn.Module + DataLoader", "训练循环模板", "GPU 显存计算", "AMP 混合精度", "Gradient Checkpointing", "DDP 分布式"],
    deliverable: "GitHub repo my-pytorch-engineer + 显存/速度对比报告",
    painkiller: "✓ 不再被 OOM 困扰\n✓ 知道每个参数为什么这么调",
  },
  {
    id: "llm-finetuning",
    icon: Sparkles,
    color: "#F59E0B",
    bg: "linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(180,83,9,0.05) 100%)",
    title: "Path 3 · LLM 微调实战（LoRA/QLoRA/DPO）",
    subtitle: "应用派 · 消费级 GPU 微调 7B-70B",
    duration: "5 天 × 3 小时 = 15 小时",
    level: "⭐⭐⭐ 高级",
    goal: "能在单卡上微调 Qwen2.5-7B，达到生产可用效果",
    prerequisite: "Path 1 + Path 2 学完",
    tools: ["transformers", "peft (LoRA)", "trl (DPO)", "bitsandbytes (QLoRA)", "datasets"],
    chapters: ["LoRA 低秩分解", "QLoRA 4-bit 量化", "DPO 直接偏好优化", "数据准备 100-10k 条", "Reward Hacking 防范", "Loss vs 效果评估"],
    deliverable: "微调后的 ./safety-lora/ + 评估报告（提升 ≥10%）",
    painkiller: "✓ 笔记本 2060 都能跑 QLoRA\n✓ 不再被算力卡脖子",
  },
  {
    id: "safety-industry-deploy",
    icon: Rocket,
    color: "#10B981",
    bg: "linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(6,95,70,0.05) 100%)",
    title: "Path 4 · 汽车安全 AI 落地",
    subtitle: "产品派 · 从模型到 ARR",
    duration: "10 天 × 3 小时 = 30 小时",
    level: "⭐⭐⭐⭐ 实战",
    goal: "做出可部署的 C-NCAP 法规问答机器人（Docker 镜像 + 演示视频）",
    prerequisite: "Path 1-3 全部学完",
    tools: ["vLLM", "LangChain", "pgvector", "FastAPI", "Docker"],
    chapters: ["C-NCAP/C-IASI 数据采集", "RAG + 向量库", "vLLM 部署", "FastAPI + Web UI", "中国 AI 合规 3 大法规", "商业化路径"],
    deliverable: "可部署的 Docker 镜像 + 演示视频 + 技术文档",
    painkiller: "✓ 把微调模型变成真实产品\n✓ 商业化潜力 ¥5-20 万/年/OEM × 50 = 千万 ARR",
  },
];

export default async function SafetyTrainingPage() {
  const allLessons = await getLessons();
  const allCards = await getCards();

  const safetyLessons = allLessons.filter((l: any) => l.phase === "D");
  const safetyCards = allCards.filter((c: any) => c.lessonSlug?.startsWith("transformer-math") || c.lessonSlug?.startsWith("pytorch-engineer") || c.lessonSlug?.startsWith("llm-finetuning") || c.lessonSlug?.startsWith("safety-industry-deploy"));

  const lessonMap = new Map<string, any>();
  safetyLessons.forEach((l: any) => lessonMap.set(l.slug, l));

  const cardCountByLesson: Record<string, number> = {};
  safetyCards.forEach((c: any) => {
    const k = c.lessonSlug || c.lessonId;
    cardCountByLesson[k] = (cardCountByLesson[k] || 0) + 1;
  });

  return (
    <div className="min-h-screen pt-20 px-6 pb-16" style={{ background: "linear-gradient(180deg, #FFF5F7 0%, #F0F9FF 100%)" }}>
      <div className="mx-auto max-w-6xl">
        {/* 返回 */}
        <Link href="/crashai" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6">
          <ArrowLeft className="h-4 w-4" /> 返回 crashAI 主页
        </Link>

        {/* Header */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-700 mb-3">
            <Brain className="h-3 w-3" />
            Phase D · 安全领域专项
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            🧠 汽车安全 AI · 模型训练 4 大路径
          </h1>
          <p className="text-gray-400 text-lg">
            从数学原理 → PyTorch 工程 → LoRA 微调 → 行业落地，<strong className="text-purple-300">3 个月内从零到生产部署</strong>
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <div className="glass-card px-3 py-1.5 flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-purple-400" />
              <span className="text-white font-medium">{safetyLessons.length}</span> <span className="text-gray-400">课程</span>
            </div>
            <div className="glass-card px-3 py-1.5 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-white font-medium">{safetyCards.length}</span> <span className="text-gray-400">记忆闪卡</span>
            </div>
            <div className="glass-card px-3 py-1.5 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-white font-medium">~70</span> <span className="text-gray-400">小时实操</span>
            </div>
          </div>
        </header>

        {/* 选路指南 */}
        <div className="glass-card-strong p-5 mb-8 bg-gradient-to-br from-purple-500/10 to-amber-500/10 border border-purple-500/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-white font-medium mb-1">🎯 怎么选路径？</p>
              <ul className="text-gray-300 space-y-1 text-xs">
                <li>• <strong className="text-purple-300">数学恐惧者</strong>：跳到 Path 2 实操，回头补 Path 1</li>
                <li>• <strong className="text-blue-300">有 GPU 想直接动手</strong>：从 Path 2 开始</li>
                <li>• <strong className="text-amber-300">目标 3 个月做产品</strong>：Path 1 → 2 → 3 → 4 顺序学完</li>
                <li>• <strong className="text-emerald-300">已会 PyTorch</strong>：直接 Path 3 微调实战</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 4 路径卡片 */}
        <div className="space-y-6 mb-12">
          {PATHS.map((path, idx) => {
            const Icon = path.icon;
            const lesson = lessonMap.get(path.id);
            const cardCount = cardCountByLesson[path.id] || 0;
            return (
              <article
                key={path.id}
                className="glass-card-strong rounded-3xl overflow-hidden"
                style={{ background: path.bg }}
              >
                {/* 标题区 */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className="flex-shrink-0 h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-lg"
                        style={{ background: `linear-gradient(135deg, ${path.color} 0%, ${path.color}80 100%)` }}
                      >
                        <Icon className="h-7 w-7" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-white mb-1">{path.title}</h2>
                        <p className="text-sm text-gray-400">{path.subtitle}</p>
                      </div>
                    </div>
                    <div className="text-right text-xs space-y-1">
                      <div className="text-white font-medium">{path.level}</div>
                      <div className="text-gray-500">⏱ {path.duration}</div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3 mt-4">
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                        <Target className="h-3 w-3" /> 目标
                      </div>
                      <p className="text-sm text-white">{path.goal}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                        <CheckCircle2 className="h-3 w-3" /> 前置
                      </div>
                      <p className="text-sm text-white">{path.prerequisite}</p>
                    </div>
                  </div>
                </div>

                {/* 章节列表 */}
                <div className="p-6 grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5" />
                      章节路线（{path.chapters.length}）
                    </h3>
                    <ol className="space-y-2">
                      {path.chapters.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                          <span
                            className="flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center text-xs text-white font-bold"
                            style={{ background: path.color }}
                          >
                            {i + 1}
                          </span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-bold text-gray-300 mb-2 flex items-center gap-1.5">
                        <Wrench className="h-3.5 w-3.5" />
                        工具栈
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {path.tools.map((t) => (
                          <span key={t} className="text-xs px-2 py-1 rounded-md bg-white/10 text-gray-300">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-300 mb-2">📦 最终交付</h3>
                      <p className="text-sm text-white bg-white/5 rounded-xl p-3">{path.deliverable}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-300 mb-2">🎁 学完你能</h3>
                      <div className="text-sm text-gray-300 whitespace-pre-line bg-white/5 rounded-xl p-3">
                        {path.painkiller}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 底部 CTA */}
                <div className="px-6 pb-6 flex flex-wrap gap-2">
                  {lesson && (
                    <Link
                      href={`/crashai/${path.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white font-medium text-sm shadow hover:scale-105 transition-all"
                      style={{ background: `linear-gradient(135deg, ${path.color} 0%, ${path.color}80 100%)` }}
                    >
                      <BookOpen className="h-4 w-4" />
                      开始学习
                    </Link>
                  )}
                  <Link
                    href={`/crashai/cards?topic=${path.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white text-sm hover:bg-white/20 transition-all"
                  >
                    <Sparkles className="h-4 w-4" />
                    记忆卡 ({cardCount})
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* 学习顺序建议 */}
        <div className="glass-card-strong p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-400" />
            推荐学习顺序（70 小时路径）
          </h2>
          <div className="grid md:grid-cols-4 gap-3">
            <div className="text-center p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
              <div className="text-3xl mb-2">1️⃣</div>
              <div className="text-sm font-bold text-white mb-1">Path 1</div>
              <div className="text-xs text-gray-400">3 小时</div>
              <div className="text-xs text-purple-300 mt-2">Transformer 数学</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
              <div className="text-3xl mb-2">2️⃣</div>
              <div className="text-sm font-bold text-white mb-1">Path 2</div>
              <div className="text-xs text-gray-400">21 小时</div>
              <div className="text-xs text-blue-300 mt-2">PyTorch 工程</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <div className="text-3xl mb-2">3️⃣</div>
              <div className="text-sm font-bold text-white mb-1">Path 3</div>
              <div className="text-xs text-gray-400">15 小时</div>
              <div className="text-xs text-amber-300 mt-2">LoRA 微调</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="text-3xl mb-2">4️⃣</div>
              <div className="text-sm font-bold text-white mb-1">Path 4</div>
              <div className="text-xs text-gray-400">30 小时</div>
              <div className="text-xs text-emerald-300 mt-2">行业落地</div>
            </div>
          </div>
        </div>

        {/* 闪卡分类导航 */}
        <div className="glass-card-strong p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            40 张模型训练概念闪卡（按路径分类）
          </h2>
          <div className="grid md:grid-cols-4 gap-3">
            {PATHS.map((path) => {
              const cardCount = cardCountByLesson[path.id] || 0;
              const Icon = path.icon;
              return (
                <Link
                  key={path.id}
                  href={`/crashai/cards?topic=${path.id}`}
                  className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10"
                >
                  <Icon className="h-5 w-5 mb-2" style={{ color: path.color }} />
                  <div className="text-sm font-bold text-white mb-1">{path.title.split("·")[1].trim()}</div>
                  <div className="text-xs text-gray-400">{cardCount} 张闪卡</div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}