"""_chapter_bodies.py - PINN 课程 6 章 HTML 正文
   由 _rebuild_pinn_bodies.py 从 PINN仿真降阶_report.md 自动生成
   源文件是 UTF-8 + GBK 混合编码(章节标题用 GBK 字节嵌入)
"""
bodies = {
    '01-tech-foundations': '''<h3>1.1 AI+DOE+PINN完整技术链路</h3>
<p>AI+DOE+PINN仿真降阶是一个"数据生成—物理约束建模—快速推理"的三段式技术体系，其核心价值在于将昂贵的高保真仿真结果转化为可快速调用的代理模型，从而在设计优化、不确定性分析等需要大量重复求解的场景中实现数量级加速。</p>
<p>!<a href="https://www.coze.cn/s/zoMZtue6_bI/" target="_blank">AI+DOE+PINN仿真降阶完整技术链路</a></p>
<p>完整的工作流包含五个核心阶段：</p>
<p><strong>第一阶段：问题定义与参数化。</strong> 需要明确输入参数空间（设计变量如壁厚、材料参数、几何尺寸；工况参数如碰撞速度、冲击位置）和输出量（标量如最大加速度、侵入量；场量如应力分布、变形场）。参数化质量直接决定代理模型的适用范围，维度爆炸是主要风险——当设计变量超过20个时，采样成本会急剧上升。经验法则是参数维度为<em>d</em>时，初始DOE需要<em>10d~20d</em>个样本点 <a href="https://novasolver.jp/zh/ai-cae/index.html" target="_blank">(NovaSolver)</a>。</p>
<p><strong>第二阶段：DOE试验设计与采样。</strong> DOE的角色是在高维参数空间中以最高效的方式选取训练样本，确保用最少的仿真次数覆盖最全面的设计空间信息。常用策略包括：拉丁超立方抽样（LHS）保证每个变量维度的均匀覆盖；Hammersley/Sobol等低差异序列进一步降低样本方差；自适应采样（如RAR-G、RAD、RAR-D）则在训练过程中动态向残差大的区域补充样本点，是提升数据效率的关键 <a href="https://blog.csdn.net/qq_26157437/article/details/131249785" target="_blank">(CSDN博客)</a>。研究表明Hammersley采样在多种PDE问题上的PINN训练效果优于其他DOE策略 <a href="https://arxiv.org/pdf/2202.06416.pdf" target="_blank">(arXiv:2202.06416)</a>。</p>
<p><strong>第三阶段：高保真仿真数据生成。</strong> 这是整个流程中计算成本最高的环节。现代整车碰撞模型通常包含4000万-5000万个单元，在700-1000核的高性能集群上单次完整碰撞仿真需要25-30小时 <a href="https://www.ansys.com/zh-cn/blog/accelerating-automotive-safety-through-ai-powered-design" target="_blank">(Ansys博客)</a>。因此DOE采样的效率和仿真的并行度直接决定了项目周期。工业实践中常采用子模型技术（如侧梁子模型比整车快约400倍）来降低数据生成成本 <a href="https://www.cambridge.org/core/product/8B1C8340F82B88FACE8CD3CEAAB1E747/core-reader" target="_blank">(Cambridge Core)</a>。</p>
<p><strong>第四阶段：PINN/代理模型训练。</strong> 这是技术路线的核心。在纯PINN方案中，损失函数由三部分组成：</p>
<p>$$\\mathcal{L}(\\theta) = w_r \\mathcal{L}_r(\\text{PDE残差}) + w_b \\mathcal{L}_b(\\text{边界条件}) + w_d \\mathcal{L}_d(\\text{数据拟合})$$</p>
<p>其中PDE残差通过自动微分计算，无需生成网格 <a href="https://novasolver.jp/zh/ai-cae/index.html" target="_blank">(NovaSolver)</a>。但在实际碰撞场景中，由于接触、塑性大变形等强非线性难以写成可微的PDE形式，更多采用"数据驱动为主、物理约束为辅"的混合架构——以GNN或Transformer学习时空动力学，同时加入能量守恒、动量守恒等全局物理约束作为正则化项。</p>
<p><strong>第五阶段：验证与主动学习闭环。</strong> 模型训练完成后，需用独立验证集评估精度（指标包括RMSE、R²、场量可视化对比）。如果精度不满足要求，则通过主动学习策略在不确定性最大或预测误差最大的区域补充仿真样本，迭代优化直到满足精度要求。这一闭环是保证工程可用性的关键——静态DOE往往难以覆盖强非线性问题的所有行为模式。</p>
<h3>1.2 PINN降阶 vs 纯数据驱动降阶：优势与局限</h3>
<p>!<a href="https://www.coze.cn/s/xnute84GUNw/" target="_blank">PINN vs POD-ROM vs Autoencoder降阶方法能力对比</a></p>
<p><strong>PINN相对于传统POD-ROM的核心优势。</strong> 传统POD-ROM通过将高维解投影到低维基空间实现降阶，本质是线性子空间逼近，在强非线性问题（如碰撞塑性变形）中会迅速丧失精度。POD-ROM的另一根本限制是几何固定性——所有数据必须来自同一几何的不同工况，无法处理设计变量中的几何变化 <a href="https://m.eeworld.com.cn/bbs_thread-1351961-1-1.html" target="_blank">(电子工程世界)</a>。PINN则具有三个本质优势：一是<strong>无网格特性</strong>，可处理复杂几何和移动边界，天然支持参数化几何变化；二是<strong>物理一致性保证</strong>，输出自动满足控制方程约束，在数据稀疏区域不会产生明显违背物理的结果；三是<strong>逆问题天然支持</strong>，可同时进行正问题求解和参数反演（如材料参数辨识） <a href="https://arxiv.org/pdf/2303.14878" target="_blank">(arXiv:2303.14878)</a>。</p>
<p><strong>PINN相对于纯数据驱动Autoencoder的优势。</strong> Autoencoder通过编码器-解码器架构实现非线性降维，完全依赖数据量和数据覆盖面，在训练分布外的预测可能严重偏离物理规律，甚至违反守恒律。PINN通过将PDE残差嵌入损失函数，即使在数据稀缺场景下也能维持基本的物理合理性，理论上具有更好的外推能力和泛化性。以谐振子为例，纯神经网络在训练点外预测严重偏离真实解，而PINN几乎与精确解重合 <a href="https://blog.csdn.net/gitblog_00849/article/details/155962943" target="_blank">(CSDN博客)</a>。</p>
<p><strong>PINN的核心局限。</strong> 第一，<strong>训练效率问题</strong>：普通PINN的训练速度通常显著慢于经典数值方法，因为需要优化大量参数且损失函数包含复杂的高阶导数计算 <a href="https://arxiv.org/pdf/2303.14878" target="_blank">(arXiv:2303.14878)</a>。第二，<strong>强非线性和接触问题困难</strong>：对于高度非线性、存在不连续性（如接触冲击、材料失效）的问题，PINN的PDE残差计算面临挑战，需要特殊处理。第三，<strong>大规模问题可扩展性</strong>：整车级千万自由度的碰撞仿真远超当前PINN的典型应用尺度，纯PINN架构在计算上不可行。第四，<strong>损失函数权重调优困难</strong>：数据项、PDE项、边界项之间的权重平衡对结果影响极大，缺乏系统性调参方法。</p>
<p>正因为这些局限，工业级碰撞降阶实际上走的是<strong>混合路线</strong>：用GNN或神经算子处理大规模时空场预测（数据驱动主力），用物理约束（能量、动量、对称性）作为正则化项提升泛化性（PINN思想辅助），用DOE+高保真仿真构建训练数据集（数据基础设施）。这不是对PINN理念的背离，而是PINN在复杂工程问题中的实用化形态。</p>
<h3>1.3 汽车碰撞场景下PINN如何处理非线性与接触</h3>
<p>汽车碰撞是结构力学中最具挑战性的问题之一，其复杂性来自三个方面：<strong>材料非线性</strong>（塑性屈服、硬化、失效）、<strong>几何非线性</strong>（大变形、大转动、屈曲）和<strong>边界非线性</strong>（接触-冲击、摩擦）。纯PINN在这个场景中的应用需要一系列专门的技术处理。</p>
<p><strong>材料非线性的处理。</strong> 对于弹塑性材料，PINN可以将本构方程（如J2塑性理论、超弹性模型）嵌入损失函数，通过应力-应变关系的残差作为约束项。DEP AIWorks的做法是针对不同非线性程度（轻度、中度、高度）设计不同的PINN架构，其中高度非线性问题需要更复杂的网络结构和特殊的损失函数设计 <a href="https://depusa.com/aiworks" target="_blank">(DEP AIWorks)</a>。能量型PINN（Energy-based PINN）是处理材料非线性的另一种有效路径——它通过最小化总势能而非满足强形式PDE来训练网络，在大变形、不稳定现象（如屈曲）和近不可压缩材料上表现更稳健 <a href="https://arxiv.org/pdf/2411.03671.pdf" target="_blank">(arXiv:2411.03671)</a>。</p>
<p><strong>接触问题的处理。</strong> 接触是碰撞仿真的核心难点，也是PINN应用的主要挑战之一。接触问题的本质是一组不等式约束（KKT条件/Hertz-Signorini-Moreau条件）：间隙非负、接触压应力非正、两者乘积为零。当前主要有三种处理策略：</p>
<ul>
<li><strong>罚函数法（Penalty Method）</strong>：最简单的方式，用二次惩罚项½η·max(0, -gap)²近似非穿透约束。这种方法在能量型PINN框架中实现方便，已被用于3D赫兹接触和环形失稳接触问题 <a href="https://deepwiki.com/imcs-compsim/pinns_for_comp_mech/5.4-large-deformation-problems" target="_blank">(deepwiki)</a>。缺点是惩罚参数η的选择需要权衡——太小则穿透严重，太大则训练不稳定。</li>
</ul>
<ul>
<li><strong>KKT软约束法</strong>：将KKT不等式条件直接转化为损失函数项。具体实现方式包括符号法、Sigmoid法和Fischer-Burmeister NCP函数法，其中Fischer-Burmeister函数因其良好的优化特性被认为是最佳选择 <a href="https://scispace.com:443/pdf/solving-forward-and-inverse-problems-of-contact-mechanics-28ed6fs322.pdf" target="_blank">(Sahin et al.)</a>。</li>
</ul>
<ul>
<li><strong>PINN-FEM耦合法</strong>：对于复杂的多体接触问题，最新研究提出通过Robin-Neumann域分解将PINN和FEM耦合，PINN侧处理需要频繁拓扑变化的区域（如流体接触），通过配点排除（collocation exclusion）自动适应接触界面变化，无需重网格化。测试显示静态平衡接触反力误差可控制在0.4%以内 <a href="https://arxiv.org/abs/2606.14181v1" target="_blank">(arXiv:2606.14181)</a>。</li>
</ul>
<p><strong>瞬态动力学的处理。</strong> 碰撞是一个强瞬态过程，需要准确预测整个时间历程。当前的神经网络代理模型主要采用三种瞬态建模策略：时间条件式（Time-Conditional，直接以时间为输入预测状态）、标准自回归式（Autoregressive，逐步递推预测）和稳定性增强自回归式（含rollout训练以提高长时间稳定性）。NVIDIA的对比研究显示，稳定性增强自回归方案在碰撞动力学的长期预测中表现最优，而时间条件式虽然简单但容易丢失动力学细节 <a href="https://arxiv.org/pdf/2510.15201v2.pdf" target="_blank">(arXiv:2510.15201v2)</a>。</p>
<p>---</p>''',
    '02-research-progress': '''<h3>2.1 学术前沿：从部件级到整车级的突破</h3>
<p>2024-2026年，碰撞仿真领域的AI代理模型研究呈现出明显的"规模升级"趋势——从早期的简单部件（梁、管）发展到整车级复杂结构，从标量预测发展到全场时空预测。</p>
<p><strong>整车级代理模型的最新进展。</strong> 2026年5月，SEAT与IDIADA合作发布了侧柱撞击（lateral pole-impact）整车级代理模型研究，采用MeshTransolver、MeshGeoTransolver、MeshGeoFLARE等混合架构，在25个测试样本上实现了<strong>时间平均RMSE仅3.20mm</strong>的精度。研究发现，纯注意力模型虽然在量化指标上有竞争力，但定性检查会发现局部空间噪声和变形不规则；而"网格消息传递+几何感知注意力+稀疏接触感知修正"的混合架构在标量精度、生存空间一致性和物理解释性之间取得了最佳平衡 <a href="https://arxiv.org/pdf/2605.11784" target="_blank">(arXiv:2605.11784)</a>。</p>
<p>NVIDIA与通用汽车合作的白车身碰撞研究更进一步，使用150次LS-DYNA仿真训练MeshGraphNet和Transolver模型，支持可变厚度分布的参数化输入，能够预测整个碰撞过程的时空变形演化。虽然尚未达到完整FE精度，但实现了数量级的计算加速，证明了ML代理模型在早期碰撞安全性优化中的可行性 <a href="https://www.nvidia.com/en-us/on-demand/session/gtc26-s81785/" target="_blank">(GTC 2026)</a>。该工作已整合进NVIDIA PhysicsNeMo框架，作为官方示例提供，支持d3plot和VTP数据格式 <a href="https://docs.nvidia.com/physicsnemo/latest/physicsnemo/examples/structural_mechanics/crash/README.html" target="_blank">(NVIDIA文档)</a>。</p>
<p><strong>模型架构的演进路径。</strong> 碰撞代理模型的架构选择经历了三代演进：</p>
<p>第一代是<strong>标量回归模型</strong>（GPR、DNN），直接从设计参数预测几个关键性能指标（如最大侵入量、峰值加速度）。这类模型数据需求少、实现简单，但丢失了空间分布信息，无法支持详细的工程分析。典型如某皮卡车碰撞BP神经网络代理模型，以碰撞速度为输入、力-位移曲线为输出，最大峰值相对误差在2.74%-9.6%之间 <a href="http://qks.cqu.edu.cn/html/cqdxzrcn/2021/2/20210209.htm" target="_blank">(重庆大学学报)</a>。</p>
<p>第二代是<strong>全场图神经网络</strong>（MeshGraphNet等），直接在网格上运行，以节点位移为输出，能够保留完整的空间信息。MeshGraphNet以网格连接为图结构，通过边更新-节点更新的消息传递机制学习局部物理交互，具有天然的结构归纳偏置 <a href="https://arxiv.org/pdf/2510.15201v2.pdf" target="_blank">(arXiv:2510.15201v2)</a>。</p>
<p>第三代是<strong>注意力混合架构</strong>（Transolver、GeoTransolver），在GNN基础上引入注意力机制捕捉长程变形模式。Transolver的核心创新是在学习的物理状态空间上计算注意力而非直接在网格点上，从而克服了Transformer的二次复杂度问题，同时获得了更好的几何泛化能力。该架构在六个标准基准上比之前SOTA降低22%误差，已集成到NVIDIA PhysicsNeMo <a href="https://github.com/thuml/Transolver/blob/main/README.md" target="_blank">(Transolver GitHub)</a>。</p>
<p><strong>精度与效率的量化进展。</strong> 不同研究的精度指标因问题规模和复杂度差异较大，但总体趋势清晰：</p>
<ul>
<li>部件级（轨道、横梁）：压溃误差<0.5%，力误差<10%，加速20x-50x <a href="http://hengstar-china.com/ueditor/php/upload/file/20250528/1748400839785342.pdf" target="_blank">(Ansys SimAI)</a></li>
<li>子系统级（侧梁、B柱）：R²=0.80-0.95，加速400x+（子模型相对整车） <a href="https://www.cambridge.org/core/product/8B1C8340F82B88FACE8CD3CEAAB1E747/core-reader" target="_blank">(Cambridge Core)</a></li>
<li>整车级（白车身）：位移RMSE=3.20mm，加速100x-1000x（推理阶段） <a href="https://arxiv.org/pdf/2605.11784" target="_blank">(arXiv:2605.11784)</a></li>
<li>整车级（完整功能模型）：RMSE<3%，从数小时压缩到数秒 <a href="https://luminary.ai/resources/luminary-launches-shift-crash-first-physics-ai-model-for-full-vehicle-crash-prediction/" target="_blank">(Luminary SHIFT-Crash)</a></li>
</ul>
<p>需要注意的是，这些精度数字都是在<strong>训练参数空间内</strong>（interpolation）的验证结果。一旦超出训练分布，精度会急剧下降——这是所有数据驱动方法的共同瓶颈，也是PINN物理约束最有可能发挥价值的地方。</p>
<h3>2.2 代表性研究团队与机构</h3>
<p><strong>产业界领先团队。</strong> 当前碰撞AI仿真的技术突破主要由产业界和产业合作项目推动：</p>
<ul>
<li><strong>Luminary（前称PhysicsAI）</strong>：推出首个整车级Physics AI碰撞模型SHIFT-Crash，基于5000次仿真训练，采用迁移学习架构，已在实际OEM项目中验证 <a href="https://luminary.ai/resources/shift-crash-bringing-physics-ai-to-full-vehicle-crashworthiness-prediction/" target="_blank">(Luminary)</a></li>
<li><strong>NVIDIA PhysicsNeMo团队</strong>：联合通用汽车开发碰撞ML代理模型，提供开源框架和官方示例，架构涵盖MeshGraphNet、Transolver等多种方案 <a href="https://docs.nvidia.com/physicsnemo/latest/physicsnemo/examples/structural_mechanics/crash/README.html" target="_blank">(NVIDIA)</a></li>
<li><strong>Ansys SimAI团队</strong>：基于深度学习的通用代理建模平台，与LS-DYNA深度集成，在侧面碰撞、行人保护、保险杠碰撞等多个场景验证 <a href="https://www.ansys.com/zh-cn/blog/accelerating-automotive-safety-through-ai-powered-design" target="_blank">(Ansys博客)</a></li>
<li><strong>Altair PhysicsAI团队</strong>：与BMW合作开发碰撞优化ML增强工作流，将聚类+分类引入优化以模拟工程经验判断 <a href="https://altair.com/docs/default-source/resource-library/altair_customerstory_bmw_letter049985b9-905b-4079-833e-8b0c8134bc40.pdf" target="_blank">(Altair案例)</a></li>
<li><strong>DEP（Detroit Engineered Products）</strong>：AIWorks平台提供PINN架构的工程仿真代理，已在多家汽车OEM生产部署 <a href="https://depusa.com/aiworks" target="_blank">(DEP)</a></li>
</ul>
<p><strong>学术界关键团队。</strong> 基础研究层面，以下团队的工作值得关注：</p>
<ul>
<li><strong>布朗大学/北京大学 Lu Lu团队（DeepXDE）</strong>：PINN框架的主要开发者，在PINN方法学、自适应采样、算子学习方面有系统性贡献 <a href="https://deepxde.readthedocs.io/en/latest/user/research.html" target="_blank">(DeepXDE文档)</a></li>
<li><strong>西安电子科技大学董灏团队</strong>：专注高阶多尺度PINN（HOMS-PINN）方法，在复合材料多尺度热-力耦合问题上有系列成果 <a href="https://faculty.xidian.edu.cn/DH2/zh_CN/index/396877/list/index.htm" target="_blank">(西电董灏主页)</a></li>
<li><strong>清华大学Transolver团队</strong>：开发了Transolver架构（ICML 2024 Spotlight），已被NVIDIA集成到PhysicsNeMo <a href="https://github.com/thuml/Transolver/blob/main/README.md" target="_blank">(Transolver GitHub)</a></li>
<li><strong>SEAT/IDIADA联合团队</strong>：在工业级整车碰撞代理模型评估方面有系统研究，提供了多架构公平对比的基准数据 <a href="https://arxiv.org/pdf/2605.11784" target="_blank">(arXiv:2605.11784)</a></li>
</ul>
<h3>2.3 神经算子在非线性动力学中的局限</h3>
<p>需要特别指出的是，<strong>傅里叶神经算子（FNO）等算子学习方法在强非线性结构动力学中的表现存在明显局限</strong>。UC Berkeley 2026年的系统评估显示，在地震激励下的非线性结构响应预测中，FNO的误差随非线性程度急剧恶化：线性系统相对L2误差为0.02，立方硬化系统升至0.28，双线性滞回系统达到0.38。当结构周期超出训练区间（0.5-1.0s）时，误差甚至超过1，即预测完全失效 <a href="https://engrxiv.org/preprint/view/7702/version/9942" target="_blank">(engrXiv)</a>。</p>
<p>这一发现对碰撞仿真有直接的警示意义：碰撞动力学比地震响应具有更强的非线性和路径依赖性（塑性、接触、屈曲都是强不连续行为），纯算子学习方法可能面临更严峻的挑战。这也解释了为什么工业级方案普遍采用混合架构而非纯FNO——GNN的归纳偏置和自回归的时间递推方式对于处理强非线性瞬态过程更为可靠。</p>
<p>---</p>''',
    '03-multiscale': '''<h3>3.1 多尺度问题的本质与挑战</h3>
<p>汽车结构中的多尺度问题横跨多个层次：微观尺度（晶粒、纤维、位错）→ 介观尺度（复合材料层、焊缝、涂层）→ 宏观尺度（部件、子系统、整车）。传统多尺度方法（如均质化方法、FE²）的计算瓶颈在于：每一个宏观积分点的响应都需要调用一次微观RVE（代表性体积单元）的完整有限元计算，计算量与两个尺度的自由度乘积成正比，在工程问题中几乎不可行。</p>
<p>PINN和AI降阶为多尺度仿真提供了新的思路：用神经网络代理模型替代微观RVE的有限元计算，使每个宏观积分点的应力更新从"求解一个边界值问题"变为"一次神经网络前向传播"，从而实现数量级的加速。</p>
<h3>3.2 PINN在多尺度中的技术路线</h3>
<p><strong>高阶多尺度PINN（HOMS-PINN）框架。</strong> 西安电子科技大学董灏团队发展的高阶多尺度物理信息神经网络框架，将多尺度物理约束分解为三个层次：低阶微观单元函数、高阶微观单元函数和宏观均质方程。这种分解的核心价值在于：通过多尺度渐近分析将强振荡的微观场"提取"出来，让PINN只需学习相对光滑的宏观场和修正项，大大降低了学习难度。与直接用PINN模拟整个多尺度问题相比，HOMS-PINN的计算量可减少约一半，同时能够精确捕捉微观尺度的剧烈振荡——这是纯PINN方法难以做到的，因为神经网络倾向于学习低频成分（频谱偏见，spectral bias） <a href="https://www.bohrium.com/paper-details/higher-order-multi-scale-physics-informed-neural-network-homs-pinn-method-and-its-convergence-analysis-for-solving-elastic-problems-of-authentic-composite-materials/1056156140724813856-879" target="_blank">(Bohrium)</a>。</p>
<p>该方法已在二维和三维复合材料、多孔材料的热力耦合问题上验证，不仅精度优于传统FEM多尺度方法，而且在大规模材料和长时间问题上的计算效率优势更加明显。2025年进一步发展的HOMS-PIRNN（随机神经网络版本）和HOMS-RNN方法在动态热力耦合问题上继续提升了效率和精度 <a href="https://journals.sagepub.com/doi/10.1177/10812865251362165" target="_blank">(SAGE Journals)</a>。</p>
<p><strong>分层物理循环神经网络（HPRNN）。</strong> 对于编织复合材料等具有层级结构的材料，研究人员提出了三层式架构：微观纱线尺度PRNN → 介观编织RVE代理 → 宏观结构。物理循环神经网络（PRNN）的核心是将本构关系的路径依赖性编码进循环结构中，使其能够准确捕捉非线性滞回行为。测试显示，PRNN预测的纱线非线性行为与FE结果高度吻合，而传统的平均场均质化（MFH）方法偏差较大，验证了物理编码架构在多尺度建模中的优势 <a href="https://arxiv.org/html/2503.04901" target="_blank">(arXiv:2503.04901)</a>。</p>
<p><strong>VPINN与变分方法。</strong> 变分PINN（VPINN）采用Petrov-Galerkin方法，以神经网络为试函数、局部多项式为检验函数，相比强形式PINN更适合处理材料不连续问题。结合树状自适应积分方案（quadtree/octree），VPINN能够稳健捕捉内部材料界面，同时大幅降低计算成本。这一方法已在多相架构材料的力学分析中验证 <a href="https://arxiv.org/pdf/2506.23357.pdf" target="_blank">(arXiv:2506.23357)</a>。</p>
<h3>3.3 从材料多尺度到结构多尺度</h3>
<p>当前的AI+PINN多尺度研究主要集中在<strong>材料多尺度</strong>（均质化、RVE代理）层面，而结构多尺度（部件-子系统-整车）的AI降阶更多依赖传统代理建模和数据驱动方法，而非PINN。主要原因在于：</p>
<ol>
<li>材料多尺度有明确的PDE约束（平衡方程、本构方程），PINN的物理约束作用直接而有效；而结构级碰撞的PDE形式虽然存在，但接触和失效带来的不连续性使残差计算非常困难。</li>
</ul>
<ol>
<li>材料RVE的尺度较小、边界条件规整，适合PINN的无网格方法；而整车结构几何复杂、载荷工况多样，需要GNN等直接处理非结构化数据的架构。</li>
</ul>
<ol>
<li>材料多尺度的核心瓶颈是计算效率（每个宏观点都要算RVE），PINN代理能带来1000x+加速；而结构级的瓶颈更多是设计空间探索，代理模型的价值在于快速评估而非每一步计算替代。</li>
</ul>
<p>因此，在完整的"材料-结构"跨尺度链路上，AI降阶的合理分工是：<strong>微观/介观尺度用PINN代理均质化（物理约束强、样本量小），宏观/系统级用GNN/神经算子代理全场响应（数据驱动、规模大）</strong>，两者通过尺度桥接接口连接。这也是当前最有前景的技术融合方向。</p>
<p>---</p>''',
    '04-tools-frameworks': '''<h3>4.1 开源框架</h3>
<p>!<a href="https://www.coze.cn/s/xOK_nfjHl1w/" target="_blank">AI+PINN仿真工具多维度能力对比</a></p>
<p><strong>DeepXDE。</strong> 由布朗大学Lu Lu等人（现北京大学）开发，是目前最成熟、最广泛使用的PINN开源框架，已被250+大学采用 <a href="https://deepxde.readthedocs.io/en/latest/user/research.html" target="_blank">(DeepXDE文档)</a>。支持PINN、DeepONet、FNO、MIONet等多种算法，覆盖正问题、逆问题、积分微分方程等多种场景。优势在于：API设计简洁直观，用户代码高度接近数学表述；支持复杂几何（CSG布尔运算、点云几何）；5种边界条件类型；3种自动微分方式。固体力学方面已实现弹性梁、板的大变形、赫兹接触、弹塑性等算例。不足是性能优化不如商业级框架，大规模问题和GPU并行需要自行实现。适合科研探索、方法验证和原型开发。</p>
<p><strong>NVIDIA PhysicsNeMo（原Modulus）。</strong> NVIDIA推出的物理机器学习开源平台，专为大规模工程问题和生产部署优化。核心优势在于：深度GPU优化，支持多GPU多节点训练；预训练模型库（Model Zoo）可快速微调；内置FNO、DeepONet、GNN、PINN等多种架构；官方提供碰撞动力学示例，支持LS-DYNA d3plot数据读取 <a href="https://docs.nvidia.com/physicsnemo/latest/physicsnemo/examples/structural_mechanics/crash/README.html" target="_blank">(NVIDIA文档)</a>。在碰撞仿真中提供MeshGraphNet、Transolver、GeoTransolver、GeoFlare等多种架构选择，精度排名为GeoFlare > GeoTransolver > Transolver > MeshGraphNet。与GM合作的白车身碰撞项目是其标杆案例。限制是需要NVIDIA GPU，学习曲线较陡，更适合有一定AI基础的团队。</p>
<p><strong>NeuroDiffEq。</strong> 基于PyTorch的轻量级PINN库，由哈佛大学等机构的研究组使用。功能相对基础，主要用于教学和简单问题研究，在工程级问题上的适用性有限 <a href="https://github.com/topics/pinn?l=python&o=asc" target="_blank">(GitHub topics)</a>。</p>
<p>其他有价值的开源工具还包括：NeuralPDE（Julia生态，基于SciML）、PyDEns（俄罗斯团队，教学用）。整体而言，<strong>对于汽车碰撞的工程应用，PhysicsNeMo是当前最佳开源选择</strong>，DeepXDE则适合方法学研究和小规模验证。</p>
<h3>4.2 商业CAE软件的AI集成</h3>
<p>主流CAE厂商正在快速布局AI功能，但集成深度和产品形态差异很大。</p>
<p><strong>Ansys：最积极的AI玩家。</strong> Ansys是传统CAE厂商中AI投入最大的一家，其AI战略包含多条产品线：</p>
<ul>
<li><strong>SimAI</strong>：独立的深度学习代理建模平台，云部署，物理无关（可用于流体、结构、电磁等多种物理）。在碰撞领域已验证多个场景：侧面碰撞（变极位置和门梁配置）、行人头碰（HIC预测，86训练+20测试样本）、保险杠碰撞（压溃误差<0.5%，力误差<10%，预测时间<1分钟）。核心架构是基于隐式神经表示（INR）的连续代理模型，对网格变化鲁棒，能捕捉多尺度现象 <a href="https://www.ansys.com/zh-cn/blog/accelerating-automotive-safety-through-ai-powered-design" target="_blank">(Ansys博客)</a>。SimAI的官方宣称加速比为10x-100x。</li>
</ul>
<ul>
<li><strong>LS-DYNA + Twin Builder ROM</strong>：将降阶模型作为LS-DYNA中的代理子结构使用，用Twin Builder生成ROM，在LS-DYNA中替换复杂结构以节省计算时间。这种ROM方案是成熟的商业功能，但仅限于固定几何 <a href="https://www.ansys.com/it-it/blog/safety-first-computational-combo" target="_blank">(Ansys博客)</a>。</li>
</ul>
<ul>
<li><strong>用户自定义材料（UMAT）代理模型</strong>：通过管道框架实现LS-DYNA与Python脚本的共仿真，可将训练好的神经网络材料模型（代理本构）嵌入LS-DYNA求解流程。这种模式在电池多尺度建模中已有实践，为材料级AI降阶提供了技术路径 <a href="https://www.dynalook.com/conferences/14th-european-ls-dyna-conference-2023/battery-electric-vehicle/dhumal_dynamore.pdf/@@download/file/Dhumal_DYNAmore.pdf" target="_blank">(DYNAmore)</a>。</li>
</ul>
<p><strong>Altair：物理AI与优化深度整合。</strong> Altair的AI仿真产品称为<strong>PhysicsAI</strong>，整合在HyperWorks和HyperStudy生态中。其特点是与设计优化流程紧密结合，不仅做代理预测，还直接支持多学科优化（MDO）。轨道碰撞可行性研究显示：450次FEA训练、50次验证，AI与FEA结果一致性良好，帕累托前沿最大偏差15%，速度提升5倍 <a href="https://altair.com/docs/default-source/resource-library/altair_whitepaper_rail_crash_physicsai_061025-final-clean.pdf" target="_blank">(Altair白皮书)</a>。BMW的案例更具代表性：用无监督聚类理解碰撞运动学对KPI的影响，再用分类器在优化中强制执行有利的运动模式，本质上是用ML"模拟工程专家经验"，简化了优化问题的表述 <a href="https://altair.com/docs/default-source/resource-library/altair_customerstory_bmw_letter049985b9-905b-4079-833e-8b0c8134bc40.pdf" target="_blank">(Altair案例)</a>。Altair还提供ODYSSEE CAE工具，专用于DOE+ROM工作流，POD_KRG等算法在约束系统分析中R²可达97%以上 <a href="https://m.auto-testing.net/news/show-120458.html" target="_blank">(汽车测试网)</a>。</p>
<p><strong>Siemens：RomAI + HEEDS双轨。</strong> Siemens的AI仿真战略分为两条线：</p>
<ul>
<li><strong>Simcenter RomAI</strong>：深度学习驱动的降阶建模工具，无代码界面，支持静态和动态模型训练，可通过FMI导出，主要面向数字孪生和系统仿真。</li>
<li><strong>HEEDS AI Simulation Predictor</strong>：AI驱动的设计空间探索工具，核心创新是"精度感知AI"——主动自我验证预测结果，帮助解决AI漂移问题。在燃气轮机应用中实现了24小时处理2万个设计、寿命提升20%、节省15000+小时计算时间的成果 <a href="https://news.siemens.com/lt-lt/heeds-ai-simulation-predictor-simcenter-rom/" target="_blank">(Siemens新闻)</a>。</li>
<li><strong>Simcenter PhysicsAI</strong>：可行性研究显示在轨道碰撞设计中可达到5倍加速，与HyperStudy工作流集成 <a href="https://resources.sw.siemens.com/en-US/white-paper-ai-feasibility-study-optimizing-crash-performance-using-simcenter-physicsai/" target="_blank">(Siemens白皮书)</a>。</li>
</ul>
<p><strong>Abaqus：社区驱动的AI集成。</strong> 达索的Abaqus本身尚未内置PINN功能，但通过Python API（odb访问）和用户子程序，社区已发展出丰富的自定义集成方案。典型流程是：用Python脚本从ODB文件提取结果（节点位移、应力等）→ 用PyTorch/TensorFlow训练代理模型 → 将模型作为代理或降阶模型使用。已有的研究案例包括：热压工艺深度学习代理（温度场预测误差约3°C，加速~10⁴倍）、GNN静态弹性代理（计算时间~0.1s vs ~20s，Mooney-Rivlin材料）等 <a href="https://caeassistant.com/blog/abaqus-surrogate-modeling/" target="_blank">(CAE Assistant)</a>。HyperWorks 2026也已内置GPU加速物理AI功能 <a href="https://wenku.csdn.net/answer/3szscpkx7a4w" target="_blank">(CSDN问答)</a>。</p>
<h3>4.3 专用碰撞AI工具</h3>
<p>除了传统CAE厂商的AI功能，还有一类专用的Physics AI公司和工具，它们走的是"从零构建AI仿真引擎"的路线，而非在传统求解器上做AI增强。</p>
<p><strong>Luminary SHIFT-Crash。</strong> 这是目前最激进、定位最清晰的专用碰撞AI产品。2026年4月在SAE World Congress发布，定位为"首个整车碰撞Physics AI模型"。核心特性：</p>
<ul>
<li>基于5000次碰撞仿真训练（2010丰田雅力士平台）</li>
<li>预测全场响应：节点位移时间历程 + Von Mises应力场</li>
<li>RMSE < 3%，推理时间从数小时压缩到数秒</li>
<li>支持迁移学习：同级别车型第三个项目仅需300次补充仿真，跨级别约600次</li>
<li>可从预测场量中提取工程决策所需的KPI（峰值减速度、防火墙侵入量、delta-V等）</li>
</ul>
<p>与传统FEM的关键区别是：SHIFT-Crash是可重用的AI模型，能跨车型项目积累碰撞物理知识，而FEM每个新设计都要从头计算 <a href="https://luminary.ai/resources/luminary-launches-shift-crash-first-physics-ai-model-for-full-vehicle-crash-prediction/" target="_blank">(Luminary)</a>。其技术路线不是纯PINN，而是"数据+物理"的Physics AI范式——利用大规模仿真数据学习，结合物理约束保证一致性。</p>
<p><strong>DEP AIWorks。</strong> 定位是"完整的工程仿真AI工作流平台"，覆盖从数据生成到设计优化的全生命周期。核心是PINN技术，但针对不同非线性程度有专门的架构设计。声称已在主要汽车OEM、航空航天项目和一级供应商中<strong>生产部署</strong>（非试点项目）。精度指标：气动阻力<3%误差、碰撞/侧面冲击95%+ R²、NVH整车身<1%频率误差 <a href="https://depusa.com/aiworks" target="_blank">(DEP AIWorks)</a>。平台架构包含7个模块：Simulate-AI（CAE数据生成器）、Adaptive Trainer（自适应训练器）、Predictor（预测器）、Auto Parametrizer（自动参数化）、Optimizer（优化器）、GEN-AI（生成式AI）、Enterprise Data Connector（企业数据连接器）。2026年4月正式发布AIWorks平台 <a href="https://dailycadcam.com/dep-launches-aiworks-an-ai-powered-engineering-platform-integrating-machine-learning-and-simulation/?noamp=available" target="_blank">(DailyCADCAM)</a>。</p>
<h3>4.4 工具选型决策矩阵</h3>
<p>!<a href="https://www.coze.cn/s/1Cfl6JBDMfg/" target="_blank">各工具碰撞仿真精度与加速对比</a></p>
<table class="markdown-table"><thead><tr><th>工具/框架</th><th>类型</th><th>碰撞适用性</th><th>核心技术</th><th>精度等级</th><th>加速比</th><th>部署形态</th><th>推荐场景</th></tr></thead><tbody>
<tr><td>Luminary SHIFT-Crash</td><td>商业专用</td><td>★★★★★</td><td>Physics AI（数据+物理混合）</td><td>RMSE<3%（整车）</td><td>~1000x</td><td>商业平台</td><td>整车级碰撞设计优化，OEM项目级</td></tr>
<tr><td>NVIDIA PhysicsNeMo</td><td>开源框架</td><td>★★★★☆</td><td>GNN/Transformer（MeshGraphNet, Transolver）</td><td>RMSE=3.2mm（整车侧碰）</td><td>100-1000x</td><td>开源，需NVIDIA GPU</td><td>自研代理模型，研究与开发</td></tr>
<tr><td>Ansys SimAI</td><td>商业平台</td><td>★★★★☆</td><td>深度学习+隐式神经表示</td><td>压溃误差<0.5%，力误差<10%</td><td>10-100x</td><td>云服务/商业许可</td><td>LS-DYNA用户的AI增强工作流</td></tr>
<tr><td>DEP AIWorks</td><td>商业平台</td><td>★★★★☆</td><td>PINN（分级架构）</td><td>碰撞R²>95%</td><td>10x+</td><td>商业平台</td><td>多学科AI仿真，OEM生产部署</td></tr>
<tr><td>Altair PhysicsAI</td><td>商业平台</td><td>★★★☆☆</td><td>ML代理+优化集成</td><td>帕累托偏差<15%</td><td>5x+</td><td>HyperWorks生态</td><td>优化驱动设计，已有Altair用户</td></tr>
<tr><td>DeepXDE</td><td>开源框架</td><td>★★☆☆☆</td><td>纯PINN</td><td>部件级可验证</td><td>不定（取决于训练成本）</td><td>开源，Python</td><td>PINN方法研究，小规模验证</td></tr>
<tr><td>Siemens PhysicsAI</td><td>商业平台</td><td>★★★☆☆</td><td>AI代理+ROM</td><td>R²良好（具体未披露）</td><td>5x+</td><td>Simcenter生态</td><td>Simcenter用户的渐进式引入</td></tr>
<p><strong>选型建议：</strong> 如果团队以LS-DYNA为主且希望最小侵入式引入AI，优先考虑Ansys SimAI；如果需要自研模型、有AI开发能力，选PhysicsNeMo（开源、有碰撞示例）；如果做整车级碰撞优化且有预算，考虑Luminary SHIFT-Crash或DEP AIWorks；如果已经是Altair/Siemens用户，从各自的PhysicsAI/RomAI开始试水成本最低。</p>
<p>---</p>
</tbody></table>''',
    '05-engineering-practice': '''<h3>5.1 训练数据量与硬件需求</h3>
<p><strong>数据量需求。</strong> 数据量需求与问题维度、复杂度和目标精度强相关。根据公开案例可总结出大致规律：</p>
<ul>
<li><strong>标量+低维（3-5个参数）</strong>：25-100次仿真即可达到较高精度。例如约束系统ROM案例用3个设计变量、25个DOE样本，R²>97% <a href="https://m.auto-testing.net/news/show-120458.html" target="_blank">(汽车测试网)</a>。</li>
<li><strong>场量+中维（10-20个参数）</strong>：几百次仿真量级。例如Altair轨道碰撞用450次训练+50次验证 <a href="https://altair.com/docs/default-source/resource-library/altair_whitepaper_rail_crash_physicsai_061025-final-clean.pdf" target="_blank">(Altair白皮书)</a>；侧梁优化用556个变体（14个壁厚参数）<a href="https://www.cambridge.org/core/product/8B1C8340F82B88FACE8CD3CEAAB1E747/core-reader" target="_blank">(Cambridge Core)</a>。</li>
<li><strong>全场+高维（整车级）</strong>：数千次仿真量级。SHIFT-Crash基准数据集为5000次仿真 <a href="https://luminary.ai/resources/luminary-launches-shift-crash-first-physics-ai-model-for-full-vehicle-crash-prediction/" target="_blank">(Luminary)</a>；NVIDIA白车身研究用150次（变量较少、精度要求也较低）<a href="https://www.nvidia.com/en-us/on-demand/session/gtc26-s81785/" target="_blank">(GTC 2026)</a>。</li>
</ul>
<p>DOE采样的经验法则是参数维度d的10-20倍，但这是初始样本量。对于强非线性问题，通常还需要主动学习循环补充30%-100%的样本才能达到工程精度。</p>
<p><strong>硬件需求。</strong> 训练阶段：现代碰撞代理模型（如GNN/Transformer）通常需要单个GPU到多GPU训练。NVIDIA PhysicsNeMo的碰撞示例推荐GPU环境配PyTorch <a href="https://docs.nvidia.com/physicsnemo/latest/physicsnemo/examples/structural_mechanics/crash/README.html" target="_blank">(NVIDIA文档)</a>。对于百万节点级的整车模型，训练可能需要A100或更高级别GPU，训练周期从几小时（部件级）到几天（整车级）不等。推理阶段则非常快——通常在秒级以内，这也是代理模型的核心价值所在。</p>
<p><strong>训练周期。</strong> 完整的AI+DOE+PINN项目周期包括：数据准备（参数化+DOE）1-4周、仿真运行（取决于并行资源）数天到数周、模型训练与调优几天到几周、验证与部署1-2周。对于部件级问题，整个周期可以在1-2个月内完成；整车级项目通常需要3-6个月，具体取决于数据可用性和团队经验。</p>
<h3>5.2 工业落地的主要障碍</h3>
<p><strong>精度与问题规模的矛盾。</strong> PINN在小规模、PDE形式清晰的问题上表现出色，但在整车级碰撞这种千万自由度、强非线性、多接触的问题上，纯PINN方案计算上不可行且精度不足。当前工业级解决方案都是"数据驱动为主、物理约束为辅"的混合架构，这意味着对数据量的依赖仍然很高，PINN的"小样本优势"在工程级问题上被稀释。</p>
<p><strong>泛化性与分布外（OOD）性能。</strong> 这是最大的落地障碍。代理模型在训练参数空间内的插值预测可以达到很高精度，但一旦超出训练分布（如新的几何拓扑、不同量级的冲击速度、新材料体系），性能会急剧恶化。空气动力学代理模型的零样本跨车型测试显示阻力R²降至-5.27（完全失效），虽然是气动案例但反映了普遍问题 <a href="https://arxiv.org/html/2605.27968v1" target="_blank">(arXiv:2605.27968)</a>。碰撞问题的非线性更强，OOD泛化的挑战更为严峻。迁移学习可以部分缓解（同级别车型从5000次降到300次），但跨级别、跨拓扑仍然困难 <a href="https://luminary.ai/resources/luminary-launches-shift-crash-first-physics-ai-model-for-full-vehicle-crash-prediction/" target="_blank">(Luminary)</a>。</p>
<p><strong>可解释性与可信度。</strong> 深度学习模型的"黑箱"特性在汽车安全领域尤为敏感——碰撞性能直接关系到乘员生命安全，任何预测都需要可追溯、可验证。当前的应对方式包括：等价评分（equivalence scoring）为每个预测提供置信度评估，置信度不足的不用于设计决策 <a href="https://depusa.com/aiworks" target="_blank">(DEP AIWorks)</a>；KPI从预测场量衍生而非直接回归，作为物理一致性自检 <a href="https://luminary.ai/resources/shift-crash-bringing-physics-ai-to-full-vehicle-crashworthiness-prediction/" target="_blank">(Luminary)</a>。但这些手段尚未形成行业标准。</p>
<p><strong>验证标准与监管认可。</strong> 汽车碰撞有严格的法规体系（FMVSS、C-NCAP等），所有安全设计必须通过物理试验验证。AI代理模型目前的定位是"设计筛选工具"——帮助工程师快速找出有潜力的设计方案，最终验证仍然依靠物理仿真和实车试验。AI结果能否直接用于认证、需要满足哪些精度标准，目前全球都在探索中。</p>
<p><strong>数据获取与质量。</strong> 高质量标注的碰撞仿真数据是训练代理模型的基础，但获取成本极高（单次数万到数十万元计算资源）。而且历史数据可能存在参数化不统一、网格差异大、数据格式不规范等问题。这也是为什么领先的项目（如SHIFT-Crash）都从统一的参数化平台系统生成数据，而非直接使用零散的历史数据。</p>
<p><strong>人才与组织障碍。</strong> 这项工作需要同时懂CAE仿真、机器学习和汽车工程的跨学科人才，目前市场上极为稀缺。传统CAE团队普遍缺乏AI能力，而AI团队又缺乏工程物理理解。组织上，AI项目需要CAE团队与数据团队紧密协作，但两者的工作模式、评价体系和沟通语言差异很大。</p>
<h3>5.3 成功案例与标杆项目</h3>
<table class="markdown-table"><thead><tr><th>项目/案例</th><th>主体</th><th>场景</th><th>关键指标</th><th>技术路线</th><th>成熟度</th></tr></thead><tbody>
<tr><td>SHIFT-Crash</td><td>Luminary</td><td>整车正面碰撞</td><td>RMSE<3%, 数秒推理</td><td>Physics AI + 迁移学习</td><td>商用产品</td></tr>
<tr><td>白车身碰撞代理</td><td>NVIDIA + GM</td><td>白车身碰撞变形</td><td>数量级加速</td><td>MeshGraphNet/Transolver</td><td>研究验证</td></tr>
<tr><td>侧柱碰整车代理</td><td>SEAT + IDIADA</td><td>侧柱撞击</td><td>RMSE=3.20mm</td><td>混合GNN+注意力</td><td>学术研究</td></tr>
<tr><td>轨道碰撞优化</td><td>Altair PhysicsAI</td><td>轨道压溃</td><td>5倍加速, 偏差<15%</td><td>ML代理 + 优化</td><td>商业验证</td></tr>
<tr><td>保险杠碰撞</td><td>Ansys SimAI</td><td>保险杠冲击</td><td>压溃误差<0.5%</td><td>深度学习代理</td><td>商业验证</td></tr>
<tr><td>行人头碰HIC优化</td><td>Altair</td><td>发动机罩</td><td>550倍加速, 误差~6%</td><td>DOE + ML代理</td><td>工程应用</td></tr>
<tr><td>BMW碰撞运动学优化</td><td>BMW + Altair</td><td>前碰撞</td><td>减少设计迭代</td><td>聚类+分类ML</td><td>生产部署</td></tr>
<tr><td>约束系统ROM</td><td>ODYSSEE CAE</td><td>正面碰撞乘员约束</td><td>R²>97%（多数响应）</td><td>POD+KRG</td><td>工程应用</td></tr>
<p>这些案例呈现出一个清晰的<strong>落地路径</strong>：从部件级/子系统级开始验证（风险低、周期短），积累经验和数据后扩展到系统级，最后逐步向整车级推进。当前工业界的量产部署主要集中在部件优化和设计筛选层面，整车级代理模型虽然有产品推出但仍处于早期采用阶段。</p>
<p>---</p>
</tbody></table>''',
    '06-getting-started': '''<h3>6.1 从0到1的技术路线图</h3>
<p><strong>阶段一：理论与工具准备（2-4周）</strong></p>
<ol>
<li><strong>PINN基础理论学习</strong>：从Raissi 2019年的原始PINN论文开始，理解物理约束损失函数的核心思想。配合YouTube PINN教程系列和GitHub上的入门notebook（如AGN000/PINN_tutorial），从简单的热方程、Burgers方程入手，亲手跑通第一个PINN实验 <a href="https://github.com/AGN000/PINN_tutorial" target="_blank">(GitHub PINN_tutorial)</a>。</li>
</ul>
<ol>
<li><strong>选定框架并上手</strong>：</li>
<li>如果研究导向、Python基础扎实 → DeepXDE（文档完善、案例丰富）</li>
<li>如果有GPU资源、面向工程应用 → NVIDIA PhysicsNeMo（有碰撞官方示例）</li>
<li>建议从DeepXDE入门理解原理，再根据项目需求决定是否迁移到PhysicsNeMo。</li>
</ul>
<ol>
<li><strong>DOE与代理模型基础</strong>：理解拉丁超立方、Sobol序列等空间填充设计的原理，学习GPR、RBF、Kriging等传统代理模型。这是PINN的基础和对照组——先掌握传统方法，才能正确评估PINN的增量价值。</li>
</ul>
<p><strong>阶段二：部件级验证（4-8周）</strong></p>
<ol>
<li><strong>选择一个简单的结构力学问题</strong>：从简支梁、悬臂梁的弹性问题开始，用PINN复现FEM结果，验证损失函数构建、边界条件施加、自动微分计算等基本环节。可以参考beam-elasticity-pinn等GitHub项目 <a href="https://github.com/Sasmxtha/beam-elasticity-pinn" target="_blank">(GitHub beam-elasticity-pinn)</a>。</li>
</ul>
<ol>
<li><strong>逐步引入非线性</strong>：弹性问题掌握后，逐步加入材料非线性（弹塑性）、几何非线性（大变形）、接触等复杂因素，每一步都与FEM基准解对比，观察误差来源和精度变化。</li>
</ul>
<ol>
<li><strong>构建DOE+代理模型工作流</strong>：选取一个真实的部件级问题（如轨道压溃、B柱弯曲），按完整流程实践：参数化→DOE采样→批量FEM计算→数据提取→PINN/ML训练→精度验证。建议先做纯数据驱动的GPR/DNN基准，再加入PINN物理约束，量化PINN带来的精度提升。</li>
</ul>
<p><strong>阶段三：系统级扩展（2-6个月）</strong></p>
<ol>
<li><strong>从标量到场量</strong>：如果前期只做标量KPI的代理预测，此时可以升级到场量预测（应力分布、变形云图）。这一步需要GNN或自编码器等架构，推荐用PhysicsNeMo的MeshGraphNet或Transolver实现。</li>
</ul>
<ol>
<li><strong>从部件到子系统</strong>：验证通过后，扩展到子系统级问题（如侧梁总成、前端模块），数据量和计算成本都会上升，需要注意并行计算和数据管理。</li>
</ul>
<ol>
<li><strong>引入多尺度</strong>：如果涉及新材料或复杂本构，可以在材料参数层面引入PINN代理——用PINN替代RVE计算或材料参数反演，再与结构级代理模型耦合。</li>
</ul>
<p><strong>阶段四：工程化部署（持续迭代）</strong></p>
<ol>
<li><strong>建立数据管道</strong>：将参数化建模、DOE生成、仿真提交、结果提取、模型训练全流程自动化，形成数据飞轮——新的仿真结果持续加入训练集，模型不断迭代改进。</li>
</ul>
<ol>
<li><strong>验证体系建设</strong>：建立完整的模型验证流程，包括精度指标、置信度评估、OOD检测、基准案例库等，确保模型的可靠性和可追溯性。</li>
</ul>
<ol>
<li><strong>与现有CAE工作流集成</strong>：通过插件、API或独立工具的方式将训练好的代理模型集成到工程师的日常工作流中，降低使用门槛。</li>
</ul>
<h3>6.2 推荐学习资源</h3>
<p><strong>核心论文清单</strong>：</p>
<ul>
<li>Raissi et al. (2019) "Physics-informed neural networks: A deep learning framework for solving forward and inverse problems involving nonlinear partial differential equations" — PINN奠基论文</li>
<li>Lu et al. (2021) "DeepXDE: A deep learning library for solving differential equations" — DeepXDE框架论文</li>
<li>Wang et al. (2021) "On the eigenvector bias of Fourier feature networks" — PINN训练问题分析</li>
<li>Sahin et al. (2024) "Solving forward and inverse problems of contact mechanics using physics-informed neural networks" — PINN接触力学</li>
<li>Curtosi et al. (2026) "Crash Assessment via Mesh-Based Graph Neural Networks and Physics-Aware Attention" — 整车碰撞GNN代理</li>
</ul>
<p><strong>代码仓库</strong>：</p>
<ul>
<li>DeepXDE: https://github.com/lululxvi/deepxde — PINN开源框架</li>
<li>NVIDIA PhysicsNeMo: https://github.com/NVIDIA/physicsnemo — 工业级物理ML框架（含碰撞示例）</li>
<li>Transolver: https://github.com/thuml/Transolver — Transformer求解器架构</li>
<li>PINN Tutorial: https://github.com/AGN000/PINN_tutorial — 入门教程系列</li>
<li>PINNpapers: https://github.com/... — PINN论文分类与资源汇总</li>
</ul>
<p><strong>商业工具试用</strong>：</p>
<ul>
<li>Ansys SimAI: 提供云服务试用，适合LS-DYNA用户快速体验</li>
<li>Altair PhysicsAI: HyperWorks生态内可直接接入</li>
<li>DEP AIWorks: 提供技术演示，PINN导向</li>
<li>Luminary SHIFT-Crash: 整车级碰撞AI标杆，可申请演示</li>
</ul>
<p>---</p>''',
}
