#!/usr/bin/env python3 -u
"""Generate complete lessons.json (24 courses) and cards.json (150+ flashcards)."""
import json, os, sys

OUT = r"D:\LvyzWeb\platform\src\content"
os.makedirs(OUT, exist_ok=True)

def S(tp,ti,c="",cd="",a="",it=None):
    d={"type":tp,"title":ti,"content":c}
    if cd: d["code"]=cd
    if a: d["answer"]=a
    if it: d["items"]=it
    return d

T=lambda ti,c:S("text",ti,c)
F=lambda ti,c:S("formula",ti,c)
Ex=lambda ti,c:S("example",ti,c)
Co=lambda ti,c,cd="":S("code",ti,c,code=cd)
Qz=lambda ti,c,a="":S("exercise",ti,c,answer=a)
Tb=lambda ti,c:S("table",ti,c)
Cmp=lambda ti,c:S("comparison",ti,c)

L=[]  # lessons
C=[]  # cards
cid=[0]
def card(tp,src,front,back):
    cid[0]+=1
    C.append({"id":f"card-{cid[0]:04d}","type":tp,"source":src,"front":front,"back":back})

# ════════════════════════════════════
# HELPER: Quick table HTML
# ════════════════════════════════════
def tbl(headers,rows):
    h="<tr>"+"".join(f"<th>{c}</th>" for c in headers)+"</tr>"
    r="".join("<tr>"+"".join(f"<td>{c}</td>" for c in row)+"</tr>" for row in rows)
    return f"<table>{h}{r}</table>"

