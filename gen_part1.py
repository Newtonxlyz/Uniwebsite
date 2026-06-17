#!/usr/bin/env python3
"""Generate complete lessons.json (24 courses) and cards.json (150+ flashcards) for crashAI."""
import json, os

OUT_DIR = r"D:\LvyzWeb\platform\src\content"
os.makedirs(OUT_DIR, exist_ok=True)

def S(typ, title, content="", code="", answer="", items=None):
    s = {"type": typ, "title": title, "content": content}
    if code: s["code"] = code
    if answer: s["answer"] = answer
    if items: s["items"] = items
    return s

T = lambda t,c: S("text",t,c)
F = lambda t,c: S("formula",t,c)
Ex = lambda t,c: S("example",t,c)
Co = lambda t,c,cd="": S("code",t,c,code=cd)
Qz = lambda t,c,a="": S("exercise",t,c,answer=a)
Tb = lambda t,c: S("table",t,c)
Cmp = lambda t,c: S("comparison",t,c)

lessons = []
# ── Card helper ──
cards = []

def card(tp, src, front, back):
    cards.append({"id": f"card-{len(cards)+1:04d}", "type": tp, "source": src, "front": front, "back": back})

# ══════════════════════════════════════════
# PHASE A: Foundations (7 courses)
# ══════════════════════════════════════════

