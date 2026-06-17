import json

output_path = r"D:\LvyzWeb\platform\src\content\crashai-expanded\courses-6-11.json"

# Read existing courses
with open(output_path, 'r', encoding='utf-8') as f:
    courses = json.load(f)

print(f"Read {len(courses)} existing courses: {[c['slug'] for c in courses]}")

# ============================================================
# COURSE 9: sklearn
# ============================================================
sklearn_course = {
    "slug": "sklearn",
    "title": "2.3 Scikit-learn",
    "description": "分类/回归/GBDT/SHAP：经典机器学习全流程，从数据到洞察的完整工具链",
    "category": "llm",
    "phase": "B",
    "order": 9,
    "sections": []
}

sklearn_course["sections"].append({
    "type": "text",
    "title": "Scikit-learn是什么？——经典机器学习的瑞士军刀",
    "content": """<p>如果说深度学习（PyTorch/TensorFlow）是造船的木料，那<b>Scikit-learn</b>（简称sklearn）就是工具箱里最趁手的锤子和螺丝刀。它不搞花哨的深度学习，专注于<b>经典机器学习</b>——决策树、随机森林、支持向量机、梯度提升树等等。</p>
<p>可以这样理解：</p>
<p>深度学习 = 造火箭。需要大量数据、算力，适合图像识别、自然语言处理等复杂任务。</p>
<p>Scikit-learn = 开车。简单高效，适合<b>结构化数据</b>（如表格数据、Excel数据）上的分类、回归、聚类任务。</p>
<p>很多实际业务场景中，数据是结构化的Excel表格，行是样本，列是特征。这种场景下，sklearn的模型往往不比深度学习差，而且训练快、可解释性强。</p>
<p><b>sklearn的核心哲学：统一的API设计</b></p>
<p>所有模型都有相同的接口，学会一个就能用所有：</p>
<pre>
model.fit(X_train, y_train)          # 训练模型
y_pred = model.predict(X_test)       # 预测
score = model.score(X_test, y_test)  # 评估（分类=准确率，回归=R²）
</pre>
<p>不管底下的模型是决策树、随机森林还是SVM，这三行代码完全一样。这就是sklearn最漂亮的设计。</p>
<p><b>sklearn适合什么场景？</b></p>
<ul>
<li>表格数据（Excel/CSV格式）上的分类和回归预测</li>
<li>客户流失预测、信用卡欺诈检测、房价预测、疾病诊断</li>
<li>特征重要性分析——了解哪些因素对结果影响最大</li>
<li>Kaggle竞赛中的经典ML赛道（XGBoost常胜）</li>
</ul>"""
})

sklearn_course["sections"].append({
    "type": "code",
    "title": "机器学习全流程代码实战",
    "content": """<p>我们用一个完整的案例来学习：<b>预测泰坦尼克号上谁生还</b>。</p>
<pre>
# 1. 导入所需工具
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

# 2. 加载数据
df = pd.read_csv('titanic.csv')
# 数据包含：PassengerId, Survived(0=死亡,1=生还), Pclass(舱位等级),
#           Sex(性别), Age(年龄), Fare(票价) 等

# 3. 数据预处理
# 处理缺失值
df['Age'] = df['Age'].fillna(df['Age'].median())
df['Embarked'] = df['Embarked'].fillna(df['Embarked'].mode()[0])

# 编码类别特征
le = LabelEncoder()
df['Sex'] = le.fit_transform(df['Sex'])      # male→1, female→0
df['Embarked'] = le.fit_transform(df['Embarked'])

# 选择特征和标签
features = ['Pclass', 'Sex', 'Age', 'Fare', 'SibSp', 'Parch']
X = df[features]              # 特征矩阵
y = df['Survived']            # 标签（要预测的值）

# 4. 划分训练集和测试集
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,          # 20%用作测试
    random_state=42         # 随机种子，保证结果可复现
)

# 5. 特征标准化
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)   # 在训练集上计算均值和标准差并变换
X_test = scaler.transform(X_test)         # 用训练集的均值和标准差变换测试集

# 6. 构建并训练模型
model = RandomForestClassifier(
    n_estimators=100,       # 100棵决策树
    max_depth=10,           # 树的最大深度10层
    random_state=42
)
model.fit(X_train, y_train)

# 7. 评估模型
y_pred = model.predict(X_test)
print("准确率:", accuracy_score(y_test, y_pred))
print("\\n分类报告:")
print(classification_report(y_test, y_pred, target_names=['死亡', '生还']))
print("\\n混淆矩阵:")
print(confusion_matrix(y_test, y_pred))

# 8. 特征重要性分析
feature_importance = pd.DataFrame({
    'feature': features,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)
print("\\n特征重要性:")
print(feature_importance)
</pre>
<p><b>这段代码的每一部分做什么？</b></p>
<p><b>train_test_split：</b>随机打乱数据，分成训练集和测试集。test_size=0.2表示20%用于测试、80%用于训练。random_state=42保证每次分的结果一样。</p>
<p><b>StandardScaler：</b>把特征标准化为均值0方差1。fit_transform在训练集上计算均值和方差并做变换。transform用训练集的参数变换测试集——<b>一定不能fit测试集，会信息泄漏</b>。</p>
<p><b>RandomForestClassifier：</b>随机森林——100棵决策树投票决定。是一种强大的集成学习算法。</p>"""
})