# ════════════════════════════════════
# COURSE 1: 高数唤醒 (math-basics)
# ════════════════════════════════════
L.append({"slug":"math-basics","title":"00. 高数唤醒","description":"从导数/偏导/链式法则到矩阵/概率，彻底搞懂AI公式里的90%高数知识","category":"math","phase":"A","order":0,"sections":[
    T("为什么要学高数？","<p>打开任何一篇AI论文或教材，你会发现几乎每个公式都包含：<b>导数、偏导、链式法则、矩阵乘法、对数</b>。</p><p>好消息是：<b>AI用到的高数不深</b>，80%的公式只需要求导和链式法则。本章是所有课程的基础。学完这一章，之后的优化器、激活函数、损失函数、Transformer的公式你都能看懂。</p><p>适用对象：高数基本忘光的同学。学习方法：每个概念先看<b>直觉理解</b>，再看<b>数学公式</b>，最后做<b>手算练习</b>。别跳，一步一步来。</p>"),
    T("导数是什么？速度变化的类比","<p><b>导数 = 函数在某点的瞬时变化率</b>。</p><p><b>日常类比：车速</b><br>你开车在高速上，速度表显示120 km/h。\"速度\"就是位置对时间的导数：<br><pre>位置 = f(时间)<br>速度 = 位置的(瞬时)变化率 = df/d时间</pre></p><p><b>AI类比：训练速度</b><br>在训练神经网络时，损失函数L随着训练步数t变化。<br>dL/dt = \"每训练一步，损失下降多少\" = 学习效果。</p><p><b>数学几何意义：</b><br>导数 = 函数图像上某点切线的<b>斜率</b><br>导数 > 0 → 函数在增加（上坡）<br>导数 < 0 → 函数在减少（下坡）<br>导数 = 0 → 函数的\"山顶\"或\"山谷\"（极值点）</p>"),
    T("导数的数学定义","<p><b>极限定义：</b></p><pre>f'(x) = df/dx = lim(Δx→0) [f(x+Δx) - f(x)] / Δx</pre><p>用大白话说：让x变一点点（Δx无穷小），看f(x)变化了多少（Δf），Δf/Δx就是导数。</p>"),
    Ex("手算求导例子","<p><b>例子1：</b>f(x) = x²，求 f'(2)</p><pre>f(x) = x²<br>f'(x) = 2x      ← 幂函数求导：xⁿ → nxⁿ⁻¹<br>f'(2) = 2 × 2 = 4</pre><p><b>例子2：</b>f(x) = 3x² + 2x，求 f'(3)</p><pre>f'(x) = 6x + 2   ← 3×2x = 6x, 2x → 2<br>f'(3) = 6×3 + 2 = 18 + 2 = 20</pre><p><b>例子3：</b>f(x) = x³ - 4x，求 f'(1) 和 f'(0)</p><pre>f'(x) = 3x² - 4<br>f'(1) = 3×1 - 4 = -1（下降方向）<br>f'(0) = 0 - 4 = -4</pre>"),
    Tb("常用导数表（必背）",tbl(["函数f(x)","导数f'(x)","AI在哪用到"],["xⁿ","nxⁿ⁻¹","任何多项式项"],["eˣ","eˣ（导数还是自己！）","Softmax、Sigmoid"],["ln(x)","1/x","CrossEntropy"],["1/x","-1/x²","Sigmoid、负向"],["sin(x)","cos(x)","位置编码PE"],["cos(x)","-sin(x)","位置编码PE"],["e⁻ˣ","-e⁻ˣ","Sigmoid中"])),
    T("偏导数 — 多变量只看一个","<p><b>偏导 = 多个变量时，只看一个变量怎么变，其他变量\"假装不变\"</b>。</p><p><b>日常类比：</b>体重 = f(饮食, 运动, 睡眠)<br>∂体重/∂饮食 = 运动量和睡眠不变，只看吃的影响<br>∂体重/∂运动 = 吃和睡眠不变，只看运动的影响</p>"),
    Ex("偏导数手算","<p>f(x,y)=x²y+xy³，求∂f/∂x和∂f/∂y</p><pre>∂f/∂x=(y当常数)=2xy+y³<br>∂f/∂y=(x当常数)=x²+3xy²<br>验证x=2,y=3：∂f/∂x=12+27=39, ∂f/∂y=4+54=58</pre>"),
    F("链式法则—反向传播基础","<p>链式法则 = 复合函数的求导公式</p><pre>f = g(h(x)) → df/dx = (df/dg) × (dg/dh) × (dh/dx)</pre><p><b>日常类比：</b>气囊压力p → 弹开速度v → 乘员伤害i<br>di/dp = (di/dv)×(dv/dp)</p><p><b>AI：</b>反向传播就是链式法则直接应用</p>"),
    Ex("链式法则手算","<p>3层神经网络：x=2, z=3x+1=7, a=z²=49, L=2a=98</p><pre>dL/da=2, da/dz=2z=14, dz/dx=3<br>dL/dx = 2×14×3 = <b>84</b><br>这就是反向传播！从L一步步返回到x</pre>"),
    F("Sigmoid导数推导","<p>σ(x)=1/(1+e⁻ˣ)</p><p><b>结论：σ'(x)=σ(x)×(1-σ(x))</b>←记住这个</p><p><b>推导：</b></p><pre>设 g=-x, h=e^g, z=1+h, σ=1/z<br>dσ/dz=-1/z², dz/dh=1, dh/dg=e^g, dg/dx=-1<br>σ'(x)=(-1/z²)×1×e^g×(-1)=e⁻ˣ/(1+e⁻ˣ)²=σ(x)(1-σ(x)) ✓</pre>"),
    T("梯度是什么？","<p>梯度 = 多个偏导组成的向量：∇f=[∂f/∂x₁,...,∂f/∂xₙ]<br>指向增长最快的方向<br><b>负梯度方向</b>=下降最快的方向=梯度下降的核心<br>例：f(x,y)=x²+y²在(1,2): ∇f=[2,4], 负梯度[-2,-4]最快接近原点</p>"),
    T("矩阵乘法—AI基础","<p>神经网络一层：<code>y = Wx + b</code></p><pre>W=[1 2; 3 4], x=[3; 4] → Wx=[1×3+2×4; 3×3+4×4]=[11; 25]<br>y=Wx+b=[11; 25]+[1; 2]=[12; 27]</pre><p>深度学习 = 一串矩阵乘法 + 激活函数</p>"),
    T("对数基础","<p>为什么AI到处是log？①乘变加求导方便②数值稳定③信息论定义</p>"+tbl(["公式","说明"],["log(1)=0","1的log是0"],["log(a×b)=log(a)+log(b)","乘变加"],["log(a/b)=log(a)-log(b)","除变减"],["log(aᵇ)=b×log(a)","指数变乘法"],["e^(ln x)=x","逆运算抵消"])),
    Qz("综合练习（5题）","<p><b>Q1：</b>f(x) = 5x³ - 4x + 7，求 f'(x)<br><b>Q2：</b>f(x,y)=x²y+3xy，求∂f/∂x和∂f/∂y<br><b>Q3：</b>f(x)=(2x+1)³，求f'(2)<br><b>Q4：</b>f(x)=ln(2x+1)，求f'(0)<br><b>Q5：</b>f(x,y)=x²y-2xy²，求∇f(1,1)</p>","<b>A1：</b>15x²-4<br><b>A2：</b>∂f/∂x=2xy+3y, ∂f/∂y=x²+3x<br><b>A3：</b>链式：6(2x+1)²,f'(2)=6×25=150<br><b>A4：</b>f'(x)=2/(2x+1), f'(0)=2<br><b>A5：</b>∂f/∂x=2xy-2y²→0, ∂f/∂y=x²-4xy→-3, ∇f=[0,-3]")
])})