# ===== COURSE 1: math-basics =====
lessons.append({
    "slug":"math-basics","title":"00. 高数唤醒","description":"从导数/偏导/链式法则到矩阵/概率，彻底搞懂AI公式里的90%高数知识","category":"math","phase":"A","order":0,
    "sections":[
        T("为什么要学高数？",
          "<p>打开任何一篇AI论文或教材，你会发现几乎每个公式都包含：<b>导数、偏导、链式法则、矩阵乘法、对数</b>。</p><p>好消息是：<b>AI用到的高数不深</b>，80%的公式只需要求导和链式法则。本章是所有课程的基础。学完这一章，之后的优化器、激活函数、损失函数、Transformer的公式你都能看懂。</p><p>适用对象：高数基本忘光的同学。学习方法：每个概念先看<b>直觉理解</b>，再看<b>数学公式</b>，最后做<b>手算练习</b>。别跳，一步一步来。</p>"),
        T("导数是什么？速度变化的类比",
          "<p><b>导数 = 函数在某点的瞬时变化率</b>。</p><p><b>日常类比：车速</b><br>你开车在高速上，速度表显示120 km/h。\"速度\"就是位置对时间的导数：<br><pre>位置 = f(时间)<br>速度 = 位置的(瞬时)变化率 = df/d时间</pre></p><p><b>AI类比：训练速度</b><br>在训练神经网络时，损失函数L随着训练步数t变化。<br>dL/dt = \"每训练一步，损失下降多少\" = 学习效果。</p><p><b>数学几何意义：</b><br>导数 = 函数图像上某点切线的<b>斜率</b><br>导数 > 0 → 函数在增加（上坡）<br>导数 < 0 → 函数在减少（下坡）<br>导数 = 0 → 函数的\"山顶\"或\"山谷\"（极值点）</p>"),
        F("导数的数学定义",
          "<p><b>极限定义：</b></p><pre>f'(x) = df/dx = lim(Δx→0) [f(x+Δx) - f(x)] / Δx</pre><p>用大白话说：让x变一点点（Δx无穷小），看f(x)变化了多少（Δf），Δf/Δx就是导数。</p><p>在神经网络中，我们有成千上万个参数w₁, w₂, ..., wₙ。损失函数L对这些参数的<b>偏导数</b>∂L/∂wᵢ就是导数的多维版本。</p>"),
        Ex("手算例子：求导练习",
           "<p><b>例子1：</b>f(x) = x²，求 f'(2)</p><pre>f(x) = x²<br>f'(x) = 2x      ← 幂函数求导：xⁿ → nxⁿ⁻¹<br>f'(2) = 2 × 2 = 4</pre><p><b>含义：</b>当x=2时，x²的瞬时变化率是4。x增加一点点，x²会增加约4倍那么多。</p><p><b>例子2：</b>f(x) = 3x² + 2x，求 f'(3)</p><pre>f'(x) = 6x + 2   ← 3×2x = 6x, 2x → 2<br>f'(3) = 6×3 + 2 = 18 + 2 = 20</pre><p><b>例子3：</b>f(x) = x³ - 4x，求 f'(1) 和 f'(0)</p><pre>f'(x) = 3x² - 4<br>f'(1) = 3×1 - 4 = -1（下降方向）<br>f'(0) = 0 - 4 = -4（下降更快）</pre>"),
        Tb("常用导数表（必背）",
           "<table><tr><th>函数f(x)</th><th>导数f'(x)</th><th>AI在哪用到</th></tr><tr><td>xⁿ</td><td>nxⁿ⁻¹</td><td>任何多项式项</td></tr><tr><td>eˣ</td><td>eˣ（导数还是自己！）</td><td>Softmax、Sigmoid</td></tr><tr><td>ln(x)</td><td>1/x</td><td>CrossEntropy</td></tr><tr><td>1/x</td><td>-1/x²</td><td>Sigmoid、负向</td></tr><tr><td>sin(x)</td><td>cos(x)</td><td>位置编码</td></tr><tr><td>cos(x)</td><td>-sin(x)</td><td>位置编码</td></tr><tr><td>e⁻ˣ</td><td>-e⁻ˣ</td><td>Sigmoid中</td></tr></table>"),
        F("偏导数 — 多变量只看一个",
          "<p><b>偏导 = 多个变量时，只看一个变量怎么变，其他变量\"假装不变\"</b>。</p><p><b>日常生活类比：</b><br>体重 = f(饮食, 运动, 睡眠)<br>∂体重/∂饮食 = 运动量和睡眠不变，只看吃的影响<br>∂体重/∂运动 = 吃和睡眠不变，只看运动的影响</p><p><b>AI里的偏导：</b>损失L受百万个权重w₁...wₙ影响。<br>∂L/∂wᵢ = \"第i个权重增一点点，损失变多少\"<br>所有偏导组成<b>梯度（Gradient）</b>向量。</p>"),
        Ex("偏导数手算例子",
           "<p><b>例子：</b>f(x, y) = x²y + xy³，求 ∂f/∂x 和 ∂f/∂y</p><pre>∂f/∂x = (y当常数) x² → 2xy, xy³ → y³ → 2xy + y³<br>∂f/∂y = (x当常数) x²y → x², xy³ → 3xy² → x² + 3xy²</pre><p><b>数值验证 x=2, y=3：</b></p><pre>∂f/∂x = 2×2×3 + 3³ = 12 + 27 = 39<br>∂f/∂y = 2² + 3×2×3² = 4 + 54 = 58</pre>"),
        F("链式法则 — 反向传播的数学基础",
          "<p><b>链式法则 = 复合函数的求导公式</b>。</p><p><b>日常类比：</b>安全气囊压力p → 弹开速度v → 乘员伤害i<br>你想问\"压力每增加一点，伤害增加多少？\"<br>di/dp = (di/dv) × (dv/dp)<br>因果链上的导数相乘</p><p><b>AI的重要性：</b>神经网络是复合函数链：</p><pre>输入 x → z₁ = W₁x + b₁ → a₁ = σ(z₁) → z₂ = W₂a₁ + b₂ → ... → 损失 L</pre><p>反向传播（Backpropagation）就是链式法则的直接应用。</p>"),
        Ex("链式法则手算：3层神经网络",
           "<p><b>例子（3层链——神经网络的样子）：</b></p><pre>x = 2（输入）<br>z = 3x + 1 = 7（线性层）<br>a = z² = 49（激活层）<br>L = 2a = 98（损失）</pre><p><b>问：x变一点点，L变多少？</b></p><pre>dL/da = 2<br>da/dz = 2z = 14<br>dz/dx = 3<br>dL/dx = 2 × 14 × 3 = 84</pre><p><b>这就是反向传播！</b>从L一步步反向求到x。</p>"),
        F("Sigmoid导数推导（最重要！）",
          "<p>σ(x) = 1/(1+e⁻ˣ)</p><p><b>结论：σ'(x) = σ(x) × (1-σ(x))</b> ← 记住这个就够了！</p><p><b>完整推导（用链式法则）：</b></p><pre>设 g=-x, h=e^g, z=1+h, σ=1/z<br>dσ/dz = -1/z², dz/dh = 1, dh/dg = e^g, dg/dx = -1<br>σ'(x) = (-1/z²)×1×e^g×(-1) = e⁻ˣ/(1+e⁻ˣ)² = σ(x)(1-σ(x)) ✓</pre><p>这个优美的性质让Sigmoid的梯度计算极快——只需用输出值本身就能算出导数。</p>"),
        T("梯度是什么？",
          "<p><b>梯度 = 多个偏导组成的向量</b>：</p><pre>∇f = [∂f/∂x₁, ∂f/∂x₂, ..., ∂f/∂xₙ]</pre><ul><li>指向函数<b>增长最快</b>的方向</li><li>长度 = 变化快慢程度</li><li><b>负梯度方向</b> = 下降最快的方向 = 梯度下降的核心</li></ul><p><b>例子：</b>f(x,y) = x² + y²，在点(1,2)处的梯度：</p><pre>∂f/∂x = 2x = 2<br>∂f/∂y = 2y = 4<br>∇f(1,2) = [2, 4]</pre><p>负梯度方向 [−2, −4] = 最快接近最小值（原点）的方向。</p>"),
        T("矩阵乘法 — AI必备基础",
          "<p>神经网络一层：<code>y = Wx + b</code></p><ul><li>W = 权重矩阵（连接强度）</li><li>x = 输入向量（神经元激活值）</li><li>b = 偏置向量（阈值）</li></ul><p><b>深度学习 = 一串矩阵乘法 + 激活函数</b></p><p><b>手算2×2：</b></p><pre>W = [1  2]   x = [3]   Wx = [1×3+2×4] = [11]<br>    [3  4]       [4]        [3×3+4×4]   [25]<br>y = Wx + b = [11] + [1] = [12]<br>             [25]   [2]   [27]</pre>"),
        T("对数（log）基础",
          "<p>为什么AI到处是log？<br>① 乘变加：求导方便 ② 数值稳定 ③ 信息论的自然定义</p><table><tr><th>公式</th><th>说明</th></tr><tr><td>log(1) = 0</td><td>1的log是0</td></tr><tr><td>log(a×b) = log(a) + log(b)</td><td>乘变加</td></tr><tr><td>log(a/b) = log(a) - log(b)</td><td>除变减</td></tr><tr><td>log(aᵇ) = b×log(a)</td><td>指数变乘法</td></tr><tr><td>e^(ln x) = x</td><td>逆运算抵消</td></tr></table><p><b>化简练习：</b>ln(a²b/c³) = 2ln(a) + ln(b) - 3ln(c)</p>"),
        Qz("综合练习（5题）",
           "<p><b>Q1：</b>f(x) = 5x³ - 4x + 7，求 f'(x)</p><p><b>Q2：</b>f(x, y) = x²y + 3xy，求 ∂f/∂x 和 ∂f/∂y</p><p><b>Q3：</b>f(x) = (2x+1)³，求 f'(2)</p><p><b>Q4：</b>f(x) = ln(2x+1)，求 f'(0)</p><p><b>Q5：</b>f(x,y)=x²y-2xy²，求 ∇f(1,1)</p>",
           "<p><b>A1：</b>f'(x) = 15x² - 4</p><p><b>A2：</b>∂f/∂x=2xy+3y, ∂f/∂y=x²+3x</p><p><b>A3：</b>链式法则：f'(x)=3(2x+1)²×2=6(2x+1)², f'(2)=6×25=150</p><p><b>A4：</b>f'(x)=2/(2x+1), f'(0)=2</p><p><b>A5：</b>∂f/∂x=2xy-2y²→2(1)(1)-2(1)=0, ∂f/∂y=x²-4xy→1-4=-3, ∇f(1,1)=[0,-3]</p>")
    ]
})

