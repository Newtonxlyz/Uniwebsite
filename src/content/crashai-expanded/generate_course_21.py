import json
import os

os.makedirs('crashai-expanded', exist_ok=True)

# ============================================================
# COURSE 21: integration-guide (整合指南)
# ============================================================
course_21 = {
    "slug": "integration-guide",
    "title": "3.5 整合指南",
    "description": "前后端整合/CI/CD/部署方案/性能优化/监控告警：从零搭建AI应用的全栈架构与生产级部署",
    "category": "llm",
    "phase": "C",
    "order": 21,
    "sections": [
        {
            "type": "text",
            "title": "项目架构全景图",
            "content": """<p><b>AI应用架构就像建造一座现代摩天大楼</b>——数据层是地基，必须坚固可靠；后端是钢骨架，承载所有业务逻辑；前端是玻璃幕墙，给用户直观的交互体验；LLM则是大楼的\u201C智能大脑\u201D，让整个建筑\u201C活\u201D起来。</p><p><b>经典四层架构：</b></p><ul><li><b>D层（数据层）：</b>PostgreSQL存储业务数据，Redis做缓存，Chroma/Pinecone存储向量，对象存储（S3/MinIO）存文件</li><li><b>E层（交互层）：</b>Next.js/React前端，FastAPI/Node.js后端，WebSocket实时通信</li><li><b>L层（LLM层）：</b>OpenAI/Claude API，自部署模型（vLLM/Ollama），Embedding服务</li><li><b>O层（运维层）：</b>Prometheus监控，Grafana可视化，CI/CD流水线，日志收集</li></ul><p><b>类比：</b>想象你在开一家餐厅。数据层是仓库和冷库（存食材），后端是厨房（处理订单、做菜），前端是餐厅门面和菜单（顾客看到的一切），LLM是主厨（理解和创造菜品），运维层是卫生检查和质量控制（确保一切正常运转）。</p>"""
        },
        {
            "type": "text",
            "title": "前端架构详解",
            "content": """<p><b>前端是用户与AI系统的桥梁。</b>现代AI应用前端通常采用Next.js（React框架）作为首选方案，原因有三：SSR（服务端渲染）优化首屏加载、API路由天然支持后端功能、Vercel一键部署体验极佳。</p><p><b>状态管理选择：</b></p><ul><li><b>小应用：</b>React useState + useContext足够</li><li><b>中大型应用：</b>Zustand（轻量、无样板代码）或 Redux Toolkit（生态成熟）</li><li><b>实时协作：</b>Zustand + WebSocket 或 Yjs</li></ul><p><b>AI应用特有的前端模式：</b></p><ul><li><b>Streaming UI：</b>LLM回复逐字显示，需处理SSE（Server-Sent Events）流式数据</li><li><b>消息状态机：</b>发送中→思考中→生成中→完成→失败，每个状态有对应的UI反馈</li><li><b>文件上传：</b>支持PDF/Word/Excel解析，需展示解析进度和分块预览</li><li><b>对话历史：</b>无限滚动加载、搜索、对话分支管理</li></ul><p><b>类比：</b>前端就像餐厅的菜单和服务员。菜单要清晰（UI设计），服务员要能快速传达顾客需求（API调用），还要在等菜时告诉顾客\u201C厨师正在做\u201D（loading状态）。如果厨师（LLM）回复特别长，服务员得一句一句传话（streaming），而不是等全说完了再告诉顾客。</p>"""
        },
        {
            "type": "table",
            "title": "前端框架选型对比",
            "content": """<table><tr><th>框架</th><th>SSR</th><th>API路由</th><th>部署便利</th><th>AI生态</th><th>适用场景</th></tr><tr><td>Next.js</td><td>\u2713</td><td>\u2713</td><td>\u2605\u2605\u2605\u2605\u2605</td><td>\u2605\u2605\u2605\u2605\u2605</td><td>AI应用首选，Vercel生态完善</td></tr><tr><td>Nuxt.js</td><td>\u2713</td><td>\u2713</td><td>\u2605\u2605\u2605\u2605\u2606</td><td>\u2605\u2605\u2605\u2606\u2606</td><td>Vue团队偏好项目</td></tr><tr><td>React SPA</td><td>\u2717</td><td>\u2717</td><td>\u2605\u2605\u2605\u2605\u2605</td><td>\u2605\u2605\u2605\u2605\u2605</td><td>纯客户端应用，SEO不敏感</td></tr><tr><td>Vue</td><td>\u2206</td><td>\u2206</td><td>\u2605\u2605\u2605\u2605\u2606</td><td>\u2605\u2605\u2605\u2606\u2606</td><td>国内团队常用，上手简单</td></tr><tr><td>Streamlit</td><td>\u2717</td><td>\u2717</td><td>\u2605\u2605\u2605\u2605\u2606</td><td>\u2605\u2605\u2605\u2605\u2605</td><td>AI Demo/原型快速搭建</td></tr><tr><td>Gradio</td><td>\u2717</td><td>\u2717</td><td>\u2605\u2605\u2605\u2605\u2606</td><td>\u2605\u2605\u2605\u2605\u2605</td><td>HuggingFace模型演示</td></tr></table><p><b>选择建议：</b>生产级AI应用首选Next.js（App Router），快速原型用Streamlit/Gradio，内部工具用React SPA或Vue。</p>"""
        },
        {
            "type": "text",
            "title": "后端架构详解",
            "content": """<p><b>后端是AI系统的\u201C中枢神经系统\u201D。</b>FastAPI是Python生态的绝对首选，因为：原生异步支持（async/await）、自动OpenAPI文档、类型提示、Pydantic数据验证、与ML/AI库生态无缝衔接。</p><p><b>后端核心模块：</b></p><ul><li><b>API网关：</b>统一入口，处理认证、限流、路由、日志</li><li><b>业务服务：</b>用户管理、对话管理、文件处理、支付等</li><li><b>LLM代理：</b>封装各厂商API（OpenAI、Anthropic、Google、本地模型），统一接口</li><li><b>检索服务：</b>向量检索、混合搜索、重排序</li><li><b>任务队列：</b>Celery/Redis/RabbitMQ处理异步任务（PDF解析、长文本生成、邮件发送）</li></ul><p><b>异步架构的必要性：</b>LLM API调用通常耗时3-30秒，同步处理会阻塞所有请求。使用async/await可以让单进程处理成百上千并发请求。</p><p><b>类比：</b>后端就像餐厅的后厨。接单（API请求）要快，不能让客户等太久。当一道菜需要慢炖（LLM生成），厨师不能停下来等，而是把锅放火上，转头做其他菜（异步处理）。还需要一个传菜系统（任务队列）来确保做好的菜按顺序送到顾客面前。</p>"""
        },
        {
            "type": "code",
            "title": "FastAPI后端架构示例",
            "code": """from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
import redis.asyncio as redis
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

# 数据库配置
DATABASE_URL = \"postgresql+asyncpg://user:pass@localhost/db\"
engine = create_async_engine(DATABASE_URL, pool_size=20, max_overflow=0)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

# Redis连接
redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 启动时：连接池预热、加载模型
    await redis_client.ping()
    print(\"服务启动完成，连接池已预热\")
    yield
    # 关闭时：清理资源
    await redis_client.close()
    await engine.dispose()

app = FastAPI(title=\"AI应用后端\", lifespan=lifespan)

# CORS配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=[\"http://localhost:3000\", \"https://app.example.com\"],
    allow_credentials=True,
    allow_methods=[\"*\"],
    allow_headers=[\"*\"],
)

# 认证依赖
security = HTTPBearer()
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    # 验证JWT，返回用户信息
    user = await verify_token(token)
    if not user:
        raise HTTPException(status_code=401, detail=\"Invalid token\")
    return user

# 数据库会话依赖
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

@app.post(\"/chat\")
async def chat(
    request: ChatRequest,
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # 1. 检查缓存（相同问题+相同上下文）
    cache_key = f\"chat:{user['id']}:{hash(request.messages)}\"
    cached = await redis_client.get(cache_key)
    if cached:
        return json.loads(cached)
    
    # 2. 调用LLM（异步，不阻塞）
    response = await llm_service.chat(request.messages, model=request.model)
    
    # 3. 保存到数据库（异步）
    await conversation_service.save(db, user['id'], request, response)
    
    # 4. 写入缓存（5分钟过期）
    await redis_client.setex(cache_key, 300, json.dumps(response))
    
    return response

@app.post(\"/chat/stream\")
async def chat_stream(request: ChatRequest):
    # SSE流式响应
    async def event_generator():
        async for chunk in llm_service.chat_stream(request.messages):
            yield f\"data: {json.dumps(chunk)}\\n\\n\"
        yield \"data: [DONE]\\n\\n\"
    
    return StreamingResponse(event_generator(), media_type=\"text/event-stream\")

# 健康检查
@app.get(\"/health\")
async def health():
    return {\"status\": \"ok\", \"version\": \"1.0.0\"}"""
        },
        {
            "type": "text",
            "title": "LLM API集成最佳实践",
            "content": """<p><b>LLM API集成不是简单的HTTP调用，而是一门工程艺术。</b>生产环境中，你需要处理：超时重试、流式响应、多模型切换、费用控制、上下文管理、错误降级等。</p><p><b>关键设计原则：</b></p><ul><li><b>统一接口层：</b>封装OpenAI、Anthropic、Google、Azure等API，对外提供统一接口。切换模型只需改一行配置。</li><li><b>断路器模式：</b>某厂商API故障时自动切换到备用模型，避免单点故障。</li><li><b>Token预算管理：</b>预设每次调用的Token上限（max_tokens），防止异常输入导致账单爆炸。</li><li><b>上下文窗口管理：</b>系统消息+历史对话+新输入的Token数不能超过模型上限。超长的要自动截断或摘要。</li><li><b>流式响应：</b> SSE（Server-Sent Events）让用户看到\u201C打字机效果\u201D，提升体验。注意处理连接中断和重连。</li></ul><p><b>类比：</b>LLM API就像你外包给一位外国顾问。你（后端）需要：准备好问题（prompt engineering），控制通话时长（timeout），准备备用顾问（fallback），记录通话内容（logging），控制咨询预算（token limit）。顾问说话可能很慢（生成延迟），你不能干等，要同时做其他事（异步）。</p>"""
        },
        {
            "type": "code",
            "title": "LLM代理服务实现",
            "code": """import asyncio
from enum import Enum
from typing import AsyncGenerator, Optional
import openai
import anthropic
from tenacity import retry, stop_after_attempt, wait_exponential

class LLMProvider(Enum):
    OPENAI = \"openai\"
    ANTHROPIC = \"anthropic\"
    AZURE = \"azure\"
    LOCAL = \"local\"

class LLMService:
    def __init__(self):
        self.clients = {
            LLMProvider.OPENAI: openai.AsyncOpenAI(api_key=OPENAI_API_KEY),
            LLMProvider.ANTHROPIC: anthropic.AsyncAnthropic(api_key=ANTHROPIC_API_KEY),
        }
        # 默认配置：优先用OpenAI，故障时切换到Anthropic
        self.fallback_chain = [LLMProvider.OPENAI, LLMProvider.ANTHROPIC]
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
    async def chat(self, messages, model=\"gpt-4\", temperature=0.7, max_tokens=2000):
        \"\"\"非流式对话，带重试和断路器\"\"\"
        for provider in self.fallback_chain:
            try:
                client = self.clients[provider]
                if provider == LLMProvider.OPENAI:
                    response = await client.chat.completions.create(
                        model=model,
                        messages=messages,
                        temperature=temperature,
                        max_tokens=max_tokens,
                        timeout=30  # 30秒超时
                    )
                    return {
                        \"content\": response.choices[0].message.content,
                        \"usage\": response.usage,
                        \"provider\": provider.value
                    }
                elif provider == LLMProvider.ANTHROPIC:
                    response = await client.messages.create(
                        model=\"claude-3-sonnet-20240229\",
                        max_tokens=max_tokens,
                        messages=messages,
                        timeout=30
                    )
                    return {
                        \"content\": response.content[0].text,
                        \"usage\": response.usage,
                        \"provider\": provider.value
                    }
            except Exception as e:
                print(f\"{provider.value} 调用失败: {e}\")
                continue
        raise Exception(\"所有LLM提供商均不可用\")
    
    async def chat_stream(self, messages, model=\"gpt-4\") -> AsyncGenerator[dict, None]:
        \"\"\"流式响应，用于打字机效果\"\"\"
        client = self.clients[LLMProvider.OPENAI]
        stream = await client.chat.completions.create(
            model=model,
            messages=messages,
            stream=True,
            max_tokens=2000
        )
        async for chunk in stream:
            if chunk.choices[0].delta.content:
                yield {\"text\": chunk.choices[0].delta.content}
    
    async def estimate_cost(self, messages, model=\"gpt-4\") -> dict:
        \"\"\"预估Token数和费用\"\"\"
        # 使用tiktoken精确计算
        import tiktoken
        encoder = tiktoken.encoding_for_model(model)
        total_tokens = sum(len(encoder.encode(m[\"content\"])) for m in messages)
        # 预留输出Token
        estimated_output = min(2000, total_tokens * 2)
        # 价格表（每1K tokens）
        prices = {\"gpt-4\": {\"input\": 0.03, \"output\": 0.06},
                  \"gpt-3.5-turbo\": {\"input\": 0.0005, \"output\": 0.0015}}
        p = prices.get(model, prices[\"gpt-4\"])
        cost = (total_tokens / 1000) * p[\"input\"] + (estimated_output / 1000) * p[\"output\"]
        return {\"input_tokens\": total_tokens, \"estimated_cost\": f\"${cost:.4f}\"}

# 使用示例
llm_service = LLMService()

async def demo():
    # 预估费用
    messages = [{\"role\": \"user\", \"content\": \"写一篇关于AI的短文\"}]
    cost_info = await llm_service.estimate_cost(messages)
    print(f\"预估费用: {cost_info['estimated_cost']}\")
    
    # 流式生成
    async for chunk in llm_service.chat_stream(messages):
        print(chunk[\"text\"], end=\"\", flush=True)"""
        },
        {
            "type": "text",
            "title": "向量数据库选型与集成",
            "content": """<p><b>向量数据库是RAG系统的\u201C记忆宫殿\u201D。</b>它将文本、图像、代码转化为高维向量，通过相似度搜索快速找到相关内容。选型要考虑：数据规模、查询延迟、过滤能力、混合搜索、自托管vs托管、成本。</p><p><b>核心概念：</b></p><ul><li><b>Embedding模型：</b>将文本转为向量（OpenAI text-embedding-3-large: 3072维，BGE-large: 1024维）。维度越高语义表达能力越强，但存储和计算成本也越高。</li><li><b>相似度度量：</b>Cosine（角度距离，适合语义相似）、Euclidean（直线距离，适合聚类）、Dot Product（适合归一化向量）。</li><li><b>索引算法：</b>HNSW（图索引，召回率高，构建慢）、IVF（倒排索引，构建快，适合大规模）、Flat（暴力搜索，精确但慢）。</li><li><b>混合搜索：</b>向量相似度 + 关键词匹配（BM25）融合，解决纯向量检索的精确性问题。</li></ul><p><b>类比：</b>向量数据库就像图书馆的索引系统。每本书（文档）被编码成一个\u201C气味签名\u201D（向量）。当你想找\u201C类似《百年孤独》的书\u201D，不是按书名或作者搜索，而是找\u201C气味最相似\u201D的书。混合搜索则是：既找气味相似的，又确保标题包含\u201C魔幻现实主义\u201D。</p>"""
        },
        {
            "type": "table",
            "title": "向量数据库深度对比",
            "content": """<table><tr><th>数据库</th><th>托管方式</th><th>最大规模</th><th>延迟</th><th>混合搜索</th><th>价格</th><th>最佳场景</th></tr><tr><td>Chroma</td><td>本地/自托管</td><td>百万级</td><td>~50ms</td><td>\u2717</td><td>免费</td><td>原型开发、本地RAG</td></tr><tr><td>Pinecone</td><td>全托管</td><td>十亿级</td><td>~10ms</td><td>\u2713</td><td>$0.096/GB/月</td><td>生产级、快速上线</td></tr><tr><td>Milvus/Zilliz</td><td>自托管/托管</td><td>百亿级</td><td>~5ms</td><td>\u2713</td><td>按需</td><td>大规模、企业级</td></tr><tr><td>Weaviate</td><td>自托管/托管</td><td>十亿级</td><td>~10ms</td><td>\u2713</td><td>按需</td><td>GraphQL接口、多模态</td></tr><tr><td>Qdrant</td><td>自托管/托管</td><td>十亿级</td><td>~5ms</td><td>\u2713</td><td>免费/托管</td><td>Rust高性能、过滤强</td></tr><tr><td>pgvector</td><td>PostgreSQL插件</td><td>千万级</td><td>~20ms</td><td>\u2713</td><td>免费</td><td>已有PG、结构化+向量</td></tr><tr><td>Elasticsearch</td><td>自托管/托管</td><td>百亿级</td><td>~15ms</td><td>\u2713</td><td>按需</td><td>搜索平台、已有ES集群</td></tr></table><p><b>选型决策树：</b>预算紧张+原型 → Chroma/pgvector；快速生产上线 → Pinecone；大规模+自主可控 → Milvus/Qdrant；已有搜索团队 → Elasticsearch；已有PostgreSQL → pgvector。</p>"""
        },
        {
            "type": "code",
            "title": "向量数据库集成代码（多数据库适配）",
            "code": """from abc import ABC, abstractmethod
from typing import List, Dict, Any
import numpy as np

class VectorStore(ABC):
    \"\"\"向量存储抽象基类，支持多数据库切换\"\"\"
    @abstractmethod
    async def add(self, texts: List[str], embeddings: List[List[float]], metadatas: List[Dict]):
        pass
    @abstractmethod
    async def search(self, query_embedding: List[float], top_k: int = 5, filter: Dict = None) -> List[Dict]:
        pass

class ChromaStore(VectorStore):
    def __init__(self, collection_name=\"docs\"):
        import chromadb
        self.client = chromadb.Client()
        self.collection = self.client.get_or_create_collection(name=collection_name)
    
    async def add(self, texts, embeddings, metadatas):
        ids = [f\"doc_{i}\" for i in range(len(texts))]
        self.collection.add(ids=ids, embeddings=embeddings, documents=texts, metadatas=metadatas)
    
    async def search(self, query_embedding, top_k=5, filter=None):
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            where=filter
        )
        return [{\"text\": r, \"metadata\": m, \"distance\": d}
                for r, m, d in zip(results[\"documents\"][0], results[\"metadatas\"][0], results[\"distances\"][0])]

class PineconeStore(VectorStore):
    def __init__(self, index_name, dimension=1536):
        from pinecone import Pinecone
        self.pc = Pinecone(api_key=PINECONE_API_KEY)
        self.index = self.pc.Index(index_name)
    
    async def add(self, texts, embeddings, metadatas):
        vectors = []
        for i, (emb, meta) in enumerate(zip(embeddings, metadatas)):
            vectors.append({\"id\": f\"doc_{i}\", \"values\": emb, \"metadata\": {**meta, \"text\": texts[i]}})
        self.index.upsert(vectors=vectors)
    
    async def search(self, query_embedding, top_k=5, filter=None):
        results = self.index.query(
            vector=query_embedding, top_k=top_k, filter=filter, include_metadata=True
        )
        return [{\"text\": r.metadata[\"text\"], \"metadata\": r.metadata, \"score\": r.score}
                for r in results.matches]

class HybridSearcher:
    \"\"\"混合搜索：向量相似度 + 关键词BM25\"\"\"
    def __init__(self, vector_store: VectorStore, bm25_index=None, alpha=0.7):
        self.vector_store = vector_store
        self.bm25_index = bm25_index
        self.alpha = alpha  # 向量权重，1-alpha为关键词权重
    
    async def search(self, query_embedding, query_text, top_k=5):
        # 1. 向量检索召回Top50
        vector_results = await self.vector_store.search(query_embedding, top_k=50)
        
        # 2. BM25检索（如果有关键词索引）
        if self.bm25_index:
            keyword_results = self.bm25_index.search(query_text, top_k=50)
            # 3. 融合排序：RRF（Reciprocal Rank Fusion）
            return self._rrf_fuse(vector_results, keyword_results, top_k)
        return vector_results[:top_k]
    
    def _rrf_fuse(self, vector_results, keyword_results, k=60):
        \"\"\"RRF融合：排名越靠前，得分越高，对排名位置敏感\"\"\"
        scores = {}
        for rank, r in enumerate(vector_results):
            doc_id = r[\"metadata\"][\"id\"]
            scores[doc_id] = scores.get(doc_id, 0) + 1 / (k + rank + 1)
            scores[doc_id + \"_vec\"] = r
        for rank, r in enumerate(keyword_results):
            doc_id = r[\"id\"]
            scores[doc_id] = scores.get(doc_id, 0) + 1 / (k + rank + 1)
        # 排序返回TopK
        sorted_ids = sorted(scores.keys(), key=lambda x: scores[x], reverse=True)[:5]
        return [scores[i + \"_vec\"] for i in sorted_ids if i + \"_vec\" in scores]"""
        },
        {
            "type": "text",
            "title": "数据层设计：PostgreSQL + Redis",
            "content": """<p><b>数据层是AI应用的\u201C记忆库\u201D。</b>PostgreSQL处理结构化数据（用户信息、对话记录、业务数据），Redis处理高速缓存和会话，对象存储（S3/MinIO）处理文件。</p><p><b>PostgreSQL在AI应用中的角色：</b></p><ul><li><b>对话历史：</b>thread表存储对话主题，message表存储每条消息，支持JSONB存储消息元数据（Token数、模型名、耗时）</li><li><b>用户管理：</b>users表 + 订阅表 + 用量表，记录每月Token消耗、API调用次数</li><li><b>文件管理：</b>documents表存储文件元数据，文件内容存S3，解析后的文本块存向量库</li><li><b>pgvector插件：</b>如果数据量不大，直接用PostgreSQL存向量，省去额外数据库运维</li></ul><p><b>Redis在AI应用中的角色：</b></p><ul><li><b>会话缓存：</b>JWT黑名单、用户在线状态、WebSocket连接映射</li><li><b>结果缓存：</b>相同查询的LLM结果缓存（TTL=5分钟），减少重复调用</li><li><b>速率限制：</b>滑动窗口计数，防止用户滥用API</li><li><b>队列：</b>Celery任务队列后端，处理PDF解析、邮件发送等异步任务</li><li><b>排行榜：</b>热门对话、用户活跃度排名</li></ul><p><b>类比：</b>PostgreSQL是图书馆的主书库，书籍（数据）永久保存，有序排列，适合长期查询。Redis是收银台旁的便签墙，记的是临时信息（今天特价、当前排队号），读完就撕，但拿起来飞快。对象存储是仓库，存的是大文件（PDF、图片、视频），不常取但取的时候用叉车（HTTP）搬运。</p>"""
        },
        {
            "type": "code",
            "title": "数据层SQLAlchemy模型定义",
            "code": """from sqlalchemy import Column, Integer, String, DateTime, JSON, ForeignKey, Text, Float
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from datetime import datetime
import uuid

Base = declarative_base()

class User(Base):
    __tablename__ = \"users\"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    subscription_tier = Column(String(20), default=\"free\")  # free/pro/enterprise
    monthly_token_quota = Column(Integer, default=100000)
    monthly_tokens_used = Column(Integer, default=0)
    
    conversations = relationship(\"Conversation\", back_populates=\"user\")
    api_keys = relationship(\"APIKey\", back_populates=\"user\")

class Conversation(Base):
    __tablename__ = \"conversations\"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey(\"users.id\"), nullable=False, index=True)
    title = Column(String(255))  # AI自动生成的对话标题
    model = Column(String(50), default=\"gpt-4\")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    metadata = Column(JSONB, default={})  # 额外元数据：标签、评分、是否收藏
    
    user = relationship(\"User\", back_populates=\"conversations\")
    messages = relationship(\"Message\", order_by=\"Message.created_at\", back_populates=\"conversation\")

class Message(Base):
    __tablename__ = \"messages\"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey(\"conversations.id\"), nullable=False, index=True)
    role = Column(String(20), nullable=False)  # system/user/assistant/tool
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    token_count = Column(Integer)  # 本条消息的Token数
    latency_ms = Column(Float)  # 生成耗时（毫秒）
    model = Column(String(50))  # 实际使用的模型
    cost_usd = Column(Float)  # 本次调用费用（美元）
    metadata = Column(JSONB, default={})  # 引用来源、搜索到的文档等
    
    conversation = relationship(\"Conversation\", back_populates=\"messages\")

class Document(Base):
    __tablename__ = \"documents\"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey(\"users.id\"), nullable=False)
    filename = Column(String(255), nullable=False)
    file_size = Column(Integer)  # 字节
    file_type = Column(String(50))  # application/pdf, text/plain
    s3_url = Column(String(500))  # 对象存储地址
    status = Column(String(20), default=\"pending\")  # pending/processing/completed/failed
    chunk_count = Column(Integer, default=0)  # 解析后的文本块数
    vectorized = Column(String(1), default=\"N\")  # 是否已写入向量库
    created_at = Column(DateTime, default=datetime.utcnow)
    metadata = Column(JSONB, default={})  # 页数、语言、摘要

class APIKey(Base):
    __tablename__ = \"api_keys\"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey(\"users.id\"), nullable=False)
    key_hash = Column(String(255), nullable=False)  # 存储哈希，不存明文
    name = Column(String(100))  # 用户给API Key的命名
    last_used_at = Column(DateTime)
    rate_limit = Column(Integer, default=60)  # 每分钟请求数
    is_active = Column(String(1), default=\"Y\")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship(\"User\", back_populates=\"api_keys\")

# 索引优化
# CREATE INDEX idx_messages_conv_created ON messages(conversation_id, created_at);
# CREATE INDEX idx_users_email ON users USING btree(email);
# CREATE INDEX idx_conversations_user_updated ON conversations(user_id, updated_at DESC);"""
        },
        {
            "type": "text",
            "title": "CI/CD流水线：从代码到生产",
            "content": """<p><b>CI/CD是AI应用发布的\u201C自动化高速公路\u201D。</b>没有CI/CD，每次发布都是一场冒险——手动打包、SSH登录服务器、祈祷不报错。有了CI/CD，代码提交即自动测试、构建、部署，团队可以每天发布几十次。</p><p><b>AI应用CI/CD的特殊考量：</b></p><ul><li><b>模型文件管理：</b>模型权重文件通常几GB到几十GB，不应放入Git。用Git LFS或DVC管理，CI时从对象存储下载。</li><li><b>环境隔离：</b>开发环境用小模型（gpt-3.5-turbo），生产环境用大模型（gpt-4）。通过环境变量控制，而非代码写死。</li><li><b>Prompt版本化：</b>Prompt是代码的一部分，应纳入Git版本控制。用独立的prompts/目录，支持A/B测试不同版本。</li><li><b>测试策略：</b>单元测试（工具函数）+ 集成测试（API端到端）+ 评估测试（LLM输出质量）。LLM输出的不确定性需要评估测试（用确定性指标如BLEU、ROUGE，或LLM-as-Judge）。</li><li><b>安全扫描：</b>依赖漏洞扫描（Snyk/Dependabot）、Secret检测（防止API Key泄露）、容器扫描（Trivy）。</li></ul><p><b>类比：</b>CI/CD就像餐厅的中央厨房供应链。厨师（开发者）把菜谱（代码）提交到总部，自动检查菜谱是否正确（测试），准备食材（构建Docker镜像），送到各分店（部署）。如果某道菜（测试）不合格，整批都不送（阻断发布）。如果一切顺利，30分钟后新菜就出现在所有分店菜单上。</p>"""
        },
        {
            "type": "code",
            "title": "GitHub Actions CI/CD配置",
            "code": """# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: testpass
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports: ['5432:5432']
      redis:
        image: redis:7-alpine
        ports: ['6379:6379']
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
          cache: 'pip'
      
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install pytest pytest-asyncio pytest-cov
      
      - name: Lint and format check
        run: |
          pip install ruff black
          ruff check .
          black --check .
      
      - name: Run tests with coverage
        env:
          DATABASE_URL: postgresql+asyncpg://postgres:testpass@localhost:5432/testdb
          REDIS_URL: redis://localhost:6379/0
          OPENAI_API_KEY: ${{ secrets.OPENAI_TEST_KEY }}
        run: pytest --cov=app --cov-report=xml --cov-report=term
      
      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          file: ./coverage.xml

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=sha,prefix=,suffix=,format=short
            type=raw,value=latest,enable=${{ github.ref == 'refs/heads/main' }}
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          # 多阶段构建，减小镜像体积
          build-args: |
            BUILD_ENV=production

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - name: Deploy to VPS via SSH
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /opt/ai-app
            docker-compose pull
            docker-compose up -d --remove-orphans
            docker system prune -f
            echo \"部署完成: $(date)\""""
        },
        {
            "type": "text",
            "title": "部署方案：从原型到生产",
            "content": """<p><b>部署方案的选择取决于你的阶段、规模和预算。</b>没有\u201C最好的\u201D方案，只有\u201C最合适的\u201D方案。一个个人开发者用K8s是过度工程，一个独角兽公司用Vercel可能成本失控。</p><p><b>部署方案演进路线：</b></p><ol><li><b>Stage 0 - 原型验证：</b>Vercel（前端）+ Serverless Function（Vercel/Cloudflare Workers）+ 托管服务（Supabase + Pinecone）。零运维，按量付费，月成本<$50。</li><li><b>Stage 1 - 小规模生产：</b>Docker Compose + 单台云服务器（4核8G）。前端Nginx托管，后端Docker容器，PostgreSQL+Redis容器。月成本~$50-100。</li><li><b>Stage 2 - 中小规模：</b>K8s（托管如EKS/GKE）或Docker Swarm + 负载均衡 + 自动扩缩容。需要DevOps工程师。月成本~$500-2000。</li><li><b>Stage 3 - 大规模：</b>多可用区K8s + CDN + 对象存储 + 专有网络 + 监控告警 + 自动故障转移。月成本~$5000+。</li></ol><p><b>关键决策因素：</b></p><ul><li><b>流量模式：</b>稳定流量适合预留实例（便宜50%），突发流量适合自动扩容</li><li><b>合规要求：</b>数据不出境需选国内云（阿里云/腾讯云），跨国需多区域部署</li><li><b>团队规模：</b>1-3人小团队选托管服务，10+人可自建部分基础设施</li><li><b>SLA要求：</b>99.9%可用性需要冗余设计，99.99%需要多活架构</li></ul><p><b>类比：</b>部署就像开餐厅选场地。原型阶段是夜市摆摊（Vercel/serverless，随摆随收）。小规模是租个小店面（单台服务器，够用就行）。中等规模是连锁加盟（K8s，标准化复制）。大规模是米其林集团（多区域、多品牌、中央厨房、严格品控）。</p>"""
        },
        {
            "type": "table",
            "title": "部署方案全面对比",
            "content": """<table><tr><th>方案</th><th>复杂度</th><th>月成本</th><th>扩展性</th><th>运维负担</th><th>适用阶段</th></tr><tr><td>Vercel + Serverless</td><td>\u2605\u2606\u2606\u2606\u2606</td><td>$0-50</td><td>\u2605\u2605\u2605\u2605\u2605</td><td>\u2605\u2606\u2606\u2606\u2606</td><td>原型/MVP</td></tr><tr><td>Docker Compose + VPS</td><td>\u2605\u2605\u2606\u2606\u2606</td><td>$50-200</td><td>\u2605\u2605\u2606\u2606\u2606</td><td>\u2605\u2605\u2605\u2606\u2606</td><td>小规模生产</td></tr><tr><td>K8s托管 (EKS/GKE)</td><td>\u2605\u2605\u2605\u2605\u2606</td><td>$500-3000</td><td>\u2605\u2605\u2605\u2605\u2605</td><td>\u2605\u2605\u2605\u2605\u2605</td><td>中大规模</td></tr><tr><td>Serverless (Lambda/CF)</td><td>\u2605\u2605\u2606\u2606\u2606</td><td>$0-500</td><td>\u2605\u2605\u2605\u2605\u2605</td><td>\u2605\u2605\u2606\u2606\u2606</td><td>API后端/间歇流量</td></tr><tr><td>云平台PaaS (Heroku/Railway)</td><td>\u2605\u2605\u2606\u2606\u2606</td><td>$50-500</td><td>\u2605\u2605\u2605\u2606\u2606</td><td>\u2605\u2605\u2606\u2606\u2606</td><td>小团队快速上线</td></tr><tr><td>裸金属服务器</td><td>\u2605\u2605\u2605\u2605\u2605</td><td>$200-1000</td><td>\u2605\u2605\u2605\u2606\u2606</td><td>\u2605\u2605\u2605\u2605\u2605</td><td>GPU推理/特殊需求</td></tr></table><p><b>推荐组合：</b>个人开发者→Vercel + Supabase + Pinecone；小团队→Railway/Render + Neon + Pinecone；中小企业→EKS + RDS + OpenSearch；大企业→自建K8s + 多区域 + 混合云。</p>"""
        },
        {
            "type": "text",
            "title": "性能优化：让AI应用飞起来",
            "content": """<p><b>性能优化是用户体验的生命线。</b>研究显示：页面加载每延迟1秒，转化率下降7%。LLM应用尤其敏感——用户已经习惯了ChatGPT的\u201C秒回\u201D，如果你的应用卡3秒，用户就会流失。</p><p><b>AI应用性能优化四维模型：</b></p><ul><li><b>前端优化：</b>首屏加载（SSR/SSG）、代码分割（Code Splitting）、图片懒加载、字体预加载。Next.js的App Router天然支持React Server Components，减少客户端JS体积。</li><li><b>网络优化：</b>CDN加速静态资源（Cloudflare/Vercel Edge）、Gzip/Brotli压缩、HTTP/2、Keep-Alive连接、DNS预解析。API响应开启压缩可减少60%传输量。</li><li><b>后端优化：</b>数据库连接池（不要每次请求新建连接）、Redis缓存热点数据、API结果缓存（相同问题直接返缓存）、Nginx反向代理+静态文件服务、LLM结果流式返回（不要等全生成完）。</li><li><b>LLM优化：</b>缓存常见问题的回答（Redis TTL=5min）、Prompt压缩（减少Token数）、选择合适模型（gpt-3.5-turbo处理简单问题，gpt-4只处理复杂问题）、批量处理（批量Embedding比单个快10倍）、模型量化（INT8/INT4推理速度提升2-4倍）。</li></ul><p><b>类比：</b>性能优化就像餐厅的效率提升。前端优化是菜单设计简洁、上菜速度快（用户不用等）。网络优化是外卖配送路线优化（数据传输快）。后端优化是厨房流水线改造（厨师不闲着）。LLM优化是：常见菜品提前备好（缓存），简单菜让学徒做（gpt-3.5），复杂菜让主厨做（gpt-4），而且主厨边说边传菜（streaming）而不是等全说完了再传。</p>"""
        },
        {
            "type": "table",
            "title": "性能优化技术清单",
            "content": """<table><tr><th>优化层级</th><th>技术</th><th>效果</th><th>实施难度</th><th>优先级</th></tr><tr><td>前端</td><td>SSR/SSG + RSC</td><td>FCP降低50%</td><td>低</td><td>P0</td></tr><tr><td>前端</td><td>Code Splitting + Lazy Load</td><td>JS体积减60%</td><td>低</td><td>P0</td></tr><tr><td>网络</td><td>CDN + Brotli压缩</td><td>传输减70%</td><td>低</td><td>P0</td></tr><tr><td>后端</td><td>Redis缓存LLM结果</td><td>重复查询<50ms</td><td>中</td><td>P1</td></tr><tr><td>后端</td><td>PostgreSQL连接池</td><td>并发提升5倍</td><td>低</td><td>P1</td></tr><tr><td>后端</td><td>DB索引优化</td><td>查询快10-100倍</td><td>中</td><td>P1</td></tr><tr><td>LLM</td><td>流式响应</td><td>TTFT<1s</td><td>低</td><td>P0</td></tr><tr><td>LLM</td><td>模型路由（3.5/4切换）</td><td>成本减70%</td><td>中</td><td>P1</td></tr><tr><td>LLM</td><td>批量Embedding</td><td>吞吐提升10倍</td><td>低</td><td>P1</td></tr><tr><td>LLM</td><td>量化推理 (INT8)</td><td>速度提升2-4倍</td><td>中</td><td>P2</td></tr><tr><td>LLM</td><td>Prompt压缩</td><td>Token成本减30%</td><td>中</td><td>P2</td></tr></table><p><b>FCP = First Contentful Paint（首屏内容绘制时间），TTFT = Time To First Token（首个Token返回时间）。</b>P0=必须做，P1=尽快做，P2=有空做。</p>"""
        },
        {
            "type": "text",
            "title": "监控与告警：系统的\u201C健康体检\u201D",
            "content": """<p><b>没有监控的系统就像没有体检的人——你不知道什么时候会出问题。</b>生产环境必须监控三类指标：系统指标（CPU/内存/磁盘）、业务指标（API延迟/错误率/吞吐量）、AI指标（LLM Token消耗/成本/生成质量）。</p><p><b>监控体系架构：</b></p><ul><li><b>指标采集：</b>Prometheus（时序数据库）采集应用指标，Node Exporter采集系统指标，cAdvisor采集容器指标。</li><li><b>可视化：</b>Grafana配置仪表盘，实时展示：QPS曲线、P99延迟、错误率、Token消耗趋势、用户活跃度。</li><li><b>日志收集：</b>ELK Stack（Elasticsearch + Logstash + Kibana）或Loki（轻量级，适合K8s）。日志结构化（JSON格式），包含trace_id便于追踪全链路。</li><li><b>告警通知：</b>Alertmanager配置告警规则：API错误率>1%持续5分钟→PagerDuty/钉钉/飞书/Slack。LLM调用失败率>5%→立即通知。</li><li><b>链路追踪：</b>Jaeger/Zipkin追踪请求从入口到LLM API的全链路，定位瓶颈。</li></ul><p><b>AI应用特有的监控指标：</b></p><ul><li><b>Token效率：</b>每美元产生的有效Token数，衡量Prompt工程效果</li><li><b>回答质量分：</b>用LLM-as-Judge定期评估回答质量，分数下降触发告警</li><li><b>幻觉率：</b>RAG场景中，回答引用来源不匹配的比例</li><li><b>用户满意度：</b>点赞/点踩比例，连续对话轮数，会话时长</li></ul><p><b>类比：</b>监控就像餐厅的运营仪表盘。厨师长（开发者）需要知道：今天来了多少客人（QPS），每道菜平均等多久（延迟），有几桌客人投诉（错误率），今天用了多少食材（Token消耗），哪道菜最受欢迎（用户满意度）。如果投诉率突然升高，立刻通知经理（告警）。如果某道菜等太久，需要看是厨房哪个环节卡住了（链路追踪）。</p>"""
        },
        {
            "type": "code",
            "title": "监控指标埋点代码",
            "code": """from prometheus_client import Counter, Histogram, Gauge, start_http_server
import time

# 定义指标
REQUEST_COUNT = Counter('http_requests_total', 'Total HTTP requests', ['method', 'endpoint', 'status'])
REQUEST_LATENCY = Histogram('http_request_duration_seconds', 'Request latency', ['endpoint'])
ACTIVE_CONNECTIONS = Gauge('active_connections', 'Current active connections')
LLM_TOKEN_USAGE = Counter('llm_tokens_total', 'Total LLM tokens used', ['model', 'type'])
LLM_COST = Counter('llm_cost_usd_total', 'Total LLM cost in USD', ['model'])
LLM_LATENCY = Histogram('llm_generation_duration_seconds', 'LLM generation time', ['model'])
RAG_RETRIVAL_SCORE = Histogram('rag_retrieval_score', 'Retrieval relevance score')

class MetricsMiddleware:
    \"\"\"FastAPI中间件：自动采集所有请求指标\"\"\"
    async def __call__(self, request, call_next):
        start = time.time()
        ACTIVE_CONNECTIONS.inc()
        
        response = await call_next(request)
        
        duration = time.time() - start
        ACTIVE_CONNECTIONS.dec()
        
        REQUEST_COUNT.labels(
            method=request.method,
            endpoint=request.url.path,
            status=response.status_code
        ).inc()
        REQUEST_LATENCY.labels(endpoint=request.url.path).observe(duration)
        
        return response

class LLMMetrics:
    \"\"\"LLM调用指标采集\"\"\"
    @staticmethod
    def record_usage(model: str, input_tokens: int, output_tokens: int, cost_usd: float, latency: float):
        LLM_TOKEN_USAGE.labels(model=model, type='input').inc(input_tokens)
        LLM_TOKEN_USAGE.labels(model=model, type='output').inc(output_tokens)
        LLM_COST.labels(model=model).inc(cost_usd)
        LLM_LATENCY.labels(model=model).observe(latency)
    
    @staticmethod
    def record_rag_score(score: float):
        RAG_RETRIVAL_SCORE.observe(score)

# Prometheus告警规则（prometheus.yml）
ALERT_RULES = \"\"\"
groups:
  - name: ai_app_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~\"5..\"}[5m]) > 0.01
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: \"API错误率过高\"
          description: \"错误率 {{ $value | humanizePercentage }} 超过 1%\"
      
      - alert: HighLatency
        expr: histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m])) > 5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: \"API P99延迟过高\"
          description: \"P99延迟 {{ $value }}s 超过 5秒\"
      
      - alert: LLMHighCost
        expr: rate(llm_cost_usd_total[1h]) > 10
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: \"LLM费用异常\"
          description: \"每小时LLM费用 ${{ $value }} 超过预算\"
      
      - alert: LLMFailureRate
        expr: rate(llm_generation_errors_total[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: \"LLM调用失败率过高\"
\"\"\"

# 启动Prometheus metrics端点
if __name__ == \"__main__\":
    start_http_server(9090)  # /metrics 端点
    print(\"Metrics server started on :9090\")"""
        },
        {
            "type": "text",
            "title": "安全实践：保护AI应用的\u201C护城河\u201D",
            "content": """<p><b>安全不是可选项，而是底线。</b>AI应用面临特有的安全挑战：API Key泄露、Prompt Injection、模型滥用、数据隐私、DDoS攻击。一次安全事件可能导致：API Key被盗用产生$10万账单、用户数据泄露、模型被诱导生成有害内容。</p><p><b>核心安全策略：</b></p><ul><li><b>认证与授权：</b>JWT Token + Refresh Token机制，Access Token短期（15分钟），Refresh Token长期（7天）。API Key采用前缀+哈希存储（如sk-app-xxx），只展示一次，丢失后重新生成。RBAC权限控制：普通用户/Pro用户/管理员/系统管理员四级权限。</li><li><b>输入安全：</b>Prompt Injection防护——对用户输入进行过滤和转义，禁止包含\u201C系统提示词覆盖\u201D类攻击。输出内容过滤——用Moderation API检测有害内容，敏感词库过滤。文件上传限制——类型白名单（pdf/doc/txt），大小限制（10MB），病毒扫描（ClamAV）。</li><li><b>API安全：</b>速率限制（Rate Limiting）——按用户等级限制：免费60次/分钟，Pro 300次/分钟。IP限流——单IP 100次/分钟。CORS白名单——只允许配置的域名访问。HTTPS强制——HSTS头，TLS 1.3。请求签名——防止重放攻击。</li><li><b>数据安全：</b>敏感数据加密存储（AES-256），传输加密（TLS 1.3），PII脱敏（用户姓名、电话、身份证号自动脱敏），日志脱敏（不在日志中记录用户输入和LLM输出中的敏感信息）。</li><li><b>供应链安全：</b>依赖扫描（Dependabot/Snyk），固定依赖版本（requirements.txt指定具体版本），容器镜像扫描（Trivy），Secret检测（GitHub Secret Scanning防止API Key提交到Git）。</li></ul><p><b>类比：</b>安全就像餐厅的安保系统。认证授权是会员卡系统（谁可以进、可以点什么菜）。输入安全是食材检验（防止有毒食材进入厨房）。API安全是客流控制（防止拥挤、防止有人恶意占座）。数据安全是客户隐私保护（不泄露客户的饮食偏好和联系方式）。供应链安全是供应商审核（确保送来的食材没问题）。</p>"""
        },
        {
            "type": "code",
            "title": "安全中间件实现",
            "code": """from fastapi import Request, HTTPException, status
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import jwt
from datetime import datetime, timedelta
import re

# 1. 速率限制
limiter = Limiter(key_func=get_remote_address)

@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request, exc):
    return JSONResponse(
        status_code=429,
        content={\"error\": \"请求过于频繁，请稍后再试\", \"retry_after\": 60}
    )

@app.post(\"/chat\")
@limiter.limit(\"60/minute\")  # 每IP每分钟60次
async def chat(request: Request, ...):
    pass

# 2. Prompt Injection 检测
class PromptInjectionDetector:
    \"\"\"检测用户输入是否包含Prompt Injection攻击\"\"\"
    PATTERNS = [
        r\"ignore\s+(?:all|previous)\s+instructions\",
        r\"system\s*:\\s*you\s+are\s+now\",
        r\"\\[\\s*system\\s*\\]\",
        r\"ignore\s+the\s+above\",
        r\"you\s+are\s+an\s+?unrestricted\s+AI\",
        r\"DAN\s*\\\",  # Do Anything Now
        r\"jailbreak\",
    ]
    
    @classmethod
    def is_injection(cls, text: str) -> tuple[bool, str]:
        text_lower = text.lower()
        for pattern in cls.PATTERNS:
            if re.search(pattern, text_lower, re.IGNORECASE):
                return True, f\"检测到潜在的Prompt Injection攻击: {pattern}\"
        return False, \"\"

# 3. PII脱敏
class PIISanitizer:
    \"\"\" personally identifiable information 脱敏 \"\"\"
    PATTERNS = {
        \"phone\": re.compile(r\"1[3-9]\\d{9}\"),  # 中国手机号
        \"email\": re.compile(r\"[\\w.-]+@[\\w.-]+\\.\\w+\"),
        \"id_card\": re.compile(r\"\\d{17}[\\dXx]|\\d{15}\"),  # 身份证
        \"bank_card\": re.compile(r\"\\d{16,19}\"),  # 银行卡
    }
    
    @classmethod
    def sanitize(cls, text: str) -> str:
        for name, pattern in cls.PATTERNS.items():
            if name == \"phone\":
                text = pattern.sub(lambda m: m.group()[:3] + \"****\" + m.group()[-4:], text)
            elif name == \"email\":
                text = pattern.sub(lambda m: m.group().split('@')[0][:2] + \"***@\" + m.group().split('@')[1], text)
            elif name == \"id_card\":
                text = pattern.sub(lambda m: m.group()[:6] + \"********\" + m.group()[-4:], text)
            else:
                text = pattern.sub(lambda m: m.group()[:4] + \"****\" + m.group()[-4:], text)
        return text

# 4. JWT认证中间件
async def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[\"HS256\"])
        if payload.get(\"exp\") < datetime.utcnow().timestamp():
            raise HTTPException(status_code=401, detail=\"Token已过期\")
        return payload
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail=\"无效的Token\")

# 5. 请求签名验证（防重放）
import hmac
import hashlib

class RequestSigner:
    \"\"\"API请求签名验证\"\"\"
    @staticmethod
    def sign(payload: str, secret: str, timestamp: str) -> str:
        message = f\"{timestamp}.{payload}\"
        return hmac.new(secret.encode(), message.encode(), hashlib.sha256).hexdigest()
    
    @staticmethod
    def verify(signature: str, payload: str, secret: str, timestamp: str, max_age=300) -> bool:
        # 检查时间戳（防止重放）
        if abs(int(timestamp) - int(time.time())) > max_age:
            return False
        expected = RequestSigner.sign(payload, secret, timestamp)
        return hmac.compare_digest(signature, expected)

# 6. CORS安全配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=[\"https://app.example.com\", \"https://admin.example.com\"],  # 白名单，非*
    allow_credentials=True,
    allow_methods=[\"GET\", \"POST\", \"PUT\", \"DELETE\"],  # 非*
    allow_headers=[\"Authorization\", \"Content-Type\", \"X-Request-Signature\"],
    max_age=600,
)"""
        },
        {
            "type": "example",
            "title": "完整项目实战：从0到1部署AI问答系统",
            "content": """<p><b>场景：</b>你要为公司部署一个内部AI知识库问答系统，支持员工上传PDF/Word文档，通过RAG检索回答业务问题。</p><p><b>Step 1 - 基础设施准备：</b>购买一台4核8G云服务器（~$40/月），安装Docker和Docker Compose。配置域名（ai-docs.company.com）和SSL证书（Let's Encrypt）。</p><p><b>Step 2 - 代码准备：</b>克隆项目代码，创建.env文件配置：DATABASE_URL、REDIS_URL、OPENAI_API_KEY、PINECONE_API_KEY。确保.gitignore包含.env。</p><p><b>Step 3 - 数据库初始化：</b>运行docker-compose up -d postgres redis，执行alembic upgrade head迁移数据库。创建初始管理员账号。</p><p><b>Step 4 - 向量库初始化：</b>在Pinecone创建索引（dimension=1536，metric=cosine），上传初始文档集。验证检索效果。</p><p><b>Step 5 - 构建与部署：</b>docker-compose build后docker-compose up -d。配置Nginx反向代理（SSL + 压缩 + 缓存头）。</p><p><b>Step 6 - 监控配置：</b>Prometheus采集指标，Grafana导入预置仪表盘。配置Alertmanager告警规则（错误率、延迟、费用）。</p><p><b>Step 7 - 上线验证：</b>通过健康检查接口确认服务正常。执行端到端测试：上传PDF→提问→验证回答。监控首周数据，调优参数。</p><p><b>成本预估：</b>服务器$40/月 + 域名$10/年 + Pinecone免费层（10万向量） + OpenAI API按量（1000次/月≈$20）。首月总成本约$60。</p>"""
        },
        {
            "type": "exercise",
            "title": "实战练习：搭建个人AI应用",
            "content": """<p><b>练习1：</b>使用Next.js + FastAPI + Chroma搭建一个本地运行的AI问答应用。要求：前端支持流式响应显示，后端支持多模型切换（gpt-3.5和gpt-4），向量库支持上传PDF后检索问答。</p><p><b>练习2：</b>为练习1的应用添加Docker Compose配置，包含：PostgreSQL、Redis、后端服务、前端服务。编写GitHub Actions CI/CD流水线，实现提交后自动测试和构建Docker镜像。</p><p><b>练习3：</b>在练习2基础上添加Prometheus监控，采集API延迟、LLM Token消耗、向量检索命中率等指标。配置Grafana仪表盘展示这些数据。</p><p><b>练习4：</b>为练习3添加安全中间件：JWT认证、速率限制（60次/分钟）、Prompt Injection检测、CORS白名单。编写测试用例验证每个安全功能。</p><p><b>挑战：</b>将应用部署到任意云平台（Vercel + Railway + Pinecone），实现公开访问。记录部署过程和遇到的问题。</p>""",
            "answer": """<p><b>练习1提示：</b>前端使用React的useState管理消息列表，用EventSource接收SSE流。后端用FastAPI的StreamingResponse返回生成流。Chroma用from_documents加载PDF后的文本块。</p><p><b>练习2提示：</b>Dockerfile用多阶段构建（node builder → nginx runner for frontend, python slim for backend）。docker-compose.yml定义服务依赖关系。GitHub Actions用services定义PostgreSQL和Redis测试容器。</p><p><b>练习3提示：</b>Prometheus客户端库prometheus-client，FastAPI中间件自动采集。Grafana导入JSON模型定义仪表盘。告警规则用Prometheus Alertmanager配置。</p><p><b>练习4提示：</b>JWT用pyjwt库，密码用bcrypt哈希。速率限制用slowapi或自定义Redis计数器。Prompt Injection检测用正则表达式库。CORS中间件配置具体域名而非通配符。</p>"""
        }
    ]
}

with open('crashai-expanded/course-21.json', 'w', encoding='utf-8') as f:
    json.dump(course_21, f, ensure_ascii=False, indent=2)

print(f\"Course 21 written: {len(course_21['sections'])} sections\")
""", 