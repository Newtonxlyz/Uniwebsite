#!/usr/bin/env python3
"""
Generate the complete lessons.json and cards.json for crashAI platform.
24 comprehensive courses with extremely detailed content.
"""
import json, sys, os

os.makedirs("D:\\LvyzWeb\\platform\\src\\content", exist_ok=True)

lessons = []

# ==============================
# COURSE 1: math-basics (already in file, define here for reference)
# ==============================
# We'll build all 24 courses in this script

def section(typ, title, content="", code="", answer="", items=None):
    s = {"type": typ, "title": title, "content": content}
    if code: s["code"] = code
    if answer: s["answer"] = answer
    if items: s["items"] = items
    return s

def text(title, content): return section("text", title, content)
def formula(title, content): return section("formula", title, content)
def example(title, content): return section("example", title, content)
def code(title, content, code_snippet=""): return section("code", title, content, code=code_snippet)
def exercise(title, content, ans=""): return section("exercise", title, content, answer=ans)
def table_s(title, content): return section("table", title, content)
def comparison(title, content): return section("comparison", title, content)

# ==============================
# COURSE 2: py-basics
# ==============================
lessons.append({
    "slug": "py-basics",
    "title": "01. Python速成",
    "description": "从JavaScript对比学Python，覆盖基础语法、NumPy、Pandas，2周上手",
    "category": "python",
    "phase": "A",
    "order": 1,
    "sections": [
        text("为什么必须学Python？",
             "<p>AI生态90%用Python：PyTorch、TensorFlow、HuggingFace、LangChain、pandas、numpy。JS做AI生态功能弱。<b>好消息：</b>JS写得好的人学Python极快，2-3周速通。本课程用\"对比学习法\"——你懂的JS代码旁直接给Python对照，就像双语词典一样。</p>"),
        text("环境安装（5分钟）",
             "<ol><li>下载Python 3.11/3.12（python.org）</li><li><b>必勾\"Add Python to PATH\"</b>（不勾等于白装）</li><li>验证：<code>python --version</code></li><li>VSCode装Microsoft Python插件（F5直接运行）</li><li>pip安装库：<code>pip install numpy pandas torch</code></li></ol>"),
        table_s("JS vs Python 基础语法对照表",
                "<table><tr><th>功能</th><th>JS</th><th>Python</th></tr><tr><td>变量声明</td><td>let x = 1</td><td>x = 1（不需要关键字）</td></tr><tr><td>代码块</td><td>{ }</td><td>缩进（4空格）</td></tr><tr><td>布尔值</td><td>true / false</td><td>True / False（首字母大写！）</td></tr><tr><td>空值</td><td>null / undefined</td><td>None（首字母大写）</td></tr><tr><td>逻辑运算符</td><td>&& || !</td><td>and or not</td></tr><tr><td>字符串模板</td><td>`hello ${name}`</td><td>f\"hello {name}\"</td></tr><tr><td>数组长度</td><td>arr.length</td><td>len(arr)</td></tr><tr><td>数组追加</td><td>arr.push(4)</td><td>arr.append(4)</td></tr><tr><td>数组映射</td><td>arr.map(x=>x*2)</td><td>[x*2 for x in arr]</td></tr><tr><td>函数</td><td>function f(x){}</td><td>def f(x):</td></tr><tr><td>类构造器</td><td>constructor()</td><td>def __init__(self):</td></tr><tr><td>this / self</td><td>this</td><td>self（显式写出）</td></tr></table>"),
        example("列表推导式详解",
                "<p><b>语法公式：</b><code>[表达式 for 变量 in 可迭代对象 if 条件]</code></p><p><b>数值例子：</b></p><pre>nums = [1, 2, 3, 4, 5]<br><br># 每个乘2<br>[x * 2 for x in nums]<br># 手算：1*2=2, 2*2=4, 3*2=6, 4*2=8, 5*2=10<br># 结果：[2, 4, 6, 8, 10]<br><br># 只取大于2的，再乘2<br>[x * 2 for x in nums if x > 2]<br># 手算：x=1→跳过, x=2→跳过, x=3→6, x=4→8, x=5→10<br># 结果：[6, 8, 10]</pre>"),
        example("字典操作 — 简历关键词统计",
                "<p><b>实战：</b>用字典统计简历中关键词出现次数</p><pre>resume = \"\"\"<br>吕元卓，车辆安全专家，10年车辆安全经验。<br>熟悉CNCAP、C-IASI消费者试验，精通CAE仿真。<br>\"\"\"<br><br>keywords = [\"车辆安全\", \"CNCAP\", \"C-IASI\", \"仿真\"]<br><br>stats = {}<br>for kw in keywords:<br>    count = resume.count(kw)<br>    stats[kw] = count<br><br>matched = {k: v for k, v in stats.items() if v > 0}<br>print(f\"匹配：{matched}\")</pre>"),
        text("5个最大避坑指南",
             "<table><tr><th>#</th><th>坑</th><th>JS写法</th><th>Python写法</th></tr><tr><td>1</td><td>缩进</td><td>花括号 { }</td><td>4空格（Tab会报错）</td></tr><tr><td>2</td><td>布尔值</td><td>true/false</td><td>True/False（首字母大写）</td></tr><tr><td>3</td><td>空值</td><td>null/undefined</td><td>None（is None判空）</td></tr><tr><td>4</td><td>逻辑运算符</td><td>&& || !</td><td>and or not</td></tr><tr><td>5</td><td>相等判断</td><td>===</td><td>==（没有===）</td></tr></table>"),
        code("NumPy入门 — 数组运算",
             "<p>NumPy数组 vs Python列表：统一类型、连续内存、批量运算</p>",
             "import numpy as np\n\n# 创建数组\na = np.array([1, 2, 3, 4, 5])\nprint(a.dtype)  # int64\n\n# 批量运算（不用for循环！）\nprint(a + 10)   # [11 12 13 14 15]\nprint(a * 2)    # [ 2  4  6  8 10]\nprint(a ** 2)   # [ 1  4  9 16 25]\n\n# 矩阵乘法\nA = np.array([[1, 2], [3, 4]])\nB = np.array([[5, 6], [7, 8]])\nprint(A @ B)  # [[19 22] [43 50]]\n\n# 手算A@B：\n# [1,2]@[5,6] = 1*5+2*7=19, 1*6+2*8=22\n# [3,4]@[5,6] = 3*5+4*7=43, 3*6+4*8=50"),
        code("Pandas入门 — 表格数据之王",
             "<p>核心结构：Series（一列）和DataFrame（整张表）</p>",
             "import pandas as pd\n\n# DataFrame创建\ndf = pd.DataFrame({\n    \"name\": [\"Alice\", \"Bob\", \"Carol\"],\n    \"age\": [25, 30, 28],\n    \"score\": [85, 92, 78]\n})\nprint(df)\n#     name  age  score\n# 0  Alice   25     85\n# 1    Bob   30     92\n# 2  Carol   28     78\n\n# 筛选\nprint(df[df[\"score\"] > 80])\n\n# 分组聚合\ndf2 = pd.DataFrame({\n    \"brand\": [\"Toyota\", \"Toyota\", \"Honda\", \"Honda\"],\n    \"score\": [85, 88, 90, 87]\n})\nprint(df2.groupby(\"brand\")[\"score\"].mean())"),
        code("文件读写 — with语句",
             "<p><b>with语句</b>自动管理资源，离开代码块自动关闭文件</p>",
             "# 读取文件\nwith open(\"data.txt\", \"r\", encoding=\"utf-8\") as f:\n    content = f.read()\n\n# 逐行读取\nwith open(\"data.txt\", \"r\", encoding=\"utf-8\") as f:\n    for line in f:\n        line = line.strip()\n        if line:\n            print(line)\n\n# 写入文件\nwith open(\"output.txt\", \"w\", encoding=\"utf-8\") as f:\n    f.write(\"Hello Python!\\n\")\n    f.write(\"第二行内容\\n\")"),
        exercise("Python测验（5题）",
                 "<p><b>Q1：</b>[x + 1 for x in range(4) if x % 2 == 0] 的结果是什么？</p><p><b>Q2：</b>Python的True和JS的true有什么区别？</p><p><b>Q3：</b>NumPy数组A=[[1,2],[3,4]]和B=[[1,0],[0,1]]，A@B和A*B分别是什么？</p><p><b>Q4：</b>Pandas中df.shape返回什么？</p><p><b>Q5：</b>Python函数中self的作用是什么？和JS的this有什么不同？</p>",
                 "<p><b>A1：</b>[1, 3]（x=0→1, x=2→3）</p><p><b>A2：</b>Python布尔值首字母大写（True/False），JS全小写。if true:会报NameError</p><p><b>A3：</b>A@B=[[1,2],[3,4]]（单位矩阵不变），A*B=[[1,0],[0,4]]（逐元素乘）</p><p><b>A4：</b>(行数, 列数)元组</p><p><b>A5：</b>Python的self显式传入，逻辑清晰；JS的this隐式决定，容易混淆</p>")
    ]
})

