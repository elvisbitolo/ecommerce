"use client";

import { useState } from "react";
import { CheckCircle2, Mail, Send } from "lucide-react";
import styles from "./Newsletter.module.css";

export default function Newsletter({ title, copy }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle"); // idle | loading | done | error
  const [message, setMessage] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    if (!email.trim()) return;
    setState("loading");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setState("done");
        setEmail("");
        setMessage("You're subscribed. Welcome aboard!");
      } else {
        setState("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setState("error");
      setMessage("Could not reach the server. Please try again.");
    }
  }

  return (
    <section className={styles.section} aria-labelledby="utl-newsletter-heading">
      <div className="utl-container">
        <div className={styles.box}>
          <p className="utl-kicker">NEW ARRIVALS · OFFERS · PROMOS</p>
          <h2 id="utl-newsletter-heading">{title}</h2>
          <p className={styles.copy}>{copy}</p>
          {state === "done" ? (
            <div className={styles.done} role="status"><CheckCircle2 size={22} /> {message}</div>
          ) : (
            <form className={styles.form} onSubmit={onSubmit} noValidate>
              <Mail size={18} aria-hidden="true" />
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email address"
                aria-label="Email address"
                disabled={state === "loading"}
              />
              <button type="submit" disabled={state === "loading"}>
                Subscribe <Send size={16} />
              </button>
            </form>
          )}
          {state === "error" && <p className={styles.error} role="alert">{message}</p>}
          <p className={styles.terms}>Your information is safe with us. Unsubscribe at any time.</p>
        </div>
      </div>
    </section>
  );
}