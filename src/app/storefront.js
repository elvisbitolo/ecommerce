import Header from "../components/utl/Header";
import HeroSlider from "../components/utl/HeroSlider";
import FeaturedTabs from "../components/utl/FeaturedTabs";
import SeoAccordion from "../components/utl/SeoAccordion";
import Newsletter from "../components/utl/Newsletter";
import MobileBottomNav from "../components/utl/MobileNav";
import FloatingButtons from "../components/utl/FloatingButtons";
import {
  BrandCarousel,
  CatalogTiles,
  Coupon,
  Footer,
  FullBanner,
  ProductDeck,
  PromoTriple,
  TwoUp,
  ValueProps,
  BlogRow,
} from "../components/utl/Sections";
import styles from "./storefront.module.css";

function classifyFullWidth(blocks = []) {
  const pick = (re) => blocks.find((b) => re.test(`${b.title} ${b.copy}`.toLowerCase()));
  return {
    milling: pick(/milling|mills|slots?/) ?? blocks[0],
    keysteel: pick(/key ?steel/) ?? blocks[1],
    discs: pick(/cutting|grinding|discs|slicing/) ?? blocks[2],
  };
}

export default function Storefront({ data }) {
  const {
    heroSlides,
    tileCategories,
    brands,
    industries,
    navCategories,
    arrivals,
    highlighted,
    promo3up,
    fullWidth,
    twoUp,
    decks = [],
    hotDeck = {},
    couponCode,
    couponTitle,
    couponNote,
    featured,
    posts,
    seo,
    newsletterTitle,
    newsletterCopy,
  } = data;

  const [deckMeasuring, deckEngineering, deckAutomotive, deckAbrasives, deckSealants] = decks;
  const { milling, keysteel, discs } = classifyFullWidth(fullWidth);

  return (
    <main className={styles.page}>
      <Header categories={navCategories} industries={industries} arrivals={arrivals} highlighted={highlighted} />

      <ValueProps />
      <HeroSlider slides={heroSlides} />
      <CatalogTiles tiles={tileCategories} />
      <BrandCarousel brands={brands} />
      <PromoTriple blocks={promo3up} />

      <FullBanner block={milling} tone="blue" />
      <ProductDeck deck={deckMeasuring} />
      <ProductDeck deck={deckEngineering} reverse />
      <ProductDeck deck={deckAutomotive} />
      <ProductDeck
        deck={{ title: "Hot Products This Week!", href: "/shop", banner: hotDeck.banner, products: hotDeck.products?.slice(0, 5) }}
        reverse
      />

      <FullBanner block={keysteel} tone="yellow" />
      <ProductDeck deck={deckAbrasives} />
      <FullBanner block={discs} tone="gray" />

      <FeaturedTabs categories={featured} />
      <ProductDeck deck={deckSealants} reverse />
      <TwoUp blocks={twoUp} />
      <Coupon code={couponCode} title={couponTitle} note={couponNote} />

      <BlogRow posts={posts} />
      <SeoAccordion heading={seo?.heading} accordions={seo?.accordions} />
      <Newsletter title={newsletterTitle} copy={newsletterCopy} />

      <Footer categories={navCategories} />
      <MobileBottomNav />
      <FloatingButtons />
    </main>
  );
}