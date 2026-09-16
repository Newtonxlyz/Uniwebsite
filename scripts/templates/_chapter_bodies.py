"""_chapter_bodies.py - 6 章章节正文 (HTML)
基于 testPINN/PINN仿真降阶_report.md + GNN碰撞仿真降阶系统建设指导.md 重写。
简化版:保留核心概念、公式、例子,删去次要细节。
"""
bodies = {}

bodies['01-tech-foundations'] = '''
<section class="lesson-section">
<h2>1.1 AI+DOE+PINN 完整技术链路</h2>
<p><strong>仿真降阶</strong>的核心思想:把昂贵的高保真仿真结果转化为<strong>快速代理模型</strong>,实现数量级加速。</p>
<ol>
<li>><strong>第一阶段:问题定义与参数化</strong> — 明确输入参数(壁厚、速度、材料)和输出量(吸能量、应力场)</li>
<li>><strong>第二阶段:DOE 试验设计</strong> — 用拉丁超立方(LHS) / Hammersley 等采样</li>
<li>><strong>第三阶段:高保真仿真数据生成</strong> — LS-DYNA 等求解,1000+ 仿真</li>
<li>><strong>第四阶段:代理模型训练</strong> — GNN + Transformer + 物理约束</li>
<li>><strong>第五阶段:验证与主动学习闭环</strong> — 主动补样提升精度</li>
</ol>
<div class="important">
<div class="important-title">💡 核心洞察</div>
<p>参数维度 d 的样本量经验法则:<strong>10d~20d</strong>。维度爆炸是主要风险。</p>
</div>
</section>

<section class="lesson-section">
<h2>1.2 PINN 损失函数</h2>
<div class="formula">
<b>L(θ) = w<sub>r</sub> · L<sub>r</sub>(PDE 残差) + w<sub>b</sub> · L<sub>b</sub>(边界) + w<sub>d</sub> · L<sub>d</sub>(数据拟合) + w<sub>i</sub> · L<sub>i</sub>(初始)</div>
</div>
<p>每项权重 w 调节"物理 vs 数据"权衡。</p>
</section>

<section class="lesson-section">
<h2>1.3 PINN vs POD-ROM vs Autoencoder</h2>
<table style="width:100%; border-collapse: collapse;">
<tr style="background: var(--bg-section);">
<th style="padding: 8px; border: 1px solid var(--border);">维度</th>
<th style="padding: 8px; border: 1px solid var(--border);">POD-ROM</th>
<th style="padding: 8px; border: 1px solid var(--border);">Autoencoder</th>
<th style="padding: 8px; border: 1px solid var(--border);">PINN</th>
</tr>
<tr>
<td style="padding: 6px; border: 1px solid var(--border);">核心</td>
<td style="padding: 6px; border: 1px solid var(--border);">线性子空间</td>
<td style="padding: 6px; border: 1px solid var(--border);">非线性编码</td>
<td style="padding: 6px; border: 1px solid var(--border);">物理约束嵌入</td>
</tr>
<tr>
<td style="padding: 6px; border: 1px solid var(--border);">几何</td>
<td style="padding: 6px; border: 1px solid var(--border);">固定</td>
<td style="padding: 6px; border: 1px solid var(--border);">可变</td>
<td style="padding: 6px; border: 1px solid var(--border);">无网格</td>
</tr>
<tr>
<td style="padding: 6px; border: 1px solid var(--border);">外推</td>
<td style="padding: 6px; border: 1px solid var(--border);">差</td>
<td style="padding: 6px; border: 1px solid var(--border);">差</td>
<td style="padding: 6px; border: 1px solid var(--border);">较好</td>
</tr>
</table>
</section>

<section class="lesson-section">
<h2>1.4 PINN 在碰撞场景的局限</h2>
<p>碰撞动力学的强非线性 + 接触不连续 → <strong>PDE 残差难以计算</strong>。</p>
<p><strong>工业实践</strong>:数据驱动为主、物理约束为辅的混合架构。</p>
<div class="important">
<div class="important-title">⚠ 神经网络的频谱偏见 (spectral bias)</div>
<p>倾向学习低频成分,难捕捉微观尺度剧烈振荡。需多尺度方法(HOMS-PINN 等)解决。</p>
</div>
</section>
'''