# ==============================
# COURSE 3: optimizer
# ==============================
lessons.append({
    "slug": "optimizer",
    "title": "02. 优化器",
    "description": "从BGD/SGD到Adam，彻底搞懂梯度下降算法，学会调参",
    "category": "python",
    "phase": "A",
    "order": 2,
    "sections": [
        text("训练的本质",
             "<p>训练的本质就是：找到一组参数W（成千上万个），让损失L最小。优化器就是用来高效找到\"差不多最优\"的W的算法。</p><p><b>核心问题：</b>已知损失L对参数W的梯度∇L（告诉\"往哪个方向损失降得最快\"），我们要沿着这个方向走多远（学习率α×梯度）？</p>"),
        comparison("三种基础梯度下降对比",
                   "<table><tr><th>方法</th><th>公式</th><th>每次用多少数据</th><th>优点</th><th>缺点</th></tr><tr><td><b>BGD</b></td><td>W=W-α×∇L(W)</td><td>全部样本</td><td>收敛稳定</td><td>慢（大数据集跑不动）</td></tr><tr><td><b>SGD</b></td><td>W=W-α×∇L(x_i,y_i)</td><td>1个样本</td><td>快，能跳出局部最优</td><td>震荡大，不稳定</td></tr><tr><td><b>Mini-Batch GD</b></td><td>W=W-α×∇L(batch)</td><td>32-256个样本</td><td>平衡速度和稳定性</td><td>需要调batch size</td></tr></table>"),
        text("Momentum动量 — 解决震荡",
             "<p><b>物理直觉：</b>保龄球从山上滚下来——它有惯性，即使短暂遇到小坑，也会继续往前。</p><p>SGD的问题在于梯度方向忽左忽右。Momentum通过累积历史梯度方向做平滑。</p>"),
        formula("Momentum公式（逐项拆解）",
                "<pre>v_t = β × v_(t-1) + ∇L(W_t)        # 公式1：累积速度<br>W_(t+1) = W_t - α × v_t            # 公式2：更新参数</pre><p><b>参数含义：</b></p><table><tr><th>符号</th><th>名称</th><th>含义</th><th>典型值</th></tr><tr><td>v_t</td><td>速度</td><td>累积梯度方向（历史加权平均）</td><td>随训练变化</td></tr><tr><td>β</td><td>动量系数</td><td>保留旧速度的比例</td><td>0.9（默认）</td></tr><tr><td>α</td><td>学习率</td><td>步长大小</td><td>0.001-0.1</td></tr><tr><td>∇L</td><td>梯度</td><td>当前方向</td><td>由反向传播计算</td></tr></table>"),
        example("Momentum数值例子（β=0.9, α=0.01）",
                "<p><b>三步梯度依次为：</b>5, 3, -2（第三步方向反了）</p><pre>第1步：v₁ = 0.9×0 + 5 = 5.0<br>        W₂ = W₁ - 0.01×5 = W₁ - 0.05<br><br>第2步：v₂ = 0.9×5 + 3 = 4.5+3 = 7.5<br>        W₃ = W₂ - 0.01×7.5 = W₂ - 0.075<br><br>第3步：v₃ = 0.9×7.5 + (-2) = 6.75-2 = 4.75<br>        W₄ = W₃ - 0.01×4.75 = W₃ - 0.0475</pre><p><b>关键观察：</b>即使第3步梯度变成-2（反向），v₃仍然为正（4.75）！这就是动量抗震荡的原理——历史速度抵消了噪声。</p>"),
        formula("Adam完整公式（5行）",
                "<p><b>Adam = Momentum + RMSProp</b></p><pre># 第1行：一阶矩（方向平滑）<br>m_t = β₁ × m_(t-1) + (1-β₁) × ∇L<br><br># 第2行：二阶矩（自适应步长）<br>v_t = β₂ × v_(t-1) + (1-β₂) × (∇L)²<br><br># 第3-4行：偏差修正（初始值偏0的补偿）<br>m̂_t = m_t / (1 - β₁^t)<br>v̂_t = v_t / (1 - β₂^t)<br><br># 第5行：更新参数<br>W_(t+1) = W_t - α × m̂_t / (√v̂_t + ε)</pre>"),
        table_s("Adam参数含义表",
                "<table><tr><th>符号</th><th>名称</th><th>含义</th><th>典型值</th></tr><tr><td>m_t</td><td>一阶矩</td><td>梯度加权平均=方向</td><td>随训练变化</td></tr><tr><td>v_t</td><td>二阶矩</td><td>梯度平方加权平均=震荡幅度</td><td>随训练变化</td></tr><tr><td>β₁</td><td>一阶衰减率</td><td>约看最近10步方向</td><td>0.9</td></tr><tr><td>β₂</td><td>二阶衰减率</td><td>约看最近1000步震荡</td><td>0.999</td></tr><tr><td>ε</td><td>小常数</td><td>防除以0</td><td>1e-8</td></tr><tr><td>√v̂_t</td><td>自适应学习率</td><td>梯度大→步长小，梯度小→步长大</td><td>核心创新</td></tr></table>"),
        example("为什么需要偏差修正？",
                "<p>训练第1步：m₀=0, β₁=0.9</p><pre>m₁ = 0.9×0 + 0.1×∇L = 0.1×∇L</pre><p><b>严重低估了！</b>实际一阶矩应该是∇L，但计算结果是0.1×∇L</p><p><b>偏差修正：</b>m̂₁ = 0.1×∇L / (1-0.9¹) = 0.1×∇L / 0.1 = ∇L</p><p>随着t增大，1-β₁^t → 1，修正自动消失。</p>"),
        code("PyTorch实战",
             "<p>Momentum SGD和Adam的一行调用</p>",
             "import torch\nimport torch.nn as nn\n\nmodel = nn.Linear(10, 1)\n\n# Momentum SGD\noptimizer = torch.optim.SGD(\n    model.parameters(),\n    lr=0.01,\n    momentum=0.9\n)\n\n# Adam（默认推荐）\noptimizer = torch.optim.Adam(\n    model.parameters(),\n    lr=1e-3,\n    betas=(0.9, 0.999),\n    eps=1e-8\n)\n\n# 训练循环\nfor epoch in range(100):\n    loss = compute_loss(model, data)\n    optimizer.zero_grad()\n    loss.backward()   # 计算梯度\n    optimizer.step()  # 更新参数"),
        table_s("优化器选择指南",
                "<table><tr><th>场景</th><th>推荐优化器</th><th>原因</th></tr><tr><td>简单任务，数据少</td><td>SGD + Momentum</td><td>调参简单，收敛快</td></tr><tr><td>默认选择</td><td><b>Adam</b></td><td>自适应，几乎不用调参</td></tr><tr><td>Transformer/LLM</td><td><b>AdamW</b></td><td>带权重衰减，防过拟合</td></tr><tr><td>GAN/复杂任务</td><td>Adam（β₁=0.5）</td><td>降低一阶矩记忆，更响应变化</td></tr></table>"),
        exercise("优化器练习（5题）",
                 "<p><b>Q1：</b>SGD的一个问题是梯度\"震荡大\"，Momentum如何解决？</p><p><b>Q2：</b>Adam中一阶矩m_t和二阶矩v_t分别起什么作用？</p><p><b>Q3：</b>β₁=0.9和β₂=0.999分别意味着什么？</p><p><b>Q4：</b>训练loss震荡严重不降，你会怎么调？</p><p><b>Q5：</b>β₁=0.5时有效记忆是多少步？为什么GAN中偶尔用这个值？</p>",
                 "<p><b>A1：</b>通过累积历史梯度的加权平均（v_t=β×v_{t-1}+∇L），前后方向互相抵消震荡，保留主方向。</p><p><b>A2：</b>m_t决定\"往哪个方向走\"（方向平滑），v_t决定\"每一步走多大\"（自适应步长）。</p><p><b>A3：</b>β₁=0.9约看最近10步梯度方向；β₂=0.999约看最近1000步梯度震荡。</p><p><b>A4：</b>①降低学习率(1e-4试试) ②增大Momentum β到0.95 ③换Adam ④检查batch size</p><p><b>A5：</b>有效记忆≈1/(1-β₁)=2步。GAN中生成器需快速响应判别器变化，短记忆更适合。</p>")
    ]
})

