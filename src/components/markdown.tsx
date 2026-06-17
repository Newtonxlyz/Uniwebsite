// Markdown 渲染器（基于 react-markdown）
"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Props {
  content: string;
}

export function Markdown({ content }: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <h1 className="text-3xl font-bold text-white mt-8 mb-4">{children}</h1>,
        h2: ({ children }) => <h2 className="text-2xl font-bold text-white mt-6 mb-3">{children}</h2>,
        h3: ({ children }) => <h3 className="text-xl font-bold text-white mt-5 mb-2">{children}</h3>,
        p: ({ children }) => <p className="text-gray-300 leading-relaxed mb-4">{children}</p>,
        a: ({ children, href }) => (
          <a href={href} className="text-amber-400 hover:text-amber-300 underline" target="_blank" rel="noopener">
            {children}
          </a>
        ),
        ul: ({ children }) => <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 text-gray-300 space-y-1">{children}</ol>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-amber-500/50 pl-4 py-2 my-4 text-gray-400 italic">
            {children}
          </blockquote>
        ),
        code: ({ inline, className, children, ...props }: any) => {
          const match = /language-(\w+)/.exec(className || "");
          if (!inline && match) {
            return (
              <div className="my-4 rounded-lg overflow-hidden">
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)" }}
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            );
          }
          return (
            <code className="bg-white/10 text-amber-300 px-1.5 py-0.5 rounded text-sm" {...props}>
              {children}
            </code>
          );
        },
        img: ({ src, alt }) => (
          <img src={src} alt={alt} className="rounded-lg my-4 w-full" />
        ),
        table: ({ children }) => (
          <table className="w-full my-4 border border-white/10">{children}</table>
        ),
        th: ({ children }) => (
          <th className="border border-white/10 px-3 py-2 bg-white/5 text-left text-white">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-white/10 px-3 py-2 text-gray-300">{children}</td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