bodies['02-research-progress'] = '''
<section class="lesson-section">
<h2>2.1 整车级代理模型里程碑</h2>
<table style="width:100%; border-collapse: collapse;">
<tr style="background: var(--bg-section);">
<th style="padding: 8px; border: 1px solid var(--border);">研究 / 平台</th>
<th style="padding: 8px; border: 1px solid var(--border);">规模</th>
<th style="padding: 8px; border: 1px solid var(--border);">精度</th>
</tr>
<tr>
<td style="padding: 6px; border: 1px solid var(--border);"><strong>Luminary SHIFT-Crash</strong></td>
<td style="padding: 6px; border: 1px solid var(--border);">整车 (5000 仿真)</td>
<td style="padding: 6px; border: 1px solid var(--border);">RMSE &lt; 3%</td>
</tr>
<tr>
<td style="padding: 6px; border: 1px solid var(--border);">SEAT/IDIADA 侧柱撞击</td>
<td style="padding: 6px; border: 1px solid var(--border);">整车</td>
<td style="padding: 6px; border: 1px solid var(--border);">3.20 mm 位移 RMSE</td>
</tr>
<tr>
<td style="padding: 6px; border: 1px solid var(--border);">NVIDIA + 通用汽车</td>
<td style="padding: 6px; border: 1px solid var(--border);">白车身 (150 仿真)</td>
<td style="padding: 6px; border: 1px solid var(--border);">数量级加速</td>
</tr>
<tr>
<td style="padding: 6px; border: 1px solid var(--border);">Ansys SimAI 保险杠</td>
<td style="padding: 6px; border: 1px solid var(--border);">子系统</td>
<td style="padding: 6px; border: 1px solid var(--border);">压溃 &lt; 0.5%</td>
</tr>
</table>
</section>

<section class="lesson-section">
<h2>2.2 架构三代演进</h2>
<ol>
<li>><strong>第一代标量回归</strong>(GPR/DNN):从设计参数 → 几个关键性能指标。简单,丢失空间信息。</li>
<li>><strong>第二代全场 GNN</strong>(MeshGraphNet):网格节点位移。保留空间信息。MeshGraphNet 以网格连接为图结构,边更新-节点更新消息传递机制。</li>
<li>><strong>第三代注意力混合</strong>(Transolver/GeoTransolver/GeoFlare):GNN + Transformer 注意力。Transolver 在物理状态空间计算注意力,降低复杂度。精度排名:GeoFlare &gt; GeoTransolver &gt; Transolver &gt; MeshGraphNet</li>
</ol>
</section>

<section class="lesson-section">
<h2>2.3 神经算子 (FNO) 的局限</h2>
<p><strong>重要发现</strong>:FNO 在强非线性结构动力学中误差急剧恶化:</p>
<ul>
<li>线性系统:L2 误差 0.02</li>
<li>立方硬化:0.28</li>
<li>双线性滞回:<strong>0.38</strong></li>
<li>超出训练区间 (0.5-1.0s):误差 &gt; 1(完全失效)</li>
</ul>
<div class="important">
<div class="important-title">⚠ 对碰撞的警示</div>
<p>碰撞比地震响应具有<strong>更强非线性</strong>和<strong>路径依赖性</strong>,纯算子学习方法面临更严峻挑战。</p>
</div>
</section>

<section class="lesson-section">
<h2>2.4 Luminary 迁移学习效率</h2>
<ul>
<li>首个 SUV 项目:5000 次仿真</li>
<li>第二个 SUV 项目:&lt; 1000 次</li>
<li><strong>第三个 SUV 项目:&lt; 300 次</strong></li>
<li>跨车型级别(从 SUV 到轿车):~600 次</li>
</ul>
</section>
'''