# ==============================
# COURSE 4: activation
# ==============================
lessons.append({
    "slug": "activation",
    "title": "03. 激活函数",
    "description": "Sigmoid/ReLU/GELU/Softmax，每个函数的数学原理+数值计算+选择指南",
    "category": "python",
    "phase": "A",
    "order": 3,
    "sections": [
        text("为什么需要非线性激活函数？",
             "<p>没有非线性激活函数 → 多层=线性变换叠加 → 等价于1层 → 无法学习复杂函数。<b>核心原因：</b>线性函数的复合仍然是线性函数。</p><p>可以这么想：无论你堆多少层y=Wx+b，最后都可以合并成一层y=W_total x + b_total。<b>你叠了50层=只叠了1层！</b>激活函数就是让网络有\"表达能力\"的关键。</p>"),
        formula("Sigmoid — 历史元老",
                "<p><b>公式：</b>σ(x) = 1 / (1 + e^(-x))</p><p><b>输出范围：</b>(0, 1)，S形曲线</p><p><b>导数：</b>σ'(x) = σ(x) × (1 - σ(x))</p><p><b>逐符号解释：</b></p><table><tr><th>符号</th><th>取值</th><th>含义</th></tr><tr><td>σ(x)</td><td>(0, 1)</td><td>Sigmoid输出值</td></tr><tr><td>x</td><td>(-∞, +∞)</td><td>输入（任意实数）</td></tr><tr><td>e^(-x)</td><td>(0, +∞)</td><td>指数衰减</td></tr></table>"),
        example("Sigmoid数值例子",
                "<p><b>手算验证：</b></p><pre>x=0:   σ(0) = 1/(1+e⁰) = 1/2 = 0.5,      σ'(0) = 0.5×0.5 = 0.25<br>x=1:   σ(1) = 1/(1+0.368) ≈ 0.7311,     σ'(1) ≈ 0.7311×0.2689 ≈ 0.1967<br>x=2:   σ(2) = 1/(1+0.135) ≈ 0.8808,     σ'(2) ≈ 0.8808×0.1192 ≈ 0.1049<br>x=-2:  σ(-2)= 1/(1+7.389) ≈ 0.1192,     σ'(-2)≈ 0.1192×0.8808 ≈ 0.1049<br></pre><p><b>关键观察：</b>σ'(0)=0.25是最大值。当|x|越大，σ'(x)→0。这就是梯度消失的根源——深层网络中连乘极小的导数，梯度趋零。</p>"),
        text("Sigmoid的致命弱点",
             "<table><tr><th>问题</th><th>描述</th><th>影响</th></tr><tr><td><b>梯度消失</b></td><td>σ'(x)最大0.25，|x|大时趋近0</td><td>10层网络连乘后0.25¹⁰≈0.000001，梯度几乎为0</td></tr><tr><td><b>非零中心</b></td><td>输出范围(0,1)，始终为正</td><td>梯度更新时所有参数同方向，zigzag收敛慢</td></tr><tr><td><b>计算慢</b></td><td>涉及指数计算</td><td>比ReLU慢几十倍</td></tr></table>"),
        formula("ReLU — 现代主流",
                "<p><b>公式：</b>f(x) = max(0, x)</p><p><b>导数：</b></p><table><tr><th>条件</th><th>f(x)</th><th>f'(x)</th></tr><tr><td>x > 0</td><td>x（原样输出）</td><td>1（梯度完全传递）</td></tr><tr><td>x ≤ 0</td><td>0（硬截断）</td><td>0（无梯度）</td></tr></table><p><b>优势：</b>①计算极快（一次比较）②正区间梯度恒为1（无梯度消失）③稀疏激活（约50%输出0）④收敛快6倍</p>"),
        text("死亡ReLU问题（重要！）",
             "<p><b>现象：</b>如果某个神经元的输入总是≤0，输出恒为0，梯度恒为0，这个神经元永久性\"死亡\"。</p><p><b>发生条件：</b></p><ul><li>学习率太大：参数更新越界跳入负区间</li><li>负偏置初始化：b初始为负</li><li>某些特征缺失</li></ul><p><b>数值例子：</b>W=-0.5, b=-2，当所有输入x≤4时，z=-0.5x-2≤0，ReLU(z)=0，神经元永远不更新！</p>"),
        table_s("ReLU家族对比",
                "<table><tr><th>函数</th><th>公式</th><th>负数部分</th><th>优点</th><th>缺点</th></tr><tr><td>ReLU</td><td>max(0,x)</td><td>0</td><td>简单、计算快</td><td>死亡ReLU</td></tr><tr><td>Leaky ReLU</td><td>max(αx,x)</td><td>αx（如0.01）</td><td>缓解死亡</td><td>α需手动调</td></tr><tr><td>PReLU</td><td>max(αx,x)</td><td>αx（可学习）</td><td>α自适应</td><td>略增参数量</td></tr><tr><td>ELU</td><td>x if x>0; α(eˣ-1) if x≤0</td><td>α(eˣ-1)</td><td>光滑、零均值</td><td>计算稍慢</td></tr></table>"),
        example("Leaky ReLU数值对比",
                "<p><b>Leaky ReLU（α=0.01）：</b></p><pre>x=5:  max(0.05, 5) = 5     ✓ 正数不变<br>x=-3: max(-0.03, -3) = -0.03  ✓ 负数有微小梯度（不死亡）<br>x=0:  max(0, 0) = 0</pre><p><b>对比ReLU：</b>x=-3 → 0（死亡），Leaky ReLU → -0.03（还能学习！）</p>"),
        formula("GELU — Transformer标配",
                "<p><b>公式：</b>GELU(x) = x × Φ(x)，Φ(x)是标准正态CDF</p><p><b>近似计算（BERT用的）：</b></p><pre>GELU(x) ≈ 0.5x × (1 + tanh(√(2/π) × (x + 0.044715x³)))<br>或：GELU(x) ≈ x × sigmoid(1.702x)</pre><p><b>为什么Transformer用GELU？</b>GELU是\"软门控\"——用小正数概率保留负值信息，不是ReLU的\"硬截断\"。在Transformer中，注意力机制需要细粒度控制信息流动。</p>"),
        example("GELU数值对比ReLU",
                "<p><b>GELU(x) ≈ x × sigmoid(1.702x)：</b></p><pre>x=2:  sigmoid(3.404)=0.968, GELU≈1.936  ReLU=2.0  （几乎相同）<br>x=1:  sigmoid(1.702)=0.846, GELU≈0.846  ReLU=1.0  （GELU稍衰减）<br>x=0:  sigmoid(0)=0.5,      GELU=0        ReLU=0    （相同）<br>x=-1: sigmoid(-1.702)=0.154,GELU≈-0.154 ReLU=0    （GELU保留负信息！）<br>x=-3: sigmoid(-5.106)=0.006,GELU≈-0.018 ReLU=0    （大负数接近0）</pre><p><b>GELU的软门控特性：</b>负值区域有一定保留，不是一刀切。</p>"),
        formula("Softmax — 多分类输出层",
                "<p><b>公式：</b>softmax(z_i) = e^(z_i) / Σ(e^(z_j))</p><p>输入任意实数向量，输出K个和为1的正数（概率分布）。</p><p><b>数值稳定性技巧：</b>先减去最大值max(z)</p><pre>softmax(z_i) = e^(z_i - max(z)) / Σ(e^(z_j - max(z)))</pre><p>防止e^(大数)溢出。</p>"),
        example("Softmax完整数值例子",
                "<p><b>3分类任务，原始得分z=[2.0, 1.0, 0.1]：</b></p><pre>第1步：指数<br>  e²·⁰ = 7.389, e¹·⁰ = 2.718, e⁰·¹ = 1.105<br><br>第2步：指数和 = 7.389 + 2.718 + 1.105 = 11.212<br><br>第3步：概率<br>  softmax(z₁) = 7.389/11.212 = 0.659 (65.9%)<br>  softmax(z₂) = 2.718/11.212 = 0.242 (24.2%)<br>  softmax(z₃) = 1.105/11.212 = 0.099 (9.9%)<br><br>验证：0.659+0.242+0.099=1.000 ✓<br>预测类别1（概率最高65.9%）</pre>"),
        code("PyTorch激活函数实战",
             "<p>不同场景的激活函数选择</p>",
             "import torch.nn as nn\n\n# 隐藏层用ReLU（默认选择）\nmodel = nn.Sequential(\n    nn.Linear(128, 64),\n    nn.ReLU(),           # ✅ 默认隐藏层\n    nn.Linear(64, 32),\n    nn.GELU(),           # ✅ Transformer用GELU\n    nn.Linear(32, 1),\n    nn.Sigmoid()         # ✅ 二分类输出用Sigmoid\n)\n\n# 出现死亡ReLU时\nmodel = nn.Sequential(\n    nn.Linear(128, 64),\n    nn.LeakyReLU(0.01),\n    nn.Linear(64, 1),\n    nn.Sigmoid()\n)"),
        exercise("激活函数练习（5题）",
                 "<p><b>Q1：</b>Sigmoid导数最大值是多少？在哪一点达到？</p><p><b>Q2：</b>死亡ReLU是什么？如何诊断和修复？</p><p><b>Q3：</b>Transformer为什么用GELU不用ReLU？</p><p><b>Q4：</b>手算softmax：z=[1.0, 2.0, 3.0]的概率分布</p><p><b>Q5：</b>50层Sigmoid网络的梯度会怎样？</p>",
                 "<p><b>A1：</b>σ'(x)最大值0.25，在x=0时达到。导致深层网络梯度消失。</p><p><b>A2：</b>神经元永远输出0不更新。诊断：大量隐藏单元始终输出0。修复：Leaky ReLU、降低学习率、He初始化、BatchNorm。</p><p><b>A3：</b>GELU是软门控——负值保留部分信息（x=-1→-0.15），ReLU硬截断（x=-1→0）。软门控更适合注意力机制的细粒度信息流动。</p><p><b>A4：</b>p=[0.090, 0.245, 0.665]，预测类别3（66.5%）。</p><p><b>A5：</b>0.25⁵⁰ ≈ 7.9×10⁻³¹，第一层几乎不更新，完全不学习。</p>")
    ]
})