# Cards for math-basics
for tp,fr,bk in [
    ("概念","什么是导数？","<b>导数 = 函数在某点的瞬时变化率</b><br>几何意义：切线的斜率<br>AI意义：梯度就是多维导数"),
    ("公式","f(x)=x²的导数？","f'(x)=2x<br>口诀：指数降下来，系数乘进去<br>x²→2x, x³→3x², eˣ→eˣ"),
    ("公式","f(x)=eˣ的导数？","f'(x)=eˣ<br><b>导数还是自己</b>！这让eˣ在AI中极其常用"),
    ("概念","什么是偏导数？","多变量函数中<b>只看一个变量，其他假装不变</b><br>符号：∂f/∂x<br>神经网络：∂L/∂w = 损失对权重的偏导"),
    ("概念","什么是链式法则？","<b>复合函数求导 = 外层导数×内层导数</b><br>df/dx=(df/dg)×(dg/dx)<br>这是<b>反向传播的数学基础</b>"),
    ("应用","链式法则的生活类比","油门→引擎转速→车速→里程<br>油门影响里程 = (油门→转速)×(转速→车速)×(车速→里程)<br>每环导数相乘"),
    ("应用","数值：f(x)=2(3x+1)²,x=2求f'(2)","设z=3x+1,a=z²,f=2a<br>df/da=2,da/dz=2z=14,dz/dx=3<br>链式：2×14×3=<b>84</b><br>直接展开验证：f'=36x+12,x=2→84✓"),
    ("公式","Sigmoid导数公式","σ'(x)=σ(x)×(1-σ(x))<br>用输出值本身就能算导数！"),
    ("概念","什么是梯度？","∇f=[∂f/∂x₁, ∂f/∂x₂, ...]<br>梯度方向=上升最快方向<br><b>负梯度方向=下降最快</b>"),
    ("应用","为什么AI用对数？","①乘变加log(ab)=log(a)+log(b)<br>②数值稳定避免极小连乘<br>③信息论交叉熵含log"),
    ("概念","矩阵乘法在AI中代表什么？","y=Wx+b是神经网络一层的核心<br>W=权重矩阵,x=输入,b=偏置<br>深度学习=大量矩阵乘法+激活函数"),
    ("概念","log基本性质4条","log(1)=0<br>log(ab)=log(a)+log(b)<br>log(a/b)=log(a)-log(b)<br>log(aᵇ)=b×log(a)"),
]: card(tp,"math-basics",fr,bk)

