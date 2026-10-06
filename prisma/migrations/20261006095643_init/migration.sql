-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT,
    "count" INTEGER NOT NULL DEFAULT 0,
    "menuOrder" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" TEXT,
    "icon" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brands" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "website" TEXT,
    "count" INTEGER NOT NULL DEFAULT 0,
    "menuOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "sourceId" INTEGER,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT,
    "brandId" TEXT,
    "price" DECIMAL(12,2),
    "regularPrice" DECIMAL(12,2),
    "onSale" BOOLEAN NOT NULL DEFAULT false,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "shortDescription" TEXT,
    "description" TEXT,
    "images" TEXT[],
    "position" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'tag',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hero_slides" (
    "id" TEXT NOT NULL,
    "eyebrow" TEXT,
    "badge" TEXT,
    "title" TEXT NOT NULL,
    "copy" TEXT,
    "ctaLabel" TEXT NOT NULL DEFAULT 'Shop Now',
    "href" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "menuOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_slides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "home_blocks" (
    "id" TEXT NOT NULL,
    "placement" TEXT NOT NULL,
    "eyebrow" TEXT,
    "title" TEXT NOT NULL,
    "copy" TEXT,
    "priceLabel" TEXT,
    "ctaLabel" TEXT,
    "href" TEXT,
    "imageUrl" TEXT,
    "menuOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT,
    "coverUrl" TEXT,
    "category" TEXT,
    "author" TEXT NOT NULL DEFAULT 'utl-online',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "enquiries" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT,
    "notes" TEXT,
    "items" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "source" TEXT NOT NULL DEFAULT 'order-form',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "enquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletter_subscribers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "newsletter_subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CategoryToProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProductToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_parentId_menuOrder_idx" ON "categories"("parentId", "menuOrder");

-- CreateIndex
CREATE UNIQUE INDEX "brands_slug_key" ON "brands"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_sourceId_key" ON "products"("sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE INDEX "products_isPublished_position_idx" ON "products"("isPublished", "position");

-- CreateIndex
CREATE INDEX "products_brandId_idx" ON "products"("brandId");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- CreateIndex
CREATE INDEX "home_blocks_placement_menuOrder_idx" ON "home_blocks"("placement", "menuOrder");

-- CreateIndex
CREATE UNIQUE INDEX "posts_slug_key" ON "posts"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "enquiries_reference_key" ON "enquiries"("reference");

-- CreateIndex
CREATE INDEX "enquiries_status_createdAt_idx" ON "enquiries"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscribers_email_key" ON "newsletter_subscribers"("email");

-- CreateIndex
CREATE INDEX "_CategoryToProduct_B_index" ON "_CategoryToProduct"("B");

-- CreateIndex
CREATE INDEX "_ProductToTag_B_index" ON "_ProductToTag"("B");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToProduct" ADD CONSTRAINT "_CategoryToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToProduct" ADD CONSTRAINT "_CategoryToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToTag" ADD CONSTRAINT "_ProductToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToTag" ADD CONSTRAINT "_ProductToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ---------------------------------------------------------------------------
-- Supabase integration: grants, row level security, public image bucket.
-- Applied by Prisma Migrate; no SQL Editor needed.
-- ---------------------------------------------------------------------------

-- Catalog is readable by anonymous visitors (storefront / PostgREST).
grant select on table categories, brands, products, tags,
  "_CategoryToProduct", "_ProductToTag" to anon, authenticated;

-- Staff workspace tables: privileges granted, access gated by RLS below.
grant all on table hero_slides, home_blocks, posts, settings,
  enquiries, newsletter_subscribers to authenticated;

alter table categories enable row level security;
alter table brands enable row level security;
alter table products enable row level security;
alter table tags enable row level security;
alter table "_CategoryToProduct" enable row level security;
alter table "_ProductToTag" enable row level security;
alter table hero_slides enable row level security;
alter table home_blocks enable row level security;
alter table posts enable row level security;
alter table settings enable row level security;
alter table enquiries enable row level security;
alter table newsletter_subscribers enable row level security;

-- Superadmin (trusted app_metadata claim) manages everything.
drop policy if exists "Superadmins manage categories" on categories;
create policy "Superadmins manage categories" on categories for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin');

drop policy if exists "Superadmins manage brands" on brands;
create policy "Superadmins manage brands" on brands for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin');

drop policy if exists "Superadmins manage products" on products;
create policy "Superadmins manage products" on products for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin');

drop policy if exists "Superadmins manage tags" on tags;
create policy "Superadmins manage tags" on tags for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin');

drop policy if exists "Superadmins manage hero slides" on hero_slides;
create policy "Superadmins manage hero slides" on hero_slides for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin');

drop policy if exists "Superadmins manage home blocks" on home_blocks;
create policy "Superadmins manage home blocks" on home_blocks for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin');

drop policy if exists "Superadmins manage posts" on posts;
create policy "Superadmins manage posts" on posts for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin');

drop policy if exists "Superadmins manage settings" on settings;
create policy "Superadmins manage settings" on settings for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin');

-- Enquiries: written by the server (Prisma/owner), read by staff only.
drop policy if exists "Superadmins manage enquiries" on enquiries;
create policy "Superadmins manage enquiries" on enquiries for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin');

drop policy if exists "Superadmins manage subscribers" on newsletter_subscribers;
create policy "Superadmins manage subscribers" on newsletter_subscribers for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin');

-- Public catalog reads.
drop policy if exists "Published categories are public" on categories;
create policy "Published categories are public" on categories for select
  to anon, authenticated
  using ("isPublished" = true);

drop policy if exists "Published products are public" on products;
create policy "Published products are public" on products for select
  to anon, authenticated
  using ("isPublished" = true);

drop policy if exists "Brands are public" on brands;
create policy "Brands are public" on brands for select to anon, authenticated using (true);

drop policy if exists "Tags are public" on tags;
create policy "Tags are public" on tags for select to anon, authenticated using (true);

drop policy if exists "Product categories are public" on "_CategoryToProduct";
create policy "Product categories are public" on "_CategoryToProduct" for select
  to anon, authenticated
  using (exists (
    select 1 from products p where p.id = "_CategoryToProduct"."B" and p."isPublished" = true
  ));

drop policy if exists "Product tags are public" on "_ProductToTag";
create policy "Product tags are public" on "_ProductToTag" for select
  to anon, authenticated
  using (exists (
    select 1 from products p where p.id = "_ProductToTag"."B" and p."isPublished" = true
  ));

-- Public product image bucket (8 MB, raster images only).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 8388608,
        array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read product images" on storage.objects;
create policy "Public can read product images" on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

drop policy if exists "Superadmins upload product images" on storage.objects;
create policy "Superadmins upload product images" on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin');

drop policy if exists "Superadmins update product images" on storage.objects;
create policy "Superadmins update product images" on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin');

drop policy if exists "Superadmins delete product images" on storage.objects;
create policy "Superadmins delete product images" on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin');
