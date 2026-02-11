// FILE PATH: api/_lib/utils.js

export function json(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

export function ok(res, data = {}) {
  return json(res, 200, data);
}

export function bad(res, status = 400, message = "Bad Request", extra = {}) {
  return json(res, status, { error: message, ...extra });
}

export function onlyPost(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    bad(res, 405, "Method Not Allowed");
    return false;
  }
  return true;
}

// Vercel node function: safely read raw body (needed for webhooks)
export async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export function safeEnv(name, fallback = "") {
  const v = process.env[name];
  if (!v) return fallback;
  // Remove accidental wrapping quotes and trim spaces (very common in Vercel)
  return String(v).trim().replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
}

export function mask(s, keep = 4) {
  if (!s) return "";
  const str = String(s);
  if (str.length <= keep) return "*".repeat(str.length);
  return str.slice(0, keep) + "*".repeat(Math.max(0, str.length - keep));
}
