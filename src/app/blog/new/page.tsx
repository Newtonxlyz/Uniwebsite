// /blog/new - 写新文章（需登录）
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PostEditor } from "@/components/post-editor";

export const metadata = { title: "写新文章 · 博客" };

export default async function NewPostPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    redirect("/login?redirect=/blog/new");
  }
  return (
    <div className="min-h-screen pt-24 px-6 pb-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-white mb-2">✍️ 写新文章</h1>
        <p className="text-gray-400 mb-8">分享你的技术笔记 / 学习心得 / 诗与远方</p>
        <PostEditor mode="create" />
      </div>
    </div>
  );
}
