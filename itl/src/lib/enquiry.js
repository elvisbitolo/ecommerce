export const ENQUIRY_STORAGE_KEY = "itl-enquiry-list";

export function readEnquiryList() {
  try {
    const stored = window.localStorage.getItem(ENQUIRY_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    window.localStorage.removeItem(ENQUIRY_STORAGE_KEY);
    return [];
  }
}

export function addEnquiryProduct(product) {
  const current = readEnquiryList();
  const existing = current.find((item) => item.id === product.id);
  const next = existing
    ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
    : [...current, { ...product, quantity: 1 }];
  window.localStorage.setItem(ENQUIRY_STORAGE_KEY, JSON.stringify(next));
  return next;
}
