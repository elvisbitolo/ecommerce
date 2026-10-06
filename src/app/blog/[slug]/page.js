import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "../../../lib/prisma";

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug }, select: { title: true, excerpt: true } });
  return { title: `${post?.title ?? "Post"} | United Tools Ltd`, description: post?.excerpt };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) notFound();

  return (
    <main style={{ maxWidth: 860, marginInline: "auto", paddingInline: 15, paddingBlock: "40px 90px", minHeight: "70vh" }}>
      <Link href="/blog" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, color: "#004798" }}>
        <ArrowLeft size={15} /> Back to blog
      </Link>
      <div style={{ marginTop: 20 }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#2c81c1", textTransform: "uppercase", letterSpacing: "0.1em" }}>{post.category || "Guides"}</p>
        <h1 style={{ margin: "10px 0 0", fontSize: "clamp(26px,4vw,42px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em" }}>{post.title}</h1>
        <p style={{ margin: "12px 0 0", fontSize: 13.5, color: "#768088" }}>
          {post.author} · {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>
      {post.coverUrl && (
        <div style={{ position: "relative", aspectRatio: "16/9", marginTop: 26, borderRadius: 12, overflow: "hidden" }}>
          <Image src={post.coverUrl} alt="" fill sizes="900px" style={{ objectFit: "cover" }} />
        </div>
      )}
      <div style={{ marginTop: 26, fontSize: 16.5, lineHeight: 1.8, color: "#22262a" }} dangerouslySetInnerHTML={{ __html: post.content || post.excerpt || "" }} />
    </main>
  );
}