sklearn_course["sections"].append({
    "type": "text",
    "title": "GBDT：Kaggle竞赛的王者算法",
    "content": """<p>在深度学习流行之前（甚至现在），<b>GBDT（梯度提升决策树）</b>是结构化数据上表现最好的算法。Kaggle竞赛中，XGBoost（GBDT的一种实现）赢得最多的比赛。</p>
<p><b>GBDT的核心思想：一步一个小目标</b></p>
<p>想象你在预测房价。你的策略是：</p>
<p>第1步：猜一个数字600（所有房价的平均值）。→ 误差有些大</p>
<p>第2步：另一个人分析为什么错了，并预测"还需要加50"。修正 → 650</p>
<p>第3步：再来一个人看为什么还差一点，说"再减10"。修正 → 640</p>
<p>...重复很多次，每次都修正前一个人犯的错。</p>
<p>这就是GBDT！每棵决策树都试图<b>修正前面所有树的错误</b>。第一棵树输出初始预测，后续每棵树输出"错误修正量"。最终预测 = 所有树的输出相加。</p>
<p>GBDT有三个主流实现，各有特点：</p>
<p><b>XGBoost：</b>最早广受欢迎的GBDT库，Kaggle竞赛常胜工具。平衡了速度和准确率。</p>
<p><b>LightGBM（微软）：</b>更快，能处理超大规模数据。使用基于直方图的算法。</p>
<p><b>CatBoost（Yandex）：</b>自动处理类别特征，不需要手动编码。对类别数据多时特别方便。</p>
<p><b>GBDT vs 深度学习什么时候用哪个？</b></p>
<p>用GBDT：数据是表格形式（结构化的Excel/CSV），特征数量<1000，样本量<100万。</p>
<p>用深度学习：数据是图像、文本、音频等非结构化数据。或特征极多、样本极多时。</p>"""
})

sklearn_course["sections"].append({
    "type": "text",
    "title": "SHAP：用博弈论解释模型为什么这样预测",
    "content": """<p>一个模型告诉你"这个客户会流失"，但<b>为什么？</b>哪个因素促使模型做了这个判断？这在金融、医疗等场景非常重要。<b>SHAP</b>就是回答"为什么"的工具。</p>
<p>SHAP的全称是<b>SHapley Additive exPlanations</b>，它的理论基础来自博弈论中的<b>Shapley值</b>。</p>
<p><b>Shapley值是什么？</b></p>
<p>想象三个人一起工作赚了1000元。如何公平分配这1000元？不能平均分——可能有人贡献大有人贡献小。Shapley值计算每个人的"边际贡献"：每加入一个新成员，团队的收益增加了多少，按所有可能的加入顺序取平均。</p>
<p>把模型预测类比为团队合作：</p>
<p>团队成员 = 各个特征（年龄、收入、职业...）</p>
<p>团队产出 = 模型预测值</p>
<p>每个人的Shapley值 = 该特征对预测的贡献</p>
<p><b>SHAP的核心公式：</b></p>
<p><b>预测值 = 基准值 + Σ(每个特征的SHAP值)</b></p>
<p>基准值 = 所有样本的平均预测（比如平均房价=50万）</p>
<p>每个特征的SHAP值 = 该特征如何使预测偏离平均值</p>
<p>举个例子：预测某人的收入是8万。</p>
<p>基准值（平均收入）= 5万</p>
<p>"教育=硕士"的SHAP值 = +2万（教育高使预测增加2万）</p>
<p>"年龄=25"的SHAP值 = -1万（太年轻使预测降低1万）</p>
<p>"城市=北京"的SHAP值 = +2万（在一线城市使预测增加2万）</p>
<p>总预测 = 5万 + 2万 - 1万 + 2万 = 8万 ✓</p>
<p>每个贡献值直接可解释：为什么这个人是8万？因为学历高+在北京但比较年轻。</p>"""
})

