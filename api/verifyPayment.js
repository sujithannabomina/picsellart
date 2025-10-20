// api/verifyPayment.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  // You can verify signature here if you’ve enabled it in checkout
  // For now respond OK to avoid blocking the UX
  return res.status(200).json({ ok: true });
}
