# ITL Storefront

A JavaScript and Next.js storefront project modeled on the publicly visible catalog and shopping experience at [United Tools Ltd](https://utl.co.ke/). The implementation is being built in this repository and is not affiliated with or operated by United Tools Ltd.

## Project Status

The frontend prototype includes a responsive storefront, sample category and product routes, search/sort/filter controls, a browser-persisted enquiry list, a guest quotation form with WhatsApp handoff, and a separate admin dashboard preview. `/admin` and `/admin/dashboard` are unlinked from the public storefront and marked no-index. Admin controls are disabled; this UI is not authentication and does not protect admin data.

The database, complete catalog import, real checkout, payment processing, email, admin authentication, and order-management tools are not implemented or configured. Sample catalog content is a small frontend fixture, not a full or authoritative inventory.

The reference site has a broad industrial-tools catalog, category navigation, product listings, a checkout promotion, and a WhatsApp contact entry. Its homepage navigation includes Engineering - Tooling; Measuring, Marking & Testing; Tools & Accessories; Abrasives; Automotive Tools; Sealants & Lubricants; and Safety.

The public WordPress API reported 2,646 product records when checked on 2026-10-02. That catalog has not been exported into this project. The site's `robots.txt` specifies a 30-second crawl delay, so a full public crawl must be paced accordingly. Product copy, images, stock, shipping terms, and the reference site's active payment gateway still need confirmation before they can be reproduced accurately.

See [the product requirements document](docs/PRODUCT_REQUIREMENTS.md) for proposed scope, requirements, assumptions, and decisions that remain open.

## Technology

The current application foundation is:

- Next.js App Router
- React
- JavaScript (not TypeScript)
- CSS Modules for component-scoped styles
- Lucide React for interface icons

There is no database, authentication, payment, email, or server-backed product search configured. Supabase/PostgreSQL and a Kenya-capable M-Pesa gateway are proposals in the requirements document, not installed or approved integrations.

## Requirements

- Node.js compatible with the installed Next.js version
- npm

## Run Locally

From this directory, install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The development server uses the `src/app` directory.

## Available Commands

```bash
npm run dev    # Start the development server
npm run lint   # Run ESLint
npm run build  # Create a production build
npm start      # Serve the production build
```

Run `npm run build` before deploying. `npm start` requires a successful production build first.

## Project Structure

```text
src/
  app/
    globals.css       Global styles
    layout.js         Root layout and document metadata
    page.js           Home page
    storefront.js     Interactive storefront prototype
    storefront.module.css  Storefront styles
    admin/
      page.js          Unlinked admin sign-in preview
      sign-in.js       Admin preview UI
      admin.module.css Admin styles
      dashboard/       Unlinked dashboard preview
    category/[slug]/   Sample category pages
    product/[slug]/    Sample product details
    enquiry/           Guest quotation form
  components/          Shared catalog and enquiry UI
  data/catalog.js      Sample categories, products and hero slides
  lib/enquiry.js       Browser-only enquiry-list persistence
public/               Static assets
docs/
  PRODUCT_REQUIREMENTS.md
```

As the storefront grows, keep route-specific and component-specific styles in `.module.css` files. Keep global CSS for resets, fonts, and design tokens. Do not introduce TypeScript or a utility-CSS framework without an explicit project decision.

## Configuration and Secrets

No runtime environment variables are required by the frontend prototype. When database or payment integrations are approved, document their variable names in an `.env.example` file and keep real credentials in an untracked local `.env.local` or deployment secret store. Never expose database service-role keys, payment secrets, or webhook secrets in browser code or commit them to source control.

## Reference and Data Notes

The current reference is [utl.co.ke](https://utl.co.ke/). The implementation should use only product data and media that the project is authorized to use. The product-count observation is a point-in-time API count, not a local catalog export. Reference-site payment methods, exact shipping prices, inventory rules, and all product content have not yet been verified.

## Deployment

No production deployment is configured. Vercel is a proposed hosting option for the Next.js application; the production database, image storage, domains, payment credentials, and webhook URL must be configured and tested before accepting orders.
