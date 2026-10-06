"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { WhatsAppIcon } from "./icons";
import styles from "./FloatingButtons.module.css";

const WHATSAPP = "https://wa.me/254774888373";

export default function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a
        className={styles.whatsapp}
        href={WHATSAPP}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with us on WhatsApp"
      >
        <WhatsAppIcon size={28} />
        <span className={styles.pulse} />
      </a>
      <button
        className={`${styles.top} ${showTop ? styles.topShow : ""}`}
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp size={20} />
      </button>
    </>
  );
}