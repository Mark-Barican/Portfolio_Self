import { NextResponse } from "next/server";
import { Resend } from "resend";
import { SITE } from "@/lib/constants";

export const runtime = "nodejs";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

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
