// Origines autorisées à appeler le proxy (bloque l'usage depuis d'autres sites).
const ALLOWED_ORIGINS = [
  "https://fitrace-lemon.vercel.app",
  "http://localhost:5173",
  "http://localhost:5199",
];

// Rate-limit simple en mémoire (par instance serverless) : limite l'abus/emballement.
// Best-effort — pour une limite stricte multi-instances, il faudrait un store (KV/Redis).
const RATE = new Map(); // ip -> { count, resetAt }
const RATE_LIMIT = 40;             // requêtes max
const RATE_WINDOW = 60 * 1000;     // par minute

function rateLimited(ip) {
  const now = Date.now();
  const entry = RATE.get(ip);
  if (!entry || now > entry.resetAt) {
    RATE.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

export default async function handler(req, res) {
  const origin = req.headers.origin;
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  res.setHeader("Access-Control-Allow-Origin", allowOrigin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Refuse les origines inconnues (navigateur d'un autre site).
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return res.status(403).json({ error: "Origin not allowed" });
  }

  // Rate-limit par IP.
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) {
    return res.status(429).json({ error: "Trop de requêtes — réessaie dans une minute." });
  }

  const isStream = req.body?.stream === true;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: { message: errText } });
    }

    if (isStream) {
      // Pipe SSE stream directly to client
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          res.write(chunk);
        }
      } finally {
        reader.releaseLock();
      }
      return res.end();
    } else {
      const data = await response.json();
      return res.status(200).json(data);
    }
  } catch (error) {
    console.error("Proxy error:", error);
    if (isStream) {
      res.write(`data: {"type":"error","error":{"message":"${error.message}"}}\n\n`);
      return res.end();
    }
    return res.status(500).json({ error: error.message });
  }
}
