// Lightweight Upstash REST rate limiter; optional (skip if not using Upstash)
// Set env: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
export async function checkRateLimit(req, limit = 30, windowSec = 60) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return { ok: true }; // disabled

  const ip = (req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || req.socket?.remoteAddress || "global").toString();
  const bucket = Math.floor(Date.now() / (windowSec * 1000));
  const key = `rl:${ip}:${bucket}`;
  const inc = await fetch(`${url}/incr/${key}`, { headers: { Authorization: `Bearer ${token}` } });
  const count = Number(await inc.text());
  if (count === 1) {
    await fetch(`${url}/pexpire/${key}/${windowSec * 1000}`, { headers: { Authorization: `Bearer ${token}` } });
  }
  return { ok: count <= limit, count };
}
