# Product Requirements Document: ITL Storefront

**Status:** Draft for review  
**Version:** 0.1  
**Date:** 2026-10-02  
**Reference:** [United Tools Ltd](https://utl.co.ke/)

## 1. Summary

Build a responsive online storefront for industrial, engineering, workshop, automotive, and safety tools. The storefront should reproduce the important customer-facing structure and shopping flows visible on the reference site while using the project's required stack: Next.js, JavaScript, and CSS Modules.

This document describes the intended product and distinguishes it from the current frontend prototype. The storefront UI, responsive navigation, sample catalog, local search/category filtering, browser-persisted enquiry list, and WhatsApp enquiry action are implemented. The `/admin` route is an unlinked, no-index sign-in preview with disabled fields; it is not authentication or an access-control boundary. The database, full product import, server-backed search, checkout, payments, admin authentication, and order management are not implemented.

## 2. Product Goals

- Help trade and individual customers find the right tool through clear category navigation, search, filters, and product detail pages.
- Support a complete purchase journey: product discovery, cart, discount entry, delivery details, payment, and order confirmation.
- Make M-Pesa a first-class payment option for customers in Kenya, subject to merchant onboarding and gateway approval.
- Provide a clear WhatsApp contact path for product and order questions.
- Make product, stock, order, promotion, and delivery information maintainable without changing application code.
- Deliver indexable, responsive pages that work on mobile and desktop.

## 3. Users

- **Retail customer:** Browses products, compares specifications and prices, and places an order.
- **Trade/workshop buyer:** Searches for a specific tool, brand, or specification; may need help confirming suitability or delivery.
- **Store operator:** Maintains the catalog and stock, handles orders and payment status, and responds to customer questions.

## 4. Reference-Site Observations

These details were observed from the public homepage and navigation; they do not imply that the full catalog or all checkout behavior has been verified.

- The site presents a large tools and equipment catalog with hierarchical category navigation.
- Top-level navigation observed: Engineering - Tooling; Measuring, Marking & Testing; Tools & Accessories; Abrasives; Automotive Tools; Sealants & Lubricants; Safety.
- Example subcategories include cutting and sawing, drilling and holemaking, threading and tapping, milling, bore gauges, calipers, hand tools, power tools, air tools, abrasives, automotive service tools, and adhesives.
- The homepage includes product listings, a checkout discount promotion (`UTL25NEW`), and a WhatsApp contact entry.
- The site describes delivery across Kenya and parts of East Africa. Actual eligible destinations, rates, and timelines have not been confirmed.
- A public WordPress API reported 2,646 product records on 2026-10-02. No records or product images have been imported into this project.
- The reference site's current payment methods and payment provider have not been verified. M-Pesa is a local-market recommendation for this project, not a claim about the reference site's setup.

## 5. Scope

### MVP In Scope

1. **Storefront shell:** Responsive header, category navigation, search entry, cart indicator, contact links, and footer.
2. **Home page:** Product/category discovery sections, promotional content, featured products, and clear links into the catalog.
3. **Category pages:** Hierarchical categories, product grids, pagination or progressive loading, and useful empty states.
4. **Search and filters:** Search by product name and SKU; filter by category and brand. Add price and product-attribute filters when those fields are present in the imported data.
5. **Product details:** Product name, SKU, brand, description, images, price and currency, availability, quantity selection, and add-to-cart action. Show only fields supported by verified product data.
6. **Cart:** Add, remove, and change quantities; show item totals and order subtotal; persist the cart for returning visitors on the same device.
7. **Promotions:** Support a validated discount code. Do not hard-code the observed reference promotion as active without approval.
8. **Guest checkout:** Collect customer name, phone, email, delivery address, and delivery instructions. Customer account creation is not required for the first release.
9. **Payment:** Start with M-Pesa STK Push through an approved gateway. Card payment is optional pending business requirements and gateway approval. Keep an order pending until a verified server-side callback confirms payment.
10. **Order confirmation:** Show a confirmation page and send an order email after the relevant order/payment state is confirmed. Provide a clear path for payment-pending and payment-failed outcomes.
11. **WhatsApp contact:** Provide a visible contact action. Where supported, prefill a message with product or cart context without placing customer data in a public URL unnecessarily.
12. **Store operations:** Provide an approved way for staff to review orders and update product availability. Decide whether this is a custom admin interface or a managed database/admin console before implementation.

### Out of Scope for the Initial Release

- Customer loyalty points, wishlists, product reviews, and saved customer profiles.
- Multi-vendor marketplace behavior.
- Automated international tax, customs, or cross-border shipping calculations.
- Subscription or recurring payments.
- ERP/accounting integrations unless required by the store operator.
- Exact import of every source-site product and image until authorized source data is available and the crawl/export method is agreed.

## 6. Functional Requirements

### Catalog

- Each published product must have a stable ID and URL slug.
- Recommended product fields: name, SKU, brand, category, short and full descriptions, price, currency, stock/availability, images, and optional specifications or attributes.
- Product/category pages must have useful titles, descriptions, canonical URLs, and breadcrumbs.
- Search and filtering must be server-backed when the catalog is connected; the browser must not receive private inventory or administrative credentials.
- Unavailable products must not be purchasable. The UI must communicate their state and may offer a WhatsApp enquiry action.

### Cart and Checkout

- A customer may check out without creating an account.
- The server must recalculate prices, discounts, delivery charges, and totals from authoritative stored data. Client-submitted totals are never trusted.
- Checkout must clearly show currency, items, quantities, discounts, delivery charge, and final payable total before payment begins.
- The order must be stored before redirecting or initiating a payment request, with a unique order reference.
- Payment callbacks must be authenticated/verified and idempotent. Repeated callbacks must not duplicate an order, charge, or stock adjustment.
- Payment status and fulfillment status must be separate. Suggested payment states: pending, paid, failed, cancelled, refunded. Suggested fulfillment states: unfulfilled, processing, dispatched, delivered, cancelled.

### Delivery and Support

- Delivery areas, fees, and estimated timelines must be configurable; do not infer them from the reference site's marketing copy.
- Checkout must validate the required customer contact and delivery fields.
- The WhatsApp contact action must be available from the storefront and product detail pages.

### Store Operations

- Authorized staff must be able to find an order by order number or customer contact and view its items, total, payment state, and delivery details.
- Product price and availability changes must take effect without rebuilding the frontend.
- Administrative access must require authentication and must not be exposed to anonymous visitors.

## 7. Non-Functional Requirements

- **Framework constraints:** Next.js App Router, JavaScript, and CSS Modules. Do not add TypeScript or a CSS utility framework.
- **Responsive design:** Support narrow mobile screens through desktop widths without horizontal overflow or overlapping controls.
- **Accessibility:** Semantic HTML, keyboard operation, visible focus, properly labeled forms, useful image alternative text, and sufficient contrast.
- **Performance:** Optimize product images; avoid loading the entire catalog on the home page; paginate or progressively load catalog results.
- **SEO:** Server-render public catalog pages, provide metadata and canonical URLs, and generate an indexable sitemap after catalog routes exist.
- **Security:** Validate all checkout input server-side, protect staff routes, keep secrets server-only, and never store raw payment-card data.
- **Reliability:** Preserve order and payment state across reloads and retryable gateway callbacks. Log failures without logging secrets or full payment credentials.
- **Privacy:** Collect only information needed to fulfill and support an order. Add consent and privacy notices if analytics or non-essential cookies are introduced.

## 8. Proposed Technical Approach

The frontend choice is fixed by the project request. The services below are recommendations only and need approval before implementation.

- **Application:** Existing Next.js App Router project with JavaScript and CSS Modules.
- **Database:** Supabase PostgreSQL for products, categories, stock, promotions, customers, orders, and payment events.
- **Data access/auth/media:** Supabase JavaScript client; use server-side access for privileged operations. Supabase Auth could protect staff functions; Supabase Storage is a candidate for authorized product images.
- **Payments:** Evaluate IntaSend for M-Pesa and optional cards, subject to merchant onboarding, supported transaction flows, and fees. Keep payment-provider calls behind server-side route handlers and a provider adapter. Safaricom Daraja is an alternative if direct M-Pesa integration is preferred.
- **Hosting:** Vercel is a candidate for the Next.js application. Select production database region, image domain, secrets, and webhook URL before launch.
- **Validation/email:** Zod for server-side input validation and Resend for transactional email are optional candidates.

Do not commit credentials or assume a provider's sandbox/production configuration. Confirm current provider documentation, merchant eligibility, fees, callback requirements, and refund support during implementation planning.

## 9. Acceptance Criteria

- A visitor can navigate from a top-level category to a product and return to the catalog without losing context.
- Search and filters return matching published products and have clear no-results states.
- A visitor can add an available product to the cart, change quantity, remove it, and see recalculated totals.
- An invalid or expired discount code is rejected with a clear message; a valid code is calculated server-side.
- Checkout rejects missing or malformed required contact/delivery details and never trusts a browser-supplied total.
- Payment initiation creates a pending order. Only a verified callback can mark the payment paid; duplicate callbacks do not duplicate side effects.
- The interface exposes WhatsApp contact on relevant shopping screens and works on mobile and keyboard navigation.
- Product, order, and payment data remain accessible after a page reload and are not dependent on in-memory frontend state.
- SEO metadata, responsive behavior, and empty/error/loading states exist for the main catalog routes.

## 10. Success Measures

Collect a baseline before setting business targets. Initial measures should include:

- Product search success and zero-result rate.
- Product-detail-to-cart and cart-to-checkout rates.
- Checkout completion and payment failure rates by payment method.
- Orders with unresolved payment status and orders requiring manual support.
- Mobile page performance and catalog image load failures.

## 11. Risks, Dependencies, and Open Decisions

- **Catalog source:** The product API count is known, but the catalog has not been exported. The reference site requests a 30-second crawl delay. Obtain an authorized CSV/API export or plan a paced import before claiming catalog completeness.
- **Media/content rights:** Confirm permission to reuse product descriptions, trademarks, and images. Verify product-image availability and attribution requirements.
- **Payment gateway:** Confirm merchant account, M-Pesa/card methods, settlement, fees, webhook authentication, refunds, and sandbox access before selecting a provider.
- **Delivery policy:** Confirm destinations, charges, free-delivery thresholds, timelines, and East Africa fulfillment rules.
- **Currency and tax:** KES is the expected primary currency based on the Kenya-focused reference; confirm tax display and whether other currencies are needed.
- **Store administration:** Decide between a custom admin UI and a managed admin workflow for products, promotions, orders, and stock.
- **Customer accounts:** Guest checkout is the MVP recommendation; confirm whether account creation or order history is required.
- **Reference completeness:** Only public homepage/navigation observations are available so far. Product detail, checkout, mobile layout, policies, and all catalog pages still require review before pixel-level or behavior-level replication.

## 12. Delivery Phases

1. **Requirements approval:** Confirm this scope, data source, payment provider, delivery policy, and admin workflow.
2. **Storefront foundation:** Build responsive layout, navigation, home, category, search, and product detail views with CSS Modules.
3. **Catalog and cart:** Import approved data, implement search/filter/pagination, and persist the cart.
4. **Checkout and operations:** Add guest checkout, delivery rules, order storage, staff order workflow, and email notifications.
5. **Payments and launch readiness:** Integrate the approved gateway, verify callback/retry behavior, configure production hosting/secrets, and test end-to-end.