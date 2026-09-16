"""完整解析 GNN: chapters + flashcards + quizzes"""
import re, json, sys, os
try: sys.stdout.reconfigure(encoding='utf-8')
except: pass

SRC = r'D:\LvyzWeb\testPINN\GNN碰撞降阶学习指南.html'
OUT_DIR = r'D:\LvyzWeb\platform\public\courses\gn-crash-guide\data'

content = open(SRC, encoding='utf-8').read()

# === 1. 抽 chapters ===
SECTION_IDS = ['01-crash-basics','02-gnn-core','03-transformer','04-physics-pinn',
               '05-hybrid-frontend','06-tools-datasets','07-spring-mass']
SECTION_TITLES = ['碰撞仿真与降阶基础','图神经网络（GNN）核心',
                  'Transformer 与长程依赖','物理约束与 PINN',
                  '混合架构与前沿方法','工具框架与数据集','实战：弹簧-质点系统']
SUMMARIES = ['理解传统有限元的局限，掌握碰撞仿真的精度/速度矛盾',
             '掌握图卷积/注意力/归纳学习三大 GNN 范式及其在物理仿真中的作用',
             '理解注意力机制、Graph Transformer 与物理感知 Transformer (Transolver)',
             '将物理定律嵌入神经网络损失函数，构建 PINN/PhyGNNet',
             '从 GNS/MeshGraphNet 到 GNN+Transformer 混合架构的实战路径',
             '掌握 PyG/DGL/JAX/ΦFlow 等工具栈与仿真数据集',
             '从 0 到 1 实现弹簧-质点 GNN 仿真器']

def extract_sections(html):
    pat = re.compile(r'<h2[^>]*>(.*?)</h2>(.*?)(?=<h2[^>]*>|</main>|<footer|$)', re.DOTALL)
    return [{'title': re.sub(r'<[^>]+>', '', m.group(1)).strip(), 'body': m.group(2)}
            for m in pat.finditer(html)
            if re.sub(r'<[^>]+>', '', m.group(1)).strip() in SECTION_TITLES]

def parse_subsections(body_html):
    matches = list(re.finditer(r'<h3[^>]*>(.*?)</h3>', body_html, re.DOTALL))
    if not matches: return [('概述', body_html)]
    subs = []
    for i, m in enumerate(matches):
        h3 = re.sub(r'<[^>]+>', '', m.group(1)).strip()
        start = m.end()
        end = matches[i+1].start() if i+1 < len(matches) else len(body_html)
        subs.append((h3, body_html[start:end]))
    return subs

def clean_html(h):
    h = re.sub(r'\s+style="[^"]*"', '', h)
    h = re.sub(r'<span[^>]*>', '', h)
    h = re.sub(r'</span>', '', h)
    return h.strip()

sections_raw = extract_sections(content)
chapters_data = {
    'courseId': 'gn-crash-guide',
    'title': 'GNN + Transformer + 物理约束：碰撞仿真降阶实战',
    'subtitle': '从图神经网络到物理感知 Transformer,系统掌握 AI 碰撞降阶的完整技术栈',
    'level': '进阶',
    'duration': '14 小时',
    'chapters': [],
}
for idx, sec in enumerate(sections_raw):
    subs = parse_subsections(sec['body'])
    chapters_data['chapters'].append({
        'id': SECTION_IDS[idx],
        'title': SECTION_TITLES[idx],
        'summary': SUMMARIES[idx],
        'subsections': [{'title': h3, 'body': clean_html(body)} for h3, body in subs],
    })
with open(os.path.join(OUT_DIR, 'chapters.json'), 'w', encoding='utf-8') as f:
    json.dump(chapters_data, f, ensure_ascii=False, indent=2)
print(f'chapters.json OK ({len(chapters_data["chapters"])} 章)')

# === 2. 抽 flashcards ===
# 找 script 块里的卡片数组
js_match = re.search(r'<script[^>]*>(.*?)</script>', content, re.DOTALL)
js = js_match.group(1)
arr_match = re.search(r'(\[\s*\n\s*//[\s\S]*?\n\s*\]);', js)
if not arr_match:
    # 备选: 找所有 { q: ..., a: ..., chapter: ... }
    arr_match = re.search(r'(\[[\s\S]*?\{ q:[^\]]+\]);', js)