bodies['03-multiscale'] = '''
<section class="lesson-section">
<h2>3.1 多尺度问题本质</h2>
<p>汽车结构跨 4 个尺度:<strong>微观</strong>(晶粒) → <strong>介观</strong>(复合材料层、焊缝) → <strong>宏观</strong>(部件) → <strong>系统</strong>(整车)</p>
<p>传统 FE² 方法:每宏观积分点都需调用微观 RVE 完整有限元 → 计算瓶颈。</p>
<div class="formula">
<b>计算量 ∝ D<sub>宏观</sub> × D<sub>微观</sub></b>(D = 自由度)</div>
</div>
</section>

<section class="lesson-section">
<h2>3.2 HOMS-PINN 框架</h2>
<p><strong>核心思想</strong>:多尺度渐近分析 + 物理约束分层。</p>
<ul>
<li><strong>高阶多尺度 PINN</strong>:把强振荡的微观场"提取"出来,PINN 只需学宏观场+修正项</li>
<li><strong>计算量减少约一半</strong></li>
<li>克服神经网络的频谱偏见</li>
</ul>
</section>

<section class="lesson-section">
<h2>3.3 PRNN - 物理循环神经网络</h2>
<p>核心:将本构路径依赖性编码进<strong>循环结构</strong>,捕捉非线性滞回行为。</p>
<p>3 层架构:微观 PRNN → 介观 RVE 代理 → 宏观结构。</p>
<p>对编织复合材料的纱线非线性行为预测,PRNN 与 FE 结果高度吻合,优于平均场均质化 (MFH)。</p>
</section>

<section class="lesson-section">
<h2>3.4 VPINN 变分方法</h2>
<p>采用 Petrov-Galerkin 方法,以神经网络为<strong>试函数</strong>、局部多项式为<strong>检验函数</strong>。</p>
<p>优势:更适合处理材料不连续问题。结合 quadtree / octree 自适应积分,稳健捕捉内部材料界面。</p>
</section>

<section class="lesson-section">
<h2>3.5 微-介-宏观的合理分工</h2>
<ul>
<li><strong>微观/介观</strong>:用 PINN(物理约束强、样本小、几何规整)</li>
<li><strong>宏观/系统级</strong>:用 GNN/神经算子(数据驱动、规模大、几何复杂)</li>
<li>两者通过<strong>尺度桥接接口</strong>连接</li>
</ul>
</section>
'''

bodies['04-tools-frameworks'] = '''
<section class="lesson-section">
<h2>4.1 开源框架对比</h2>
<table style="width:100%; border-collapse: collapse;">
<tr style="background: var(--bg-section);">
<th style="padding: 8px; border: 1px solid var(--border);">框架</th>
<th style="padding: 8px; border: 1px solid var(--border);">最佳场景</th>
<th style="padding: 8px; border: 1px solid var(--border);">缺点</th>
</tr>
<tr>
<td style="padding: 6px; border: 1px solid var(--border);"><strong>DeepXDE</strong></td>
<td style="padding: 6px; border: 1px solid var(--border);">方法学研究、小规模验证</td>
<td style="padding: 6px; border: 1px solid var(--border);">GPU 性能需自行优化</td>
</tr>
<tr>
<td style="padding: 6px; border: 1px solid var(--border);"><strong>NVIDIA PhysicsNeMo</strong></td>
<td style="padding: 6px; border: 1px solid var(--border);">工程应用、碰撞仿真</td>
<td style="padding: 6px; border: 1px solid var(--border);">需 NVIDIA GPU</td>
</tr>
<tr>
<td style="padding: 6px; border: 1px solid var(--border);">NeuroDiffEq</td>
<td style="padding: 6px; border: 1px solid var(--border);">教学、简单问题</td>
<td style="padding: 6px; border: 1px solid var(--border);">工程级适用性有限</td>
</tr>
</table>
</section>

<section class="lesson-section">
<h2>4.2 NVIDIA PhysicsNeMo 详情</h2>
<ul>
<li>深度 GPU 优化,多 GPU/多节点</li>
<li>预训练模型库 (Model Zoo)</li>
<li>内置 FNO / DeepONet / GNN / PINN</li>
<li>官方碰撞示例 (d3plot + VTP 支持)</li>
</ul>
</section>

<section class="lesson-section">
<h2>4.3 商业平台对比</h2>
<table style="width:100%; border-collapse: collapse;">
<tr style="background: var(--bg-section);">
<th style="padding: 8px; border: 1px solid var(--border);">平台</th>
<th style="padding: 8px; border: 1px solid var(--border);">精度</th>
<th style="padding: 8px; border: 1px solid var(--border);">特点</th>
</tr>
<tr>
<td style="padding: 6px; border: 1px solid var(--border);"><strong>Luminary SHIFT-Crash</strong></td>
<td style="padding: 6px; border: 1px solid var(--border);">整车 &lt; 3% RMSE</td>
<td style="padding: 6px; border: 1px solid var(--border);">迁移学习、5000 仿真</td>
</tr>
<tr>
<td style="padding: 6px; border: 1px solid var(--border);">Ansys SimAI</td>
<td style="padding: 6px; border: 1px solid var(--border);">子系统级 &lt; 0.5%</td>
<td style="padding: 6px; border: 1px solid var(--border);">INR 连续代理、LS-DYNA 集成</td>
</tr>
<tr>
<td style="padding: 6px; border: 1px solid var(--border);">Altair PhysicsAI</td>
<td style="padding: 6px; border: 1px solid var(--border);">优化场景</td>
<td style="padding: 6px; border: 1px solid var(--border);">聚类+分类引入优化</td>
</tr>
<tr>
<td style="padding: 6px; border: 1px solid var(--border);">DEP AIWorks</td>
<td style="padding: 6px; border: 1px solid var(--border);">PINN 通用</td>
<td style="padding: 6px; border: 1px solid var(--border);">3 级非线性架构</td>
</tr>
</table>
</section>

<section class="lesson-section">
<h2>4.4 选型建议</h2>
<ul>
<li><strong>科研/方法学</strong>:DeepXDE</li>
<li><strong>工程应用/投产</strong>:PhysicsNeMo (NVIDIA GPU) 或 Luminary/Ansys 商业方案</li>
<li><strong>DOE 优化</strong>:Altair PhysicsAI</li>
<li><strong>少样本物理建模</strong>:DEP AIWorks</li>
</ul>
</section>
'''

