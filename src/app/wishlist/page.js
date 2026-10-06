import Link from "next/link";
import { Heart } from "lucide-react";
import styles from "./wishlist.module.css";

export const metadata = { title: "Wishlist | United Tools Ltd" };

export default function WishlistPage() {
  return (
    <main className={styles.page}>
      <div className="utl-container">
        <span className={styles.icon}><Heart size={26} /></span>
        <h1>Your wishlist</h1>
        <p>Add products you're interested in, then send them to us on WhatsApp for a confirmed quote.</p>
        <p>On this deployment the wishlist is not yet stored per visitor — use <Link href="/shop">Shop</Link> and the WhatsApp buttons to enquire about any product.</p>
        <Link className={styles.cta} href="/shop">Browse the catalogue</Link>
      </div>
    </main>
  );
}