import { prisma } from "./prisma";

const productSelect = {
  id: true,
  slug: true,
  name: true,
  sku: true,
  brand: { select: { slug: true, name: true } },
  images: true,
  inStock: true,
};

const CATEGORY_TILE_IMAGES = {
  abrasives: "https://utl.co.ke/wp-content/uploads/2024/03/abrasives.png",
  "automotive-service-tools": "https://utl.co.ke/wp-content/uploads/2025/01/auto-maintenance.png",
  "engineering-machining-tooling-cutting": "https://utl.co.ke/wp-content/uploads/2024/03/tooling-engineering.png",
  ladders: "https://utl.co.ke/wp-content/uploads/2024/03/scaffolding-ladders.png",
  "measuring-tools": "https://utl.co.ke/wp-content/uploads/2024/03/measuring.png",
  "adhesives-sealants-tape": "https://utl.co.ke/wp-content/uploads/2024/03/adhesives-lubricants.png",
  tools: "https://utl.co.ke/wp-content/uploads/2024/03/power-hand-tools.png",
  "welding-equipment": "https://utl.co.ke/wp-content/uploads/2024/03/welding.png",
};

const GRID_BANNER_IMAGES = {
  "measuring-tools": "https://utl.co.ke/wp-content/uploads/2025/07/grid-banner-3-spring-divider-inside-caliper.jpg",
  "engineering-machining-tooling-cutting": "https://utl.co.ke/wp-content/uploads/2025/07/grid-banner-4-bench-vices.jpg",
  "automotive-service-tools": "https://utl.co.ke/wp-content/uploads/2025/07/grid-banner-5-vehicle-service-torque-wrench.jpg",
  abrasives: "https://utl.co.ke/wp-content/uploads/2024/03/grid-banner-1.jpg",
  "adhesives-sealants-tape": "https://utl.co.ke/wp-content/uploads/2024/03/grid-banner-2.jpg",
};

function mapProduct(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    sku: row.sku ?? "",
    brand: row.brand?.name ?? "",
    brandSlug: row.brand?.slug ?? "",
    image: row.images?.[0] ?? "",
    images: row.images ?? [],
    inStock: row.inStock,
  };
}

const hrefCache = new Map();
async function normalizeHrefs(rows) {
  return Promise.all(rows.map(async (row) => ({ ...row, href: await normalizeHref(row.href) })));
}
async function normalizeHref(href) {
  if (!href || href.startsWith("/search") || href.startsWith("https://") || href.startsWith("mailto:") || href.startsWith("tel:")) return href;
  if (hrefCache.has(href)) return hrefCache.get(href);

  let resolved = href;
  const productMatch = href.match(/^\/product\/([^/]+)$/);
  const categoryMatch = href.match(/^\/category\/(.+)$/);
  const tagMatch = href.match(/^\/tag\/(.+)$/);

  if (productMatch) {
    const found = await prisma.product.findUnique({ where: { slug: productMatch[1] }, select: { id: true } });
    if (!found) resolved = "/shop";
  } else if (categoryMatch) {
    const found = await prisma.category.findUnique({ where: { slug: categoryMatch[1] }, select: { id: true } });
    if (!found) resolved = "/shop";
  } else if (tagMatch) {
    const found = await prisma.tag.findUnique({ where: { slug: tagMatch[1] }, select: { id: true } });
    if (!found) resolved = "/shop";
  }

  hrefCache.set(href, resolved);
  return resolved;
}

function dedupeProducts(rows) {
  const seen = new Set();
  const unique = [];
  for (const row of rows) {
    const key = `${row.brand?.name ?? ""}|${row.name}`.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(row);
  }
  return unique;
}

function dedupeSlides(rows) {
  const seen = new Set();
  const unique = [];
  for (const row of rows) {
    const imageKey = row.imageUrl || `${row.title ?? ""}|${row.menuOrder ?? ""}`;
    if (seen.has(imageKey)) continue;
    seen.add(imageKey);
    unique.push(row);
  }
  return unique;
}

async function productsInCategories(slugs, take) {
  const rows = await prisma.product.findMany({
    where: { categories: { some: { slug: { in: slugs } } } },
    select: productSelect,
    orderBy: { position: "asc" },
    take,
  });
  return dedupeProducts(rows).map(mapProduct);
}

async function productsByBrand(brandSlug, take) {
  const rows = await prisma.product.findMany({
    where: { brand: { slug: brandSlug } },
    select: productSelect,
    orderBy: { position: "asc" },
    take,
  });
  return dedupeProducts(rows).map(mapProduct);
}