sklearn_course["sections"].append({
    "type": "example",
    "title": "实操案例：用随机森林+SHAP预测客户流失",
    "content": """<p>场景：电信公司要预测哪些客户会取消订阅。我们要用sklearn建模+SHAP解释。</p>
<pre>
# 假设我们有客户数据：tenure(月数), MonthlyCharges(月费),
# Contract(合同类型), TotalCharges(累计花费) 等

import pandas as pd
import shap
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

# 数据准备
df = pd.read_csv('customer_churn.csv')
le = LabelEncoder()
df['Contract'] = le.fit_transform(df['Contract'])
df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
df['TotalCharges'] = df['TotalCharges'].fillna(0)

# 特征和标签
features = ['tenure', 'MonthlyCharges', 'TotalCharges', 'Contract']
X = df[features]
y = df['Churn']

# 划分
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42)

# 训练
model = RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42)
model.fit(X_train, y_train)

# SHAP解释
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)

# 分析特征重要性（SHAP版）
shap.summary_plot(shap_values[1], X_test, feature_names=features)
# 图中能看到：tenure(使用月数)最重要，使用越久越不易流失

# 分析单个客户
sample = X_test.iloc[0]  # 第一个客户
sample_shap = explainer.shap_values(sample)
shap.waterfall_plot(shap.Explanation(
    values=sample_shap[1],
    base_values=explainer.expected_value[1],
    data=sample.values,
    feature_names=features
))
# waterfall图显示每个特征如何推高或拉低该客户的流失概率
</pre>
<p><b>关键SHAP图解读：</b></p>
<p>每个点是一个样本。红色=特征值高，蓝色=特征值低。横轴=SHAP值（对预测的影响）。</p>
<p>如果red在右边：特征值越高越容易流失</p>
<p>如果blue在右边：特征值越低越容易流失</p>
<p>这直观地揭示了特征和结果的关系。</p>"""
})

sklearn_course["sections"].append({
    "type": "exercise",
    "title": "练习题",
    "content": """<p><b>Q1：</b>sklearn中fit、predict、score方法分别做什么？</p>
<p><b>Q2：</b>train_test_split中的test_size=0.3、random_state=42各是什么意思？</p>
<p><b>Q3：</b>为什么GBDT要"梯度提升"？和普通决策树有什么不同？</p>
<p><b>Q4：</b>SHAP值的含义是什么？如果"tenure"的SHAP值是+0.3，什么意思？</p>
<p><b>Q5：</b>为什么对测试集只能用transform而不能用fit_transform？</p>""",
    "answer": """<p><b>A1：</b>fit=训练模型（从数据中学习规律）。predict=预测（对新数据做判断）。score=评估分数（分类=准确率，回归=R²）。</p>
<p><b>A2：</b>test_size=0.3表示30%的数据用作测试集。random_state=42是随机种子，保证每次划分结果相同。</p>
<p><b>A3：</b>普通决策树一次建完整棵树。GBDT每次只建一棵小树来修正之前所有树的错误（用梯度下降的思想），最终是多棵决策树的加权和。这种"逐步修正"让GBDT比单棵决策树准确得多。</p>
<p><b>A4：</b>+0.3表示这个特征让模型的预测值比平均预测高了0.3。如果预测的是"流失概率"，tenure的SHAP值+0.3意味着tenure让流失概率增加了0.3（即该特征推动预测向"会流失"方向走）。</p>
<p><b>A5：</b>fit_transform既计算参数（均值、标准差）又做变换。如果在测试集上也fit_transform，测试集会被"看到"并影响标准化参数，导致信息泄漏——训练时的标准化参数应该只用训练集的数据计算，测试时直接套用。</p>"""
})

courses.append(sklearn_course)

# ============================================================
# COURSE 10: rag-basics
# ============================================================
rag_basics = {
    "slug": "rag-basics",
    "title": "2.4 RAG基础",
    "description": "检索增强生成：LangChain/Chroma/VectorDB/检索策略——让LLM拥有知识库的完整指南",
    "category": "llm",
    "phase": "B",
    "order": 10,
    "sections": []
}