# ════════════════════════════════════
# COURSE 2: Python速成 (py-basics)
# ════════════════════════════════════
L.append({"slug":"py-basics","title":"01. Python速成","description":"从JavaScript对比学Python，覆盖基础语法、NumPy、Pandas，2周上手","category":"python","phase":"A","order":1,"sections":[
    T("为什么必须学？","<p>AI生态90%用Python：PyTorch、TensorFlow、HuggingFace、LangChain。<b>好消息：</b>JS写得好的人学Python极快。本课程用\"对比学习法\"——你懂的JS代码旁直接给Python对照。</p>"),
    T("环境安装（5分钟）","<ol><li>下载Python 3.11+（python.org）</li><li><b>必勾Add Python to PATH</b></li><li>验证：<code>python --version</code></li><li>VSCode装Python插件</li><li>pip安装：<code>pip install numpy pandas torch</code></li></ol>"),
    Tb("JS vs Python语法对照",tbl(["功能","JS","Python"],["变量","let x=1","x=1"],["代码块","{}","缩进4空格"],["布尔","true/false","True/False"],["空值","null","None"],["逻辑","&& || !","and or not"],["字符串模板","`${name}`","f\"{name}\""],["数组长度","arr.length","len(arr)"],["数组追加","arr.push(4)","arr.append(4)"],["数组映射","arr.map(x=>x*2)","[x*2 for x in arr]"],["函数","function f(x){}","def f(x):"],["类","constructor()","def __init__(self)"],["this","this","self"])),
    Ex("列表推导式详解","<p><b>语法：</b><code>[表达式 for 变量 in 可迭代 if 条件]</code></p><pre>nums = [1,2,3,4,5]<br>[x*2 for x in nums]          # [2,4,6,8,10]<br>[x*2 for x in nums if x>2]   # [6,8,10]</pre>"),
    Ex("字典实战—简历关键词统计","<p>统计简历中关键词出现次数</p><pre>resume = \"车辆安全专家，10年车辆安全经验…\"<br>keywords = [\"车辆安全\",\"CNCAP\",\"C-IASI\",\"仿真\"]<br>stats = {kw: resume.count(kw) for kw in keywords}<br># {'车辆安全': 2, 'CNCAP': 0, 'C-IASI': 0, '仿真': 0}</pre>"),
    T("5个最大避坑",tbl(["#","坑","JS","Python"],["1","缩进","{}","4空格（Tab报错）"],["2","布尔值","true/false","True/False"],["3","空值","null","None（is None）"],["4","逻辑","&& \|\| !","and or not"],["5","相等","===","==（无===）"])),
    Co("NumPy数组运算","<p><b>NumPy vs Python列表：统一类型、连续内存、批量运算，快100倍</b></p>","import numpy as np\na = np.array([1,2,3,4,5])\nprint(a+10)   # [11 12 13 14 15]\nprint(a*2)    # [2 4 6 8 10]\nprint(a**2)   # [1 4 9 16 25]\n# 矩阵乘法\nA = np.array([[1,2],[3,4]])\nB = np.array([[5,6],[7,8]])\nprint(A @ B)  # [[19 22] [43 50]]"),
    Co("Pandas入门","<p>DataFrame=整张表，Series=一列</p>","import pandas as pd\ndf = pd.DataFrame({'name':['Alice','Bob','Carol'],'age':[25,30,28],'score':[85,92,78]})\nprint(df[df['score']>80])  # 筛选\nprint(df.groupby('age')['score'].mean())  # 分组聚合"),
    Qz("Python测验","<p><b>Q1：</b>[x+1 for x in range(4) if x%2==0]的结果？<br><b>Q2：</b>Python的True和JS的true区别？<br><b>Q3：</b>NumPy中A@B和A*B的区别？<br><b>Q4：</b>df.shape返回什么？<br><b>Q5：</b>self和this的区别？</p>","<b>A1：</b>[1,3](x=0→1,x=2→3)<br><b>A2：</b>Python首字母大写<br><b>A3：</b>@是矩阵乘，*是逐元素乘<br><b>A4：</b>(行数,列数)元组<br><b>A5：</b>self显式传入，this隐式")
])})
for tp,fr,bk in [
    ("概念","Python和JS最大差异","Python用<b>缩进(4空格)</b>划分代码块，JS用{}<br>缩进错了直接IndentationError"),
    ("对比","JS的true/false在Python中","<b>True/False</b>首字母大写！None也是大写<br>写if true: 会报NameError"),
    ("对比","JS的&&和||在Python中","<b>and / or / not</b>用英文单词不用符号"),
    ("代码","NumPy数组 vs Python列表","<b>NumPy：</b>统一类型、连续内存→快100倍<br>批量运算不用for循环<br>矩阵乘法A@B"),
    ("代码","Pandas读取CSV","import pandas as pd<br>df=pd.read_csv('data.csv')<br>df.head()前5行<br>df.shape返回(行数,列数)"),
    ("概念","Python列表推导式","[x for x in arr if condition]<br>比JS的filter+map更紧凑"),
]: card(tp,"py-basics",fr,bk)