fc_arr_text = arr_match.group(1) if arr_match else None
print(f'找到闪卡数组: {len(fc_arr_text) if fc_arr_text else 0} 字符')

# 把 JS 对象字面量解析为 Python dict
# q / a / chapter
fc_items = re.findall(r"\{\s*q:\s*'([^']*)',\s*a:\s*'([^']*)',\s*chapter:\s*(\d+)\s*\}", fc_arr_text)
print(f'解析到 {len(fc_items)} 张闪卡')

flashcards = []
for q, a, ch in fc_items:
    # 解码 \\n / \\u 转义
    q = q.replace("\\'", "'").replace('\\n', '\n')
    a = a.replace("\\'", "'").replace('\\n', '\n')
    ch_int = int(ch)
    flashcards.append({
        'id': f'fc-{len(flashcards)+1:02d}',
        'front': q,
        'back': a,
        'chapterId': SECTION_IDS[ch_int - 1],
        'tags': [SECTION_TITLES[ch_int - 1][:8]],
    })
with open(os.path.join(OUT_DIR, 'flashcards.json'), 'w', encoding='utf-8') as f:
    json.dump({'courseId': 'gn-crash-guide', 'cards': flashcards}, f, ensure_ascii=False, indent=2)
print(f'flashcards.json OK ({len(flashcards)} 张)')

# === 3. 生成 quizzes (每章 8 题 + 期末 12 题) ===
DIFFICULTY = ['easy', 'medium', 'hard']
quizzes = {}
for i, ch_id in enumerate(SECTION_IDS):
    quizzes[ch_id] = {
        'title': SECTION_TITLES[i],
        'passingScore': 70,
        'maxAttempts': 3,
        'questions': [],
    }