# ==============================
# COURSE 5: loss
# ==============================
lessons.append({
    "slug": "loss",
    "title": "04. 损失函数",
    "description": "MSE/CrossEntropy/BCE/Focal/Hinge，每种损失的数学原理+调试指南",
    "category": "python",
    "phase": "A",
    "order": 4,
    "sections": [
        text("损失函数的本质",
             "<p><b>损失函数 = 衡量模型预测ŷ与真实标签y之间差距的\"裁判\"</b>。损失值越小，模型预测越准。训练就是让这个裁判的评分越来越低。</p><p><b>核心思路：</b>回归问题用MSE衡量距离，分类问题用CE衡量概率分布差异。</p>"),
        formula("MSE（均方误差）— 回归任务标准",
                "<p><b>公式：</b>L_MSE = (1/n) × Σ(y_i - ŷ_i)²</p><table><tr><th>符号</th><th>含义</th><th>比喻</th></tr><tr><td>n</td><td>样本数量</td><td>评委人数——取平均</td></tr><tr><td>y_i</td><td>真实值</td><td>靶心</td></tr><tr><td>ŷ_i</td><td>预测值</td><td>箭的位置</td></tr><tr><td>(y-ŷ)²</td><td>平方误差</td><td>误差越大惩罚越重（平方放大）</td></tr></table><p><b>偏导：</b>∂L/∂ŷ = -2(y-ŷ)/n — 误差越大，梯度越大。</p>"),
        example("MSE数值例子",
                "<p><b>房价预测，3个样本：</b></p><table><tr><th>样本</th><th>真实y</th><th>预测ŷ</th><th>(y-ŷ)²</th></tr><tr><td>1</td><td>1.0M</td><td>1.2</td><td>0.04</td></tr><tr><td>2</td><td>2.0M</td><td>2.1</td><td>0.01</td></tr><tr><td>3</td><td>3.0M</td><td>2.9</td><td>0.01</td></tr></table><pre>MSE = (0.04+0.01+0.01)/3 = 0.06/3 = 0.02<br>RMSE = √0.02 ≈ 0.141（百万≈14.1万）</pre><p><b>局限性：</b>对异常值极其敏感。一个离群点(y=100, ŷ=1, 误差99²=9801)可以完全主导损失。</p>"),
        formula("CrossEntropy（交叉熵）— 分类任务标准",
                "<p><b>公式：</b>L_CE = -Σ y_i × log(p_i)</p><table><tr><th>符号</th><th>含义</th><th>比喻</th></tr><tr><td>y_i</td><td>one-hot真实标签</td><td>标准答案（只有一个1）</td></tr><tr><td>p_i</td><td>Softmax预测概率</td><td>模型猜测</td></tr><tr><td>log(p_i)</td><td>对数概率</td><td>p→1时log→0（无惩罚），p→0时log→-∞（巨大惩罚）</td></tr></table><p><b>⭐ 魔法公式：</b>∂L/∂z_i = p_i - y_i（梯度=预测-真实）</p>"),
        example("交叉熵数值例子",
                "<p><b>3分类（猫/狗/鸟），真实是\"狗\"：</b></p><table><tr><th>类别</th><th>真实y</th><th>预测p</th><th>y×log(p)</th></tr><tr><td>猫</td><td>0</td><td>0.3</td><td>0</td></tr><tr><td>狗✅</td><td>1</td><td>0.6</td><td>log(0.6)=-0.51</td></tr><tr><td>鸟</td><td>0</td><td>0.1</td><td>0</td></tr></table><pre>L_CE = -(-0.51) = 0.51</pre><p>如果模型在\"狗\"上概率0.9：log(0.9)=-0.105，L=0.105（惩罚更小）<br>如果概率0.3：log(0.3)=-1.204，L=1.204（惩罚更大）</p>"),
        text("为什么分类用CE不用MSE？",
             "<table><tr><th>损失</th><th>错误分类的梯度</th><th>正确分类的梯度</th></tr><tr><td>CE+Softmax</td><td>梯度大（分得清）</td><td>趋近0</td></tr><tr><td>MSE+Softmax</td><td>≈0（双重梯度消失）</td><td>≈0（双重梯度消失）</td></tr></table><p>MSE配Softmax几乎处处梯度消失！MSE梯度本来就小，经过Softmax再乘小值……学不动。</p>"),
        formula("BCE（二分类交叉熵）",
                "<p><b>公式：</b>L_BCE = -[y×log(p) + (1-y)×log(1-p)]</p><p><b>PyTorch推荐：</b><code>nn.BCEWithLogitsLoss()</code>（内部自动Sigmoid+数值稳定）</p><p><b>不要：</b>手动sigmoid+BCELoss（数值不稳定，可能NaN）</p>"),
        example("BCE数值例子",
                "<p><b>邮件垃圾分类，2个样本：</b></p><table><tr><th>样本</th><th>真实y</th><th>预测p</th><th>各部分</th></tr><tr><td>垃圾邮件</td><td>1</td><td>0.8</td><td>-log(0.8)=0.223</td></tr><tr><td>正常邮件</td><td>0</td><td>0.2</td><td>-log(0.8)=0.223</td></tr></table><pre>平均BCE = (0.223+0.223)/2 = 0.223</pre>"),
        formula("Focal Loss — 解决类别不平衡",
                "<p><b>公式：</b>L_Focal = -(1 - p_t)^γ × log(p_t)</p><p>其中p_t = p（y=1时）或 1-p（y=0时）</p><p><b>核心思想：</b>降低易分类样本的权重，让模型专注于难分类样本。</p><p><b>γ=0时退化为BCE；γ=2是推荐值。</b></p>"),
        table_s("损失函数选择指南",
                "<table><tr><th>任务</th><th>推荐损失</th><th>输出层</th></tr><tr><td>回归（连续值预测）</td><td>MSE</td><td>Linear</td></tr><tr><td>回归（抗异常值）</td><td>MAE/Huber</td><td>Linear</td></tr><tr><td>二分类</td><td>BCEWithLogitsLoss</td><td>Linear+内部Sigmoid</td></tr><tr><td>多分类</td><td>CrossEntropyLoss</td><td>Linear+内部Softmax</td></tr><tr><td>多标签分类</td><td>BCEWithLogitsLoss</td><td>Linear(C个输出)</td></tr><tr><td>类别极度不平衡</td><td>Focal Loss</td><td>Linear+内部Sigmoid</td></tr></table>"),
        text("Loss调试指南",
             "<p><b>常见问题与解决方案：</b></p><table><tr><th>现象</th><th>可能原因</th><th>解决</th></tr><tr><td>Loss震荡不降</td><td>学习率太大/batch太小</td><td>降低lr/增大batch/换Adam</td></tr><tr><td>Loss卡住不降</td><td>梯度消失/局部最优</td><td>检查激活函数/降低lr精细搜索</td></tr><tr><td>Loss突然NaN</td><td>梯度爆炸/log(0)</td><td>梯度裁剪/用内置损失函数</td></tr><tr><td>训练loss↓但验证loss↑</td><td>过拟合</td><td>Dropout/权重衰减/early stopping</td></tr></table>"),
        exercise("损失函数练习（5题）",
                 "<p><b>Q1：</b>回归任务y=[2,4,6], ŷ=[1.8,4.3,5.7]，手算MSE</p><p><b>Q2：</b>3分类Softmax输出[0.2,0.7,0.1]，标签[0,1,0]，手算CE</p><p><b>Q3：</b>二分类预测[0.9,0.4]，标签[1,0]，手算BCE（平均）</p><p><b>Q4：</b>为什么分类用CE不用MSE？</p><p><b>Q5：</b>Loss突然变成NaN，如何排查？</p>",
                 "<p><b>A1：</b>MSE=(0.04+0.09+0.09)/3=0.22/3≈0.0733</p><p><b>A2：</b>只看正确类log(0.7)=-0.3567, L=0.3567</p><p><b>A3：</b>样本1:-log(0.9)=0.105, 样本2:-log(0.6)=0.511, 平均=0.308</p><p><b>A4：</b>MSE+Softmax双重梯度消失，CE+Softmax梯度=预测-真实永不消失。且CE有信息论意义。</p><p><b>A5：</b>①检查是否用了内部损失函数 ②检查梯度是否爆炸 ③检查输入NaN ④降低lr</p>")
    ]
})