async function recentProducts(take) {
  const rows = await prisma.product.findMany({
    select: productSelect,
    orderBy: [{ position: "desc" }, { updatedAt: "desc" }],
    take,
  });
  return dedupeProducts(rows).map(mapProduct);
}

async function getHomeBlocks(placement) {
  return prisma.homeBlock.findMany({
    where: { placement, isPublished: true },
    orderBy: { menuOrder: "asc" },
    select: {
      eyebrow: true,
      title: true,
      copy: true,
      priceLabel: true,
      ctaLabel: true,
      href: true,
      imageUrl: true,
      menuOrder: true,
    },
  });
}

const DECK_SLUGS = {
  "Measuring, Marking & Testing": { category: "measuring-tools", tiles: 5, banner: "measuring-tools", href: "/category/measuring-tools" },
  "World Class Engineering Tools": { brand: "ozar-alok-tools", tiles: 5, banner: "engineering-machining-tooling-cutting", href: "/brand/ozar-alok-tools" },
  "Automotive Service Tools": { category: "automotive-service-tools", tiles: 5, banner: "automotive-service-tools", href: "/category/automotive-service-tools" },
  "High Performance Abrasives": { category: "abrasives", tiles: 5, banner: "abrasives", href: "/category/abrasives" },
  "Sealants, Adhesives, Lubricants & Industrial Chemicals": { category: "adhesives-sealants-tape", tiles: 5, banner: "adhesives-sealants-tape", href: "/category/adhesives-sealants-tape" },
};

export async function getHomeData() {
  const [
    heroSlides,
    categories,
    navCategories,
    brandRows,
    recent,
    blocks,
    featuredCategories,
    posts,
    settings,
    tags,
  ] = await Promise.all([
    prisma.heroSlide.findMany({ where: { isPublished: true }, orderBy: { menuOrder: "asc" } }),
    prisma.category.findMany({
      where: { isPublished: true, slug: { in: Object.keys(CATEGORY_TILE_IMAGES) } },
      orderBy: [{ menuOrder: "asc" }, { name: "asc" }],
    }),
    prisma.category.findMany({
      where: { isPublished: true, parentId: null },
      orderBy: [{ menuOrder: "asc" }, { name: "asc" }],
      take: 9,
      include: { children: { where: { isPublished: true }, orderBy: { menuOrder: "asc" }, take: 20 } },
    }),
    prisma.brand.findMany({
      where: { logoUrl: { not: "" } },
      orderBy: { menuOrder: "asc" },
      select: { slug: true, name: true, logoUrl: true },
    }),
    recentProducts(8),
    Promise.all([
      getHomeBlocks("promo-3up"),
      getHomeBlocks("grid-banner"),
      getHomeBlocks("full-width"),
      getHomeBlocks("price-banner"),
      getHomeBlocks("two-up"),
    ]),
    prisma.product.findMany({
      where: { categories: { some: { slug: { in: ["abrasives", "engineering-machining-tooling-cutting", "measuring-tools", "tools"] } } } },
      select: { ...productSelect, categories: true },
      orderBy: { position: "asc" },
      take: 320,
    }),
    prisma.post.findMany({ orderBy: { publishedAt: "desc" }, take: 4, select: { id: true, slug: true, title: true, category: true, author: true, coverUrl: true, excerpt: true, publishedAt: true, createdAt: true } }),
    prisma.setting.findMany(),
    prisma.tag.findMany({
      where: { slug: { in: ["market-building-and-construction", "market-automotive-aftermarket", "fabrication"] } },
      orderBy: { name: "asc" },
    }),
  ]);

  const [promo3up, gridBanner, fullWidth, priceBanner, twoUp] = blocks;

  const tileCategories = categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    count: c.count,
    imageUrl: c.imageUrl || CATEGORY_TILE_IMAGES[c.slug],
  }));

  const decks = Object.entries(DECK_SLUGS).map(async ([title, cfg]) => {
    const products = cfg.brand
      ? await productsByBrand(cfg.brand, cfg.tiles)
      : await productsInCategories([cfg.category], cfg.tiles);
    return {
      title,
      href: cfg.href,
      banner: {
        title: GRID_BANNER_TITLES[cfg.banner]?.title ?? "",
        eyebrow: GRID_BANNER_TITLES[cfg.banner]?.eyebrow ?? "",
        copy: GRID_BANNER_TITLES[cfg.banner]?.copy ?? "",
        imageUrl: GRID_BANNER_TITLES[cfg.banner]?.imageUrl ?? GRID_BANNER_IMAGES[cfg.banner] ?? "",
        priceLabel: "Shop",
        price: "NOW!",
      },
      products,
    };
  });
  const deckData = await Promise.all(decks);

  const uniqueFeatured = dedupeProducts(featuredCategories);
  const featuredByCat = (slug) =>
    uniqueFeatured.filter((p) => p.categories?.some((c) => c.slug === slug)).slice(0, 6).map(mapProduct);

  const settingMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  const featured = uniqueFeatured.filter((p) => p.categories?.some((c) => c.slug === "power-tools"));
  const powerTools = featured.length >= 6 ? featured.slice(0, 6) : await productsInCategories(["power-tools"], 6);

  const hotBannerBlock = priceBanner[0] ?? null;

  const [slides, p3, fw, tu, hotBanner] = await Promise.all([
    normalizeHrefs(dedupeSlides(heroSlides)),
    normalizeHrefs(promo3up),
    normalizeHrefs(fullWidth.slice(0, 3)),
    normalizeHrefs(twoUp),
    normalizeHref(hotBannerBlock?.href).then((href) => ({ ...(hotBannerBlock ?? {}), href })),
  ]);

  return {
    heroSlides: slides,
    tileCategories,
    brands: brandRows,
    industries: tags.slice(0, 8),
    navCategories,
    arrivals: recent.slice(0, 4),
    highlighted: uniqueFeatured.filter((p) => p.categories?.some((c) => c.slug === "abrasives")).slice(0, 4),
    promo3up: p3,
    fullWidth: fw,
    twoUp: tu,
    decks: deckData,
    couponCode: settingMap.coupon_code || "UTL25NEW",
    couponTitle: settingMap.coupon_title || "Super discount for your first purchase",
    couponNote: settingMap.coupon_note || "Use discount code in the checkout!",
    hotDeck: {
      banner: hotBanner,
      products: recent,
    },
    featured: [
      { slug: "abrasives", name: "Abrasives", products: featuredByCat("abrasives") },
      { slug: "engineering-machining-tooling-cutting", name: "Engineering - Tooling", products: featuredByCat("engineering-machining-tooling-cutting") },
      { slug: "measuring-tools", name: "Measuring, Marking & Testing", products: featuredByCat("measuring-tools") },
      { slug: "power-tools", name: "Power Tools", products: powerTools },
    ],
    posts,
    seo: {
      top: settingMap.seo_top_html || "",
      accordions: [
        { title: "Why Choose United Tools Limited, Kenya?", body: settingMap.seo_why ? [settingMap.seo_why] : [] },
        { title: "Professional Engineering Tools & Equipment Online Shopping in Kenya", body: settingMap.seo_body ? [settingMap.seo_body] : [] },
      ],
    },
    newsletterTitle: settingMap.newsletter_title || "Sign up to our newsletter to stay updated!",
    newsletterCopy: settingMap.newsletter_copy || "Register now to be the first to know about new arrivals, offers, and promos.",
    social: JSON.parse(settingMap.social_links || "{}"),
  };
}

