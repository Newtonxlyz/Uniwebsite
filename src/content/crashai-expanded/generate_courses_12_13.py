import json, os

def write_course(course, filename):
    out = os.path.join(r'D:\LvyzWeb\platform\src\content\crashai-expanded', filename)
    with open(out, 'w', encoding='utf-8') as f:
        json.dump(course, f, ensure_ascii=False, indent=2)
    print('Written %s: %s (%d sections, %d bytes)' % (filename, course['slug'], len(course['sections']), os.path.getsize(out)))

# ============== COURSE 12: LLM TRAINING ==============
course_12 = {
    "slug": "llm-training",
    "title": "2.6 LLM训练",
    "description": "预训练全流程：数据清洗/Tokenization/训练策略/分布式训练",
    "category": "llm", "phase": "B", "order": 12,
    "sections": [
        {
            "type": "text",
            "title": "为什么需要预训练？——LLM的\u201C九年义务教育\u201D",
            "content": "<p><b>预训练（Pre-training）是LLM的\u201C九年义务教育\u201D</b>——在模型学会回答问题、写代码或翻译之前，它必须先\u201C读遍天下书\u201D。</p><p><b>类比理解：学做饭</b>。你不可能在学会切菜、认识食材、了解火候之前，直接做出一道米其林大餐。预训练就是让模型先通过阅读海量文本，学会人类语言的基本规律——词语怎么搭配、句子怎么连接、故事怎么展开。只有在\u201C毕业\u201D之后，模型才能被进一步调教（微调）去执行特定任务。</p><p><b>预训练的核心目标是什么？</b>简单来说，就是让模型学会<b>\u201C预测下一个词\u201D</b>。当你读到\u201C今天天气很\u201D，你的大脑会自动猜出\u201C好\u201D\u201C热\u201D\u201C冷\u201D\u201C糟糕\u201D等词。预训练就是让模型在看了几千亿个词之后，也能做这种预测。这个看似简单的任务，实际上迫使模型学会了语法、逻辑、知识、推理——几乎所有语言相关的智能。</p><p><b>数据规模是怎样的？</b>GPT-3（2020年）在约5000亿个token（约等于3750亿个英文单词）上训练。GPT-4使用更多。中国的DeepSeek-V2、智谱GLM-4等模型也使用万亿级token。如果把这比作读书，一个普通人一生读的书可能只值几亿个词，而GPT-3在预训练阶段\u201C读\u201D的书比全人类历史加起来还多。</p><p><b>预训练的核心公式：自回归语言建模</b>。模型训练的目标是让下面的概率最大化：</p><pre>P(第1个词) × P(第2个词|第1个词) × P(第3个词|第1,2个词) × ... × P(第N个词|第1,...,N-1个词)</pre><p>每个\u201C×\u201D号表示\u201C并且\u201D。模型用前面的所有词来预测下一个词。如果预测正确，概率大；如果错误，概率小。训练就是让模型调整内部参数，让整体概率越来越大。</p><p><b>预训练的核心参数说明：</b></p><table border=\"1\" cellpadding=\"5\"><tr><th>参数名</th><th>含义</th><th>典型值</th><th>太大/太小</th></tr><tr><td>参数数量（N）</td><td>模型的权重总数</td><td>70B, 175B, 1.8T</td><td>太大→难训练、推理贵；太小→表达能力弱</td></tr><tr><td>训练token数（D）</td><td>模型看到多少词</td><td>1T, 2T, 14T</td><td>太少→过拟合；太多→收益递减</td></tr><tr><td>学习率（lr）</td><td>每次参数调整步长</td><td>1e-4 ~ 3e-4</td><td>太大→不收敛/震荡；太小→训练极慢</td></tr><tr><td>批次大小（batch_size）</td><td>每次更新看多少样本</td><td>4M tokens（分布式）</td><td>太大→内存不够；太小→梯度噪声大</td></tr><tr><td>上下文长度（max_len）</td><td>模型一次能看多长</td><td>2048, 4096, 128K</td><td>太长→显存爆炸；太短→无法处理长文</td></tr></table>"
        },
        {
            "type": "text",
            "title": "数据清洗：为什么质量比数量更重要？",
            "content": "<p><b>核心观点：Garbage In, Garbage Out。</b>如果你用垃圾数据训练，模型就会学会垃圾。一个用1万亿高质量token训练的模型，可能比一个用3万亿低质量token训练的模型表现更好。</p><p><b>数据来源有哪些？</b>预训练数据主要来自：</p><ul><li><b>Common Crawl</b>：爬取全球互联网网页，原始数据量巨大但质量参差不齐。包含大量广告、垃圾页面、重复内容、低质量论坛帖子。</li><li><b>书籍</b>：如Books3、Gutenberg项目。语法规范、结构完整、质量较高。</li><li><b>学术论文</b>：如arXiv、PubMed。包含大量专业术语、数学公式。</li><li><b>代码</b>：GitHub上的公开代码。代码有严格的语法规则，训练代码能提升模型的结构化思维和逻辑能力。</li><li><b>维基百科</b>：知识准确、结构化的百科内容。</li></ul><p><b>数据清洗的关键步骤：</b></p><p><b>1. 去重（Deduplication）</b>：MinHash算法，相似文档有相似签名。签名相似度>0.9→认为是重复文档。</p><p><b>2. 语言过滤（Language Filtering）</b>：fastText语言检测，99%准确率识别176种语言。</p><p><b>3. 质量过滤（Quality Filtering）</b>：困惑度过滤、启发式规则（删除包含太多重复行的文档、删除行数太少的文档）。</p><p><b>4. 隐私过滤（PII Removal）</b>：用正则表达式匹配身份证号、电话号码、银行卡号、邮箱地址等。</p><p><b>5. 毒性/有害内容过滤（Toxicity Filtering）</b>：用内容分类器给每段内容打分，分数超过阈值（如0.8）的内容被删除。</p><p><b>数据清洗参数表：</b></p><table border=\"1\" cellpadding=\"5\"><tr><th>参数</th><th>含义</th><th>典型值</th><th>太大/太小</th></tr><tr><td>重复阈值</td><td>MinHash相似度</td><td>0.80 ~ 0.95</td><td>太大→漏掉重复；太小→误删不同内容</td></tr><tr><td>困惑度阈值</td><td>低质量过滤线</td><td>文档困惑度<参考模型平均困惑度的2倍</td><td>太高→保留垃圾；太低→删除正常内容</td></tr><tr><td>毒性阈值</td><td>有害内容删除线</td><td>0.7 ~ 0.9</td><td>太高→保留有害内容；太低→删除正常争议内容</td></tr><tr><td>代码比例</td><td>代码占总数据比例</td><td>10% ~ 30%</td><td>太高→模型像程序员说话；太低→编程能力弱</td></tr></table>"
        },
        {
            "type": "text",
            "title": "分布式训练：当模型太大，一台GPU放不下",
            "content": "<p><b>为什么需要分布式训练？</b>现代LLM的参数从几十亿到几千亿。以GPT-3（1750亿参数）为例，如果每个参数用4字节（FP32精度）存储，仅模型本身就需要约700GB内存。而当前最强GPU（NVIDIA H100）也只有80GB显存。所以一台GPU绝对放不下。</p><p><b>类比理解：搬家</b>。想象你要搬一个3000斤的钢琴，但你只有一个人（一台GPU）。你需要找10个朋友（10台GPU）一起搬。</p><p><b>数据并行（Data Parallelism）</b>：最基础、最常用。每台GPU都保存完整的模型副本。把一个大的数据批次（batch）分成若干小份，每份发给一台GPU。每台GPU独立计算前向传播和反向传播，得到各自的梯度。然后所有GPU同步梯度（求平均），最后每台GPU用这个平均梯度更新自己的模型。</p><p><b>模型并行（Model Parallelism）</b>：</p><p><b>1. 张量并行（Tensor Parallelism）</b>：把某一层（比如一个线性层的权重矩阵）切成几块，放到不同GPU上。例如，一个4096×4096的矩阵，可以切成4个4096×1024的块，放在4块GPU上。</p><p><b>2. 流水线并行（Pipeline Parallelism）</b>：把模型按层拆分。例如，一个96层的Transformer，前24层放在GPU1，接下来24层放在GPU2，以此类推。数据像流水线一样流过。</p><p><b>3D并行：数据并行 + 张量并行 + 流水线并行</b>。训练GPT-3/4级别模型时，通常三种并行同时使用。总GPU数 = 4 × 8 = 32块，可以训练千亿参数模型。</p><p><b>ZeRO（Zero Redundancy Optimizer）</b>：DeepSpeed的核心创新。分片存储优化器状态、梯度和参数。ZeRO-3分片所有三者，配合CPU Offload，可以在单块消费级GPU上训练百亿参数模型！</p><p><b>训练框架对比：</b></p><table border=\"1\" cellpadding=\"5\"><tr><th>框架</th><th>开发者</th><th>核心特性</th><th>适用场景</th></tr><tr><td>DeepSpeed</td><td>微软</td><td>ZeRO、3D并行、模型压缩</td><td>超大规模模型训练</td></tr><tr><td>Megatron-LM</td><td>NVIDIA</td><td>张量并行、流水线并行</td><td>NVIDIA GPU集群</td></tr><tr><td>FSDP</td><td>PyTorch</td><td>数据并行+分片</td><td>PyTorch原生集成</td></tr><tr><td>Colossal-AI</td><td>潞晨科技</td><td>统一并行、高效通信</td><td>国产AI芯片适配</td></tr></table>"
        },
        {
            "type": "formula",
            "title": "损失函数：交叉熵损失",
            "content": "<p><b>预训练的目标是让预测概率尽可能接近真实概率。</b>用\u201C交叉熵损失\u201D（Cross-Entropy Loss）来衡量差距。</p><p><b>公式：</b></p><pre>L = - (1/N) × Σᵢ log( P(yᵢ | y₁, ..., yᵢ₋₁) )</pre><p><b>逐符号解释：</b></p><ul><li><b>L</b>：损失值（Loss），代表模型有多\u201C错\u201D。L越大→模型越差；L越小→模型越好。</li><li><b>-</b>：负号。因为log(概率)是负数（概率小于1），取负号让结果变成正数。</li><li><b>1/N</b>：求平均。N是一句话中词的总数。</li><li><b>Σᵢ</b>：求和符号。对每一个位置i分别计算损失后加起来。</li><li><b>log</b>：自然对数（以e为底，约等于2.718）。</li><li><b>P(yᵢ | y₁, ..., yᵢ₋₁)</b>：在第i个位置，模型给出的正确词的概率。</li></ul><p><b>类比理解：猜谜游戏</b>。想象你玩一个猜词游戏，每次有100个可能的词。如果你猜对某个词的概率是0.01（即1%），那么log(0.01) ≈ -4.6，取负后损失=4.6。如果你猜对的概率是0.5（50%），log(0.5) ≈ -0.69，损失=0.69。如果你猜对的概率是0.99（99%），log(0.99) ≈ -0.01，损失=0.01。</p><p><b>数值例子：计算具体损失</b></p><p>假设模型预测句子\u201C猫吃鱼\u201D，模型给出的正确词概率分别是0.5（猫）、0.7（吃）、0.9（鱼）。</p><pre>L = -(1/3) × [log(0.5) + log(0.7) + log(0.9)] = -(1/3) × [-0.693 + (-0.357) + (-0.105)] = 0.385</pre><p>损失约为0.385。如果模型在第1步就能预测\u201C猫\u201D的概率是0.9而不是0.3，那么损失会变成约0.28，减少一半。</p><p><b>参数详细说明：</b></p><table border=\"1\" cellpadding=\"5\"><tr><th>参数</th><th>含义</th><th>典型值</th><th>太大/太小</th></tr><tr><td>L（损失值）</td><td>模型错误程度</td><td>训练初期3~5，训练后期1.5~2.5</td><td>— 是训练的结果，不是超参数</td></tr><tr><td>N（序列长度）</td><td>每次处理的词数</td><td>512, 2048, 4096</td><td>太大→显存不足；太小→上下文信息不足</td></tr><tr><td>P(yᵢ)</td><td>正确词的概率</td><td>训练后期0.3~0.5</td><td>不可能达到1.0（语言有歧义），但越接近1越好</td></tr></table>"
        },
        {
            "type": "example",
            "title": "例子：计算数据并行中的梯度同步",
            "content": "<p><b>场景：</b>用4块GPU做数据并行。总batch_size=64，每块GPU分16个样本。模型只有一个权重w，初始值w=1.0。</p><p><b>前向传播：</b>假设损失函数是 L(w)=(w-y)²。4块GPU的样本y值分别为：</p><pre>GPU1: y=2 → 损失=(w-2)² = (1-2)² = 1 → 梯度 = 2(w-2) = -2
GPU2: y=3 → 损失=(w-3)² = (1-3)² = 4 → 梯度 = 2(w-3) = -4
GPU3: y=4 → 损失=(w-4)² = (1-4)² = 9 → 梯度 = 2(w-4) = -6
GPU4: y=5 → 损失=(w-5)² = (1-5)² = 16 → 梯度 = 2(w-5) = -8</pre><p><b>梯度同步（All-Reduce）：</b>4块GPU各自有梯度，需要求平均。</p><pre>总梯度 = (-2) + (-4) + (-6) + (-8) = -20
平均梯度 = -20 / 4 = -5</pre><p><b>参数更新（假设学习率α=0.1）：</b></p><pre>w_new = w - α × 平均梯度 = 1.0 - 0.1 × (-5) = 1.0 + 0.5 = 1.5</pre><p><b>验证：</b>如果只用一块GPU，处理所有64个样本，实际平均梯度应该接近-5。数据并行让4块GPU同时计算，最后得到的结果和单块GPU处理全部数据完全相同。</p>"
        },
        {
            "type": "text",
            "title": "训练策略：Warmup、学习率衰减与梯度裁剪",
            "content": "<p><b>训练LLM不是\u201C启动→全速运行→停止\u201D这么简单。</b>就像开车，你不能点火后立刻把油门踩到底。</p><p><b>1. Warmup（预热）：温柔起步</b></p><p><b>问题：</b>训练开始时，模型参数是随机初始化的。此时如果直接用大学习率，参数会剧烈震荡，甚至导致损失爆炸（NaN）。</p><p><b>解决方案：</b>Warmup。在训练的前N步（如前1000步），学习率从0开始线性增加到目标值。</p><pre>学习率调度：0步: lr=0; 500步: lr=0.5×目标lr; 1000步: lr=1.0×目标lr（Warmup结束）; 1000步后: 正常衰减</pre><p><b>典型参数：</b>Warmup步数 = 总步数的1% ~ 5%。例如训练100万步，Warmup 1万步。</p><p><b>2. 学习率衰减（LR Decay）：越学越慢</b></p><p><b>常见衰减策略：</b></p><ul><li><b>线性衰减（Linear Decay）</b>：从Warmup结束到训练结束，学习率线性下降到0。GPT-3使用线性衰减。</li><li><b>余弦衰减（Cosine Decay）</b>：学习率按余弦曲线平滑下降。更平滑。LLaMA使用。</li><li><b>Step Decay</b>：每N个epoch学习率减半。传统，但不如线性/余弦平滑。</li></ul><p><b>3. 梯度裁剪（Gradient Clipping）：防止爆炸</b></p><p><b>问题：</b>在训练LLM时，偶尔会出现梯度突然变得非常大（比如梯度范数=1000）。这会导致参数剧烈更新，损失从2.5突然跳到NaN。</p><p><b>解决方案：</b>梯度裁剪。如果梯度的\u201C总长度\u201D（L2范数）超过阈值，就把它按比例缩小到阈值。</p><pre>梯度裁剪公式：如果 ||梯度|| > 阈值: 梯度 = 梯度 × (阈值 / ||梯度||)</pre><p><b>数值例子：</b>假设梯度向量=[10, 20, 30]，L2范数=√(10²+20²+30²)≈37.4。如果阈值=10，那么37.4>10，需要裁剪：</p><pre>缩放因子 = 10 / 37.4 ≈ 0.267; 裁剪后梯度 = [10×0.267, 20×0.267, 30×0.267] = [2.67, 5.35, 8.02]; 裁剪后范数 = √(2.67²+5.35²+8.02²) = 10 ✓</pre><p><b>典型阈值：</b>1.0（GPT系列）或5.0（一些Transformer）。</p><p><b>4. 混合精度训练（Mixed Precision）：速度与内存兼得</b></p><p><b>问题：</b>FP32（32位浮点数）计算精度高，但占用2倍于FP16（16位浮点数）的内存和带宽。</p><p><b>解决方案：</b>混合精度。前向传播和反向传播用FP16（快且省内存），但参数更新和梯度累加用FP32（稳定）。同时维护一份FP32的\u201C主参数\u201D。</p><p><b>训练策略参数表：</b></p><table border=\"1\" cellpadding=\"5\"><tr><th>参数</th><th>含义</th><th>典型值</th><th>太大/太小</th></tr><tr><td>Warmup步数</td><td>从0到目标学习率的步数</td><td>总步数的1%~5%（如2000步）</td><td>太多→浪费训练时间；太少→训练不稳定</td></tr><tr><td>最大学习率</td><td>训练中的峰值学习率</td><td>1e-4 ~ 6e-4</td><td>太大→发散/震荡；太小→收敛极慢</td></tr><tr><td>梯度裁剪阈值</td><td>最大允许梯度范数</td><td>1.0（GPT）~ 5.0</td><td>太大→无保护作用；太小→严重限制学习</td></tr><tr><td>衰减策略</td><td>学习率下降方式</td><td>Linear, Cosine</td><td>— 根据模型大小选择</td></tr></table>"
        },
        {
            "type": "exercise",
            "title": "练习：LLM训练",
            "content": "<p><b>Q1：基础计算</b> 假设模型预测句子\u201C我爱中国\u201D，模型给出的正确词概率分别是0.5（我）、0.7（爱）、0.9（中国）。请计算交叉熵损失和困惑度。</p><p><b>Q2：梯度裁剪</b> 梯度向量为[5, 12, 8]，梯度裁剪阈值设为10。请计算裁剪后的梯度。裁剪后的梯度方向是否改变？</p><p><b>Q3：数据并行</b> 2块GPU处理数据，模型参数w=2.0，损失函数L(w)=(w-y)²。GPU1的y=1，GPU2的y=5。学习率=0.1。请计算梯度同步后的w更新结果。</p><p><b>Q4：Warmup</b> 总训练步数=10000，Warmup=1000步，目标学习率=0.001。请问第500步的学习率是多少？第1000步的学习率是多少？第5000步的学习率是多少（假设线性衰减到0）？</p><p><b>Q5：困惑度应用</b> 一个语言模型的PPL=15。请解释这意味着什么。如果另一个模型的PPL=5，哪个模型更好？</p>",
            "answer": "<p><b>A1：</b>损失L = -(1/3) × [log(0.5) + log(0.7) + log(0.9)] = -(1/3) × [-0.693 + (-0.357) + (-0.105)] = -(1/3) × (-1.155) = 0.385。困惑度PPL = exp(0.385) ≈ 1.47。</p><p><b>A2：</b>梯度范数 = √(5²+12²+8²) = √(25+144+64) = √233 ≈ 15.26。15.26 > 10，需要裁剪。缩放因子 = 10/15.26 ≈ 0.655。裁剪后梯度 = [5×0.655, 12×0.655, 8×0.655] = [3.28, 7.86, 5.24]。方向不变（因为每个分量同比例缩放）。</p><p><b>A3：</b>GPU1梯度 = 2(w-y) = 2(2-1) = 2。GPU2梯度 = 2(2-5) = -6。平均梯度 = (2 + (-6))/2 = -2。w_new = 2.0 - 0.1 × (-2) = 2.0 + 0.2 = 2.2。</p><p><b>A4：</b>第500步（Warmup阶段）：lr = (500/1000) × 0.001 = 0.0005。第1000步（Warmup结束）：lr = 0.001。第5000步（衰减阶段，剩余9000步从1000步到10000步，已衰减了4000/9000）：lr = 0.001 × (1 - 4000/9000) = 0.001 × (5000/9000) ≈ 0.000556。</p><p><b>A5：</b>PPL=15意味着模型在预测下一个词时平均面临约15个等概率选择。PPL=5的模型更好（PPL越低越好）。好的程度是15/5=3倍——在信息论角度，PPL=15对应log₂(15)≈3.9比特不确定性，PPL=5对应log₂(5)≈2.3比特，不确定性减少了1.6比特。</p>"
        }
    ]
}
write_course(course_12, 'course-12.json')

