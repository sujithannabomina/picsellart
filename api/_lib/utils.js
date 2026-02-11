// FILE PATH: api/_lib/utils.js

export function sendJSON(res, status, data) {
  res.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

export function readJSON(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

export function allowCors(req, res) {
  // Usually same-domain on Vercel, but safe to include.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return true;
  }
  return false;
}

export function requireMethod(req, res, method) {
  if (req.method !== method) {
    res.statusCode = 405;
    res.setHeader("Allow", method);
    res.end(`Method ${req.method} Not Allowed`);
    return false;
  }
  return true;
}

export function nowISO() {
  return new Date().toISOString();
}