# ════════════════════════════════════
# COURSE 3: 优化器 (optimizer)
# ════════════════════════════════════
L.append({"slug":"optimizer","title":"02. 优化器","description":"从BGD/SGD到Adam，彻底搞懂梯度下降算法，学会调参","category":"python","phase":"A","order":2,"sections":[
    T("训练的本质","<p>训练就是找到一组参数W，让损失L最小。优化器就是用来高效找到\"差不多最优\"的W的算法。</p><p><b>核心公式：</b>W = W - α × ∇L —— 沿负梯度方向走一小步</p>"),
    Cmp("三种基础GD对比",tbl(["方法","每次用多少数据","优点","缺点"],["BGD","全部样本","收敛稳定","大数据集跑不动"],["SGD","1个样本","快，能跳出局部最优","震荡大"],["Mini-Batch","32-256个样本","平衡速度和稳定性","需调batch size"])),
    T("Momentum—解决震荡","<p><b>物理直觉：</b>保龄球从山上滚——有惯性，即使遇到小坑也继续往前。SGD问题在于梯度方向忽左忽右。Momentum通过累积历史梯度方向做平滑。</p>"),
    F("Momentum公式逐项拆解","<pre>v_t = β×v_{t-1} + ∇L(W_t)    # 累积速度<br>W_{t+1} = W_t - α×v_t          # 更新参数</pre><p>"+tbl(["符号","名称","含义","典型值"],["v_t","速度","累积梯度方向","随训练变化"],["β","动量系数","保留旧速度比例","0.9"],["α","学习率","步长大小","0.001-0.1"])+"</p>"),
    Ex("Momentum数值例子（β=0.9）","<pre>三步梯度：5, 3, -2（第三步方向反了！）<br>v₁=0.9×0+5=5.0<br>v₂=0.9×5+3=7.5<br>v₃=0.9×7.5-2=4.75<br><b>关键：</b>即使第3步梯度变成-2，v₃仍然为正(4.75)！<br>这就是动量抗震荡的原理。</pre>"),
    F("Adam完整公式","<p><b>Adam = Momentum + RMSProp</b></p><pre>m_t = β₁×m_{t-1} + (1-β₁)×∇L           # 一阶矩(方向)<br>v_t = β₂×v_{t-1} + (1-β₂)×(∇L)²         # 二阶矩(震荡)<br>m̂_t = m_t/(1-β₁^t)                        # 偏差修正<br>v̂_t = v_t/(1-β₂^t)<br>W_{t+1} = W_t - α×m̂_t/(√v̂_t+ε)          # 更新</pre>"),
    T("Adam参数详解","<p>"+tbl(["符号","名称","含义","典型值"],["m_t","一阶矩","梯度加权平均=方向","变化中"],["v_t","二阶矩","梯度平方加权平均=震荡","变化中"],["β₁=0.9","一阶衰减率","约看最近10步方向","0.9"],["β₂=0.999","二阶衰减率","约看最近1000步","0.999"],["√v̂_t","自适应学习率","梯度大→步长小，梯度小→步长大","核心创新"])+"</p>"),
    Ex("为什么需要偏差修正？","<pre>训练第1步：m₀=0, β₁=0.9<br>m₁=0.9×0+0.1×∇L=0.1×∇L（严重低估！）<br>修正：m̂₁=0.1×∇L/(1-0.9)=∇L ✓<br>t增大→1-β₁^t→1→修正自动消失</pre>"),
    Co("PyTorch实战","<p>Momentum SGD和Adam的一行调用</p>","import torch\nmodel = torch.nn.Linear(10,1)\n# SGD + Momentum\nopt = torch.optim.SGD(model.parameters(),lr=0.01,momentum=0.9)\n# Adam（默认推荐）\nopt = torch.optim.Adam(model.parameters(),lr=1e-3,betas=(0.9,0.999),eps=1e-8)\n# 训练循环\nfor epoch in range(100):\n    loss = compute_loss(model,data)\n    opt.zero_grad(); loss.backward(); opt.step()"),
    Tb("优化器选择指南",tbl(["场景","推荐","原因"],["简单任务","SGD+Momentum","调参简单"],["默认选择","<b>Adam</b>","自适应，几乎不调参"],["Transformer/LLM","<b>AdamW</b>","带权重衰减"]])),
    Qz("优化器练习","<p><b>Q1：</b>SGD震荡大，Momentum如何解决？<br><b>Q2：</b>Adam中β₁=0.9和β₂=0.999分别意味什么？<br><b>Q3：</b>训练loss震荡严重不降怎么调？<br><b>Q4：</b>AdamW比Adam多了什么？<br><b>Q5：</b>一阶矩和二阶矩的区别（用日常类比）?</p>","<b>A1：</b>累积历史梯度加权平均，前后方向互相抵消震荡<br><b>A2：</b>β₁≈看10步方向，β₂≈看1000步震荡<br><b>A3：</b>①降lr到1e-4②增β到0.95③换Adam④检查batch<br><b>A4：</b>权重衰减(L2)与自适应学习率解耦<br><b>A5：</b>一阶矩≈平均速度(方向)，二阶矩≈速度波动(震荡)")
])})
for tp,fr,bk in [
    ("概念","什么是梯度下降？","<b>沿负梯度方向走，让损失下降</b><br>比喻：站山顶往最陡下坡走<br>W = W - α×∇L"),
    ("对比","BGD/SGD/Mini-Batch区别","<b>BGD：</b>全数据(慢稳定)<br><b>SGD：</b>1样本(快震荡)<br><b>Mini-Batch：</b>32-256(折中)"),
    ("概念","Momentum中β含义","β=保留过去速度比例，默认0.9<br>β越大→惯性大平滑；β越小→短视震荡"),
    ("概念","Adam=哪两个组合？","<b>Adam = Momentum + RMSProp</b><br>Momentum管方向，RMSProp管自适应步长"),
    ("公式","Adam最终更新公式","W = W - α×m̂/(√v̂+ε)<br>m̂=修正后方向，v̂=修正后震荡"),
    ("概念","偏差修正为什么需要？","初始m₀=0, v₀=0导致早期严重偏小<br>m₁只有真实值的1/10<br>修正：m̂=m/(1-β^t)，t增大自动消失"),
    ("应用","loss震荡严重怎么调？","①降lr(1e-3→1e-4)②增β到0.95-0.99③SGD换Adam④增大batch size"),
]: card(tp,"optimizer",fr,bk)