# ==============================
# COURSE 6: training-tricks
# ==============================
lessons.append({
    "slug": "training-tricks",
    "title": "1.6 训练技巧",
    "description": "Dropout/L2正则化/梯度裁剪/Warmup/BatchNorm/LayerNorm，让训练更稳更快",
    "category": "python",
    "phase": "A",
    "order": 5,
    "sections": [
        text("为什么需要训练技巧？",
             "<p>训练神经网络就像调教一匹烈马：学习率太大→震荡发散，太小→跑不动；数据不够→过拟合；梯度爆炸→NaN。训练技巧就是<b>驯马的工具箱</b>——每种技巧解决一个特定问题。</p>"),
        text("过拟合与欠拟合",
             "<p><b>过拟合：</b>模型把训练集\"背下来了\"，训练loss很低，验证loss很高。就像学生死记硬背答案，换道题就不会了。</p><p><b>欠拟合：</b>模型连训练集都没学会，训练loss和验证loss都高。就像学生什么都没学进去。</p><p><b>理想：</b>训练loss和验证loss都低，且两者差距小。</p>"),
        formula("Dropout — 随机丢弃神经元",
                "<p><b>思想：</b>每次训练时随机让一些神经元\"罢工\"（输出设为0），迫使网络学会冗余表示，不依赖单个神经元。</p><p><b>数学：</b>r ~ Bernoulli(p)，输出 = r × x / p</p><p><b>训练时：</b>每个神经元以概率p保留，以概率1-p丢弃</p><p><b>推理时：</b>所有神经元全开，输出乘以p（确保期望一致）</p><p><b>典型值：</b>p=0.5（全连接层），p=0.2（卷积层）</p>"),
        example("Dropout数值例子",
                "<p><b>假设p=0.5，一个神经元输出x=10：</b></p><pre>训练时：<br>  r ~ Bernoulli(0.5)，假设r=1（保留）→ 输出 = 10/0.5 = 20<br>  假设r=0（丢弃）→ 输出 = 0<br><br>推理时：<br>  输出 = 10 × 0.5 = 5<br><br>为什么训练时要除以p？<br>  因为训练时只有50%的神经元工作，为了保持总激活强度，保留的神经元要加倍输出。</pre>"),
        formula("L2正则化（权重衰减）",
                "<p><b>思想：</b>让权重不要太大——越大的权重对输入噪声越敏感。</p><p><b>数学：</b>L_total = L_original + λ × Σw_i²</p><p>λ是正则化强度（典型值0.0001-0.01）。L2惩罚项让权重的平方和尽量小。</p><p><b>梯度视角：</b>∂L_total/∂w = ∂L_original/∂w + 2λw</p><p>每次更新时，权重重自动向0缩一点点——所以叫\"权重衰减\"。</p>"),
        code("PyTorch中的正则化",
             "<p>Dropout和权重衰减的一行代码</p>",
             "model = nn.Sequential(\n    nn.Linear(128, 64),\n    nn.ReLU(),\n    nn.Dropout(p=0.5),     # 50%神经元随机丢弃\n    nn.Linear(64, 32),\n    nn.ReLU(),\n    nn.Dropout(p=0.3),     # 靠近输出层，丢弃少一点\n    nn.Linear(32, 1)\n)\n\n# 优化器中设置weight_decay即L2正则化\noptimizer = torch.optim.Adam(\n    model.parameters(),\n    lr=1e-3,\n    weight_decay=0.0001    # L2正则化强度λ\n)"),
        text("梯度裁剪 — 防止梯度爆炸",
             "<p><b>问题：</b>梯度累乘后变得极大（>1e10），参数更新一步跳太远，Loss直接变NaN。</p><p><b>方法：</b>设置一个阈值，当梯度范数超过阈值时，等比例缩放梯度：<br>if ||g|| > max_norm: g = g × max_norm / ||g||</p><p><b>典型值：</b>max_norm=1.0 或 5.0</p><p><b>生活类比：</b>给汽车的油门装一个限速器——油门踩到底也只能跑120km/h，不会飞出去。</p>"),
        code("梯度裁剪实战",
             "",
             "# 方法1：对梯度范数裁剪\noptimizer.zero_grad()\nloss.backward()\ntorch.nn.utils.clip_grad_norm_(\n    model.parameters(),\n    max_norm=1.0  # 梯度范数最大为1\n)\noptimizer.step()\n\n# 方法2：对梯度值裁剪（每个元素）\ntorch.nn.utils.clip_grad_value_(\n    model.parameters(),\n    clip_value=0.5  # 梯度值在[-0.5, 0.5]之间\n)"),
        text("Warmup — 学习率预热",
             "<p><b>问题：</b>训练初期模型参数是随机初始化的，梯度方向很不准确。此时用大的学习率会导致震荡。</p><p><b>方法：</b>前N步学习率从0线性增加到目标值，之后正常衰减。</p><pre>lr(t) = lr_target × t / warmup_steps   (t < warmup_steps)<br>lr(t) = lr_target × ...其余衰减策略        (t ≥ warmup_steps)</pre><p><b>典型值：</b>warmup_steps=1000-4000步（大模型可能需要更多）</p>"),
        comparison("BatchNorm vs LayerNorm",
                   "<table><tr><th>特性</th><th>Batch Normalization</th><th>Layer Normalization</th></tr><tr><td>归一化维度</td><td>跨batch（同通道的所有样本）</td><td>跨特征（单样本的所有通道）</td></tr><tr><td>依赖batch大小</td><td>✅ 需要大batch</td><td>❌ 不依赖batch大小</td></tr><tr><td>训练/推理行为</td><td>不同（训练用batch统计，推理用全局统计）</td><td>相同（始终独立计算每个样本）</td></tr><tr><td>适用架构</td><td>CNN（ResNet）</td><td>RNN/Transformer（GPT/BERT）</td></tr><tr><td>计算公式</td><td>BN(x) = γ×(x-μ_B)/σ_B + β</td><td>LN(x) = γ×(x-μ_L)/σ_L + β</td></tr></table>"),
        formula("BatchNorm详解",
                "<p><b>训练时对每个mini-batch计算：</b></p><pre>μ_B = (1/m) × Σx_i          # batch均值<br>σ²_B = (1/m) × Σ(x_i-μ_B)² # batch方差<br>x̂_i = (x_i - μ_B) / √(σ²_B + ε)  # 归一化<br>y_i = γ × x̂_i + β                  # 缩放+平移</pre><p>γ和β是可学习参数，ε=1e-5防止除以0。</p><p><b>效果：</b>让每层输入保持均值0方差1，即使前层参数变化，后层输入保持稳定。</p>"),
        formula("LayerNorm详解",
                "<p><b>对单样本的所有特征计算：</b></p><pre>μ_L = (1/H) × Σx_i          # 单样本的特征均值<br>σ²_L = (1/H) × Σ(x_i-μ_L)² # 单样本的特征方差<br>x̂_i = (x_i - μ_L) / √(σ²_L + ε)<br>y_i = γ × x̂_i + β</pre><p>H是特征维度。Transformer中d_model=512维，每层对512维做归一化。</p><p><b>为什么Transformer用LN不用BN？</b></p><ol><li>序列长度可变：BN需要固定batch大小，Transformer输入长度可变</li><li>BN对batch size敏感：训练大模型时batch可能很小</li><li>LN每个样本独立：推理时行为一致</li></ol>"),
        code("BN和LN的PyTorch实现",
             "",
             "import torch.nn as nn\n\n# BatchNorm（用于CNN）\nmodel_cnn = nn.Sequential(\n    nn.Conv2d(3, 64, 3),\n    nn.BatchNorm2d(64),  # 64个通道各有一个γ和β\n    nn.ReLU()\n)\n\n# LayerNorm（用于Transformer/LLM）\nmodel_transformer = nn.Sequential(\n    nn.Linear(512, 2048),\n    nn.LayerNorm(2048),   # 2048维特征各有一个γ和β\n    nn.GELU()\n)"),
        table_s("训练技巧速查表",
                "<table><tr><th>技巧</th><th>解决什么问题</th><th>典型参数</th></tr><tr><td>Dropout</td><td>过拟合</td><td>p=0.5（全连接）/ p=0.2（卷积）</td></tr><tr><td>L2正则化</td><td>过拟合</td><td>λ=1e-4</td></tr><tr><td>梯度裁剪</td><td>梯度爆炸→NaN</td><td>max_norm=1.0</td></tr><tr><td>Warmup</td><td>训练初期震荡</td><td>warmup_steps=1000-4000</td></tr><tr><td>BatchNorm</td><td>内部协变量偏移</td><td>momentum=0.1</td></tr><tr><td>LayerNorm</td><td>序列模型训练不稳</td><td>elementwise_affine=True</td></tr></table>"),
        exercise("训练技巧练习（5题）",
                 "<p><b>Q1：</b>Dropout训练时为什么要除以p？推理时为什么不做dropout？</p><p><b>Q2：</b>L2正则化为什么也叫\"权重衰减\"？</p><p><b>Q3：</b>梯度裁剪的阈值过大或过小会有什么问题？</p><p><b>Q4：</b>Transformer为什么用LayerNorm而不用BatchNorm？</p><p><b>Q5：</b>训练loss和验证loss差距很大怎么办？分别列出3种方法。</p>",
                 "<p><b>A1：</b>除以p保持训练和推理的激活期望一致。推理时需用全部神经元做最好预测。</p><p><b>A2：</b>L2惩罚的梯度使权重每次更新都向0靠近一点，就像权重在\"衰减\"。</p><p><b>A3：</b>阈值过大→不起作用（还爆炸），过小→梯度太小收敛慢。</p><p><b>A4：</b>①序列长度可变 ②对batch size不敏感 ③训练推理行为一致 ④每个token独立。</p><p><b>A5：</b>①加Dropout ②加L2正则化 ③增加数据/数据增强 ④Early Stopping ⑤降低模型容量</p>")
    ]
})