# ── math-basics cards ──
for cdat in [
    ("概念","什么是导数？","<strong>导数 = 函数在某点的瞬时变化率</strong><br>几何意义：切线的斜率<br>物理意义：速度 = 位置对时间的导数<br>AI 意义：梯度就是多维导数"),
    ("公式","f(x) = x² 的导数是什么？","<div style='font-size:1.1em'>f'(x) = 2x</div>口诀：指数降下来，系数乘进去<br>x² → 2x，x³ → 3x²，eˣ → eˣ"),
    ("公式","f(x) = eˣ 的导数是什么？","<div style='font-size:1.1em'>f'(x) = eˣ</div>神奇性质：<strong>导数还是自己</strong><br>这让 eˣ 在 AI 中极其常用（激活函数、损失函数）"),
    ("概念","什么是偏导数？","多变量函数中，<strong>只看一个变量怎么变，其他变量假装不变</strong><br>符号：∂f/∂x<br>神经网络里 ∂L/∂w 表示损失对权重的偏导"),
    ("概念","什么是链式法则？","<strong>复合函数求导 = 外层导数 × 内层导数</strong><br>公式：df/dx = (df/dg) × (dg/dx)<br>这是<strong>反向传播（Backpropagation）的数学基础</strong>"),
    ("应用","链式法则的日常生活类比？","油门 → 引擎转速 → 车速 → 里程<br>链式法则：<strong>油门影响里程</strong> = (油门→转速) × (转速→车速) × (车速→里程)<br>这就是神经网络反向传播的原理"),
    ("应用","数值例子：f(x) = 2(3x+1)²，x=2时求f'(x)","设 z=3x+1, a=z², f=2a<br>df/da=2, da/dz=2z=2(3×2+1)=14, dz/dx=3<br>链式法则：2×14×3=<strong>84</strong><br>验证：直接展开f=18x²+12x+2, f'=36x+12, x=2时=84 ✓"),
    ("公式","Sigmoid 的导数公式是什么？","<div style='font-size:1.1em'>σ'(x) = σ(x) × (1 - σ(x))</div>推导：σ(x)=1/(1+e^(-x))<br>用链式法则+指数求导可得此优美结果"),
    ("概念","偏导数和全导数的区别？","<strong>偏导数（∂）：</strong>多变量中只看一个变量，其他固定<br><strong>全导数（d）：</strong>所有变量一起变<br>神经网络反向传播用偏导 ∂L/∂w"),
    ("概念","什么是梯度？","梯度 = 多个偏导组成的向量：<br><div style='font-size:1.1em'>∇f = [∂f/∂x₁, ∂f/∂x₂, ...]</div>梯度方向是函数上升最快的方向，<strong>负梯度方向 = 下降最快</strong>"),
    ("应用","为什么 AI 公式里偏爱用对数？","① 乘积变加法（log(a×b)=log(a)+log(b)）<br>② 数值稳定（避免很小数相乘变0）<br>③ 信息论的交叉熵定义需要 log"),
    ("概念","log(a × b) 等于什么？","<div style='font-size:1.1em'>log(a × b) = log(a) + log(b)</div>对数性质：<strong>乘变加、除变减、指数变乘法</strong><br>AI 用对数是出于数值稳定性考虑"),
    ("概念","矩阵乘法在神经网络中代表什么？","<strong>y = Wx + b</strong> 是神经网络一层的核心计算<br>W = 权重矩阵，x = 输入向量，b = 偏置<br>深度学习本质 = 大量矩阵乘法 + 激活函数"),
]:
    card(*cdat, src="math-basics")

