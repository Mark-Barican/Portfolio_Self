import { NextResponse } from "next/server";
import { Resend } from "resend";
import { SITE } from "@/lib/constants";

export const runtime = "nodejs";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/* -------------------------------------------------------------------------- */
/*  Best-effort in-memory rate limiter (per server instance).                 */
/*  Keeps the inbox from being flooded by the same client.                    */
/* -------------------------------------------------------------------------- */
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_MAX = 3; // messages per window per IP
const rateHits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (rateHits.get(ip) ?? []).filter(
    (t) => now - t < RATE_WINDOW_MS,
  );
  if (recent.length >= RATE_MAX) {
    rateHits.set(ip, recent);
    return true;
  }
  recent.push(now);
  rateHits.set(ip, recent);
  // Opportunistically prune the map so it can't grow unbounded.
  if (rateHits.size > 5000) {
    for (const [key, times] of rateHits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) rateHits.delete(key);
    }
  }
  return false;
}

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  return (
    fwd?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

interface ContactPayload {
  name?: string;
  email?: string;
  message?: string;
  /** Honeypot — real users never fill this. */
  company?: string;
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 500 },
    );
  }

  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  // Silently accept honeypot hits so bots think they succeeded.
  if (body.company) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Please fill in your name, email and message." },
      { status: 400 },
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }
  if (message.length > 5000) {
    return NextResponse.json(
      { error: "That message is a little too long." },
      { status: 400 },
    );
  }

  if (isRateLimited(clientIp(request))) {
    return NextResponse.json(
      {
        error:
          "You've sent a few messages already — please give it a little while before sending another.",
      },
      { status: 429 },
    );
  }

  const to = process.env.CONTACT_TO_EMAIL ?? SITE.email;
  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    // onboarding@resend.dev works without a verified domain.
    // Swap for an address on your own verified domain in production.
    from: `${SITE.shortName} Portfolio <onboarding@resend.dev>`,
    to,
    replyTo: email,
    subject: `New portfolio message from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
    html: `
      <div style="font-family:system-ui,sans-serif;line-height:1.6;color:#0d1b21">
        <h2 style="margin:0 0 12px">New portfolio message</h2>
        <p style="margin:0 0 4px"><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p style="margin:0 0 16px"><strong>Email:</strong> ${escapeHtml(email)}</p>
        <div style="padding:16px;background:#f4f5f7;border-radius:12px;white-space:pre-wrap">${escapeHtml(
          message,
        )}</div>
      </div>
    `,
  });

  if (error) {
    return NextResponse.json(
      { error: "Could not send your message. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, id: data?.id }, { status: 200 });
}

/** Minimal HTML-escape for user-supplied values rendered in the email body. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