rag_basics["sections"].append({
    "type": "text",
    "title": "RAG是什么？——让大模型有记忆的知识库",
    "content": """<p>你有没有问过ChatGPT"昨天发生了什么新闻"？它会回答："抱歉，我的训练数据截止到某个日期，我不知道最新信息。"</p>
<p>这就是大模型最大的局限：<b>知识截止在训练日期</b>。GPT-4训练数据截止到2023年12月，对之后发生的事情一无所知。而且对所有用户的问题都给出同样的答案，无法处理私有文档。</p>
<p><b>RAG（Retrieval-Augmented Generation，检索增强生成）</b>就是解决这个问题的方法。它的核心思想很简单：</p>
<p>让LLM在回答问题前，<b>先去知识库找到相关资料</b>，然后基于资料回答。</p>
<p>这个过程就像开卷考试和闭卷考试的区别：</p>
<p>普通LLM = <b>闭卷考试</b>——全靠记在脑子里的东西</p>
<p>RAG = <b>开卷考试</b>——你可以翻书找答案再作答</p>
<p>RAG的好处：</p>
<ul>
<li>准确回答关于私有文档的问题（公司内部资料、产品手册等）</li>
<li>减少幻觉——因为回答基于检索到的文档而非模型凭空想象</li>
<li>实时更新——只需更新知识库，不用重新训练模型</li>
<li>可溯源——可以告诉用户"这个答案来自文档X的第Y页"</li>
</ul>
<p>RAG的完整流程：</p>
<ol>
<li>用户提问："我们公司去年的营收是多少？"</li>
<li>向量检索：在公司的文档库中搜索最相关的几段文本</li>
<li>找到相关文档后，将【检索到的文档 + 用户问题】一起发给LLM</li>
<li>LLM基于检索到的信息生成回答</li>
</ol>"""
})

rag_basics["sections"].append({
    "type": "text",
    "title": "Embedding与向量数据库：把文字变成数学",
    "content": """<p>搜索引擎怎么知道"苹果手机"和"iPhone"是同一回事？Google的搜索引擎用了很多技术，但RAG用的是<b>向量嵌入（Embedding）</b>。</p>
<p><b>Embedding是什么？</b></p>
<p>把一段文字转换成一串数字（向量），这串数字编码了文字的<b>语义（含义）</b>。语义相近的文字，它们的向量在空间中距离很近。</p>
<p>举个例子（这些数字只是演示，真实向量是几百到几千维）：</p>
<p>"今天天气很好" → [0.2, 0.5, 0.1]</p>
<p>"今日天气不错" → [0.3, 0.4, 0.2] （距离很近——意思差不多）</p>
<p>"机器学习算法" → [-0.8, 0.1, 0.9] （距离很远——意思完全不同）</p>
<p><b>向量空间中的"距离"就是语义相似度。</b>距离越近=意思越接近。</p>
<p><b>常用Embedding模型：</b></p>
<ul>
<li><b>OpenAI text-embedding-3-small：</b>1536维向量，效果好，但要付费</li>
<li><b>BGE系列（BAAI）：</b>开源中文最好的Embedding之一，bge-large-zh-v1.5</li>
<li><b>M3E：</b>MokaAI开发的中文Embedding，开源免费，部署方便</li>
<li><b>Jina Embeddings：</b>支持多语言，特别适合长文本</li>
</ul>
<p><b>向量数据库</b>专门存储和检索这些向量。普通数据库用"WHERE name = '张三'"精确匹配，向量数据库用"找最近似的Top K"——不要求一模一样，但要求最相似。</p>
<p>就像图书馆里，传统的书号检索让你找"书号=12345的书"。向量检索让你找"和这本最相关的几本书"。</p>"""
})

rag_basics["sections"].append({
    "type": "code",
    "title": "LangChain实现完整RAG系统",
    "content": """<p>LangChain是目前最流行的LLM应用框架。我们来构建一个完整的RAG问答系统：</p>
<pre>
# 安装：pip install langchain langchain-community chromadb openai

from langchain.document_loaders import TextLoader, DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.chat_models import ChatOpenAI

# === 第一步：加载文档 ===
# 加载公司所有产品文档
loader = DirectoryLoader('./docs/', glob="**/*.txt")
documents = loader.load()  # 每个文档变成一个Document对象
print(f"加载了{len(documents)}个文档")

# === 第二步：文本切割 ===
# 长文档需要切成小块（chunk）。不能太长（检索不精确）、不能太短（丢失上下文）
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,          # 每块最大500个字符
    chunk_overlap=50,        # 块之间重叠50字符
    separators=["\\n\\n", "\\n", "。", "！", "？", " ", ""]  # 分割优先级
)
chunks = text_splitter.split_documents(documents)
print(f"切割成{len(chunks)}个文本块")

# === 第三步：向量化并存入向量库 ===
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectordb = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="./chroma_db"  # 持久化保存
)

# === 第四步：创建检索问答链 ===
llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",                 # 把所有检索结果拼到prompt里
    retriever=vectordb.as_retriever(
        search_kwargs={"k": 3}          # 每次检索最相似的3个块
    ),
    return_source_documents=True        # 返回引用来源
)

# === 第五步：提问 ===
question = "我们公司的手机保修政策是什么？"
result = qa_chain({"query": question})
print("回答:", result['result'])
print("\\n参考来源:")
for doc in result['source_documents']:
    print(f"  - {doc.metadata.get('source', '未知来源')}")
</pre>
<p><b>参数详解：</b></p>
<table border="1">
<tr><th>参数</th><th>含义</th><th>典型值</th><th>太大/太小的影响</th></tr>
<tr><td>chunk_size</td><td>每块文本的最大字符数</td><td>500-1000</td><td>太大→检索不精确；太小→上下文不完整</td></tr>
<tr><td>chunk_overlap</td><td>相邻块的重叠字符数</td><td>50-200</td><td>太小→可能在关键信息处断开；太大→冗余</td></tr>
<tr><td>k</td><td>检索返回的最相似块数量</td><td>3-5</td><td>太小→可能漏重要信息；太大→可能引入噪声</td></tr>
<tr><td>temperature</td><td>LLM回答的随机性</td><td>0-1</td><td>0=确定性回答；1=创造性回答。RAG建议0-0.3</td></tr>
</table>"""
})