# ===== COURSE 2: py-basics =====
lessons.append({
    "slug":"py-basics","title":"01. Python速成","description":"从JavaScript对比学Python，覆盖基础语法、NumPy、Pandas，2周上手","category":"python","phase":"A","order":1,
    "sections":[
        T("为什么必须学Python？",
          "<p>AI生态90%用Python：PyTorch、TensorFlow、HuggingFace、LangChain、pandas、numpy。JS做AI生态功能弱。<b>好消息：</b>JS写得好的人学Python极快，2-3周速通。本课程用<b>\"对比学习法\"</b>——你懂的JS代码旁直接给Python对照，就像双语词典一样。</p>"),
        T("环境安装（5分钟）",
          "<ol><li>下载Python 3.11/3.12（python.org）</li><li><b>必勾\"Add Python to PATH\"</b>（不勾等于白装）</li><li>验证：<code>python --version</code></li><li>VSCode装Microsoft Python插件（F5直接运行）</li><li>pip安装库：<code>pip install numpy pandas torch</code></li></ol>"),
        Tb("JS vs Python 基础语法对照表",
           "<table><tr><th>功能</th><th>JS</th><th>Python</th></tr><tr><td>变量声明</td><td>let x = 1</td><td>x = 1（不需要关键字）</td></tr><tr><td>代码块</td><td>{ }</td><td>缩进（4空格）</td></tr><tr><td>布尔值</td><td>true / false</td><td>True / False（首字母大写！）</td></tr><tr><td>空值</td><td>null / undefined</td><td>None（首字母大写）</td></tr><tr><td>逻辑运算符</td><td>&& || !</td><td>and or not</td></tr><tr><td>字符串模板</td><td>`hello ${name}`</td><td>f\"hello {name}\"</td></tr><tr><td>数组长度</td><td>arr.length</td><td>len(arr)</td></tr><tr><td>数组追加</td><td>arr.push(4)</td><td>arr.append(4)</td></tr><tr><td>数组映射</td><td>arr.map(x=>x*2)</td><td>[x*2 for x in arr]</td></tr><tr><td>函数</td><td>function f(x){}</td><td>def f(x):</td></tr><tr><td>类构造器</td><td>constructor()</td><td>def __init__(self):</td></tr><tr><td>this / self</td><td>this</td><td>self（显式写出）</td></tr></table>"),
        Ex("列表推导式详解",
           "<p><b>语法公式：</b><code>[表达式 for 变量 in 可迭代对象 if 条件]</code></p><p><b>数值例子：</b></p><pre>nums = [1, 2, 3, 4, 5]<br><br># 每个乘2<br>[x * 2 for x in nums]<br># 手算：1*2=2, 2*2=4, 3*2=6, 4*2=8, 5*2=10<br># 结果：[2, 4, 6, 8, 10]<br><br># 只取大于2的，再乘2<br>[x * 2 for x in nums if x > 2]<br># 手算：x=1→跳过, x=2→跳过, x=3→6, x=4→8, x=5→10<br># 结果：[6, 8, 10]</pre>"),
        Ex("字典操作 — 简历关键词统计",
           "<p><b>实战：</b>用字典统计简历中关键词出现次数</p><pre>resume = \"\"\"<br>吕元卓，车辆安全专家，10年车辆安全经验。<br>熟悉CNCAP、C-IASI消费者试验，精通CAE仿真。<br>\"\"\"<br><br>keywords = [\"车辆安全\", \"CNCAP\", \"C-IASI\", \"仿真\"]<br><br>stats = {}<br>for kw in keywords:<br>    count = resume.count(kw)<br>    stats[kw] = count<br><br>matched = {k: v for k, v in stats.items() if v > 0}<br>print(f\"匹配：{matched}\")</pre>"),
        T("5个最大避坑指南",
          "<table><tr><th>#</th><th>坑</th><th>JS写法</th><th>Python写法</th></tr><tr><td>1</td><td>缩进</td><td>花括号 { }</td><td>4空格（Tab会报错）</td></tr><tr><td>2</td><td>布尔值</td><td>true/false</td><td>True/False（首字母大写）</td></tr><tr><td>3</td><td>空值</td><td>null/undefined</td><td>None（is None判空）</td></tr><tr><td>4</td><td>逻辑运算符</td><td>&& || !</td><td>and or not</td></tr><tr><td>5</td><td>相等判断</td><td>===</td><td>==（没有===）</td></tr></table>"),
        Co("NumPy入门 — 数组运算",
           "<p>NumPy数组 vs Python列表：统一类型、连续内存、批量运算。快100倍！</p>",
           "import numpy as np\n\n# 创建数组\na = np.array([1, 2, 3, 4, 5])\nprint(a.dtype)  # int64\n\n# 批量运算（不用for循环！）\nprint(a + 10)   # [11 12 13 14 15]\nprint(a * 2)    # [ 2  4  6  8 10]\nprint(a ** 2)   # [ 1  4  9 16 25]\n\n# 矩阵乘法\nA = np.array([[1, 2], [3, 4]])\nB = np.array([[5, 6], [7, 8]])\nprint(A @ B)  # [[19 22] [43 50]]\n\n# 手算A@B：\n# [1,2]@[5,6] = 1*5+2*7=19, 1*6+2*8=22\n# [3,4]@[5,6] = 3*5+4*7=43, 3*6+4*8=50"),
        Co("Pandas入门 — 表格数据之王",
           "<p>核心结构：Series（一列）和DataFrame（整张表）</p>",
           "import pandas as pd\n\n# DataFrame创建\ndf = pd.DataFrame({\n    \"name\": [\"Alice\", \"Bob\", \"Carol\"],\n    \"age\": [25, 30, 28],\n    \"score\": [85, 92, 78]\n})\nprint(df)\n\n# 筛选\nprint(df[df[\"score\"] > 80])\n\n# 分组聚合\ndf2 = pd.DataFrame({\n    \"brand\": [\"Toyota\", \"Toyota\", \"Honda\", \"Honda\"],\n    \"score\": [85, 88, 90, 87]\n})\nprint(df2.groupby(\"brand\")[\"score\"].mean())"),
        Qz("Python测验（5题）",
           "<p><b>Q1：</b>[x + 1 for x in range(4) if x % 2 == 0] 的结果是什么？</p><p><b>Q2：</b>Python的True和JS的true有什么区别？</p><p><b>Q3：</b>NumPy数组A=[[1,2],[3,4]]和B=[[1,0],[0,1]]，A@B和A*B分别是什么？</p><p><b>Q4：</b>Pandas中df.shape返回什么？</p><p><b>Q5：</b>Python函数中self的作用是什么？和JS的this有什么不同？</p>",
           "<p><b>A1：</b>[1, 3]（x=0→1, x=2→3）</p><p><b>A2：</b>Python布尔值首字母大写（True/False），JS全小写。if true:会报NameError</p><p><b>A3：</b>A@B=[[1,2],[3,4]]（单位矩阵不变），A*B=[[1,0],[0,4]]（逐元素乘）</p><p><b>A4：</b>(行数, 列数)元组</p><p><b>A5：</b>Python的self显式传入，逻辑清晰；JS的this隐式决定，容易混淆</p>")
    ]
})
for cdat in [
    ("概念","Python 和 JS 最大的差异是什么？","Python 用<strong>缩进（4空格）</strong>划分代码块，JS 用 {} 大括号<br>缩进错了直接报 IndentationError"),
    ("对比","JS 的 true / false 在 Python 中是什么？","<div style='font-size:1.1em'>True / False</div><strong>首字母大写</strong>！<br>None 也是首字母大写<br>写 if true: 会报 NameError"),
    ("对比","JS 的 && || ! 在 Python 中是什么？","<div style='font-size:1.1em'>and / or / not</div>用英文单词而不是符号"),
    ("代码","NumPy 数组 vs Python 列表的核心区别？","<strong>NumPy 数组：</strong><br>① 统一类型、连续内存 → 快100倍<br>② 支持批量运算：arr * 2（不用for循环）<br>③ 矩阵乘法：A @ B<br><br>Python 列表是通用容器，慢但灵活"),
    ("代码","Pandas 读取 CSV 的基本写法","import pandas as pd<br>df = pd.read_csv('data.csv')<br>print(df.head())  # 前5行<br>print(df.shape)  # (行数, 列数)<br>print(df.describe())  # 统计摘要"),
    ("概念","Python 的列表推导式是什么？","<div style='font-size:1.1em'>[x for x in arr if condition]</div>比 JS 的 filter+map 更紧凑<br>例：audi = [c for c in cars if \"AUDI\" in c]"),
]:
    card(*cdat, src="py-basics")

print(f"Wrote {len(lessons)} courses, {len(cards)} cards so far...")
