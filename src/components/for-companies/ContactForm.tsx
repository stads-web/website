"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import type { ContactTrack } from "@/lib/types";

const EASE = [0.22, 1, 0.36, 1] as const;
const OTHER = "something else";

type Values = { name: string; company: string; email: string; message: string };
type Status = "idle" | "sending" | "sent" | "error";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function problems(v: Values) {
  const list: { id: string; text: string }[] = [];
  if (v.name.trim().length < 2) list.push({ id: "cf-name", text: "your name" });
  if (v.message.trim().length < 10) list.push({ id: "cf-message", text: "a few words about your idea" });
  if (!EMAIL.test(v.email.trim())) list.push({ id: "cf-email", text: "a valid email address" });
  return list;
}

/** Answer slot inside a sentence: sized to its content, ruled underneath. */
function Slot({
  id,
  label,
  value,
  onChange,
  placeholder,
  invalid,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  invalid: boolean;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <input
      id={id}
      name={id}
      type={type}
      aria-label={label}
      aria-invalid={invalid || undefined}
      autoComplete={autoComplete}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: `${Math.max(placeholder.length, value.length) + 1}ch` }}
      className={`mx-1 inline-block max-w-full border-0 border-b-2 bg-transparent px-1 pb-0.5 align-baseline font-medium text-brand-950 outline-none transition-colors duration-300 [font:inherit] placeholder:font-normal placeholder:text-brand-600 focus:border-brand-900 ${
        invalid ? "border-[#B42318]" : "border-brand-200"
      }`}
    />
  );
}

export default function ContactForm({
  tracks,
  firstName,
  email: to,
}: {
  tracks: ContactTrack[];
  firstName: string;
  email: string;
}) {
  const reduce = useReducedMotion();
  const [values, setValues] = useState<Values>({ name: "", company: "", email: "", message: "" });
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

  const issues = problems(values);
  const bad = (id: string) => attempted && issues.some((i) => i.id === id);
  const set = (key: keyof Values) => (value: string) => setValues((v) => ({ ...v, [key]: value }));

  const options = [...tracks.map((t) => t.label), OTHER];
  const selected = tracks.find((t) => t.label === track);

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
    if (issues.length) {
      document.getElementById(issues[0].id)?.focus();
      return;
    }
    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          track: track === OTHER ? "Something else" : track,
          website: honeypot,
          t: startedAt.current,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || "Something went wrong.");
      setStatus("sent");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  const sentence =
    "text-[1.55rem] leading-[1.5] tracking-tight text-brand-500 sm:text-[2rem] sm:leading-[1.45] lg:text-[2.2rem]";

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "sent" ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.6, ease: EASE }}
          className="py-6"
        >
          <h3
            ref={sentRef}
            tabIndex={-1}
            className="text-4xl font-medium leading-[1.1] tracking-tight text-brand-950 outline-none sm:text-5xl"
          >
            Thank you, {values.name.trim().split(/\s+/)[0]}.
          </h3>
          <motion.span
            aria-hidden
            initial={{ scaleX: reduce ? 1 : 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
            className="mt-5 block h-0.5 w-24 origin-left bg-brand-900"
          />
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-brand-900/70">
            {firstName} will answer {values.email.trim()} in the next few working days.
          </p>
          <button
            type="button"
            onClick={() => {
              setValues({ name: "", company: "", email: "", message: "" });
              setTrack(null);
              setAttempted(false);
              setStatus("idle");
              startedAt.current = Date.now();
            }}
            className="mt-8 text-sm font-medium text-brand-600 underline underline-offset-4 hover:text-brand-950"
          >
            Write another message
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={onSubmit}
          noValidate
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <p className={sentence}>
            Hi {firstName}, I&apos;m
            <Slot
              id="cf-name"
              label="Your name"
              value={values.name}
              onChange={set("name")}
              placeholder="your name"
              invalid={bad("cf-name")}
              autoComplete="name"
            />
            from
            <Slot
              id="cf-company"
              label="Company (optional)"
              value={values.company}
              onChange={set("company")}
              placeholder="your company"
              invalid={false}
              autoComplete="organization"
            />
            .
          </p>

          <div className={`mt-6 ${sentence}`}>
            <p id="cf-topic-label">We&apos;d like to talk about</p>
            <div
              role="radiogroup"
              aria-labelledby="cf-topic-label"
              className="mt-1 flex flex-wrap gap-x-6 gap-y-1"
            >
              {options.map((label) => {
                const active = track === label;
                return (
                  <button
                    key={label}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setTrack(active ? null : label)}
                    className={`relative pb-1 text-left font-medium transition-colors duration-300 ${
                      active ? "text-brand-950" : "text-brand-600 hover:text-brand-950"
                    }`}
                  >
                    {label}
                    {active && (
                      <motion.span
                        layoutId="topic-rule"
                        transition={{ duration: reduce ? 0 : 0.45, ease: EASE }}
                        className="absolute inset-x-0 bottom-0 h-0.5 bg-brand-900"
                      />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="min-h-[3.5rem]" aria-live="polite">
              {selected && (
                <p className="mt-3 max-w-xl text-[15px] leading-relaxed tracking-normal text-brand-900/65">
                  {selected.text}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="cf-message" className={`block ${sentence}`}>
              Here is what we have in mind:
            </label>
            <textarea
              id="cf-message"
              name="cf-message"
              rows={3}
              value={values.message}
              placeholder="A few words about your idea, timing or questions."
              aria-invalid={bad("cf-message") || undefined}
              onChange={(e) => {
                set("message")(e.target.value);
                e.currentTarget.style.height = "auto";
                e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
              }}
              className={`mt-2 block w-full resize-none border-0 border-b-2 bg-transparent pb-2 text-xl font-medium leading-snug text-brand-950 outline-none transition-colors duration-300 placeholder:font-normal placeholder:text-brand-600 focus:border-brand-900 sm:text-2xl ${
                bad("cf-message") ? "border-[#B42318]" : "border-brand-200"
              }`}
            />
          </div>

          <p className={`mt-6 ${sentence}`}>
            You can reach me at
            <Slot
              id="cf-email"
              label="Your work email"
              type="email"
              value={values.email}
              onChange={set("email")}
              placeholder="name@company.com"
              invalid={bad("cf-email")}
              autoComplete="email"
            />
            .
          </p>

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

          <div className="mt-10" role="status" aria-live="polite">
            {attempted && issues.length > 0 && (
              <p className="mb-5 text-[15px] text-[#B42318]">
                Almost there. We still need {issues.map((i) => i.text).join(", ").replace(/, ([^,]*)$/, " and $1")}.
              </p>
            )}
            {status === "error" && (
              <p className="mb-5 text-[15px] text-[#B42318]">
                {serverError}{" "}
                <a href={fallbackMailto} className="font-medium underline underline-offset-4">
                  Open it in your email app instead
                </a>
                . Your text is already in there.
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center gap-3 rounded-full bg-brand-900 px-8 py-4 text-base font-medium text-white transition-all duration-300 hover:bg-brand-800 active:translate-y-px disabled:cursor-wait disabled:opacity-80"
            >
              {status === "sending" ? "Sending" : "Send message"}
              <ArrowRight size={18} weight="bold" aria-hidden />
            </button>
            <p className="max-w-xs text-sm leading-relaxed text-brand-900/60">
              {firstName} answers personally. We only use your details to reply, see our{" "}
              <Link href="/datenschutz" className="underline underline-offset-2 hover:text-brand-950">
                privacy policy
              </Link>
              .
            </p>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