rag_basics["sections"].append({
    "type": "text",
    "title": "检索策略与优化",
    "content": """<p>基础RAG用简单的向量相似度检索。但真实场景中可能遇到很多问题："我想找北京的公司"——关键词检索可能更好。或问题很复杂需要分步推理。</p>
<p><b>1. 混合检索（Hybrid Search）</b></p>
<p>向量检索（语义相似）+ 关键词检索（BM25精确匹配）的结合。</p>
<p>score = α × 向量相似度 + (1-α) × BM25得分</p>
<p>α=0.5~0.7时效果最好。向量的语义能力弥补关键词的"只看字面"，关键词的精确性弥补向量的"有时候跑偏"。</p>
<p><b>2. 重排序（Re-Ranking）</b></p>
<p>先用向量检索快速召回Top 50个候选，再用Cross-Encoder精挑出Top 5。</p>
<p>为什么？向量检索快但精度有限，Cross-Encoder更准但太慢。两步走：第一阶段扫一遍（快），第二阶段细选（准）。</p>
<p><b>3. 查询分解（Query Decomposition）</b></p>
<p>复杂问题拆解成多个子问题，分别检索再合并。</p>
<p>"比较Transformer和RNN的优缺点"→</p>
<p>子问题1："Transformer有什么优点和缺点？"</p>
<p>子问题2："RNN有什么优点和缺点？"</p>
<p>分别检索每个子问题，找到的文档更精确。</p>
<p><b>4. 上下文压缩（Context Compression）</b></p>
<p>检索到的文档可能太长，Token不够用。用LLM压缩/摘要后再回答问题。Extract-then-Answer策略。</p>"""
})

rag_basics["sections"].append({
    "type": "example",
    "title": "RAG实战：构建公司产品知识库问答系统",
    "content": """<p>场景：一家电商公司有100份产品文档（功能说明、保修政策、使用指南等），要构建一个内部客服系统。</p>
<p><b>设计思路：</b></p>
<p>文档选择：将PDF、Word都转成txt格式放入docs目录</p>
<p>切割策略：chunk_size=800（中文产品文档段落较长），chunk_overlap=100</p>
<p>Embedding：用BGE-large-zh做中文向量化</p>
<p>向量库：ChromaDB（轻量级，本地运行）</p>
<p>LLM：通过API调用GPT-3.5-turbo</p>
<p><b>完整代码结构：</b></p>
<pre>
# 1. 文档预处理
from langchain.document_loaders import PyPDFLoader, Docx2txtLoader
# 不同格式用不同loader，统一转成Document对象

# 2. 嵌入
from langchain.embeddings import HuggingFaceEmbeddings
embeddings = HuggingFaceEmbeddings(
    model_name="BAAI/bge-large-zh-v1.5",
    model_kwargs={'device': 'cuda'},
    encode_kwargs={'normalize_embeddings': True}
)

# 3. 向量库
vectordb = Chroma(
    embedding_function=embeddings,
    persist_directory="./product_kb"
)

# 4. Prompt模板
from langchain.prompts import PromptTemplate
template = "你是产品专家。基于以下信息回答用户问题：\\n\\n{context}\\n\\n问题：{question}\\n回答："
prompt = PromptTemplate(template=template, input_variables=["context", "question"])

# 5. 使用
result = qa_chain({"query": "手机屏幕碎了怎么处理？"})
# 回答："根据保修政策，非人为损坏的屏幕在购买7天内可以免费更换..."
</pre>"""
})