# 手工设计的题库 (基于章节要点)
QUIZZES_RAW = {
    '01-crash-basics': [
        ('single', 'easy', '碰撞仿真降阶模型（ROM）的核心思想是？',
         ['降低物理精度以换取速度', '将高维物理系统映射到低维潜空间演化再映射回去', '用 AI 完全替代 FEM', '减少网格密度'],
         1, 'ROM = 潜空间演化 + 重构,精度/速度的工程权衡'),
        ('single', 'easy', 'GNN 替代模型相比 FEM 的典型推理加速量级？',
         ['2-5 倍', '10-50 倍', '100-1000 倍', '无法加速'],
         2, 'GNN 推理复杂度与图规模线性,FEM 需迭代求解高维方程'),
        ('tf', 'easy', 'CNN 天然适合处理碰撞仿真的不规则有限元网格。',
         False, 'CNN 依赖规则网格,不规则网格需 GNN'),
        ('single', 'medium', 'GNN 适合处理不规则网格的核心优势不包括？',
         ['排列不变性', '局部归纳偏置', '权重共享', '依赖固定输入尺寸'],
         3, 'GNN 输入尺寸灵活,与排列无关'),
        ('multi', 'medium', 'AI 降阶模型与 FEM 是何种关系？',
         ['完全替代关系', '互补关系', 'FEM 提供训练数据', 'GNN 提供快速推理', '完全无关联'],
         [1, 2, 3], '互补:FEM 精度高 + AI 推理快,各取所长'),
        ('single', 'hard', '降阶方法（ROM）按线性/非线性分类，下列哪项属于非线性降阶？',
         ['POD', 'Krylov 子空间', 'Autoencoder + 神经 ODE', '模态叠加'],
         2, 'Autoencoder + 神经 ODE 捕捉非线性动力学'),
        ('fill', 'easy', '碰撞仿真中常用的降阶目标是在保证精度的前提下降低 _______ 成本。', None, '计算'),
        ('short', 'medium', '请简述为什么传统有限元（FEM）在汽车碰撞大变形仿真中计算昂贵。', None, '高维非线性方程 + 显式时间积分步数多 + 接触碰撞强非线性'),
    ],
    '02-gnn-core': [
        ('single', 'easy', 'MPNN（消息传递神经网络）的两个核心步骤是？',
         ['编码-解码', '消息构造 + 聚合更新', '卷积-池化', '采样-聚合'],
         1, 'MPNN = 消息构造 + 邻居聚合 + 节点更新'),
        ('tf', 'easy', 'GNN 层数过多会导致"过度平滑"问题,所有节点特征趋同。',
         True, '深层 GNN 信息混合,失去区分度'),
        ('single', 'medium', 'GCN 的核心公式 H^(k+1) = σ(D̃^-1/2 Ã D̃^-1/2 H^(k) W^(k)) 中 Ã = ?',
         ['原始邻接矩阵', 'A + I (加自环)', 'D - A', 'D^-1 A'],
         1, 'Ã = A + I,加自环保留节点自身特征'),
        ('single', 'medium', 'GAT 相对 GCN 的核心改进是？',
         ['更深的网络', '引入注意力机制区分邻居重要性', '更大的隐藏层', '更快的训练'],
         1, 'GAT 学习 α_ij 自适应权重'),
        ('single', 'medium', 'GraphSAGE 的核心思想是？',
         ['直推式学习', '采样+聚合,支持归纳式学习', '全局注意力', '循环连接'],
         1, 'GraphSAGE 学聚合函数而非嵌入,可泛化新节点'),
        ('multi', 'hard', '物理仿真 GNN 通常预测状态变化量而非下一状态的原因？',
         ['数值稳定性更好', '更好的归纳偏置(平凡解=0)', '网络只需学扰动', '减少内存'],
         [0, 1, 2], '变化量预测让 0 变化为 trivial baseline,更易训练'),
        ('fill', 'easy', 'Encoder-Processor-Decoder 架构中,Processor 负责多层 _______ 更新潜特征。', None, '消息传递'),
        ('short', 'medium', '请解释自回归推演（rollout）及其主要挑战。', None, 'rollout = 上一步输出作为下一步输入;挑战是误差累积'),
    ],
    '03-transformer': [
        ('single', 'easy', '自注意力公式 Attention(Q,K,V) = ?',
         ['Q·K + V', 'softmax(QK^T/√d_k) V', 'QKV 直接相乘', 'V·K·Q'],
         1, '经典 scaled dot-product attention'),
        ('tf', 'easy', 'Transformer 的全局注意力可以直接建模远距离节点相互作用。',
         True, 'GNN 需多层堆叠,Transformer 单层即可全局'),
        ('single', 'medium', 'Vision Transformer 与 Graph Transformer 的主要区别？',
         ['都是规则网格', 'ViT 处理规则 patch + 固定位置编码,Graph Transformer 处理任意图 + 拓扑感知位置编码', 'ViT 更慢', '无法比较'],
         1, 'GT 需考虑图拓扑(如 Laplacian 特征向量)'),
        ('single', 'medium', 'Transolver 的核心创新是？',
         ['标准注意力', 'Physics-Attention:将网格点分配到"物理状态切片"后计算注意力', '纯 MLP', '强化学习'],
         1, 'Transolver 切片级注意力降低复杂度,适配物理场'),
        ('single', 'hard', 'Transformer 在物理仿真中的局限是？',
         ['无法并行', '对几何结构无先验,易过拟合', '不支持 GPU', '无法处理序列'],
         1, '纯 Transformer 缺局部归纳偏置,常需 GNN 配合'),
        ('multi', 'medium', '为什么物理仿真需要 Transformer？',
         ['GNN 局部消息传递受限', 'Transformer 全局注意力建模长程依赖', 'GNN 多层易过度平滑', 'Transformer 更快收敛'],
         [0, 1, 2], 'GNN 受限于局部感受野'),
        ('fill', 'easy', 'Graph Transformer 的位置编码常使用图 _______ 特征向量。', None, 'Laplacian / 拉普拉斯'),
        ('short', 'medium', '简述 Transolver 的"物理状态切片"思想如何降低注意力复杂度。', None, '把网格点分组到有限数量的物理状态切片,在切片级别而非逐点计算注意力,O(N^2)→O(N×S)'),
    ],
    '04-physics-pinn': [
        ('single', 'easy', 'PINN 的核心思想是？',
         ['用更深的网络', '将 PDE 残差作为损失函数的一部分,物理定律嵌入训练', '纯数据驱动', '强化学习'],
         1, 'PINN = data loss + PDE residual loss'),
        ('tf', 'easy', '自动微分（autograd）是 PINN 计算 PDE 残差的关键工具。',
         True, 'PDE 残差需对网络输出求导,autograd 天然支持'),
        ('single', 'medium', 'PINN 损失函数的典型组成是？',
         ['仅数据损失', '数据损失 + PDE 残差 + 边界/初始条件损失', '仅边界条件', '均方差'],
         1, 'L = L_data + λ1·L_PDE + λ2·L_BC + λ3·L_IC'),
        ('single', 'medium', 'PhyGNNet 的核心思想是？',
         ['纯 GNN', '物理约束损失 + GNN 架构,在图上强制 PDE 守恒', '强化学习', '纯 CNN'],
         1, 'PhyGNNet = GNN + 物理损失双驱动'),
        ('multi', 'hard', 'PINN 相对纯数据驱动方法的优势？',
         ['数据效率更高', '外推能力更好', '满足物理守恒律', '无需训练数据'],
         [0, 1, 2], 'PINN 仍需数据,但物理约束提升泛化'),
        ('single', 'hard', '下列哪项不是 PINN 训练常见难点？',
         ['损失项权重平衡', '软约束 vs 硬约束', '收敛速度慢', 'GPU 显存不足'],
         3, '权重平衡 / 软硬约束 / 收敛慢是真实难点,GPU 不是'),
        ('fill', 'easy', 'PDE 残差通常通过自动微分计算网络输出对 _______ 的偏导。', None, '输入坐标'),
        ('short', 'medium', '请简述 PINN 中守恒律损失的设计思路。', None, '把守恒律(质量/动量/能量)写成 PDE,在训练点上计算残差平方作为损失'),
    ],
    '05-hybrid-frontend': [
        ('single', 'easy', 'MeshGraphNet 来自哪个机构？',
         ['Stanford', 'DeepMind', 'MIT', 'Google Brain'],
         1, 'DeepMind 2022 年提出 GNS / MeshGraphNet'),
        ('tf', 'easy', '碰撞仿真中的接触建模是非线性物理,目前 AI 模型仍以"无接触"简化为主流。',
         True, '接触 + 大变形仍是 GNN 仿真难题'),
        ('single', 'medium', 'GNN + Transformer 混合架构的典型分工是？',
         ['两者完全独立', 'GNN 编码局部结构 + Transformer 捕捉全局依赖', 'Transformer 取代 GNN', 'GNN 只做解码'],
         1, '混合架构 = GNN 局部 + Transformer 全局'),
        ('multi', 'hard', '为什么混合架构（GNN + Transformer）在物理仿真中表现优秀？',
         ['GNN 提供局部归纳偏置', 'Transformer 补充长程依赖', '物理场多尺度', 'Transformer 推理更慢'],
         [0, 1, 2], '混合架构扬长避短'),
        ('single', 'medium', '目前主流的碰撞仿真 AI 替代模型在工程化中的最大瓶颈是？',
         ['推理速度', '接触/大变形场景的精度', '显存占用', '训练时间'],
         1, '接触 + 大变形仍难处理'),
        ('single', 'hard', '下列关于 GNS (Graph Network Simulator) 的描述错误的是？',
         ['基于 Encoder-Processor-Decoder', '用 GNN 做 Processor', '接触通过简单消息聚合可完美处理'],
         2, 'GNS 不完美处理接触,需配合传统求解器或子模型'),
        ('fill', 'easy', 'MeshGraphNet 论文中每个时间步预测的量是节点 _______ 增量。', None, '加速度/速度/位移'),
        ('short', 'medium', '请解释为什么"自回归推演"在长期仿真中会累积误差。', None, '每步小误差被下一步放大,误差随步数增长'),
    ],
    '06-tools-datasets': [
        ('single', 'easy', 'PyTorch Geometric（PyG）是基于 PyTorch 的？',
         ['计算机视觉库', '图神经网络库', 'NLP 库', '强化学习库'],
         1, 'PyG 提供 Data / MessagePassing / 内置数据集'),
        ('tf', 'easy', 'DGL（Deep Graph Library）支持 PyTorch、TensorFlow、MXNet 多个后端。',
         True, 'DGL 是后端无关的 GNN 框架'),
        ('single', 'medium', 'JAX 在物理仿真中的核心优势是？',
         ['更快 CPU', '可微分编程 + JIT 编译,适合可微物理仿真', '纯 Python', '不支持 GPU'],
         1, 'JAX 提供 grad/jit/vmap,适配 ΦFlow 等可微仿真'),
        ('multi', 'medium', '物理仿真 GNN 训练常用数据集包括？',
         ['CylinderFlow', 'DeepMind 弹簧-质点数据集', 'ShapeNet', 'ModelNet'],
         [0, 1], '前两个是物理仿真专用,后两个是 3D 形状'),
        ('single', 'medium', 'ΦFlow 的核心特性是？',
         ['静态图框架', '可微分物理仿真引擎,支持多物理场', '纯图像库', 'NLP 工具'],
         1, 'ΦFlow = 可微 + 物理仿真'),
        ('single', 'hard', '下列哪个不是物理仿真 GNN 框架？',
         ['PyG', 'DGL', 'ΦFlow', 'Next.js'],
         3, 'Next.js 是前端框架,与 GNN 无关'),
        ('fill', 'easy', 'PyTorch Geometric 中数据容器称为 _______ 对象。', None, 'Data'),
        ('short', 'medium', '为什么 JAX 在可微物理仿真中越来越受欢迎？', None, 'JAX = grad + jit + vmap,统一支持自动微分 + GPU/TPU 加速'),
    ],
    '07-spring-mass': [
        ('single', 'easy', '弹簧-质点系统的核心物理方程是？',
         ['F = ma', 'F = ma + 弹簧/阻尼力', 'E = mc^2', 'V = IR'],
         1, '弹簧力 + 阻尼 + 牛顿第二定律'),
        ('single', 'easy', '弹簧-质点 GNN 图构建中,节点和边分别代表？',
         ['节点=弹簧,边=质点', '节点=质点,边=弹簧连接', '节点=网格,边=单元', '节点=材料,边=属性'],
         1, '节点 = 质点(质量+位置),边 = 弹簧(刚度)'),
        ('tf', 'medium', 'GNN 通过消息传递学习弹簧力,可以泛化到不同拓扑的系统。',
         True, '这是 GNN 相对硬编码的归纳偏置优势'),
        ('single', 'medium', '弹簧-质点数据生成时,常用积分器是？',
         ['梯度下降', '显式欧拉 / Verlet / RK4', 'Adam 优化器', '牛顿迭代'],
         1, 'Verlet 是能量守恒较好的选择'),
        ('multi', 'medium', 'GNN 训练弹簧-质点系统的注意事项？',
         ['数据归一化', '长时间 rollout 误差累积', '邻居采样', '数据增强'],
         [0, 1, 2], '归一化 + 误差 + 采样是三大关键'),
        ('single', 'hard', '下列关于 GNN 仿真器泛化能力的描述正确的是？',
         ['只能用于训练时的拓扑', '可泛化到不同节点数 / 连接方式', '完全无法泛化', '只能用于相同材料'],
         1, 'GNN 学的是局部规则,具拓扑泛化性'),
        ('fill', 'easy', '弹簧-质点 GNN 通常预测每个节点的 _______ 加速度或位移增量。', None, '下一步 / 状态变化量'),
        ('short', 'medium', '请说明为什么 GNN 适合模拟弹簧-质点系统。', None, '弹簧-质点天然图结构 + 局部相互作用 + GNN 排列不变'),
    ],
}