# ════════════════════════════════════
# COURSE 4: 激活函数 (activation)
# ════════════════════════════════════
L.append({"slug":"activation","title":"03. 激活函数","description":"Sigmoid/ReLU/GELU/Softmax，每个函数的数学原理+数值计算+选择指南","category":"python","phase":"A","order":3,"sections":[
    T("为什么需要非线性激活函数？","<p>没有非线性→多层=线性叠→等价1层→无法学复杂函数。<b>不管叠多少层y=Wx+b，最终都可以合并成一层</b>。激活函数就是让网络有\"表达能力\"的关键。</p>"),
    F("Sigmoid—历史元老","<p>σ(x)=1/(1+e⁻ˣ)，输出范围(0,1)，S形曲线</p><p><b>导数：</b>σ'(x)=σ(x)×(1-σ(x))</p><p><b>优美性质：</b>导数可用函数值本身表示！</p>"),
    Ex("Sigmoid数值计算","<pre>x=0:  σ=0.5,         σ'=0.5×0.5=0.25<br>x=1:  σ≈0.7311,      σ'≈0.1967<br>x=2:  σ≈0.8808,      σ'≈0.1049<br>x=-2: σ≈0.1192,      σ'≈0.1049<br><b>观察：</b>σ'(0)=0.25是最大值。|x|越大→σ'→0。<br>10层连乘：0.25¹⁰≈0.000001→梯度消失！</pre>"),
    T("Sigmoid的致命弱点",tbl(["问题","描述","影响"],["梯度消失","σ'最大0.25","深层：0.25^L趋零"],["非零中心","输出(0,1)恒正","Zigzag收敛慢"],["计算慢","涉及指数","比ReLU慢几十倍"])),
    F("ReLU—现代主流","<p>f(x)=max(0,x)</p><p>导数：x>0→1, x≤0→0<br>优势：①计算极快②正区间无梯度消失③稀疏激活④收敛快6倍</p>"),
    T("死亡ReLU问题","<p><b>现象：</b>神经元输入总≤0→输出恒为0→梯度恒为0→永久\"死亡\"</p><p><b>原因：</b>学习率太大、负偏置初始化、特征缺失</p><p><b>数值例子：</b>W=-0.5,b=-2。所有输入x≤4时，z=-0.5x-2≤0，ReLU=0，永远不更新。</p><p><b>修复：</b>LeakyReLU、PReLU、ELU</p>"),
    Tb("ReLU家族对比",tbl(["函数","公式","负数部分","优点"],["ReLU","max(0,x)","0","简单快速"],["LeakyReLU","max(0.01x,x)","0.01x","缓解死亡"],["PReLU","max(αx,x)","αx(可学习)","α自适应"],["ELU","α(eˣ-1)if x≤0","α(eˣ-1)","光滑零均值"])),
    F("GELU—Transformer标配","<p>GELU(x)=x×Φ(x)，Φ是正态分布CDF</p><p>近似：GELU(x)≈x×sigmoid(1.702x)<br>为什么Transformer用GELU？\"软门控\"保留负值信息，不是ReLU的硬截断。</p>"),
    Ex("GELU vs ReLU数值","<pre>x=2:  GELU≈1.936,  ReLU=2.0   (几乎相同)<br>x=1:  GELU≈0.846,  ReLU=1.0   (GELU衰减)<br>x=0:  GELU=0,      ReLU=0     (相同)<br>x=-1: GELU≈-0.154, ReLU=0     (GELU保留负信息!)<br>x=-3: GELU≈-0.018, ReLU=0     (大负数接近0)</pre>"),
    F("Softmax—多分类输出","<p>softmax(z_i)=e^z_i/Σe^z_j<br>输出K个和为1的概率</p><p><b>数值稳定技巧：</b>先减max(z)防溢出<br>softmax(z_i)=e^(z_i-max(z))/Σe^(z_j-max(z))</p>"),
    Ex("Softmax手算","<p>z=[2.0,1.0,0.1]，3分类</p><pre>e^2.0=7.389,e^1.0=2.718,e^0.1=1.105<br>Σ=11.212<br>p₁=7.389/11.212=0.659(65.9%)<br>p₂=2.718/11.212=0.242(24.2%)<br>p₃=1.105/11.212=0.099(9.9%)<br>Σp=1.000✓  预测类别1</pre>"),
    Co("PyTorch激活函数","<p>不同场景选择</p>","import torch.nn as nn\n# 隐藏层用ReLU\nmodel = nn.Sequential(nn.Linear(128,64),nn.ReLU(),nn.Linear(64,32),nn.GELU(),nn.Linear(32,1),nn.Sigmoid())\n# 死亡ReLU时换LeakyReLU\nmodel2 = nn.Sequential(nn.Linear(128,64),nn.LeakyReLU(0.01),nn.Linear(64,1))"),
    Qz("激活函数练习","<p><b>Q1：</b>Sigmoid导数最大值和在哪？<br><b>Q2：</b>死亡ReLU如何诊断修复？<br><b>Q3：</b>Transformer为什么用GELU？<br><b>Q4：</b>手算softmax([1,2,3])<br><b>Q5：</b>50层Sigmoid网梯度会怎样？</p>","<b>A1：</b>max=0.25在x=0，导致深层消失<br><b>A2：</b>大量隐藏单元恒0→LeakyReLU/降lr/He初始化<br><b>A3：</b>软门控保留负值信息，适合注意力机制<br><b>A4：</b>[0.090,0.245,0.665]预测类3<br><b>A5：</b>0.25⁵⁰≈7.9×10⁻³¹第一层完全不学习")
])})
for tp,fr,bk in [
    ("概念","为什么需要非线性激活？","没有非线性→多层=1层→无法学复杂函数<br>线性复合还是线性"),
    ("公式","Sigmoid定义","σ(x)=1/(1+e⁻ˣ)  输出(0,1)<br>导数：σ'(x)=σ(x)(1-σ(x))"),
    ("知识","Sigmoid两大弱点","①梯度消失(σ'≤0.25)②非零中心(输出>0)<br>导致深层梯度≈0，收敛慢"),
    ("公式","ReLU定义","f(x)=max(0,x)<br>导数：x>0→1, x≤0→0<br>计算极快，正区间无消失"),
    ("知识","死亡ReLU","神经元永远输出0不更新<br>修复：LeakyReLU/降lr/He初始化"),
    ("公式","GELU函数","GELU(x)=x×Φ(x)≈x×sigmoid(1.702x)<br>Transformer标配，软门控"),
    ("公式","Softmax公式","softmax(z_i)=e^z_i/Σe^z_j<br>输出概率分布，和为1"),
    ("应用","二分类输出用什么？","Sigmoid+BCEWithLogitsLoss<br>多分类用Softmax+CrossEntropy"),
]: card(tp,"activation",fr,bk)

print(f"Part1 done: {len(L)} courses, {len(C)} cards")