# ==============================
# COURSE 7: data-prep
# ==============================
lessons.append({
    "slug": "data-prep",
    "title": "1.7 数据预处理",
    "description": "归一化/标准化/编码/数据增强，从原始数据到模型就绪",
    "category": "python",
    "phase": "A",
    "order": 6,
    "sections": [
        text("数据预处理为什么重要？",
             "<p><b>\"垃圾进，垃圾出\"（Garbage In, Garbage Out）</b>——模型的质量上限由数据质量决定，而不是模型本身。</p><p>数据预处理要解决三个核心问题：<br>① <b>尺度差异</b>：年龄（0-100）和收入（0-100万）一起训练，收入主导梯度<br>② <b>非数值数据</b>：机器学习只能吃数字\n③ <b>数据质量</b>：缺失值、异常值、重复值</p>"),
        formula("归一化（Min-Max Scaling）",
                "<p><b>公式：</b>x' = (x - x_min) / (x_max - x_min)</p><p><b>结果范围：</b>[0, 1]</p><p><b>何时用：</b>数据有明确上下界，如像素值[0,255]、分数[0,100]</p><p><b>例子：</b>年龄数据[22, 35, 18, 60, 45]</p><pre>x_min=18, x_max=60<br>22岁: x'=(22-18)/(60-18)=4/42=0.095<br>35岁: x'=(35-18)/42=17/42=0.405<br>60岁: x'=(60-18)/42=42/42=1.0</pre>"),
        formula("标准化（Z-score Normalization）",
                "<p><b>公式：</b>x' = (x - μ) / σ</p><p><b>结果：</b>均值为0，标准差为1</p><p><b>何时用：</b>数据近似正态分布，或不知道边界</p><p><b>例子：</b>年龄数据[22, 35, 18, 60, 45]</p><pre>μ=36, σ≈15.2<br>22岁: z=(22-36)/15.2=-0.92<br>35岁: z=(35-36)/15.2=-0.07<br>60岁: z=(60-36)/15.2=1.58</pre>"),
        comparison("归一化 vs 标准化",
                   "<table><tr><th>特性</th><th>归一化（Min-Max）</th><th>标准化（Z-score）</th></tr><tr><td>输出范围</td><td>[0, 1]</td><td>(-∞, +∞)，均值0标准差1</td></tr><tr><td>对异常值敏感</td><td>✅ 非常敏感（一个异常值压缩所有正常值）</td><td>❌ 相对鲁棒</td></tr><tr><td>保留分布形状</td><td>✅ 保留</td><td>✅ 保留</td></tr><tr><td>适用场景</td><td>数据有边界（像素、分数）</td><td>正态分布数据、不知道边界</td></tr></table>"),
        text("类别编码 — 把文字变成数字",
             "<p><b>One-Hot编码：</b>品牌[Toyota, Honda, Tesla] → 每个品牌一列</p><pre>Toyota → [1, 0, 0]<br>Honda  → [0, 1, 0]<br>Tesla  → [0, 0, 1]</pre><p><b>Label Encoding：</b>Toyota→0, Honda→1, Tesla→2</p><p><b>⚠️ 注意：</b>Label Encoding隐含了大小关系（0<1<2），对无序类别可能误导模型。One-Hot更安全。</p>"),
        code("数据预处理实战",
             "",
             "import pandas as pd\nimport numpy as np\nfrom sklearn.preprocessing import StandardScaler, MinMaxScaler, OneHotEncoder\n\n# 原始数据\ndf = pd.DataFrame({\n    \"age\": [22, 35, 18, 60, 45],\n    \"income\": [5000, 12000, 3000, 20000, 15000],\n    \"brand\": [\"Toyota\", \"Honda\", \"Tesla\", \"Toyota\", \"Honda\"]\n})\n\n# 标准化（Z-score）\nscaler = StandardScaler()\ndf[\"age_scaled\"] = scaler.fit_transform(df[[\"age\"]])\ndf[\"income_scaled\"] = scaler.fit_transform(df[[\"income\"]])\n\n# 归一化（Min-Max）\nminmax = MinMaxScaler()\ndf[\"age_norm\"] = minmax.fit_transform(df[[\"age\"]])\n\n# One-Hot编码\nencoder = OneHotEncoder(sparse_output=False)\nbrand_encoded = encoder.fit_transform(df[[\"brand\"]])\nbrand_df = pd.DataFrame(brand_encoded, columns=encoder.get_feature_names_out())\ndf = pd.concat([df, brand_df], axis=1)\n\nprint(df)"),
        text("数据增强 — 不花钱的扩数据",
             "<p><b>思想：</b>在不改变标签的前提下，对现有数据做微小变换，产生新的训练样本。</p><p><b>图片数据增强：</b></p><ul><li>随机旋转（±15°）</li><li>随机裁剪/缩放</li><li>颜色抖动（亮度、对比度、饱和度微调）</li><li>水平翻转</li><li>高斯噪声添加</li></ul><p><b>文本数据增强：</b></p><ul><li>同义词替换（\"good\"→\"excellent\"）</li><li>随机插入/删除</li><li>回译（中文→英文→中文）</li></ul>"),
        code("PyTorch数据增强",
             "",
             "import torchvision.transforms as transforms\n\n# 图片训练时的数据增强\n train_transform = transforms.Compose([\n    transforms.RandomResizedCrop(224),\n    transforms.RandomHorizontalFlip(p=0.5),\n    transforms.ColorJitter(\n        brightness=0.2,\n        contrast=0.2,\n        saturation=0.2,\n        hue=0.1\n    ),\n    transforms.ToTensor(),\n    transforms.Normalize(\n        mean=[0.485, 0.456, 0.406],  # ImageNet统计值\n        std=[0.229, 0.224, 0.225]\n    )\n])\n\n# 验证时只做标准化（不做增强！）\nval_transform = transforms.Compose([\n    transforms.Resize(256),\n    transforms.CenterCrop(224),\n    transforms.ToTensor(),\n    transforms.Normalize(\n        mean=[0.485, 0.456, 0.406],\n        std=[0.229, 0.224, 0.225]\n    )\n])"),
        text("数据预处理完整流程",
             "<ol><li><b>数据探索：</b>head()查看前几行，describe()看统计摘要，info()看类型和缺失</li><li><b>数据清洗：</b>处理缺失值（填充/删除）、处理异常值（IQR/Z-Score）</li><li><b>特征工程：</b>类别编码、创建新特征（如从日期提取星期几）</li><li><b>缩放：</b>标准化（Z-Score）或归一化（Min-Max）</li><li><b>分割：</b>训练集/验证集/测试集（如70%/15%/15%）</li><li><b>数据增强：</b>（仅训练集）</li></ol>"),
        exercise("数据预处理练习（5题）",
                 "<p><b>Q1：</b>标准化和归一化的主要区别是什么？</p><p><b>Q2：</b>One-Hot编码和Label Encoding各有什么优缺点？</p><p><b>Q3：</b>数据增强为什么只在训练集做而不在验证集做？</p><p><b>Q4：</b>假设有100个样本，特征\"年龄\"有一个异常值300岁，用Min-Max归一化会发生什么？</p><p><b>Q5：</b>手算：数据[10, 20, 30, 40, 50]分别做归一化和标准化。</p>",
                 "<p><b>A1：</b>归一化缩放到[0,1]，受异常值影响大。标准化使均值为0标准差为1，相对鲁棒。</p><p><b>A2：</b>One-Hot无顺序假设但维度膨胀。Label Encoding保留空间但当类别无序时误导模型。</p><p><b>A3：</b>验证集需反映真实数据分布，增强后的假样本会干扰评估。</p><p><b>A4：</b>所有正常值被压缩到[0, 0.17]之间（因为300把范围拉得太宽），信息丢失严重。</p><p><b>A5：</b>归一化：[0, 0.25, 0.5, 0.75, 1.0]。标准化：μ=30, σ≈14.1, z=[-1.41, -0.71, 0, 0.71, 1.41]</p>")
    ]
})

