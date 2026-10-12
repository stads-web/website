"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle } from "@phosphor-icons/react";
import type { ContactTrack } from "@/lib/types";

const OTHER = "Something else";

type Values = { name: string; email: string; company: string; message: string };
type Errors = Partial<Record<"name" | "email" | "message", string>>;
type Status = "idle" | "sending" | "sent" | "error";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v: Values): Errors {
  const errors: Errors = {};
  if (v.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!EMAIL.test(v.email.trim())) errors.email = "Please enter a valid email address.";
  if (v.message.trim().length < 10) errors.message = "Please tell us a little more (a sentence or two is fine).";
  return errors;
}

const inputBase =
  "block w-full rounded-xl border bg-white px-4 py-3 text-base text-brand-900 outline-none transition-colors placeholder:text-brand-500 focus:border-brand-800 focus:ring-2 focus:ring-brand-200";

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-brand-900">
        {label}
        {hint && <span className="ml-1.5 font-normal text-brand-900/55">{hint}</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-[13px] text-[#B42318]">
          {error}
        </p>
      )}
    </div>
  );
}

export default function ContactForm({
  tracks,
  email: to,
}: {
  tracks: ContactTrack[];
  email: string;
}) {
  const [values, setValues] = useState<Values>({ name: "", email: "", company: "", message: "" });
  const [track, setTrack] = useState<string | null>(null);
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const startedAt = useRef(0);
  const sentRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  useEffect(() => {
    if (status === "sent") sentRef.current?.focus();
  }, [status]);

  const errors = validate(values);
  const shown = (key: keyof Errors) => (attempted ? errors[key] : undefined);
  const set = (key: keyof Values) => (value: string) => setValues((v) => ({ ...v, [key]: value }));
  const options = [...tracks.map((t) => t.label), OTHER];

  // If sending ever fails, nothing typed is lost: it opens as a ready mail.
  const fallbackMailto = `mailto:${to}?subject=${encodeURIComponent(
    `[Partnership] ${track ?? "Inquiry"}${values.company ? ` - ${values.company}` : ""}`,
  )}&body=${encodeURIComponent(
    `${values.message}\n\n${values.name}${values.company ? `, ${values.company}` : ""}\n${values.email}`,
  )}`;

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (status === "sending") return;
    setAttempted(true);
    const first = (["name", "email", "message"] as const).find((k) => errors[k]);
    if (first) {
      document.getElementById(`cf-${first}`)?.focus();
      return;
    }
    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, track, website: honeypot, t: startedAt.current }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || "Something went wrong.");
      setStatus("sent");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  const card = "rounded-3xl border border-brand-100 bg-white p-6 shadow-card sm:p-8";

  if (status === "sent") {
    return (
      <div className={`${card} flex min-h-[420px] flex-col items-start justify-center`}>
        <CheckCircle size={44} weight="light" className="text-brand-500" aria-hidden />
        <h3 ref={sentRef} tabIndex={-1} className="mt-5 text-2xl font-medium text-brand-900 outline-none sm:text-3xl">
          Thank you, {values.name.trim().split(/\s+/)[0]}!
        </h3>
        <p className="mt-3 max-w-md leading-relaxed text-brand-900/70">
          Your message has been sent. We will get back to you at{" "}
          <span className="font-medium text-brand-900">{values.email.trim()}</span> within a few
          working days.
        </p>
        <button
          type="button"
          onClick={() => {
            setValues({ name: "", email: "", company: "", message: "" });
            setTrack(null);
            setAttempted(false);
            setStatus("idle");
            startedAt.current = Date.now();
          }}
          className="mt-6 text-sm font-medium text-brand-600 underline underline-offset-4 hover:text-brand-900"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className={`${card} relative`}>
      <h3 className="text-xl font-medium text-brand-900 sm:text-2xl">Send us a message</h3>
      <p className="mt-1.5 text-sm text-brand-900/65">
        Takes about two minutes. We reply within a few working days.
      </p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field id="cf-name" label="Your name" error={shown("name")}>
          <input
            id="cf-name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(e) => set("name")(e.target.value)}
            aria-invalid={shown("name") ? true : undefined}
            aria-describedby={shown("name") ? "cf-name-error" : undefined}
            placeholder="Jane Smith"
            className={`${inputBase} ${shown("name") ? "border-[#B42318]" : "border-brand-200"}`}
          />
        </Field>
        <Field id="cf-email" label="Work email" error={shown("email")}>
          <input
            id="cf-email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => set("email")(e.target.value)}
            aria-invalid={shown("email") ? true : undefined}
            aria-describedby={shown("email") ? "cf-email-error" : undefined}
            placeholder="jane@company.com"
            className={`${inputBase} ${shown("email") ? "border-[#B42318]" : "border-brand-200"}`}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field id="cf-company" label="Company" hint="(optional)">
            <input
              id="cf-company"
              name="company"
              autoComplete="organization"
              value={values.company}
              onChange={(e) => set("company")(e.target.value)}
              placeholder="Company name"
              className={`${inputBase} border-brand-200`}
            />
          </Field>
        </div>

        <fieldset className="sm:col-span-2">
          <legend className="mb-2 text-sm font-medium text-brand-900">
            What are you interested in? <span className="font-normal text-brand-900/55">(optional)</span>
          </legend>
          <div role="radiogroup" className="flex flex-wrap gap-2">
            {options.map((label) => {
              const active = track === label;
              return (
                <button
                  key={label}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setTrack(active ? null : label)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "border-brand-800 bg-brand-800 text-white"
                      : "border-brand-200 bg-white text-brand-900 hover:border-brand-500"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="sm:col-span-2">
          <Field id="cf-message" label="Your message" error={shown("message")}>
            <textarea
              id="cf-message"
              name="message"
              rows={5}
              value={values.message}
              onChange={(e) => set("message")(e.target.value)}
              aria-invalid={shown("message") ? true : undefined}
              aria-describedby={shown("message") ? "cf-message-error" : undefined}
              placeholder="What would you like to do together? Timing, goals or questions are all welcome."
              className={`${inputBase} resize-y ${shown("message") ? "border-[#B42318]" : "border-brand-200"}`}
            />
          </Field>
        </div>
      </div>

      {/* Honeypot: invisible to people, irresistible to bots. */}
      <div aria-hidden className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
        </label>
      </div>

      <div role="status" aria-live="polite">
        {status === "error" && (
          <p className="mt-5 text-sm text-[#B42318]">
            {serverError}{" "}
            <a href={fallbackMailto} className="font-medium underline underline-offset-4">
              Open it in your email app instead
            </a>
            . Your text is already in there.
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-7 block w-full rounded-full bg-brand-500 px-7 py-3.5 text-center font-bold text-white transition-colors hover:bg-brand-600 disabled:cursor-wait disabled:opacity-80 sm:w-auto"
      >
        {status === "sending" ? "Sending..." : "Send message"}
      </button>
      <p className="mt-4 text-xs leading-relaxed text-brand-900/55">
        We only use your details to answer your inquiry. See our{" "}
        <Link href="/datenschutz" className="underline underline-offset-2 hover:text-brand-900">
          privacy policy
        </Link>
        .
      </p>
    </form>
  );
}