const GRID_BANNER_TITLES = {
  "measuring-tools": {
    eyebrow: "OZAR",
    title: "Spring Calipers & Dividers",
    copy: 'Sizes up to 24" / 600mm',
    imageUrl: "https://utl.co.ke/wp-content/uploads/2025/07/grid-banner-3-spring-divider-inside-caliper.jpg",
  },
  "engineering-machining-tooling-cutting": {
    eyebrow: "OZAR",
    title: "Bench Vices",
    copy: '4" / 6" / 8"',
    imageUrl: "https://utl.co.ke/wp-content/uploads/2025/07/grid-banner-4-bench-vices.jpg",
  },
  "automotive-service-tools": {
    eyebrow: "High Performance",
    title: "Vehicle Service Tools",
    copy: "from Reliable, Trusted Brands",
    imageUrl: "https://utl.co.ke/wp-content/uploads/2025/07/grid-banner-5-vehicle-service-torque-wrench.jpg",
  },
  abrasives: {
    eyebrow: "Great Performance",
    title: "Pink Vitrified Mounted Points",
    copy: "Highly Refined Aluminium Oxide",
    imageUrl: "https://utl.co.ke/wp-content/uploads/2024/03/grid-banner-1.jpg",
  },
  "adhesives-sealants-tape": {
    eyebrow: "Sealants & Lubricants",
    title: "Adhesives & Industrial Chemicals",
    copy: "",
    imageUrl: "https://utl.co.ke/wp-content/uploads/2024/03/grid-banner-2.jpg",
  },
};