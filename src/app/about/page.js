import Link from "next/link";
import styles from "./page.module.css";

export const metadata = {
  title: "About Us",
  description: "Learn about United Tools Ltd and the trade-focused service behind our industrial, workshop and automotive ranges.",
};

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.kicker}>United Tools Ltd</p>
          <h1>Industrial tools with practical support behind them.</h1>
          <p className={styles.lead}>We help workshops, factories, garages and trade customers find the right tools, consumables and support for the job in front of them.</p>
          <div className={styles.actions}>
            <Link href="/shop">Browse the range</Link>
            <Link href="/contact">Talk to the team</Link>
          </div>
        </div>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <p className={styles.kicker}>Who we are</p>
          <h2>Built around real-world workshop needs.</h2>
        </div>
        <div className={styles.grid}>
          <article>
            <h3>Trade-focused sourcing</h3>
            <p>We stock the products customers rely on for industrial cutting, measuring, fabrication, finishing, maintenance and more.</p>
          </article>
          <article>
            <h3>Reliable service</h3>
            <p>From product selection to delivery support, we focus on practical guidance and efficient order handling for busy operations.</p>
          </article>
          <article>
            <h3>Kenya and East Africa</h3>
            <p>Our customer reach covers local workshops and trade buyers across Kenya, with a strong focus on dependable regional support.</p>
          </article>
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className={styles.sectionHeading}>
          <p className={styles.kicker}>Why customers choose us</p>
          <h2>Practical products and clear guidance.</h2>
        </div>
        <ul className={styles.list}>
          <li>Broad categories covering engineering, cutting, measuring, abrasives and automotive support.</li>
          <li>Fast product enquiries for availability, details and delivery planning.</li>
          <li>Support for workshops, contractors, fleets and production environments.</li>
          <li>Partnership approach for repeat trade customers and service teams.</li>
        </ul>
      </section>
    </main>
  );
}
