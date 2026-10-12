import { NextResponse } from "next/server";
import { readContent } from "@/lib/content";
import type { CompanyContactData } from "@/lib/types";

export const runtime = "nodejs";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TRACKS = ["Recruiting", "Datathon sponsorship", "Workshop or lecture", "Something else"];

// Best-effort flood guard (per server instance). Real protection is the
// honeypot + minimum fill time below; this just caps a single noisy address.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

// The page content is the single source for the contact address. On Vercel the
// function may run without the content/ folder, so a read failure must never
// take the form down: fall back to the same address.
const FALLBACK_TO = "gabriel.schmiedecke@stads.de";
function recipient() {
  try {
    return readContent<CompanyContactData>("for-companies/contact.md").data.contact.email || FALLBACK_TO;
  } catch {
    return FALLBACK_TO;
  }
}

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/\u0000/g, "").trim().slice(0, max) : "";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot filled or form submitted faster than a human can: pretend success.
  const tooFast = typeof body.t === "number" && Date.now() - body.t < 2500;
  if (clean(body.website, 200) || tooFast) return NextResponse.json({ ok: true });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const company = clean(body.company, 160);
  const message = clean(body.message, 5000);
  const trackRaw = clean(body.track, 60);
  const track = TRACKS.includes(trackRaw) ? trackRaw : "Not specified";

  if (name.length < 2 || !EMAIL.test(email) || message.length < 10) {
    return NextResponse.json({ ok: false, error: "Please check your details." }, { status: 422 });
  }

  const to = process.env.CONTACT_TO ?? recipient();
  const subject = `[Partnership] ${track} - ${company || name}`;
  const text = [
    `Track: ${track}`,
    `Name: ${name}`,
    `Company: ${company || "-"}`,
    `Email: ${email}`,
    "",
    message,
    "",
    "-- Sent via the For Companies form on the STADS website. Reply to this mail to answer directly.",
  ].join("\n");

  try {
    let ok = false;
    if (process.env.RESEND_API_KEY) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM ?? "STADS Website <onboarding@resend.dev>",
          to: [to],
          reply_to: email,
          subject,
          text,
        }),
      });
      ok = res.ok;
      if (!ok) console.error("[contact] Resend:", res.status, await res.text().catch(() => ""));
    } else {
      // No mail provider configured yet: relay through FormSubmit, which needs
      // no key (the first message asks the recipient to confirm once).
      // FormSubmit refuses requests that carry no Origin/Referer ("open this
      // page through a web server"), so present the site's own origin.
      const origin = process.env.SITE_URL ?? new URL(request.url).origin;
      const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Origin: origin,
          Referer: `${origin}/for-companies`,
        },
        body: JSON.stringify({
          _subject: subject,
          _replyto: email,
          _captcha: "false",
          _template: "box",
          Track: track,
          Name: name,
          Company: company || "-",
          Email: email,
          Message: message,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        success?: string | boolean;
        message?: string;
      };
      ok = res.ok && (json.success === true || json.success === "true");
      // Visible in the Vercel function logs, e.g. "This form needs Activation".
      if (!ok) console.error("[contact] FormSubmit:", res.status, json.message);
    }
    if (!ok) throw new Error("mail provider rejected the message");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "We could not send your message. Please email us directly." },
      { status: 502 },
    );
  }
}
