// 留言组件
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { MessageCircle, Reply, Send, Trash2 } from "lucide-react";

interface Author {
  id: string;
  name: string;
  image?: string | null;
}

interface Comment {
  id: string;
  content: string;
  createdAt: Date | string;
  parentId?: string | null;
  author: Author;
  replies?: Comment[];
}

interface Props {
  postId: string;
  initialComments: Comment[];
  currentUser: Author | null;
}

export function CommentSection({ postId, initialComments, currentUser }: Props) {
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newContent, setNewContent] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newContent.trim() || !currentUser) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/blog/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newContent,
          parentId: replyTo || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert("留言失败: " + (err.error || res.statusText));
        return;
      }
      const newComment = await res.json();
      if (replyTo) {
        setComments(comments.map(c =>
          c.id === replyTo
            ? { ...c, replies: [...(c.replies || []), { ...newComment, replies: [] }] }
            : c
        ));
      } else {
        setComments([{ ...newComment, replies: [] }, ...comments]);
      }
      setNewContent("");
      setReplyTo(null);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("确定要删除这条留言吗？")) return;
    const res = await fetch(`/api/blog/posts/${postId}/comments?commentId=${commentId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      // 从列表中移除
      const removeFromList = (list: Comment[]): Comment[] =>
        list
          .filter(c => c.id !== commentId)
          .map(c => ({ ...c, replies: c.replies ? removeFromList(c.replies) : [] }));
      setComments(removeFromList(comments));
      router.refresh();
    } else {
      const err = await res.json();
      alert("删除失败: " + err.error);
    }
  };

  return (
    <div className="space-y-6">
      {/* 发表留言 */}
      {currentUser ? (
        <div className="glass-card p-4">
          {replyTo && (
            <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
              回复给某条留言
              <button
                onClick={() => setReplyTo(null)}
                className="text-rose-400 hover:text-rose-300"
              >
                取消
              </button>
            </div>
          )}
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="写下你的想法..."
            rows={3}
            className="w-full bg-transparent text-white placeholder-gray-500 resize-none focus:outline-none"
          />
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!newContent.trim() || submitting}
              className="flex items-center gap-1.5 px-4 py-1.5 text-sm bg-gradient-to-r from-amber-500 to-pink-500 text-white rounded-lg hover:scale-105 transition-transform disabled:opacity-50"
            >
              <Send className="h-3 w-3" />
              {submitting ? "发送中..." : "发表"}
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-card p-4 text-center text-sm text-gray-400">
          <Link href={`/login?redirect=/blog`} className="text-amber-300 hover:text-amber-200">
            登录
          </Link>
          {" "}后即可留言
        </div>
      )}

      {/* 留言列表 */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-gray-500 py-8">还没有留言，{currentUser ? "来抢沙发" : "登录后"}成为第一个吧 👋</p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUser={currentUser}
              onReply={() => setReplyTo(comment.id)}
              onDelete={() => handleDelete(comment.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function CommentItem({
  comment,
  currentUser,
  onReply,
  onDelete,
  depth = 0,
}: {
  comment: Comment;
  currentUser: Author | null;
  onReply: () => void;
  onDelete: () => void;
  depth?: number;
}) {
  const isAuthor = currentUser?.id === comment.author.id;
  const isAdmin = false; // TODO 从 currentUser.role 判断
  const canDelete = isAuthor || isAdmin;
  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
    locale: zhCN,
  });

  return (
    <div
      className="glass-card p-4"
      style={{ marginLeft: depth > 0 ? `${Math.min(depth * 16, 64)}px` : 0 }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white">
          {comment.author.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-white text-sm">{comment.author.name}</span>
            <span className="text-xs text-gray-500">{timeAgo}</span>
          </div>
          <p className="text-gray-300 text-sm whitespace-pre-wrap break-words">
            {comment.content}
          </p>
          <div className="mt-2 flex items-center gap-3 text-xs">
            {currentUser && depth < 2 && (
              <button
                onClick={onReply}
                className="flex items-center gap-1 text-gray-500 hover:text-amber-300"
              >
                <Reply className="h-3 w-3" />
                回复
              </button>
            )}
            {canDelete && (
              <button
                onClick={onDelete}
                className="flex items-center gap-1 text-gray-500 hover:text-rose-300"
              >
                <Trash2 className="h-3 w-3" />
                删除
              </button>
            )}
          </div>
        </div>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUser={currentUser}
              onReply={onReply}
              onDelete={onDelete}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
