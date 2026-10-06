import { prisma } from "./src/lib/prisma.js";
const rows = await prisma.product.findMany({ select: { id: true, slug: true, name: true, brand: { select: { name: true } }, categories: { select: { slug: true } } } });
const g = new Map();
for (const r of rows) {
  const k = `${r.brand?.name ?? ""}|${r.name}`.toLowerCase();
  if (!g.has(k)) g.set(k, []);
  g.get(k).push(r.slug);
}
const d = [...g.entries()].filter(([, v]) => v.length > 1);
console.log("total:", rows.length, "| remaining duplicate groups:", d.length);
console.log("sample remaining:", JSON.stringify(d.slice(0, 3)));
const badSlug = rows.filter(r => /-\d+$/.test(r.slug));
console.log("slugs with numeric suffix:", badSlug.length, JSON.stringify(badSlug.slice(0,5).map(r=>r.slug)));
console.log("categories:", await prisma.category.count());
await prisma.$disconnect();