bodies['05-engineering-practice'] = '''
<section class="lesson-section">
<h2>5.1 4 阶段落地路线图</h2>
<ol>
<li>><strong>验证可行性 (2-4 周)</strong>
<ul>
<li>选简单案例(悬臂梁冲击/方管压溃)</li>
<li>LS-DYNA 跑 100-200 DOE 样本</li>
<li>基础 GNN(GraphSAGE 2 层)</li>
<li>目标:RMSE &lt; 10%</li>
>
</ul>
</li>
<li>><strong>完整链路 (4-6 周)</strong>
<ul>
<li>自动数据管道 (DOE → 仿真 → 解析)</li>
<li>GNN+Transformer 混合 + 物理约束</li>
<li>FastAPI 推理服务</li>
<li>Three.js 前端 3D 可视化</li>
<li>目标:RMSE &lt; 5%,前端调参数实时看变形</li>
>
</ul>
</li>
<li>><strong>工程化优化 (4-8 周)</strong>
<ul>
<li>模型调优 + 注意力机制 + 多时间步</li>
<li>接触约束加入</li>
<li>不确定性估计</li>
<li>目标:关键指标误差 &lt; 3%</li>
>
</ul>
</li>
<li>><strong>多尺度拓展 (按需)</strong>
<ul>
li>子结构级联</li>
<li>材料多尺度</li>
<li>自适应细化</li>
>
</ul>
</li>
</ol>
</section>

<section class="lesson-section">
<h2>5.2 硬件需求</h2>
<table style="width:100%; border-collapse: collapse;">
<tr style="background: var(--bg-section);">
<th style="padding: 8px; border: 1px solid var(--border);">阶段</th>
<th style="padding: 8px; border: 1px solid var(--border);">GPU</th>
<th style="padding: 8px; border: 1px solid var(--border);">训练时间</th>
</tr>
<tr>
<td style="padding: 6px; border: 1px solid var(--border);">一(简单梁)</td>
<td style="padding: 6px; border: 1px solid var(--border);">RTX 3060</td>
<td style="padding: 6px; border: 1px solid var(--border);">几小时</td>
</tr>
<tr>
<td style="padding: 6px; border: 1px solid var(--border);">二(零部件)</td>
<td style="padding: 6px; border: 1px solid var(--border);">RTX 3060/4070</td>
<td style="padding: 6px; border: 1px solid var(--border);">1-3 天</td>
</tr>
<tr>
<td style="padding: 6px; border: 1px solid var(--border);">三(优化版)</td>
<td style="padding: 6px; border: 1px solid var(--border);">RTX 4090/A5000</td>
<td style="padding: 6px; border: 1px solid var(--border);">3-7 天</td>
</tr>
<tr>
<td style="padding: 6px; border: 1px solid var(--border);">整车级</td>
<td style="padding: 6px; border: 1px solid var(--border);">A100/H100</td>
<td style="padding: 6px; border: 1px solid var(--border);">数周</td>
</tr>
</table>
</section>

<section class="lesson-section">
<h2>5.3 物理约束权重推荐</h2>
<table style="width:100%; border-collapse: collapse;">
<tr style="background: var(--bg-section);">
<th style="padding: 8px; border: 1px solid var(--border);">约束类型</th>
<th style="padding: 8px; border: 1px solid var(--border);">实现</th>
<th style="padding: 8px; border: 1px solid var(--border);">权重</th>
</tr>
<tr>
<td style="padding: 6px; border: 1px solid var(--border);">动量守恒</td>
<td style="padding: 6px; border: 1px solid var(--border);">总动量预测偏差</td>
<td style="padding: 6px; border: 1px solid var(--border);">0.1-0.5</td>
</tr>
<tr>
<td style="padding: 6px; border: 1px solid var(--border);">能量守恒</td>
<td style="padding: 6px; border: 1px solid var(--border);">动能+内能+耗散 = 初始</td>
<td style="padding: 6px; border: 1px solid var(--border);">0.1-0.3</td>
</tr>
<tr>
<td style="padding: 6px; border: 1px solid var(--border);"><strong>接触不穿透</strong></td>
<td style="padding: 6px; border: 1px solid var(--border);">KKT 软约束 (FB 函数)</td>
<td style="padding: 6px; border: 1px solid var(--border);">1.0-5.0</td>
</tr>
<tr>
<td style="padding: 6px; border: 1px solid var(--border);">边界条件</td>
<td style="padding: 6px; border: 1px solid var(--border);">约束位移 = 0</td>
<td style="padding: 6px; border: 1px solid var(--border);">0.5-1.0</td>
</tr>
</table>
</section>

<section class="lesson-section">
<h2>5.4 关键风险与应对</h2>
<div class="important">
<div class="important-title">⚠ 5 大风险</div>
<ul>
<li><strong>样本量不足</strong> → 从简单案例开始,数据增强</li>
<li><strong>接触预测不准</strong> → 接触约束损失 + 局部细化</li>
<li><strong>大变形误差累积</strong> → 能量/动量约束 + teacher forcing</li>
<li><strong>仿真数据获取慢</strong> → 子模型技术</li>
<li><strong>前端性能</strong> → LOD 策略</li>
</ul>
</div>
</section>
'''