# ============== COURSE 13: TOKENIZER ==============
course_13 = {
    "slug": "tokenizer",
    "title": "2.7 Tokenizer",
    "description": "BPE/WordPiece/Byte-level：文本如何变成数字——Tokenization原理与实战",
    "category": "llm", "phase": "B", "order": 13,
    "sections": [
        {
            "type": "text",
            "title": "Tokenizer是什么？——文本到数字的翻译官",
            "content": "<p><b>Tokenizer是LLM的\u201C翻译官\u201D。</b>它把人类能看懂的文字（\u201C你好世界\u201D），翻译成模型能处理的数字（[1, 45, 678, 23]）。没有Tokenizer，模型无法理解任何文字。</p><p><b>为什么要Tokenize？</b>神经网络只认识数字。它无法理解\u201C你好\u201D这两个字，但它能理解数字1和数字45。Tokenizer就是把文字映射到数字的桥梁。</p><p><b>Tokenization的完整流程：</b></p><ol><li><b>文本输入</b>：\u201CHello world!\u201D</li><li><b>分词</b>：把文本切成小块（tokens）。例如：[\u201CHello\u201D, \u201C world\u201D, \u201C!\u201D] 或 [\u201CHe\u201D, \u201Cll\u201D, \u201Co\u201D, \u201C w\u201D, \u201Cor\u201D, \u201Cld\u201D, \u201C!\u201D]</li><li><b>映射到ID</b>：每个token对应一个唯一的整数ID。例如：Hello→1, world→45, !→23</li><li><b>输入模型</b>：[1, 45, 23] 被转换成向量 [v₁, v₄₅, v₂₃]，进入Transformer计算</li><li><b>输出解码</b>：模型输出预测的token ID，Tokenizer再把这些ID翻译回文字</li></ol><p><b>为什么不用单个字符？</b>如果每个字符是一个token，英文26个字母，中文几万个汉字。但\u201Cunhappiness\u201D有12个字符，如果是一个token（词），模型只需一步处理。而且词比字符更有语义——\u201Cunhappiness\u201D表达的情绪比12个独立字母更强。</p><p><b>为什么不用单个词？</b>英语有100万+单词，中文词更多。如果每个词是一个token，词汇表太大（模型要学100万个不同的ID）。而且新词不断出现（如\u201Cbitcoin\u201D、\u201CChatGPT\u201D），模型无法处理新词。</p><p><b>解决方案：子词（Subword）Tokenization</b>。把词拆成更小的、有意义的部分。例如：unhappiness → un + happiness。这样既减少了词汇表大小（un和happiness是常见的子词），又能处理新词（un + known = unknown）。</p><p><b>主流Tokenizer对比：</b></p><table border=\"1\" cellpadding=\"5\"><tr><th>Tokenizer</th><th>算法</th><th>代表模型</th><th>特点</th></tr><tr><td>BPE</td><td>Byte Pair Encoding</td><td>GPT-2/3/4, LLaMA</td><td>合并最频繁的字符对，简单高效</td></tr><tr><td>WordPiece</td><td>贪婪子词分割</td><td>BERT</td><td>选择使语言模型概率最大的子词</td></tr><tr><td>SentencePiece</td><td>自监督学习</td><td>LLaMA, T5</td><td>不依赖语言，直接处理原始文本</td></tr><tr><td>Byte-level BPE</td><td>字节级BPE</td><td>GPT-2</td><td>用256个字节表示所有语言，词汇表极小</td></tr></table>"
        },
        {
            "type": "text",
            "title": "BPE算法：最聪明的\u201C合并\u201D游戏",
            "content": "<p><b>BPE（Byte Pair Encoding）是GPT系列使用的Tokenizer算法。</b>它的核心思想非常巧妙：反复合并文本中最频繁出现的字符对，直到词汇表达到目标大小。</p><p><b>BPE的完整步骤（用一个简单例子）：</b></p><p>假设训练语料只有4个单词（已经拆分成字符）：</p><pre>low → l, o, w
lower → l, o, w, e, r
newest → n, e, w, e, s, t
widest → w, i, d, e, s, t</pre><p><b>初始词汇表：</b>所有字符 {l, o, w, e, r, n, s, t, i, d} = 10个token</p><p><b>第1轮：找最频繁的字符对</b></p><p>统计所有相邻字符对：</p><ul><li>l-o: 2次（low, lower）</li><li>o-w: 2次（low, lower）</li><li>w-e: 2次（newest, widest）← <b>最频繁</b></li><li>e-s: 2次（newest, widest）← <b>最频繁</b></li><li>...</li></ul><p>w-e和e-s并列最频繁（都是2次）。假设我们选择w-e（或者按字典序）。</p><p><b>合并we：</b>把w和e合并成一个新的token \u201Cwe\u201D。现在词汇表 = {l, o, w, e, r, n, s, t, i, d, we} = 11个token</p><p>文本变成：</p><pre>low → l, o, w
lower → l, o, w, e, r
newest → n, we, s, t
widest → w, i, d, e, s, t</pre><p><b>第2轮：再找最频繁的字符对</b></p><p>现在e-s还是2次（widest和... wait, newest变成了n, we, s, t，所以e-s只剩1次）。</p><p>o-w: 2次（low, lower）。合并ow：</p><p>文本变成：</p><pre>low → l, ow
lower → l, ow, e, r
newest → n, we, s, t
widest → w, i, d, e, s, t</pre><p><b>重复这个过程</b>，直到词汇表达到目标大小（如GPT-2的50,000）。</p><p><b>BPE的优雅之处：</b></p><ul><li><b>频率驱动</b>：常见组合（如\u201Cing\u201D\u201Cer\u201D\u201Ction\u201D）会被自动合并为token</li><li><b>处理新词</b>：没见过\u201CChatGPT\u201D？拆成Chat + GPT（如果这两个都在词汇表里）</li><li><b>词汇表大小可控</b>：通过合并轮数控制最终词汇表大小</li><li><b>多语言友好</b>：Byte-level BPE用256个字节，所有语言都适用</li></ul><p><b>BPE训练参数：</b></p><table border=\"1\" cellpadding=\"5\"><tr><th>参数</th><th>含义</th><th>典型值</th><th>太大/太小</th></tr><tr><td>vocab_size</td><td>最终词汇表大小</td><td>32K, 50K, 100K</td><td>太大→embedding层过大；太小→token序列过长</td></tr><tr><td>min_frequency</td><td>合并的最小频率</td><td>2</td><td>太大→错过常见组合；太小→合并噪声</td></tr><tr><td>special_tokens</td><td>特殊token（如[PAD], [UNK]）</td><td>[CLS], [SEP], [PAD], [UNK], [MASK]</td><td>根据模型架构定制</td></tr></table>"
        },
        {
            "type": "text",
            "title": "中文Tokenizer的特殊挑战",
            "content": "<p><b>中文没有空格，这是最大的挑战。</b>英文\u201CHello world\u201D天然有空格分词，中文\u201C你好世界\u201D没有空格。中文Tokenizer必须自己决定切分位置。</p><p><b>中文Tokenizer的三种策略：</b></p><p><b>1. 字符级（Character-level）</b>：每个汉字是一个token。</p><p>优点：词汇表小（几千个常用汉字），不会遇到未登录词（OOV）。</p><p>缺点：序列太长。\u201C今天天气很好\u201D=7个token，但语义上只有3-4个概念。模型需要更多计算。</p><p><b>2. 词级（Word-level）</b>：用分词工具（如jieba）先切词，每个词是一个token。</p><p>优点：语义完整。\u201C今天\u201D\u201C天气\u201D\u201C很好\u201D=3个token，更符合语义。</p><p>缺点：词汇表巨大（几十万个中文词），新词不断出现（如\u201C元宇宙\u201D\u201CChatGPT\u201D），OOV问题严重。</p><p><b>3. 子词级（Subword-level）：BPE在中文中的表现</b></p><p>BPE在中文中的表现非常有趣。由于中文汉字数量多（常用字约3500个），BPE的初始字符集已经很大。但BPE仍然能发现有意义的组合：</p><ul><li>\u201C快乐\u201D → 快 + 乐（BPE可能合并为\u201C快乐\u201D，因为这对很常见）</li><li>\u201C不快乐\u201D → 不 + 快乐（如果\u201C快乐\u201D已被合并）</li><li>\u201C超级快乐\u201D → 超级 + 快乐（如果\u201C超级\u201D也被合并）</li></ul><p><b>中文Tokenizer实践建议：</b></p><table border=\"1\" cellpadding=\"5\"><tr><th>Tokenizer</th><th>适用场景</th><th>中文表现</th></tr><tr><td>BERT-wwm</td><td>中文NLP任务</td><td>Whole Word Masking，整词掩码</td></tr><tr><td>ChatGLM-Tokenizer</td><td>中文对话</td><td>针对中文优化，中英文混合效果好</td></tr><tr><td>SentencePiece</td><td>多语言模型</td><td>不依赖空格，中文/英文/日文统一处理</td></tr><tr><td>Qwen-Tokenizer</td><td>中文大模型</td><td>针对中文词汇表优化，扩展性好</td></tr></table>"
        },
        {
            "type": "code",
            "title": "代码实战：用HuggingFace训练自己的Tokenizer",
            "content": "<p>我们用HuggingFace的tokenizers库来训练一个BPE tokenizer。</p><pre># 安装：pip install tokenizers

from tokenizers import Tokenizer
from tokenizers.models import BPE
from tokenizers.trainers import BpeTrainer
from tokenizers.pre_tokenizers import Whitespace

# 1. 创建BPE模型
tokenizer = Tokenizer(BPE(unk_token='[UNK]'))

# 2. 设置预分词器（先用空格切分）
tokenizer.pre_tokenizer = Whitespace()

# 3. 创建训练器
trainer = BpeTrainer(
    vocab_size=50000,        # 目标词汇表大小
    min_frequency=2,          # 最少出现2次才合并
    special_tokens=['[PAD]', '[UNK]', '[CLS]', '[SEP]', '[MASK]']
)

# 4. 训练（从文本文件）
files = ['train.txt']  # 你的训练语料
tokenizer.train(files, trainer)

# 5. 保存
tokenizer.save('my_bpe_tokenizer.json')

# 6. 使用
output = tokenizer.encode('Hello world!')
print(output.tokens)   # ['Hello', ' world', '!']
print(output.ids)      # [1, 45, 23]

# 解码
print(tokenizer.decode(output.ids))  # Hello world!</pre><p><b>参数详解：</b></p><table border=\"1\" cellpadding=\"5\"><tr><th>参数</th><th>含义</th><th>典型值</th><th>太大/太小</th></tr><tr><td>vocab_size</td><td>目标词汇表大小</td><td>32K-100K</td><td>太大→模型参数过多；太小→序列过长</td></tr><tr><td>min_frequency</td><td>合并的最小频率</td><td>2</td><td>太大→错过常见组合；太小→合并噪声</td></tr><tr><td>unk_token</td><td>未知词标记</td><td>[UNK]</td><td>— 必须存在</td></tr><tr><td>special_tokens</td><td>特殊token列表</td><td>[PAD], [UNK], [CLS], [SEP], [MASK]</td><td>根据模型需求定制</td></tr></table>"
        },
        {
            "type": "example",
            "title": "例子：对比不同Tokenizer的编码结果",
            "content": "<p><b>原文：</b>\u201Cunhappiness\u201D</p><p><b>字符级Tokenizer：</b>u, n, h, a, p, p, i, n, e, s, s = 11个token</p><p><b>词级Tokenizer：</b>unhappiness = 1个token（如果这个词在词汇表里）</p><p><b>BPE Tokenizer（GPT-2风格）：</b></p><pre>un + happiness = 2个token（如果un和happiness都是常见子词）</pre><p>或</p><pre>un + happy + ness = 3个token（如果happy更常见）</pre><p><b>结论：</b>子词级Tokenizer在词汇表大小和序列长度之间取得了最佳平衡。BPE能自动发现最有价值的子词组合。</p><p><b>另一个例子：中文</b></p><p><b>原文：</b>\u201C人工智能技术\u201D</p><p><b>字符级：</b>人, 工, 智, 能, 技, 术 = 6个token</p><p><b>词级（jieba）：</b>人工智能, 技术 = 2个token</p><p><b>BPE（中文优化）：</b>人工 + 智能 + 技术 = 3个token（如果这三个子词常见）</p><p>或</p><p>人工 + 智 + 能 + 技 + 术 = 5个token（如果\u201C智能\u201D未被合并）</p><p>这取决于训练语料中哪些子词组合最常见。</p>"
        },
        {
            "type": "exercise",
            "title": "练习：Tokenizer",
            "content": "<p><b>Q1：</b>为什么英文用空格分词，但中文用空格分词效果差？</p><p><b>Q2：</b>BPE的核心思想是什么？为什么它能处理新词？</p><p><b>Q3：</b>假设BPE训练语料中\u201Cchat\u201D出现100次，\u201Cbot\u201D出现50次，\u201Cchatbot\u201D出现30次。如果词汇表已满，BPE会合并哪个对？</p><p><b>Q4：</b>中文Tokenizer用字符级有什么优缺点？用词级有什么优缺点？</p><p><b>Q5：</b>vocab_size=10000和vocab_size=100000分别对模型有什么影响？</p>",
            "answer": "<p><b>A1：</b>英文是拼音文字，空格天然分隔单词，分词简单。中文是意音文字，没有空格，每个字独立但组合成词才有完整含义。\u201C人工\u201D和\u201C智能\u201D分开意义不同，\u201C人工智能\u201D组合才有完整含义。中文空格分词会按字分词，破坏语义。</p><p><b>A2：</b>BPE的核心思想是反复合并语料中最频繁出现的字符对，形成子词。它能处理新词因为新词可以拆成已知的子词。例如\u201CChatGPT\u201D未见过，但可以拆成Chat + GPT（如果这两个子词在词汇表中）。</p><p><b>A3：</b>BPE会合并出现最频繁的字符对。\u201Cchat\u201D(100) + \u201Cbot\u201D(50) = 需要看相邻对。\u201Cchatbot\u201D中的\u201Cchat\u201D和\u201Cbot\u201D相邻出现30次。如果\u201Cch\u201D和\u201Cat\u201D等子词更频繁，会先合并它们。具体取决于整个语料的频率分布。</p><p><b>A4：</b>字符级：优点→词汇表小（几千字），不会OOV；缺点→序列长，语义碎片化。词级：优点→语义完整；缺点→词汇表大（几十万个词），新词OOV严重。</p><p><b>A5：</b>vocab_size=10000：embedding层小，但每个token代表的语义信息少，序列长（一篇长文可能需要1000+token）。vocab_size=100000：embedding层大（增加模型参数），但每个token更语义化，序列短。需要平衡：通常32K-50K是最佳点。</p>"
        }
    ]
}
write_course(course_13, 'course-13.json')

print('\nDone with courses 12-13!')
