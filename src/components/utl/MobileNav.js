"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, Search, Store, User } from "lucide-react";
import styles from "./MobileNav.module.css";

export default function MobileBottomNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className={styles.nav} aria-label="Mobile navigation">
      <Link href="/shop"><span><Store size={20} /></span>Store</Link>
      <Link href="/search"><span><Search size={20} /></span>Search</Link>
      <Link href="/wishlist"><span><Heart size={20} /><b>13</b></span>Wishlist</Link>
      <Link href="/enquiry"><span><User size={20} /></span>Account</Link>
    </nav>
  );
}