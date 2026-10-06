import Link from "next/link";
import styles from "./page.module.css";

export const metadata = {
  title: "Contact Us",
  description: "Contact United Tools Ltd for quotations, product enquiries and delivery support in Kenya and East Africa.",
};

export default function ContactPage() {
  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.inner}>
          <p className={styles.kicker}>Get in touch</p>
          <h1>Talk to our tools team.</h1>
          <p>We can help with product selection, current stock, price confirmation and delivery details for workshops and trade customers.</p>
        </div>
      </header>

      <section className={styles.grid}>
        <article className={styles.card}>
          <h2>Call or WhatsApp</h2>
          <a href="https://wa.me/254774888373" target="_blank" rel="noreferrer">+254 774 888 373</a>
          <a href="mailto:sales@utl.co.ke">sales@utl.co.ke</a>
        </article>
        <article className={styles.card}>
          <h2>Visit our shop</h2>
          <p>20 Butere Rd</p>
          <p>Industrial Area, Nairobi</p>
        </article>
        <article className={styles.card}>
          <h2>Office hours</h2>
          <p>Monday to Friday</p>
          <p>8:00 AM – 4:30 PM</p>
          <p>Saturday · 8:00 AM – 1:00 PM</p>
          <p>Sundays and public holidays · Closed</p>
        </article>
        <article className={styles.card}>
          <h2>How to order</h2>
          <p>Send your product list or enquire through the enquiry form. Our team will confirm pricing, availability and delivery.</p>
          <Link href="/enquiry">Request a quotation</Link>
        </article>
      </section>
    </main>
  );
}