# === 4. 期末综合 ===
FINAL_RAW = [
    ('single', 'hard', '碰撞仿真 AI 降阶（ROM）最准确的描述是？',
     ['完全取代 FEM', '潜空间动力学演化 + AI 推理,与 FEM 互补', '数据压缩', '提高 FEM 精度'],
     1, 'ROM = 潜空间演化 + 重构,工程权衡'),
    ('single', 'hard', 'GNN 相对 CNN 在碰撞仿真网格上的优势是？',
     ['更快的推理', '天然支持不规则拓扑 + 排列不变', '更小模型', '更好可解释性'],
     1, 'GNN 的核心优势'),
    ('tf', 'hard', 'PINN 通过自动微分计算 PDE 残差损失,无需额外数值求解。',
     True, 'autograd 是 PINN 关键'),
    ('single', 'hard', 'Transolver 的切片级注意力主要解决什么问题？',
     ['过拟合', '降低标准注意力的 O(N^2) 复杂度,适配物理场', '替代 GNN', '增加参数量'],
     1, '切片级 = 物理状态分组 + 注意力简化'),
    ('multi', 'hard', 'AI 碰撞降阶在工程化部署中的主要挑战？',
     ['长程 rollout 误差累积', '接触 + 大变形场景精度', '可解释性', '训练数据稀缺'],
     [0, 1, 2, 3], '四大挑战'),
    ('single', 'hard', 'GNS / MeshGraphNet 的"自回归 rollout"误差累积最有效的缓解是？',
     ['更深网络', '更大学习率', '物理损失约束 + 多步 teacher forcing', '更多 epoch'],
     2, '物理约束 + 多步训练是关键'),
    ('single', 'medium', 'Encoder-Processor-Decoder 中,Decoder 的职责是？',
     ['编码物理特征', '消息传递更新', '将潜特征映射回物理输出', '计算损失'],
     2, 'Decoder 负责重构'),
    ('single', 'medium', '为什么 Graph Transformer 需用 Laplacian 特征向量做位置编码？',
     ['随机生成', '捕捉图全局拓扑结构', '与图像相同', '替代注意力'],
     1, 'Laplacian 特征向量编码图结构'),
    ('multi', 'medium', '哪些是物理仿真 GNN 的关键设计选择？',
     ['预测状态变化量而非下一状态', '局部消息传递层数', '物理损失加权', '固定 batch size'],
     [0, 1, 2], '第四项是训练技巧,非设计选择'),
    ('fill', 'medium', 'PINN 损失函数通常由数据损失 + PDE 残差 + _______ 条件损失组成。', None, '边界 / 初始'),
    ('short', 'hard', '请设计一个 GNN + Transformer 混合架构用于汽车前碰仿真,说明输入输出与训练策略。', None,
     '输入:车辆几何图(节点=梁/A柱单元,边=连接) + 边界速度场;Encoder:GNN 编码局部结构 + Transformer 全局碰撞波传播;Processor:GNN+Transformer 交替 N 层;输出:节点位移/加速度/应力增量;训练:数据 FEM 仿真 + 物理损失(动量/能量守恒) + rollout teacher forcing'),
    ('single', 'medium', '可微物理仿真（JAX/ΦFlow）的核心价值是？',
     ['更快推理', '端到端优化控制策略 / 反问题 + 物理约束', '替代 GNN', '减少显存'],
     1, '可微仿真 = 端到端优化'),
    ('short', 'hard', '请论述 AI 降阶模型在 5 星 C-NCAP 评价场景中的可解释性要求与实现思路。',
     None, '可解释性 = 物理一致性 + 局部归因;实现:1) 物理损失约束 2) 注意力可视化(Transformer) 3) 残差场可解释输出 4) 不确定度估计'),
]

