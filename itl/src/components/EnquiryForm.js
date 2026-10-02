"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Minus, Plus, Trash2 } from "lucide-react";
import { startTransition, useEffect, useState } from "react";
import { ENQUIRY_STORAGE_KEY, readEnquiryList } from "../lib/enquiry";
import styles from "./enquiry-form.module.css";

const emptyContact = { name: "", phone: "", email: "", company: "", town: "", notes: "" };

export default function EnquiryForm() {
  const [items, setItems] = useState([]);
  const [contact, setContact] = useState(emptyContact);
  const [ready, setReady] = useState(false);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const restoredItems = readEnquiryList();
    startTransition(() => {
      setItems(restoredItems);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(ENQUIRY_STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  function updateQuantity(id, change) {
    setItems((currentItems) => currentItems
      .map((item) => item.id === id ? { ...item, quantity: item.quantity + change } : item)
      .filter((item) => item.quantity > 0));
  }

  function removeItem(id) {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  }

  function updateContact(event) {
    const { name, value } = event.target;
    setContact((current) => ({ ...current, [name]: value }));
  }

  function submitEnquiry(event) {
    event.preventDefault();
    const lines = [
      "Hello, I would like to request a quotation.",
      `Name: ${contact.name}`,
      `Phone: ${contact.phone}`,
      contact.email ? `Email: ${contact.email}` : "",
      contact.company ? `Business: ${contact.company}` : "",
      contact.town ? `Delivery town: ${contact.town}` : "",
      "Items:",
      ...items.map((item) => `${item.quantity} x ${item.name} (${item.brand})`),
      contact.notes ? `Notes: ${contact.notes}` : "",
    ].filter(Boolean);
    const whatsappUrl = `https://wa.me/254774888373?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setOpened(true);
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className={styles.page}>
      <div className={styles.topbar}><Link href="/"><ArrowLeft size={15} /> Continue browsing</Link><span>UNITED TOOLS LTD · PRODUCT ENQUIRY</span></div>
      <header className={styles.pageHeader}><p>YOUR SELECTION</p><h1>Request a quotation</h1><span>Share your contact and delivery details. Our team can confirm current prices, stock and delivery with you.</span></header>

      {!items.length ? (
        <section className={styles.empty}>
          <MessageCircle size={29} />
          <h2>Your enquiry list is empty</h2>
          <p>Add products from the catalog first, then return here to ask about pricing and availability.</p>
          <Link href="/">Browse tools</Link>
        </section>
      ) : (
        <div className={styles.columns}>
          <section className={styles.itemsPanel} aria-labelledby="items-title">
            <div className={styles.panelHeading}><h2 id="items-title">Selected products</h2><span>{itemCount} {itemCount === 1 ? "item" : "items"}</span></div>
            <div className={styles.itemList}>
              {items.map((item) => <article className={styles.item} key={item.id}>
                <Image src={item.image} alt="" width={82} height={82} />
                <div className={styles.itemInfo}>
                  <span>{item.brand}</span>
                  <h3>{item.name}</h3>
                  <small>Price confirmed on enquiry</small>
                  <div className={styles.quantity}>
                    <button type="button" aria-label={`Remove one ${item.name}`} onClick={() => updateQuantity(item.id, -1)}><Minus size={13} /></button>
                    <span>{item.quantity}</span>
                    <button type="button" aria-label={`Add one ${item.name}`} onClick={() => updateQuantity(item.id, 1)}><Plus size={13} /></button>
                  </div>
                </div>
                <button className={styles.remove} type="button" aria-label={`Remove ${item.name}`} onClick={() => removeItem(item.id)}><Trash2 size={16} /></button>
              </article>)}
            </div>
            <p className={styles.itemsNote}>No payment is taken on this page. Product prices and availability are confirmed by the sales team.</p>
          </section>

          <form className={styles.form} onSubmit={submitEnquiry}>
            <h2>Your details</h2>
            <p>Required fields are marked with an asterisk.</p>
            <label>Name <span>*</span><input autoComplete="name" name="name" required value={contact.name} onChange={updateContact} /></label>
            <div className={styles.formRow}>
              <label>Phone number <span>*</span><input autoComplete="tel" type="tel" name="phone" required inputMode="tel" placeholder="+254 7xx xxx xxx" value={contact.phone} onChange={updateContact} /></label>
              <label>Email address<input autoComplete="email" type="email" name="email" value={contact.email} onChange={updateContact} /></label>
            </div>
            <label>Company or workshop<input autoComplete="organization" name="company" value={contact.company} onChange={updateContact} /></label>
            <label>Delivery town<input autoComplete="address-level2" name="town" value={contact.town} onChange={updateContact} /></label>
            <label>What should we know?<textarea name="notes" rows="3" value={contact.notes} onChange={updateContact} placeholder="Preferred delivery timing or product details" /></label>
            <button className={styles.submit} type="submit"><MessageCircle size={17} /> Send request via WhatsApp</button>
            {opened && <p className={styles.success} role="status">WhatsApp opened with your enquiry details. Nothing was sent to this website.</p>}
            <p className={styles.privacy}>Selecting the button opens WhatsApp with the details above. This frontend does not save or send your personal information to a server.</p>
          </form>
        </div>
      )}
    </main>
  );
}