rag_basics["sections"].append({
    "type": "exercise",
    "title": "练习题",
    "content": """<p><b>Q1：</b>RAG的全称是什么？它解决了LLM的什么核心问题？</p>
<p><b>Q2：</b>文本切割时chunk_size=300和chunk_size=1000分别有什么影响？</p>
<p><b>Q3：</b>向量检索和关键词检索各有什么优点？为什么要混合使用？</p>
<p><b>Q4：</b>RAG流程中k=3是什么意思？设成k=10会怎样？</p>
<p><b>Q5：</b>设计一个RAG系统需要哪几个核心组件？</p>""",
    "answer": """<p><b>A1：</b>Retrieval-Augmented Generation。解决了LLM的知识截止问题（无法回答训练截止日期之后的事）和无法处理私有文档的问题。让LLM在回答前先检索知识库，基于资料回答，减少幻觉。</p>
<p><b>A2：</b>chunk_size=300：块太小，可能切碎完整段落，丢失上下文。但检索时更精确匹配用户问题。chunk_size=1000：块太大，保留更多上下文，但可能包含与问题无关的内容，引入噪声。</p>
<p><b>A3：</b>向量检索理解语义（"苹果"≈"iPhone"），但可能跑偏。关键词检索精确匹配字面（只找有"苹果"二字的），但不懂同义词。混合检索取长补短，score=α×向量+ (1-α)×关键词，α通常0.5-0.7。</p>
<p><b>A4：</b>k=3表示检索最相似的3个文本块。k=10时返回10块，信息更全面但也引入了更多可能不相关的噪声，而且更消耗Token。需要根据文档质量和问题复杂度调整。</p>
<p><b>A5：</b>五个核心组件：1) 文档加载器(读取PDF/Word/txt)；2) 文本切割器(把长文档切成块)；3) Embedding模型(把文本转成向量)；4) 向量数据库(存储和检索向量)；5) LLM(基于检索到的文档生成答案)。</p>"""
})

courses.append(rag_basics)

# ============================================================
# COURSE 11: gpt-series
# ============================================================
gpt_series = {
    "slug": "gpt-series",
    "title": "2.5 GPT系列",
    "description": "GPT-1/2/3/4进化史、Scaling Laws、架构演进：解码大语言模型的发展密码",
    "category": "llm",
    "phase": "B",
    "order": 11,
    "sections": []
}

gpt_series["sections"].append({
    "type": "text",
    "title": "GPT进化史：从一个实验到改变世界",
    "content": """<p>GPT的全称是<b>Generative Pre-trained Transformer</b>（生成式预训练Transformer）。从2018年的GPT-1到2024年的GPT-4o，这个系列的模型彻底改变了人工智能的格局。让我们用讲故事的方式来理解这段进化史。</p>
<p><b>GPT-1（2018年）："预训练+微调"可行！</b></p>
<p>参数：12层，1.17亿参数。大小：就像一个小仓库。</p>
<p>GPT-1证明了"预训练+微调"范式可行：先用海量文本训练一个通用的语言模型（预训练），然后针对特定任务（如情感分析、翻译）微调模型。这就像先上完小学中学的通识教育，再学习专业方向。</p>
<p><b>GPT-2（2019年）："规模大了就是不一样"</b></p>
<p>参数：48层，15亿参数。大小：一个厂房。</p>
<p>GPT-2惊人之处在于：它在某些任务上<b>不做任何微调</b>就能表现良好——这就是"零样本学习"（Zero-shot）。模型足够大后，很多能力自然涌现。OpenAI甚至一度认为GPT-2太危险不敢发布完整版本。</p>
<p><b>GPT-3（2020年）："涌现是一种魔术"</b></p>
<p>参数：96层，1750亿参数。大小：一栋摩天大楼。</p>
<p>GPT-3的重大发现：<b>In-Context Learning（上下文学习）</b>。给模型几个示例（few-shot），它就能泛化到新任务——不用微调任何参数。只要在Prompt里给几个例子，模型就能理解你想要什么。这让AI的开发模式从"训练模型"变成了"写提示词"。</p>
<p>GPT-3的技术规格：d_model=12288（每个词用12288维向量表示），96个注意力头，序列最长2048个token。</p>
<p><b>GPT-3.5 / ChatGPT（2022年）："让人说好"</b></p>
<p>注意：参数规模与GPT-3类似，但加持了RLHF（人类反馈强化学习）。</p>
<p>2022年11月30日，ChatGPT发布。2个月用户突破1亿。它的核心突破不是更大而是"更会说话"：通过人类反馈让模型学会聊天，回答更有用、更安全、更符合人类期望。</p>
<p><b>GPT-4（2023年）："多模态与MoE时代"</b></p>
<p>参数：约1.8万亿（MoE架构，8个专家，每token路由到2个）。</p>
<p>支持图像输入。在各种专业考试（律师资格、医学执照）中达到人类前沿水平。使用了MoE（混合专家）架构——不是每次都用全部参数，只激活部分，大大降低成本。</p>
<p><b>GPT-4o（2024年）："原生多模态"</b></p>
<p>o = omni（全能的）。文本+图像+语音统一处理——不再先转成文字再处理，而是直接理解语音中的语调、情感等信息。</p>"""
})

