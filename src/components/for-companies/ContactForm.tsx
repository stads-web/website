"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import Magnetic from "../motion/Magnetic";
import type { ContactTrack } from "@/lib/types";

const EASE = [0.22, 1, 0.36, 1] as const;
const OTHER = "Something else";

type Values = { name: string; email: string; company: string; message: string };
type Errors = Partial<Record<"name" | "email" | "message", string>>;
type Status = "idle" | "sending" | "sent" | "error";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v: Values): Errors {
  const errors: Errors = {};
  if (v.name.trim().length < 2) errors.name = "Please tell us your name.";
  if (!EMAIL.test(v.email.trim())) errors.email = "That email address doesn't look right.";
  if (v.message.trim().length < 10) errors.message = "A sentence or two is plenty.";
  return errors;
}

/**
 * Underlined field with a floating label. The rule under it draws itself on
 * focus; the label lifts out of the way once there is something to protect.
 */
function Field({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  type = "text",
  autoComplete,
  multiline = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  multiline?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const raised = focused || value.length > 0;

  const shared = {
    id,
    name: id,
    value,
    autoComplete,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
    onFocus: () => setFocused(true),
    onBlur: () => {
      setFocused(false);
      onBlur();
    },
    className:
      "peer block w-full bg-transparent pb-2.5 pt-6 text-[1.15rem] leading-snug text-brand-900 outline-none sm:text-xl",
  };

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-0 origin-left transition-all duration-300 ease-out ${
          raised
            ? "top-0 -translate-y-px scale-[0.72] text-brand-600"
            : "top-6 scale-100 text-brand-400"
        } text-[1.15rem] sm:text-xl`}
      >
        {label}
      </label>

      {multiline ? (
        <textarea
          {...shared}
          rows={2}
          onChange={(e) => {
            onChange(e.target.value);
            e.currentTarget.style.height = "auto";
            e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
          }}
          className={`${shared.className} min-h-[5.5rem] resize-none`}
        />
      ) : (
        <input {...shared} type={type} onChange={(e) => onChange(e.target.value)} />
      )}

      <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-brand-200" />
      <span
        aria-hidden
        className={`absolute inset-x-0 bottom-0 h-[2px] origin-left bg-brand-800 transition-transform duration-500 ease-out ${
          focused ? "scale-x-100" : "scale-x-0"
        }`}
      />
      {error && (
        <p id={`${id}-error`} className="mt-2 text-[13px] text-[#B42318]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function SentCheck() {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16 text-brand-800" fill="none" aria-hidden>
      <motion.circle
        cx="32"
        cy="32"
        r="29"
        stroke="currentColor"
        strokeWidth="1.5"
        initial={{ pathLength: reduce ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, ease: EASE }}
      />
      <motion.path
        d="M19 33.5l8.5 8.5L45 23.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: reduce ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.55, ease: EASE }}
      />
    </svg>
  );
}

export default function ContactForm({
  tracks,
  track,
  onTrack,
  email,
}: {
  tracks: ContactTrack[];
  track: string | null;
  onTrack: (label: string | null) => void;
  email: string;
}) {
  const [values, setValues] = useState<Values>({ name: "", email: "", company: "", message: "" });
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});
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
  const visible = (key: "name" | "email" | "message") => (touched[key] ? errors[key] : undefined);
  const set = (key: keyof Values) => (value: string) => setValues((v) => ({ ...v, [key]: value }));
  const touch = (key: keyof Values) => () => setTouched((t) => ({ ...t, [key]: true }));

  // If sending fails, nothing the visitor typed is lost: it opens as a ready mail.
  const fallbackMailto = `mailto:${email}?subject=${encodeURIComponent(
    `[Partnership] ${track ?? "Inquiry"}${values.company ? ` - ${values.company}` : ""}`,
  )}&body=${encodeURIComponent(
    `${values.message}\n\n${values.name}${values.company ? `, ${values.company}` : ""}\n${values.email}`,
  )}`;

  const options = [...tracks.map((t) => t.label), OTHER];
  const selectedTrack = tracks.find((t) => t.label === track);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (status === "sending") return;
    setTouched({ name: true, email: true, message: true, company: true });
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

  function reset() {
    setValues({ name: "", email: "", company: "", message: "" });
    setTouched({});
    setStatus("idle");
    startedAt.current = Date.now();
  }

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-brand-100 bg-white shadow-[0px_10px_20px_rgba(15,29,54,0.05),0px_30px_60px_rgba(15,29,54,0.09)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(115,136,176,0.22),transparent_68%)]"
      />

      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="relative flex min-h-[480px] flex-col items-start justify-center p-7 sm:p-10"
          >
            <SentCheck />
            <h3
              ref={sentRef}
              tabIndex={-1}
              className="mt-8 text-3xl font-medium tracking-tight text-brand-900 outline-none sm:text-4xl"
            >
              Thank you, {values.name.trim().split(/\s+/)[0]}.
            </h3>
            <p className="mt-4 max-w-md leading-relaxed text-brand-900/65">
              Your message is on its way to Gabriel. Expect a personal reply to{" "}
              <span className="font-medium text-brand-900">{values.email.trim()}</span> within a few
              working days.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-8 text-sm font-medium text-brand-600 underline-offset-4 hover:text-brand-900 hover:underline"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative p-7 sm:p-10"
            aria-describedby="cf-status"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-brand-500">
                Write to us
              </p>
              <p className="flex items-center gap-2 text-[12px] text-brand-900/55">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500/60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
                </span>
                Reply within a few days
              </p>
            </div>

            <fieldset className="mt-8">
              <legend className="text-sm text-brand-900/60">What&apos;s it about? <span className="text-brand-400">(optional)</span></legend>
              <div role="radiogroup" aria-label="Topic" className="mt-3 flex flex-wrap gap-2">
                {options.map((label) => {
                  const active = track === label;
                  return (
                    <button
                      key={label}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => onTrack(active ? null : label)}
                      className={`relative rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                        active
                          ? "border-brand-900 text-white"
                          : "border-brand-200 text-brand-900/75 hover:border-brand-400 hover:text-brand-900"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="topic-chip"
                          transition={{ duration: 0.45, ease: EASE }}
                          className="absolute inset-0 rounded-full bg-brand-900"
                        />
                      )}
                      <span className="relative">{label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="min-h-[3.25rem]">
                <AnimatePresence mode="wait" initial={false}>
                  {selectedTrack && (
                    <motion.p
                      key={selectedTrack.label}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="mt-3 max-w-lg text-[13px] leading-relaxed text-brand-900/55"
                    >
                      {selectedTrack.text}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </fieldset>

            <div className="mt-2 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              <Field
                id="cf-name"
                label="Your name"
                value={values.name}
                onChange={set("name")}
                onBlur={touch("name")}
                error={visible("name")}
                autoComplete="name"
              />
              <Field
                id="cf-email"
                label="Work email"
                type="email"
                value={values.email}
                onChange={set("email")}
                onBlur={touch("email")}
                error={visible("email")}
                autoComplete="email"
              />
              <div className="sm:col-span-2">
                <Field
                  id="cf-company"
                  label="Company (optional)"
                  value={values.company}
                  onChange={set("company")}
                  onBlur={touch("company")}
                  autoComplete="organization"
                />
              </div>
              <div className="sm:col-span-2">
                <Field
                  id="cf-message"
                  label="What do you have in mind?"
                  value={values.message}
                  onChange={set("message")}
                  onBlur={touch("message")}
                  error={visible("message")}
                  multiline
                />
              </div>
            </div>

            {/* Honeypot: invisible to people, irresistible to bots. */}
            <div aria-hidden className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
              <label>
                Website
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </label>
            </div>

            <div className="mt-9">
              <Magnetic strength={0.12}>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group flex w-full items-center justify-between rounded-full bg-brand-900 py-2 pl-7 pr-2 text-base font-medium text-white transition-colors duration-300 hover:bg-brand-800 disabled:cursor-wait disabled:opacity-80"
                >
                  <span>{status === "sending" ? "Sending…" : "Send inquiry"}</span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-brand-900 transition-transform duration-500 group-hover:translate-x-0.5">
                    {status === "sending" ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-900/25 border-t-brand-900" />
                    ) : (
                      <ArrowRight size={18} weight="bold" aria-hidden />
                    )}
                  </span>
                </button>
              </Magnetic>

              <div id="cf-status" role="status" aria-live="polite">
                {status === "error" && (
                  <p className="mt-4 text-sm text-[#B42318]">
                    {serverError}{" "}
                    <a href={fallbackMailto} className="font-medium underline underline-offset-4">
                      Open it in your email app instead
                    </a>{" "}
                    - your text is already in there.
                  </p>
                )}
              </div>

              <p className="mt-4 text-center text-xs leading-relaxed text-brand-900/45">
                We only use your details to answer you. See our{" "}
                <Link href="/datenschutz" className="underline underline-offset-2 hover:text-brand-900">
                  privacy policy
                </Link>
                .
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
