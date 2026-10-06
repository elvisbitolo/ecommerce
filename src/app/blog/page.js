import Link from "next/link";
import { prisma } from "../../lib/prisma";

export const revalidate = 3600;
export const metadata = { title: "From Our Blog | United Tools Ltd" };

export default async function BlogPage() {
  const posts = await prisma.post.findMany({ orderBy: { publishedAt: "desc" }, take: 48 });
  return (
    <main style={{ maxWidth: 1320, marginInline: "auto", paddingInline: 15, paddingBlock: "36px 70px", minHeight: "70vh" }}>
      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#768088" }}>Ideas from our team</p>
      <h1 style={{ margin: "10px 0 0", fontSize: "clamp(24px,3vw,40px)", fontWeight: 800 }}>From the blog</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginTop: 28 }}>
        {posts.map((post) => (
          <article key={post.id} style={{ border: "1px solid #eceef0", borderRadius: 10, overflow: "hidden", background: "#fff" }}>
            <Link href={`/blog/${post.slug}`} style={{ aspectRatio: "16/10", position: "relative", display: "block", background: "#f1f3f5" }}>
              {post.coverUrl ? <ImageTag src={post.coverUrl} alt="" /> : null}
            </Link>
            <div style={{ padding: "16px 18px" }}>
              <p style={{ margin: 0, fontSize: 11.5, fontWeight: 700, color: "#2c81c1", textTransform: "uppercase", letterSpacing: "0.1em" }}>{post.category || "Guides"}</p>
              <h2 style={{ margin: "8px 0 0", fontSize: 18, fontWeight: 700, lineHeight: 1.25 }}><Link href={`/blog/${post.slug}`} style={{ color: "inherit" }}>{post.title}</Link></h2>
              <small style={{ display: "block", marginTop: 10, color: "#768088", fontSize: 12.5 }}>
                {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" })} · by {post.author}
              </small>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

import Image from "next/image";
function ImageTag({ src, alt }) {
  return <Image src={src} alt={alt} fill sizes="420px" style={{ objectFit: "cover" }} />;
}