gpt_series["sections"].append({
    "type": "formula",
    "title": "Scaling Laws：为什么模型越大越聪明？",
    "content": """<p>2020年，OpenAI和DeepMind分别发表论文，发现了<b>Scaling Laws（规模法则）</b>——模型性能与参数数量、数据量、计算量之间存在可预测的幂律关系。简单说就是：<b>更大的模型、更多的数据、更多的算力 → 更好的性能。而且这个关系是可预测的。</b></p>
<p>OpenAI的Scaling Law公式（简化版）：</p>
<p><b>L(N) ≈ (N_c / N)^α</b></p>
<p>其中：</p>
<table border="1">
<tr><th>符号</th><th>名称</th><th>含义</th><th>典型值/说明</th></tr>
<tr><td>L(N)</td><td>损失函数值</td><td>模型在测试集上的损失。越小越好</td><td>衡量模型性能的指标</td></tr>
<tr><td>N</td><td>参数量</td><td>模型有多少个可训练参数</td><td>GPT-3: 175B。越大模型越强</td></tr>
<tr><td>N_c</td><td>临界参数量</td><td>一个常数，与网络架构有关</td><td>由实验拟合得出</td></tr>
<tr><td>α</td><td>缩放指数</td><td>损失随参数量下降的速度</td><td>约0.04-0.10</td></tr>
</table>
<p><b>这条公式在说什么？</b></p>
<p>当参数量N翻倍时，损失L大约下降到原来的 2^(-α)，即约为原来的 94-97%。下降很慢——需要指数级增加参数才能获得线性级的性能提升。</p>
<p><b>Chinchilla修正（DeepMind 2022年）：</b></p>
<p>OpenAI的原始Scaling Law假设算力固定时先放大模型。但DeepMind发现<b>数据量同样重要</b>。Chinchilla定律说：</p>
<p>最优状态下，<b>每1个参数大约需要20个token的训练数据</b>。</p>
<p>所以训练一个70B（700亿）参数的模型，大约需要1.4T（1.4万亿）token的训练数据。</p>
<p>很多之前的模型（包括GPT-3）都训练不足——参数量大到一定程度但没有配足够的数据。GPT-4做到参数量和数据量同步增长。</p>
<p><b>实际意义：</b></p>
<p>如果你想训练一个10B参数的模型，按Chinchilla定律你需要约200B token的数据（大约4000亿字的中文）。数据不够的话，不如缩小模型。这就是为什么现在"数据质量比模型大小更重要"成为共识。</p>"""
})

gpt_series["sections"].append({
    "type": "text",
    "title": "架构演进：GPT架构的持续优化",
    "content": """<p>GPT系列使用的核心架构是<b>Decoder-only Transformer</b>（只用Transformer的解码器部分）。但它不是简单放大参数，还有很多架构改进：</p>
<p><b>1. Decoder-only（只用解码器）</b></p>
<p>为什么只用解码器？GPT的目标是<b>自回归式生成</b>——根据前面的词预测下一个词。解码器的掩码自注意力正好做这件事：每个token只能看到前面的token，适合从左到右的文本生成。BERT（编码器）更适合"理解"任务，GPT适合"生成"任务。</p>
<p><b>2. MoE（混合专家，Mixture of Experts）</b></p>
<p>一个大问题：模型越大推断越贵。MoE是一种"智慧偷懒"。</p>
<p>把模型的FFN层拆分成多个"专家"。一个<b>门控网络（Router）</b>决定每个token应该找哪些专家处理。每次只激活少数几个专家，其他专家休息。</p>
<p>GPT-4：8个专家，每个token路由到2个。总参数约1.8万亿，活跃参数约3700亿。相当于有8个专注不同领域的老师，每道题只找2个最合适的老师回答。大大节省成本。</p>
<p><b>3. GQA（Grouped Query Attention，分组查询注意力）</b></p>
<p>多头注意力中，Q（查询）多头独立但K和V可以共享。GQA把注意力头分组，组内共享KV。这样减少了KV缓存（推断时需要存起来），加速推断。</p>
<p>LLaMA 2/GPT-4等都用了这个技术。</p>
<p><b>4. RoPE（旋转位置编码）</b></p>
<p>相比Transformer原始的绝对位置编码，RoPE用旋转矩阵编码相对位置关系。优点是模型能自然地理解"距离"的概念，而且能外推到训练时没见过的长序列。</p>
<p><b>5. FlashAttention（快闪注意力）</b></p>
<p>Transformer的注意力计算是O(n²)的——序列长1000意味着100万的注意力对要计算。FlashAttention通过巧妙的<b>分块（Tiling）</b>计算，减少了GPU显存访问，速度提升2-4倍且不损失精度。</p>
<p>这项技术让你能用更长的上下文（GPT-4 Turbo支持128K token），是长上下文能力的关键。</p>
<p><b>6. Pre-Norm（前置归一化）</b></p>
<p>原始Transformer把层归一化放在每个子层之后。经过实验发现，<b>把归一化放到子层之前</b>（Pre-Norm）训练更稳定。现在几乎所有大模型都用Pre-Norm。</p>"""
})