# 合并
for ch_id, items in QUIZZES_RAW.items():
    for i, item in enumerate(items):
        t = item[0]
        if t in ('fill', 'short', 'tf'):
            _, diff, stem, answer, explanation = item
            options = None
        else:
            _, diff, stem, options, answer, explanation = item
        q = {
            'id': f'{ch_id[3:].replace("-","")}-{i+1}',
            'type': t,
            'difficulty': diff,
            'stem': stem,
            'explanation': explanation,
            'tags': [ch_id],
        }
        if t in ('single', 'tf'):
            q['options'] = options if options is not None else ['对', '错']
            q['answer'] = answer
        elif t == 'multi':
            q['options'] = options
            q['answer'] = answer
        elif t in ('fill', 'short'):
            q['answer'] = answer or ''
        quizzes[ch_id]['questions'].append(q)

# 期末
quizzes['final'] = {
    'title': '期末综合考试',
    'passingScore': 80,
    'maxAttempts': 3,
    'questions': [],
}
for i, item in enumerate(FINAL_RAW):
    t = item[0]
    if t in ('fill', 'short', 'tf'):
        _, diff, stem, answer, explanation = item
        options = None
    else:
        _, diff, stem, options, answer, explanation = item
    q = {
        'id': f'final-{i+1}',
        'type': t, 'difficulty': diff, 'stem': stem,
        'explanation': explanation, 'tags': ['final'],
    }
    if t in ('single', 'tf'):
        q['options'] = options if options is not None else ['对', '错']
        q['answer'] = answer
    elif t == 'multi':
        q['options'] = options
        q['answer'] = answer
    elif t in ('fill', 'short'):
        q['answer'] = answer or ''
    quizzes['final']['questions'].append(q)

with open(os.path.join(OUT_DIR, 'quizzes.json'), 'w', encoding='utf-8') as f:
    json.dump(quizzes, f, ensure_ascii=False, indent=2)
print(f'quizzes.json OK ({sum(len(q["questions"]) for q in quizzes.values())} 题)')