bodies['06-getting-started'] = '''
<section class="lesson-section">
<h2>6.1 学习路径 4 阶段</h2>
<ol>
<li>><strong>基础夯实 (2-4 周)</strong>:Python + PyG + 有限元 + 深度学习基础</li>
<li>><strong>模型实现 (4-6 周)</strong>:GNN + Transformer 混合架构实战</li>
<li>><strong>物理约束加入 (3-4 周)</strong>:PINN、能量守恒、接触</li>
<li>><strong>商业方案调研 (1-2 周)</strong>:Luminary / Ansys / Altair 评估</li>
</ol>
</section>

<section class="lesson-section">
<h2>6.2 入门资源推荐</h2>
<h3>📖 论文(由浅入深)</h3>
<ul>
<li><strong>入门</strong>:GNN 在非线性结构力学、DeepMind 2020 GNS</li>
<li><strong>碰撞</strong>:Luminary SHIFT-Crash (SAE 2026)、Transolver (ICML 2024 Spotlight)</li>
<li><strong>物理约束</strong>:PINN 在非线性固体力学、能量型 PINN</li>
</ul>
<h3>🛠 开源仓库</h3>
<ul>
<li><a href="https://github.com/pyg-team/pytorch_geometric" target="_blank">PyTorch Geometric (PyG)</a></li>
<li><a href="https://github.com/NVIDIA/modulus" target="_blank">NVIDIA PhysicsNeMo</a></li>
<li><a href="https://github.com/lululxvi/deepxde" target="_blank">DeepXDE</a></li>
<li><a href="https://github.com/deepmind/graph_nets" target="_blank">DeepMind Graph Nets</a></li>
</ul>
</section>

<section class="lesson-section">
<h2>6.3 30 天行动计划</h2>
<div class="important">
<div class="important-title">📅 团队落地推荐</div>
<ul>
<li><strong>第 1 周</strong>:基础夯实(PyG/DeepXDE 文档 + 有限元复习)</li>
<li><strong>第 2 周</strong>:选简单案例 + DOE 100-200 样本 + 训练基础 GNN</li>
<li><strong>第 3 周</strong>:加物理约束 + FastAPI 部署 + Three.js 前端</li>
<li><strong>第 4 周</strong>:商业方案对比 + 规划二期</li>
</ul>
</div>
</section>

<section class="lesson-section">
<h2>6.4 结论与建议</h2>
<ul>
<li><strong>AI+DOE+PINN 仿真降阶</strong>是当前工业界最成熟的代理建模路径之一</li>
<li>整车级 &lt; 3% RMSE,千倍加速已可达</li>
<li><strong>纯 PINN 不适合碰撞</strong> → 混合架构是务实选择</li>
<li>未来方向:<strong>多尺度桥接</strong>(微 PINN + 宏 GNN)</li>
</ul>
</section>

<section class="lesson-section">
<h2>6.5 下一步行动建议</h2>
<ol>
<li>><strong>先定案例</strong>:选你手头能快速跑出仿真结果的简单零部件</li>
<li>><strong>跑通 MVP</strong>:1-2 周把阶段一做完</li>
<li>><strong>再谈投入</strong>:确认可行后,投入更多资源做完整系统</li>
</ol>
</section>
'''