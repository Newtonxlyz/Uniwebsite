// /blog/edit/[id] - 编辑文章
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { getPostById } from "@/lib/posts";
import { PostEditor } from "@/components/post-editor";

export const metadata = { title: "编辑文章 · 博客" };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    redirect(`/login?redirect=/blog/edit/${id}`);
  }

  const post = await getPostById(id);
  if (!post) notFound();
  const user = session.user;
  const isAuthor = post.authorId === user.id;
  const isAdmin = ["ADMIN", "SUPERADMIN", "EDITOR"].includes((user as { role?: string }).role || "");
  if (!isAuthor && !isAdmin) {
    redirect("/blog");
  }

  return (
    <div className="min-h-screen pt-24 px-6 pb-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-white mb-2">✏️ 编辑文章</h1>
        <p className="text-gray-400 mb-8">{post.title}</p>
        <PostEditor
          mode="edit"
          post={{
            id: post.id,
            title: post.title,
            content: post.content,
            excerpt: post.excerpt || "",
            coverImage: post.coverImage || "",
            category: post.category as any,
            tags: post.tags || "",
            status: post.status as any,
            allowComments: post.allowComments,
            embeds: post.embeds || "",
          }}
        />
      </div>
    </div>
  );
}