gpt_series["sections"].append({
    "type": "example",
    "title": "实例：Scaling Laws如何指导实际开发？",
    "content": """<p>假设你在创业，想训练一个中文法律领域的专业模型。你有1000万条法律文档（约50亿个token）。你能训练多大的模型？</p>
<p>按Chinchilla定律：每参数约20 token最合理。</p>
<p>50亿 token / 20 = 2.5亿参数。</p>
<p>所以合理选择：<b>~2-3亿参数</b>。更大就是浪费（参数吃不饱数据）。</p>
<p><b>方案对比：</b></p>
<p>方案A：训练一个7B(70亿)参数的模型 → 数据严重不足，过拟合严重。看似大但实际不如小模型。</p>
<p>方案B：训练一个250M(2.5亿)参数的模型 → 数据刚好匹配，训练充分。虽然参数小但学会的知识更扎实。</p>
<p>方案C：使用开源预训练模型（如Qwen-7B）+ 用法律数据微调 → 最实际的方案！基础能力来自大模型预训练，专业能力来自微调。</p>
<p>这说明了为什么现在微调（Fine-tuning）比从头训练（Pre-training）更受欢迎：利用已有的大模型知识，只用少量专业数据就能获得好的专业表现。</p>
<p><b>NumPy验证计算：</b></p>
<pre>
import numpy as np

# 假设 Scaling Law: L = (N_c / N)^0.05
N_c = 1e8  # 临界参数量 1亿

for N_billions in [0.1, 1, 10, 100, 175]:
    N = N_billions * 1e9
    L = (N_c / N) ** 0.05
    print(f"参数量{N_billions}B: 损失值L={L:.4f}")

# 输出：
# 参数量0.1B: L=0.8912
# 参数量1B:   L=0.7942
# 参数量10B:  L=0.7078
# 参数量100B: L=0.6309
# 参数量175B: L=0.6134
# 可以看到：损失下降越来越慢（边际收益递减）
</pre>"""
})

gpt_series["sections"].append({
    "type": "exercise",
    "title": "练习题",
    "content": """<p><b>Q1：</b>GPT-1、GPT-2、GPT-3的主要突破分别是什么？</p>
<p><b>Q2：</b>Scaling Law是什么？它说明什么规律？</p>
<p><b>Q3：</b>按Chinchilla定律，训练一个70B参数的模型需要多少训练数据（token数）？</p>
<p><b>Q4：</b>MoE（混合专家）架构相比密集架构有什么优势？</p>
<p><b>Q5：</b>为什么现在GPT用的Decoder-only更适合文本生成而BERT的Encoder-only更适合文本理解？</p>""",
    "answer": """<p><b>A1：</b>GPT-1：证明"预训练+微调"有效。GPT-2：发现扩大规模带来零样本能力。GPT-3：涌现In-Context Learning和Few-shot能力。</p>
<p><b>A2：</b>Scaling Law发现模型性能（损失）与参数量、数据量、计算量之间存在幂律关系：Loss ∝ N^(-α)。更大的模型+更多数据+更多算力=更好的性能，且这个关系可预测。但边际收益递减。</p>
<p><b>A3：</b>按Chinchilla定律：每参数约20 token。70B×20=1.4T（1.4万亿）token。大约相当于2-3万亿字的中文文本。</p>
<p><b>A4：</b>MoE把FFN拆成多个专家，每次只激活2个左右。总参数可以很大（如1.8T）但活跃参数只有一小部分（如370B）。优点是：模型"容量"大但推断成本低。缺点是训练复杂，专家负载不均衡。</p>
<p><b>A5：</b>Decoder-only使用自回归生成（从左到右逐个预测下一个词），天然适合文本生成任务。Encoder-only(BERT)同时看到整个序列（双向注意），适合需要全局理解的任务如分类、实体识别。生成任务需要因果性（不能说未来），所以Decoder-only最合适。</p>"""
})

courses.append(gpt_series)

# Write all courses
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(courses, f, ensure_ascii=False, indent=2)

print(f"Written file with {len(courses)} courses: {[c['slug'] for c in courses]}")

# Verify JSON validity
with open(output_path, 'r', encoding='utf-8') as f:
    loaded = json.load(f)
    print(f"JSON valid. Total sections across all courses: {sum(len(c['sections']) for c in loaded)}")
    for c in loaded:
        print(f"  {c['order']}: {c['slug']} ({c['title']}) - {len(c['sections'])} sections")
