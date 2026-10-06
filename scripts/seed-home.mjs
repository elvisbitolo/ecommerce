#!/usr/bin/env node
/**
 * Seeds the storefront's homepage/chrome content into Supabase:
 * hero slides, promotional home blocks, blog posts, settings, brand logos.
 *
 * Uses the public UTL site as the content reference. Idempotent (upserts).
 *
 * Usage: node scripts/seed-home.mjs
 */

import fs from "node:fs";
import { PrismaClient } from "@prisma/client";

const env = fs.readFileSync(".env", "utf8");
const match = env.match(/^DATABASE_URL="?([^"\n]+)"?/m);
if (!match) {
  console.error("DATABASE_URL not found in .env");
  process.exit(1);
}
process.env.DATABASE_URL = match[1];

const prisma = new PrismaClient();
const U = "https://utl.co.ke/wp-content/uploads";

async function upsert(model, rows) {
  for (const row of rows) {
    const { id, slug, ...data } = row;
    let where;
    if (id) where = { id };
    else if (slug) where = { slug };
    else {
      const key = (data.title || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .slice(0, 28)
        .replace(/^-+|-+$/g, "");
      where = { id: `seed-${model}-${row.menuOrder ?? 0}-${key}` };
    }
    await prisma[model].upsert({ where, create: data, update: data });
  }
}

// ── Hero slides (10) ─────────────────────────────────────────────
const heroSlides = [
  {
    eyebrow: "Machining Tools",
    title: "Mill. Slot. Shape",
    copy: "End Mills & Slot Drills in HSS or Carbide",
    ctaLabel: "Shop Now",
    href: "/category/engineering-machining-tooling-cutting/milling",
    imageUrl: `${U}/2026/06/slider-33-end-mills-and-slot-drills-utl.jpg`,
    menuOrder: 0,
  },
  {
    eyebrow: "We Don't Just Stock Abrasives",
    title: "We Know Surfaces",
    copy: "Solutions for cutting, grinding, blending, finishing, and polishing for a wide range of materials",
    ctaLabel: "Shop Now",
    href: "/category/abrasives",
    imageUrl: `${U}/2026/05/slider-32-abrasives-range-utl.jpg`,
    menuOrder: 1,
  },
  {
    eyebrow: "CLARKE PRO",
    badge: "NEW",
    title: "Digital Torque Wrench",
    copy: '1/4", 3/8" & 1/2" Sq. Drive',
    ctaLabel: "Shop Now",
    href: "/category/automotive-service-tools/torque-tools",
    imageUrl: `${U}/2025/11/slider-27-b-clarke-pro-digital-torque-wrench-utl.jpg`,
    menuOrder: 2,
  },
  {
    eyebrow: "HIGH-PERFORMANCE",
    title: "Grinding Wheels",
    copy: "Grey, Green & White grinding stones",
    ctaLabel: "Explore the Range",
    href: "/category/abrasives/grinding-wheels",
    imageUrl: `${U}/2026/04/slider-31-grinding-stones-utl.jpg`,
    menuOrder: 3,
  },
  {
    eyebrow: "EUROBOOR",
    title: "Safe & Ready to Work",
    copy: "Powerful Magnetic Drills",
    ctaLabel: "Explore the Range",
    href: "/category/engineering-machining-tooling-cutting/drilling-holemaking-cutters",
    imageUrl: `${U}/2025/11/slider-30-50mm-Magnetic-Drills-Euroboor-b-utl.jpg`,
    menuOrder: 4,
  },
  {
    eyebrow: "DENZEL",
    badge: "NEW",
    title: "Professional Air Tools",
    copy: "Air-Powered Productivity.",
    ctaLabel: "Shop Now",
    href: "/category/tools/air-tools",
    imageUrl: `${U}/2025/11/slider-29-NEW-ARRIVALS-DENZEL-b-utl.jpg`,
    menuOrder: 5,
  },
  {
    eyebrow: "New Arrival",
    title: "Digital Caliper 500mm",
    copy: "Dependable accuracy for every project with K-MET Tools",
    ctaLabel: "Shop Now",
    href: "/product/k-met-digital-caliper-500mm-6044-05-100",
    imageUrl: `${U}/2025/04/slider-26-K-MET-500mm-Digital-Caliper.jpg`,
    menuOrder: 6,
  },
  {
    eyebrow: "New Arrival",
    title: "Radiator Pressure Test",
    copy: 'Draper "Expert Quality" Cooling System Pressure Test Kit (32pc)',
    ctaLabel: "Shop Now",
    href: "/product/draper-radiator-and-cap-pressure-test-kit-32pcs-23420",
    imageUrl: `${U}/2025/04/slider-24-draper-radiator-pressure-test.jpg`,
    menuOrder: 7,
  },
  {
    eyebrow: "K-MET Dial Gauges",
    title: "Measure with Confidence",
    copy: "Problem: Precision. Solution: Reliable Dial Indicators",
    ctaLabel: "Shop Now",
    href: "/category/measuring-tools/indicators-magnetic-stands",
    imageUrl: `${U}/2025/04/slider-22-dial-gauge.jpg`,
    menuOrder: 8,
  },
  {
    title: "Lubrication just got easier",
    copy: "High-performance greasing. Maximize productivity, minimize downtime.",
    ctaLabel: "Shop Now",
    href: "/category/automotive-service-tools/lubrication-tools",
    imageUrl: `${U}/2024/03/slider-21.jpg`,
    menuOrder: 9,
  },
];

// ── Home blocks (promos, banners, price banner) ──────────────────
const homeBlocks = [
  // 3-up promo row between brand carousel and sections
  {
    placement: "promo-3up",
    eyebrow: "Euroboor",
    title: "Tungsten Carbide Rotary Burrs",
    copy: "Fast stock removal",
    ctaLabel: null,
    href: "/category/engineering-machining-tooling-cutting/dressers-burrs",
    imageUrl: `${U}/2025/05/banner-23-burrs.jpg`,
    menuOrder: 0,
  },
  {
    placement: "promo-3up",
    eyebrow: "WESAF",
    title: "Dye Penetrant Test Kit",
    copy: "Cleaner, Penetrant, Developer",
    href: "/product/wesaf-dye-penetrant-test-spray-3-part-kit-cleaner-penetrant-developer-400ml-2",
    imageUrl: `${U}/2025/05/banner-03-567x300-wesaf-dye-penetrant-testing-spray-cleaner-penetrant-developer-b.jpg`,
    menuOrder: 1,
  },
  {
    placement: "promo-3up",
    eyebrow: "New in Euroboor",
    title: "Lightest 30mm Machine",
    copy: "With Advanced Safety Features",
    href: "/product/euroboor-eco-30s-magnetic-drilling-machine-up-to-30mm-eco-30s",
    imageUrl: `${U}/2025/05/banner-02-567x300-euroboor-eco30s-mag-drill-b.jpg`,
    menuOrder: 2,
  },
  // 2-up banners midway
  {
    placement: "two-up",
    eyebrow: "A wide selection",
    title: "Woodworking Essentials",
    copy: "For professionals and DIY",
    ctaLabel: "Shop Now",
    href: "/search?tag=woodworking",
    imageUrl: `${U}/2024/03/banner-20-768x329-1.jpg`,
    menuOrder: 0,
  },
  {
    placement: "two-up",
    eyebrow: "For small to large projects",
    title: "Solutions for Building & Construction",
    copy: "Equipping you with tools you need",
    ctaLabel: "Shop Now",
    href: "/search?tag=construction",
    imageUrl: `${U}/2024/03/banner-21-768x329-b.jpg`,
    menuOrder: 1,
  },
  // price-carrying banner (hot products)
  {
    placement: "price-banner",
    eyebrow: "Rotary Barrel Hand Pumps",
    title: "Smooth, simple drum transfer",
    copy: "They are ideal for dispensing and transferring fluids of light to medium viscosity (Options available for chemicals, oil, water etc). Check fluid compatibility with pump type.",
    priceLabel: "KES 11,000/-",
    href: "/category/automotive-service-tools/lubrication-tools",
    imageUrl: `${U}/2024/03/banner-26b.jpg`,
    menuOrder: 0,
  },
  // full-width image strips
  {
    placement: "full-width",
    title: "High Quality Milling Cutters",
    href: "/category/engineering-machining-tooling-cutting/milling",
    imageUrl: `${U}/2024/03/banner-30.jpg`,
    menuOrder: 0,
  },
  {
    placement: "full-width",
    title: "Key Steel",
    href: "/search?q=key steel",
    imageUrl: `${U}/2024/03/banner-50.jpg`,
    menuOrder: 1,
  },
  {
    placement: "full-width",
    title: "Cutting & Grinding Discs",
    href: "/category/abrasives/abrasive-discs/cutting-grinding-discs",
    imageUrl: `${U}/2024/03/banner-40.jpg`,
    menuOrder: 2,
  },
  // grid banners (first cell of a product grid)
  {
    placement: "grid-banner",
    eyebrow: "OZAR",
    title: "Spring Calipers & Dividers",
    copy: 'Sizes up to 24" / 600mm',
    ctaLabel: "Shop NOW!",
    href: "/category/measuring-tools",
    imageUrl: `${U}/2025/07/grid-banner-3-spring-divider-inside-caliper.jpg`,
    menuOrder: 0,
  },
  {
    placement: "grid-banner",
    eyebrow: "OZAR",
    title: "Bench Vices",
    copy: '4" / 6" / 8"',
    ctaLabel: "Shop NOW!",
    href: "/category/engineering-machining-tooling-cutting",
    imageUrl: `${U}/2025/07/grid-banner-4-bench-vices.jpg`,
    menuOrder: 1,
  },
  {
    placement: "grid-banner",
    eyebrow: "High Performance",
    title: "Vehicle Service Tools",
    copy: "from Reliable, Trusted Brands",
    ctaLabel: "Shop NOW!",
    href: "/category/automotive-service-tools",
    imageUrl: `${U}/2025/07/grid-banner-5-vehicle-service-torque-wrench.jpg`,
    menuOrder: 2,
  },
  {
    placement: "grid-banner",
    eyebrow: "Great Performance",
    title: "Pink Vitrified Mounted Points",
    copy: "Highly Refined Aluminium Oxide",
    ctaLabel: "Shop NOW!",
    href: "/category/abrasives",
    imageUrl: `${U}/2024/03/grid-banner-1.jpg`,
    menuOrder: 3,
  },
  {
    placement: "grid-banner",
    eyebrow: "Sealants & Lubricants",
    title: "Adhesives & Industrial Chemicals",
    href: "/category/adhesives-sealants-tape",
    imageUrl: `${U}/2024/03/grid-banner-2.jpg`,
    menuOrder: 4,
  },
];

// ── Brand logos (homepage carousel, 20) ──────────────────────────
const brandLogos = [
  ["euroboor", "EUROBOOR-logo.png"],
  ["ozar", "Ozar-Alok-Tools-Logo.png"],
  ["k-met-kinex", "k-met-logo.png"],
  ["kennedy", "kennedy-logo.png"],
  ["norton-abrasives", "NORTON-logo.png"],
  ["wesaf", "WESAF-logo.png"],
  ["draper", "draper-new-logo.png"],
  ["clarke", "CLARKE-logo.png"],
  ["faithfull", "faithfull-logo.png"],
  ["makita", "MAKITA-logo.png"],
  ["ryobi", "RYOBI-logo.png"],
  ["sealey", "SEALEY-logo.png"],
  ["loctite", "loctite-logo.png"],
  ["metaform", "Metaform-logo.png"],
  ["denzel", "denzel-logo.png"],
  ["mtx", "MTX-logo.png"],
  ["addison", "addison-logo.png"],
  ["belzona", "belzona-logo.png"],
  ["senator", "SENATOR-logo.png"],
  ["sterling", "sterling-logo.png"],
];

// ── Settings ─────────────────────────────────────────────────────
const settings = [
  ["contact.phone", "+254 774 888373"],
  ["contact.whatsapp", "254774888373"],
  ["contact.email", "sales@utl.co.ke"],
  ["contact.address", "20 Butere Rd, Industrial Area, Nairobi"],
  [
    "contact.hours",
    "Monday to Friday – 08:00-16:30 / Saturday – 08:00-13:00 / Sundays & Public Holidays – Closed",
  ],
  ["promo.coupon", "UTL25NEW"],
  ["promo.coupon_detail", "Super discount for your first purchase — use discount code in the checkout!"],
  ["site.value_props", JSON.stringify([
    "Quality Products",
    "Competitive Pricing",
    "Dependable Team and Service",
    "Delivery All Over East Africa",
    "Your First Choice",
  ])],
  ["site.copyright", "Copyright 2026 © United Tools Ltd. All rights reserved."],
  ["search.trending", JSON.stringify([
    "Arbor", "PIPE", "denzel", "table", "bench grinder", "2026", "Tool", "Tool Bit",
  ])],
  ["site.newsletter_title", "Sign up to our newsletter to stay updated!"],
  ["site.newsletter_body", "Register now to be the first to know about new arrivals, offers, and promos. Don't worry, we will not spam you 🙂!"],
  ["footer.social", JSON.stringify([
    { label: "Facebook", href: "https://facebook.com/unitedtoolsltd", icon: "facebook" },
    { label: "Instagram", href: "https://instagram.com/unitedtoolsltdke", icon: "instagram" },
    { label: "WhatsApp", href: "https://wa.me/254774888373", icon: "whatsapp" },
    { label: "LinkedIn", href: "https://linkedin.com/company/united-tools-limited/", icon: "linkedin" },
    { label: "Twitter", href: "https://twitter.com/unitedtoolsltd", icon: "twitter" },
  ])],
];

// ── Posts (from reference blog) ──────────────────────────────────
async function fetchPosts() {
  const slugs = [
    "the-endless-possibilities-of-knurling",
    "from-stripping-to-finishing-with-just-one-disc",
    "now-you-can-work-smarter-without-working-harder-read-on",
    "introducing-belzona-1111-super-metal-an-epoxy-based-composite-for-metal-repair",
  ];
  const posts = [];
  for (const slug of slugs) {
    const res = await fetch(
      `https://utl.co.ke/wp-json/wp/v2/posts?slug=${slug}&_embed=1`,
      { headers: { "User-Agent": "itl-storefront-importer/1.0" } }
    );
    const rows = await res.json();
    const p = rows[0];
    if (!p) continue;
    const terms = p._embedded?.["wp:term"]?.flat() || [];
    const category =
      terms.find((t) => t.taxonomy === "category")?.name || "Uncategorized";
    const cover = p._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;
    posts.push({
      slug: p.slug,
      title: p.title.rendered.replace(/<[^>]*>/g, ""),
      excerpt: (p.excerpt?.rendered || "").replace(/<[^>]*>/g, "").trim().slice(0, 300) || null,
      content: p.content?.rendered || null,
      coverUrl: cover,
      category,
      author: "utl-online",
      publishedAt: p.date ? new Date(p.date) : null,
    });
  }
  return posts;
}

const posts = await fetchPosts();
console.log(`  fetched ${posts.length} blog posts`);

// ── Apply brand logos ────────────────────────────────────────────
let logosApplied = 0;
const allBrands = await prisma.brand.findMany({
  select: { id: true, slug: true, name: true },
});
function findBrand(ref) {
  return (
    allBrands.find((b) => b.slug === ref) ||
    allBrands.find((b) => b.name.toLowerCase() === ref.toLowerCase()) ||
    null
  );
}
for (const [ref, file] of brandLogos) {
  const brand = findBrand(ref);
  if (!brand) {
    console.log(`  (no brand row for logo ref "${ref}", skipped)`);
    continue;
  }
  await prisma.brand.update({
    where: { id: brand.id },
    data: { logoUrl: `${U}/2025/06/${file}` },
  });
  logosApplied++;
}

// ── Write everything ─────────────────────────────────────────────
await upsert("heroSlide", heroSlides);
await upsert("homeBlock", homeBlocks);
for (const [key, value] of settings) {
  await prisma.setting.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
}
for (const p of posts) {
  await prisma.post.upsert({ where: { slug: p.slug }, create: p, update: p });
}

console.log(
  `DONE: ${heroSlides.length} hero slides · ${homeBlocks.length} home blocks · ` +
    `${settings.length} settings · ${posts.length} posts · ${logosApplied}/20 brand logos`
);
await prisma.$disconnect();