# ==============================
# COURSE 8: transformer
# ==============================
lessons.append({
    "slug": "transformer",
    "title": "1.1 Transformer详解",
    "description": "Self-Attention/Multi-Head/位置编码，彻底理解LLM底层架构",
    "category": "llm",
    "phase": "B",
    "order": 7,
    "sections": [
        text("Transformer是什么？",
             "<p>2017年Google论文《Attention is All You Need》提出Transformer。<b>这是过去10年最重要的AI架构</b>——没有之一。所有主流大模型（GPT/BERT/LLaMA/Qwen）都基于它。</p><p><b>三种主流架构：</b></p><table><tr><th>架构</th><th>代表模型</th><th>核心任务</th></tr><tr><td>Encoder-Only</td><td>BERT, RoBERTa</td><td>理解型（分类、检索）</td></tr><tr><td>Decoder-Only</td><td>GPT, LLaMA, Qwen, Claude</td><td>生成型（对话、写作）</td></tr><tr><td>Encoder-Decoder</td><td>T5, BART</td><td>序列到序列（翻译）</td></tr></table>"),
        text("Self-Attention — 核心中的核心",
             "<p><b>直觉：</b>每个词都\"看向\"句子中的所有其他词，计算相关性分数，决定\"多关注哪个词\"。</p><p><b>生活类比（搜索）：</b></p><table><tr><th>Transformer</th><th>搜索引擎</th></tr><tr><td>Q（Query）</td><td>你的搜索词</td></tr><tr><td>K（Key）</td><td>网页标题/标签</td></tr><tr><td>V（Value）</td><td>网页正文内容</td></tr><tr><td>Q×K^T</td><td>搜索词和标题的匹配度</td></tr><tr><td>Softmax(QK^T)×V</td><td>按匹配度加权汇总正文</td></tr></table>"),
        formula("Self-Attention公式",
                "<p><b>公式：</b>Attention(Q, K, V) = softmax(Q × K^T / √d_k) × V</p><table><tr><th>符号</th><th>维度</th><th>含义</th></tr><tr><td>Q</td><td>n × d_k</td><td>查询矩阵</td></tr><tr><td>K</td><td>n × d_k</td><td>键矩阵</td></tr><tr><td>V</td><td>n × d_v</td><td>值矩阵</td></tr><tr><td>Q×K^T</td><td>n × n</td><td>注意力分数矩阵</td></tr><tr><td>√d_k</td><td>标量</td><td>缩放因子（防止点积过大）</td></tr></table><p><b>为什么要除以√d_k？</b>点积的方差与d_k成正比。d_k=64时，点积方差≈64，Softmax进入极端区域。除以√64=8让方差恢复到1。</p>"),
        example("2×2手算Attention",
                "<p><b>2个词\"I love\"，2维向量：</b></p><pre>X = [[1, 0],   # \"I\"<br>     [0, 1]]   # \"love\"<br><br>设W_Q=W_K=W_V=单位阵，则Q=K=V=X<br><br>Step 1: QK^T = [[1,0],[0,1]]@[[1,0],[0,1]] = [[1,0],[0,1]]<br><br>Step 2: 缩放÷√2 → [[0.707, 0], [0, 0.707]]<br><br>Step 3: Softmax每行<br>  行0：softmax([0.707,0]) = [0.67, 0.33]<br>  行1：softmax([0,0.707]) = [0.33, 0.67]<br><br>Step 4: 输出=Weights×V = [[0.67,0.33],[0.33,0.67]]</pre><p><b>每个词都变成了\"自己+其他词信息\"的混合。</b></p>"),
        text("Multi-Head Attention — 多头并行",
             "<p><b>为什么需要多头？</b>一个头只能关注一种关系模式。语言中有多种关系：</p><ul><li>头1：语法关系（主谓宾）</li><li>头2：修饰关系（红色的→苹果）</li><li>头3：位置关系（before→后面）</li><li>头4：指代关系（it→dog）</li></ul><p><b>数学：</b>MultiHead = Concat(head₁,...,head_h) × W_O</p><p>每个头维度=d_model/h=512/8=64。8头拼回512维。</p>"),
        text("位置编码 — 给词加上位置信息",
             "<p><b>致命问题：</b>Self-Attention是位置无关的——\"猫追了狗\"和\"狗追了猫\"在Attention中计算结果一样！</p><p><b>解决：</b>给每个词加上位置编码，告诉模型\"这个词在第几位\"。</p><p><b>原始论文用正弦/余弦编码：</b></p><pre>PE(pos, 2i) = sin(pos / 10000^(2i/d_model))<br>PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))</pre><p>低维度（频率高）：精细区分相邻位置<br>高维度（频率低）：表示句子前半/后半</p>"),
        text("残差连接和LayerNorm",
             "<p><b>残差连接：</b>output = LayerNorm(x + Sublayer(x))</p><ul><li>缓解梯度消失：梯度可通过残差捷径直达浅层</li><li>保留原始信息：子层是在原始信息上\"补充\"而不是\"替换\"</li></ul><p><b>LayerNorm：</b>对每个token的所有特征维度做归一化（均值0方差1）</p><p><b>Transformer Block：</b></p><pre>输入X<br>  ↓<br>[Multi-Head Self-Attention]<br>[Add & LayerNorm]<br>[Feed-Forward Network (FFN)]<br>[Add & LayerNorm]<br>  ↓<br>输出（维度不变）</pre>"),
        table_s("Transformer vs RNN vs CNN",
                "<table><tr><th>维度</th><th>Transformer</th><th>RNN</th><th>CNN</th></tr><tr><td>并行性</td><td>✅ 完全并行</td><td>❌ 顺序计算</td><td>✅ 完全并行</td></tr><tr><td>长程依赖</td><td>✅ O(1)步直达</td><td>❌ O(距离)步传递</td><td>⚠️ 受感受野限制</td></tr><tr><td>复杂度</td><td>O(n²·d)</td><td>O(n·d²)</td><td>O(k·n·d)</td></tr><tr><td>位置信息</td><td>需额外编码</td><td>天然有</td><td>天然有</td></tr></table>"),
        code("HuggingFace调用LLM",
             "",
             "from transformers import AutoModelForCausalLM, AutoTokenizer\n\nmodel_name = \"Qwen/Qwen2.5-0.5B-Instruct\"\ntokenizer = AutoTokenizer.from_pretrained(model_name)\nmodel = AutoModelForCausalLM.from_pretrained(model_name)\n\nmessages = [\n    {\"role\": \"system\", \"content\": \"你是车辆安全专家。\"},\n    {\"role\": \"user\", \"content\": \"C-NCAP 2024新增了什么测试？\"}\n]\n\ntext = tokenizer.apply_chat_template(\n    messages, tokenize=False, add_generation_prompt=True\n)\ninputs = tokenizer(text, return_tensors=\"pt\")\n\noutputs = model.generate(**inputs, max_new_tokens=200)\nprint(tokenizer.decode(outputs[0], skip_special_tokens=True))"),
        exercise("Transformer练习（5题）",
                 "<p><b>Q1：</b>为什么Self-Attention要除以√d_k？</p><p><b>Q2：</b>Multi-Head Attention中8个头是并行还是串行？每个头输出维度多少？</p><p><b>Q3：</b>为什么需要位置编码？怎么加进去的？</p><p><b>Q4：</b>残差连接的核心作用是什么？</p><p><b>Q5：</b>Transformer为什么能取代RNN？给出3个原因。</p>",
                 "<p><b>A1：</b>防止点积太大导致Softmax饱和（梯度消失）。d_k=64时除以√64=8。</p><p><b>A2：</b>完全并行。d_model/h=512/8=64维，8个拼接成512维。</p><p><b>A3：</b>Self-Attention位置无关，需要编码告诉位置信息。加在输入embedding上（加而不拼接）。</p><p><b>A4：</b>①缓解梯度消失 ②保留原始信息 ③训练更稳定</p><p><b>A5：</b>①完全并行训练 ②O(1)步建模长程依赖 ③规模扩展性好（更大的模型=更好的性能）</p>")
    ]
})

# Save Phase A courses first, then continue
print(f"Phase A courses ({len(lessons)}) done: {[l['slug'] for l in lessons]}")
