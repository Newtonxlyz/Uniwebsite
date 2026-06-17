"use client";

// Next.js 16 全局错误边界
// 必须是 client component
// 不能 import 任何依赖 React context / Provider 的模块
// 不能使用 root layout（外层 layout 不渲染）
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="zh-CN">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#fff",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "1rem",
        }}
      >
        <div style={{ maxWidth: "32rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.75rem" }}>
            出了点问题
          </h1>
          <p style={{ color: "#999", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
            {error.message || "页面加载失败"}
          </p>
          <button
            onClick={reset}
            style={{
              padding: "0.5rem 1.5rem",
              background: "#4f46e5",
              color: "#fff",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            重试
          </button>
        </div>
      </body>
    </html>
  );
}
