// FILE PATH: api/razorpay/_lib/razorpay.js

function must(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name} in Vercel env.`);
  return v;
}

export function getRazorpayKeys() {
  const keyId = must("RAZORPAY_KEY_ID");
  const keySecret = must("RAZORPAY_KEY_SECRET");
  return { keyId, keySecret };
}

export async function razorpayRequest(path, { method = "GET", body } = {}) {
  const { keyId, keySecret } = getRazorpayKeys();
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  const url = `https://api.razorpay.com${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      data?.error?.description ||
      data?.error?.message ||
      data?.message ||
      `Razorpay API error (${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}
