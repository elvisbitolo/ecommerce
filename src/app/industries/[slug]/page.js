import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { categories, industries } from "../../../data/catalog";
import styles from "./industry.module.css";

const industryCategories = {
  "building-construction": ["Safety", "Ladders", "Power Tools", "Abrasives", "Hardware & Materials"],
  "automotive-aftermarket": ["Automotive Tools", "Lubrication Tools", "Calipers", "Sealants & Lubricants"],
  fabrication: ["Engineering - Tooling", "Measuring, Marking & Testing", "Abrasives", "Tools & Accessories"],
};

export const dynamicParams = false;

export function generateStaticParams() {
  return industries.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const industry = industries.find((item) => item.slug === slug);

  return {
    title: industry ? `${industry.name} Solutions` : "Industry not found",
    description: industry?.detail,
  };
}

export default async function IndustryPage({ params }) {
  const { slug } = await params;
  const industry = industries.find((item) => item.slug === slug);
  if (!industry) notFound();

  const relatedCategories = categories.filter((category) => industryCategories[slug].includes(category.name));

  return (
    <main className={styles.page}>
      <Link className={styles.back} href="/"><ArrowLeft size={15} /> Back to United Tools</Link>
      <header className={styles.hero}>
        <p>INDUSTRIES &amp; SOLUTIONS</p>
        <h1>{industry.name}</h1>
        <span>{industry.detail}</span>
      </header>
      <section className={styles.section}>
        <p className={styles.kicker}>EXPLORE PRODUCT RANGES</p>
        <h2>Tools and equipment for your work</h2>
        <div className={styles.grid}>
          {relatedCategories.map((category) => (
            <Link href={`/category/${category.slug}`} key={category.slug}>
              <strong>{category.name}</strong><span>{category.detail}</span><ArrowRight size={16} />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
