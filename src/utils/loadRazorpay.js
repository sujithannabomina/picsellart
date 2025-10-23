// src/utils/loadRazorpay.js

/**
 * Zero-dependency Razorpay helper (no axios).
 * Works with your existing serverless endpoints in /api:
 *   - POST /api/createOrder        -> returns { keyId, order: { id, amount, currency, ... }, notes? }
 *   - POST /api/verifyPayment      -> returns { ok: true } (or detailed result)
 *
 * If your backend returns a slightly different shape, we normalize below.
 */

const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

/* ----------------------------- tiny utilities ----------------------------- */

async function postJSON(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body || {}),
    credentials: "same-origin",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`POST ${url} failed: ${res.status} ${text}`);
  }
  // some of our endpoints might return empty body on error
  const data = await res.json().catch(() => ({}));
  return data;
}

function loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("window not available"));
    if (document.querySelector(`script[src="${src}"]`)) return resolve(true);

    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

function currency(amount, curr = "INR") {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: curr,
      maximumFractionDigits: 2,
    }).format((amount || 0) / 100);
  } catch {
    return `₹${(amount || 0) / 100}`;
  }
}

/* ------------------------------- API helpers ------------------------------ */

/**
 * Client-side wrapper to create an order on your server.
 * Keeps the function name some of your pages expect.
 */
export async function createOrderClient(payload, endpoint = "/api/createOrder") {
  return postJSON(endpoint, payload);
}

/**
 * Public verify wrapper (used by handler after successful payment).
 */
async function verifyPaymentClient(payload, endpoint = "/api/verifyPayment") {
  return postJSON(endpoint, payload);
}

/* ----------------------------- Main Integration --------------------------- */

/**
 * Open Razorpay checkout.
 *
 * @param {{
 *   amount: number,                // in paise
 *   currency?: string,             // defaults to 'INR'
 *   description?: string,
 *   receipt?: string,
 *   notes?: Record<string, any>,
 *   product?: {                    // arbitrary meta passed to server (e.g. photoId, packId)
 *     type: 'photo'|'pack'|'plan'|string,
 *     id?: string,
 *     title?: string,
 *   },
 *   buyer?: {
 *     name?: string,
 *     email?: string,
 *     contact?: string
 *   },
 *   // callbacks:
 *   onSuccess?: (ctx: {orderId:string,paymentId:string,signature:string}) => void,
 *   onError?: (err: Error) => void,
 * }} opts
 */
export async function openRazorpay(opts) {
  const {
    amount,
    currency: curr = "INR",
    description = "Payment",
    receipt,
    notes = {},
    product = {},
    buyer = {},
    onSuccess,
    onError,
  } = opts || {};

  if (!amount || amount <= 0) {
    const e = new Error("amount (in paise) is required");
    if (onError) onError(e);
    throw e;
  }

  // 1) Create order on our server
  const orderResp = await createOrderClient({
    amount,
    currency: curr,
    description,
    receipt,
    notes,
    product,
  });

  // Normalize possible shapes:
  // - { keyId, order: { id, amount, currency } }
  // - or { key, orderId, amount, currency }
  // - or any server variant (we do our best here)
  const keyId =
    orderResp.keyId ||
    orderResp.key ||
    orderResp.razorpayKey ||
    import.meta?.env?.VITE_RAZORPAY_KEY_ID ||
    "";

  const order =
    orderResp.order ||
    orderResp.data?.order ||
    (orderResp.orderId
      ? { id: orderResp.orderId, amount: orderResp.amount, currency: orderResp.currency || curr }
      : null);

  if (!keyId || !order?.id) {
    const e = new Error("Invalid createOrder response: missing keyId or order.id");
    if (onError) onError(e);
    throw e;
  }

  // 2) Load Razorpay script
  await loadScriptOnce(RAZORPAY_SCRIPT);
  if (typeof window.Razorpay === "undefined") {
    const e = new Error("Razorpay SDK not available");
    if (onError) onError(e);
    throw e;
  }

  // 3) Build checkout options
  const options = {
    key: keyId,
    amount: order.amount,
    currency: order.currency || curr,
    name: "Picsellart",
    description,
    order_id: order.id,
    notes: {
      ...notes,
      productType: product?.type || "",
      productId: product?.id || "",
      productTitle: product?.title || "",
    },
    prefill: {
      name: buyer.name || "",
      email: buyer.email || "",
      contact: buyer.contact || "",
    },
    theme: { color: "#111827" }, // neutral-900
    modal: { ondismiss: () => {/* no-op */} },
    handler: async function (response) {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response || {};
      try {
        const vr = await verifyPaymentClient({
          orderId: razorpay_order_id || order.id,
          paymentId: razorpay_payment_id,
          signature: razorpay_signature,
          product,
          notes,
        });
        if (vr?.ok !== false) {
          onSuccess && onSuccess({
            orderId: razorpay_order_id || order.id,
            paymentId: razorpay_payment_id,
            signature: razorpay_signature,
          });
        } else {
          const e = new Error("Payment verification failed");
          if (onError) onError(e);
          throw e;
        }
      } catch (err) {
        if (onError) onError(err instanceof Error ? err : new Error(String(err)));
      }
    },
  };

  // 4) Open checkout
  const rzp = new window.Razorpay(options);
  rzp.on("payment.failed", function (resp) {
    const msg =
      resp?.error?.description ||
      resp?.error?.reason ||
      "Payment failed or was cancelled";
    onError && onError(new Error(msg));
  });
  rzp.open();

  return {
    orderId: order.id,
    displayAmount: currency(order.amount, order.currency || curr),
  };
}

// Historical name some of your pages import:
export const launchRazorpay = openRazorpay;
