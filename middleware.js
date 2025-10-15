// Simple IP bucket using Upstash Redis
import { NextResponse } from "next/server";

const LIMIT = 30;   // 30 requests
const WINDOW = 60;  // per 60 seconds

export async function middleware(req) {
  const ip = req.headers.get("x-forwarded-for") || req.ip || "global";
  const key = `rl:${ip}:${Math.floor(Date.now()/ (WINDOW*1000))}`;

  const url = req.nextUrl.clone();
  // Limit only API endpoints
  if (!url.pathname.startsWith("/api/")) return NextResponse.next();

  const resp = await fetch(process.env.UPSTASH_REDIS_REST_URL + "/incr/" + key, {
    headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` }
  });
  const count = Number(await resp.text());
  if (count === 1) {
    await fetch(process.env.UPSTASH_REDIS_REST_URL + "/pexpire/" + key + "/" + (WINDOW*1000), {
      headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` }
    });
  }
  if (count > LIMIT) {
    return new NextResponse("Rate limit exceeded", { status: 429 });
  }
  return NextResponse.next();
}
