"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Camera, ImagePlus, PackagePlus, Save, X } from "lucide-react";
import { importSampleCatalog, saveProduct } from "./actions";
import { createSupabaseBrowserClient } from "../../lib/supabase/browser";
import styles from "./product-manager.module.css";

const blankProduct = {
  id: "",
  slug: "",
  name: "",
  sku: "",
  brand: "",
  categorySlug: "",
  detail: "",
  image: "",
  isPublished: true,
};

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ProductManager({ categories, products, userEmail, previewMode = false, showImportSamples = false }) {
  const router = useRouter();
  const [draft, setDraft] = useState(blankProduct);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  function updateField(event) {
    const { name, value, checked, type } = event.target;
    setDraft((current) => {
      const next = { ...current, [name]: type === "checkbox" ? checked : value };
      if (name === "name" && !current.id) next.slug = slugify(value);
      return next;
    });
    setError("");
    setMessage("");
  }

  function selectImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Choose a JPG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Images must be 8 MB or smaller.");
      event.target.value = "";
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  }

  function editProduct(product) {
    setDraft({
      id: product.id,
      slug: product.slug,
      name: product.name,
      sku: product.sku ?? "",
      brand: product.brand,
      categorySlug: product.categorySlug,
      detail: product.detail ?? "",
      image: product.image ?? "",
      isPublished: product.isPublished,
    });
    setImageFile(null);
    setPreview("");
    setError("");
    setMessage("");
    document.getElementById("product-editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function startNewProduct() {
    setDraft(blankProduct);
    setImageFile(null);
    setPreview("");
    setError("");
    setMessage("");
    document.getElementById("product-editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function submitProduct(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");

    try {
      if (previewMode) {
        setMessage("Preview only — this product was not saved.");
        setBusy(false);
        return;
      }

      let imageUrl = draft.image;
      if (imageFile) {
        const supabase = createSupabaseBrowserClient();
        if (!supabase) throw new Error("Supabase is not configured.");
        const extension = imageFile.type === "image/jpeg" ? "jpg" : imageFile.type.split("/")[1];
        const path = `products/${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(path, imageFile, { cacheControl: "3600", contentType: imageFile.type, upsert: false });
        if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);
        imageUrl = supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl;
      }

      const result = await saveProduct({
        ...draft,
        imageUrl,
        isPublished: draft.isPublished,
      });
      if (result.error) throw new Error(result.error);

      setMessage("Product saved. The storefront catalog has been updated.");
      setDraft(blankProduct);
      setImageFile(null);
      setPreview("");
      event.target.reset();
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "The product could not be saved.");
    } finally {
      setBusy(false);
    }
  }

  async function handleImportSamples() {
    if (previewMode) {
      setMessage("Preview only — sample products are displayed for demonstration.");
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");
    try {
      const result = await importSampleCatalog();
      if (result.error) throw new Error(result.error);
      setMessage("Starter products imported into the Supabase catalog.");
      router.refresh();
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : "The starter catalog could not be imported.");
    } finally {
      setBusy(false);
    }
  }

  const imageSource = preview || draft.image;

  return (
    <div className={styles.workspace}>
      <header className={styles.heading}>
        <div><p>PRODUCT CATALOG / SUPERADMIN</p><h1>Manage products</h1><span>{previewMode ? "Demo workspace · no changes will be saved" : `Signed in as ${userEmail}`}</span></div>
        <button className={styles.newButton} type="button" onClick={startNewProduct}><PackagePlus size={17} /> Add product</button>
      </header>

      {previewMode && <div className={styles.previewBanner} role="note"><strong>Admin screen preview</strong><span>You can explore the layout, edit sample fields, and preview a photo. This demo does not sign you in or save changes.</span></div>}
      {(error || message) && <div className={error ? styles.error : styles.success} role={error ? "alert" : "status"}>{error || message}</div>}

      <section className={styles.editor} id="product-editor" aria-labelledby="editor-title">
        <div className={styles.sectionHead}>
          <div><p>PRODUCT DETAILS</p><h2 id="editor-title">{draft.id ? "Edit product" : "Add a product"}</h2></div>
          {draft.id && <button type="button" className={styles.cancel} onClick={startNewProduct}><X size={15} /> New product</button>}
        </div>
        <form onSubmit={submitProduct}>
          <div className={styles.formGrid}>
            <label className={styles.imageField}>
              <span>Product image <b>*</b></span>
              <span className={styles.imagePicker}>
                {imageSource ? <Image src={imageSource} alt="Selected product preview" fill unoptimized sizes="240px" /> : <span className={styles.imageEmpty}><ImagePlus size={27} /><small>Choose or take a product photo</small></span>}
              </span>
              <span className={styles.imageButtons}>
                  <span><Camera size={15} /> Take photo<input type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={selectImage} /></span>
                <span><ImagePlus size={15} /> Upload image<input type="file" accept="image/jpeg,image/png,image/webp" onChange={selectImage} /></span>
              </span>
              <small>JPG, PNG, or WebP · up to 8 MB. On supported phones, Take photo opens the camera.</small>
            </label>

            <div className={styles.fields}>
              <label>Product name <b>*</b><input name="name" required maxLength={180} value={draft.name} onChange={updateField} /></label>
              <div className={styles.twoFields}>
                <label>Brand <b>*</b><input name="brand" required maxLength={100} value={draft.brand} onChange={updateField} /></label>
                <label>SKU / product code<input name="sku" maxLength={80} value={draft.sku} onChange={updateField} /></label>
              </div>
              <label>Product URL slug <b>*</b><input name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" title="Lowercase letters and numbers separated by hyphens." value={draft.slug} onChange={updateField} /><small>Generated from the product name. You can edit it.</small></label>
              <label>Category <b>*</b>
                <select name="categorySlug" required value={draft.categorySlug} onChange={updateField}>
                  <option value="">Choose a category</option>
                  {categories.map((item) => <option value={item.slug} key={item.slug}>{item.parentSlug ? `— ${item.name}` : item.name}</option>)}
                </select>
              </label>
              <label>Specifications / short details<textarea name="detail" rows="3" maxLength={500} value={draft.detail} onChange={updateField} placeholder="Size, range, material, model, or other useful product details" /></label>
              <label className={styles.publish}><input name="isPublished" type="checkbox" checked={draft.isPublished} onChange={updateField} /><span><strong>Published</strong><small>Published products appear in the public storefront.</small></span></label>
            </div>
          </div>
          <div className={styles.formActions}>
            <span>Price and availability remain enquiry-based.</span>
            <button type="submit" disabled={busy}><Save size={16} />{busy ? "Saving…" : previewMode ? "Preview save (no changes)" : "Save product"}</button>
          </div>
        </form>
      </section>

      <section className={styles.listing} aria-labelledby="listing-title">
        <div className={styles.sectionHead}>
          <div><p>SUPABASE CATALOG</p><h2 id="listing-title">Products <span>{products.length}</span></h2></div>
          {!previewMode && showImportSamples && <button className={styles.importButton} type="button" onClick={handleImportSamples} disabled={busy}>Import current sample catalog <ArrowUpRight size={15} /></button>}
        </div>
        {products.length ? <div className={styles.tableWrap}>
          <table>
            <thead><tr><th>PRODUCT</th><th>BRAND / SKU</th><th>CATEGORY</th><th>STATUS</th><th /></tr></thead>
            <tbody>{products.map((product) => (
              <tr key={product.id}>
                <td><div className={styles.productCell}>{product.image ? <Image src={product.image} alt="" width={48} height={48} unoptimized /> : <span className={styles.thumbEmpty}><ImagePlus size={18} /></span>}<span><strong>{product.name}</strong><small>{product.slug}</small></span></div></td>
                <td>{product.brand}<small className={styles.secondary}>{product.sku || "No SKU"}</small></td>
                <td>{product.category}</td>
                <td><span className={product.isPublished ? styles.published : styles.unpublished}>{product.isPublished ? "Published" : "Draft"}</span></td>
                <td><button className={styles.editButton} type="button" onClick={() => editProduct(product)}>Edit</button></td>
              </tr>
            ))}</tbody>
          </table>
        </div> : <div className={styles.empty}><PackagePlus size={24} /><h3>No products in Supabase yet</h3><p>Add your first product above, or import the existing sample products to seed the catalog.</p></div>}
      </section>
    </div>
  );
}
