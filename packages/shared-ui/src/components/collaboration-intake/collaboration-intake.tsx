"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

export type CollaborationPath = { id: "mentor" | "community" | "technical" | "other"; title: string; description: string; prompt: string; fields?: Array<{ name: string; label: string; type?: "text" | "url" }> };
export type CollaborationResource = { id: string; label: string; href: string };
export type CollaborationIntakeProps = { eyebrow?: string; heading: string; description?: string; paths?: CollaborationPath[]; resources?: CollaborationResource[]; agreement?: string };

const roles = [["mentor_educator", "Mentor or educator"], ["community_organization", "Community organization"], ["student", "Student"], ["technical_collaborator", "Technical collaborator"], ["other", "Other"]] as const;

export function CollaborationIntake({ eyebrow = "Collaboration", heading, description, paths = [], resources = [], agreement = "I understand this starts an inquiry, not a commitment, and I will not include confidential or sensitive personal information." }: CollaborationIntakeProps) {
  const headingId = useId(), errorRef = useRef<HTMLDivElement>(null);
  const [pathId, setPathId] = useState<CollaborationPath["id"] | null>(null);
  const [step, setStep] = useState(1), [sent, setSent] = useState(false), [busy, setBusy] = useState(false);
  const [error, setError] = useState(""), [values, setValues] = useState<Record<string, string>>({}), [acknowledged, setAcknowledged] = useState(false);
  const selected = useMemo(() => paths.find((path) => path.id === pathId) ?? null, [pathId, paths]);

  useEffect(() => {
    const candidate = new URLSearchParams(window.location.search).get("path");
    if (candidate && paths.some((path) => path.id === candidate)) setPathId(candidate as CollaborationPath["id"]);
    const draft = sessionStorage.getItem("collaboration-draft");
    if (draft) try { setValues(JSON.parse(draft)); } catch { sessionStorage.removeItem("collaboration-draft"); }
  }, [paths]);
  useEffect(() => { if (Object.keys(values).length) sessionStorage.setItem("collaboration-draft", JSON.stringify(values)); }, [values]);

  function update(name: string, value: string) { setValues((current) => ({ ...current, [name]: value })); }
  function choose(path: CollaborationPath) { setPathId(path.id); setStep(1); setError(""); }
  function validateFirst() {
    if (!selected) return "Choose a collaboration path.";
    if (!values.name?.trim()) return "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email?.trim() ?? "")) return "Enter a valid email address.";
    if (!values.role) return "Choose how you are reaching out.";
    if ((values.message?.trim().length ?? 0) < 12) return "Please share a little more context for the conversation.";
    return "";
  }
  function next() { const issue = validateFirst(); if (issue) { setError(issue); requestAnimationFrame(() => errorRef.current?.focus()); return; } setError(""); setStep(2); }
  async function submit() {
    if (!acknowledged) { setError("Please confirm the collaboration working agreement."); requestAnimationFrame(() => errorRef.current?.focus()); return; }
    setBusy(true); setError("");
    try {
      const details = Object.fromEntries((selected?.fields ?? []).map((field) => [field.name, values[field.name] ?? ""]).filter(([, value]) => Boolean(value.trim())));
      const response = await fetch("/api/collaboration", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path: selected?.id, name: values.name, email: values.email, role: values.role, message: values.message, acknowledgement: acknowledged, details, honeypot: values.company ?? "" }) });
      const body = await response.json().catch(() => null) as { error?: string } | null;
      if (!response.ok) throw new Error(body?.error || "Your inquiry could not be delivered. Please try again later.");
      sessionStorage.removeItem("collaboration-draft"); setSent(true);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Your inquiry could not be delivered. Please try again later."); requestAnimationFrame(() => errorRef.current?.focus()); } finally { setBusy(false); }
  }

  return <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8" aria-labelledby={headingId}>
    <div className="mx-auto max-w-5xl">
      <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.18em] text-indigo-700">{eyebrow}</p><h1 id={headingId} className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">{heading}</h1>{description && <p className="mt-5 text-lg leading-8 text-slate-600">{description}</p>}<p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-700"><ShieldCheck size={18} aria-hidden="true" /> No confidential information needed. Mutual fit comes first.</p></div>
      {sent ? <div className="mt-10 rounded-3xl border border-emerald-200 bg-white p-8 shadow-sm" role="status"><CheckCircle2 className="text-emerald-600" size={34} aria-hidden="true" /><h2 className="mt-4 text-2xl font-bold text-slate-950">Your inquiry is on its way.</h2><p className="mt-3 max-w-2xl text-slate-600">Thank you for the context. The next step is a fit review, not an automatic commitment. If a reply is possible, it will use the email you provided.</p><ol className="mt-5 list-decimal space-y-2 pl-5 text-sm text-slate-700"><li>Your note is reviewed for fit, safeguarding, and a clear next step.</li><li>If there is a fit, the response will suggest a focused conversation or a useful resource.</li></ol><div className="mt-7 flex flex-wrap gap-3">{resources.slice(0, 2).map((resource) => <a key={resource.id} href={resource.href} className="rounded-lg border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-800">{resource.label} <span aria-hidden="true">↗</span></a>)}</div></div> : <>
        <div className="mt-10 grid gap-4 sm:grid-cols-2" role="list" aria-label="Collaboration paths">{paths.map((path) => <button key={path.id} type="button" onClick={() => choose(path)} aria-pressed={path.id === pathId} className={"min-h-32 rounded-2xl border p-6 text-left transition focus:outline-none focus:ring-4 focus:ring-indigo-200 " + (path.id === pathId ? "border-indigo-600 bg-indigo-700 text-white shadow-lg" : "border-slate-200 bg-white text-slate-950 hover:border-indigo-300")}><span className="text-sm font-bold">{path.title}</span><span className={"mt-2 block text-sm leading-6 " + (path.id === pathId ? "text-indigo-100" : "text-slate-600")}>{path.description}</span></button>)}</div>
        {selected && <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between gap-3"><p className="text-sm font-bold text-indigo-700">Step {step} of 2 · {selected.title}</p><button type="button" onClick={() => { sessionStorage.removeItem("collaboration-draft"); setValues({}); }} className="text-sm font-semibold text-slate-600 underline">Clear draft</button></div>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">{step === 1 ? "Start with the essentials." : "Add context only if it helps."}</h2>
          {error && <div ref={errorRef} tabIndex={-1} role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-800">{error}</div>}
          {step === 1 ? <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label="Your name" name="name" value={values.name ?? ""} onChange={update} required />
            <Field label="Email" name="email" type="email" value={values.email ?? ""} onChange={update} required />
            <fieldset className="sm:col-span-2"><legend className="text-sm font-bold text-slate-800">You are reaching out as <span aria-hidden="true">*</span></legend><div className="mt-2 flex flex-wrap gap-2">{roles.map(([value, label]) => <label key={value} className={"cursor-pointer rounded-full border px-3 py-2 text-sm " + (values.role === value ? "border-indigo-600 bg-indigo-50 text-indigo-900" : "border-slate-200 text-slate-700")}><input className="sr-only" type="radio" name="role" value={value} checked={values.role === value} onChange={(event) => update("role", event.target.value)} />{label}</label>)}</div></fieldset>
            <div className="sm:col-span-2"><Field label={selected.prompt} name="message" type="textarea" value={values.message ?? ""} onChange={update} helper="A few sentences are enough. Do not include private, medical, or confidential information." required /></div>
            <input className="hidden" aria-hidden="true" tabIndex={-1} name="company" value={values.company ?? ""} onChange={(event) => update("company", event.target.value)} />
            <button type="button" onClick={next} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-700 px-5 font-bold text-white sm:col-span-2">Continue <ArrowRight size={18} /></button>
          </div> : <div className="mt-6 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">{(selected.fields ?? []).map((field) => <Field key={field.name} label={field.label} name={field.name} type={field.type} value={values[field.name] ?? ""} onChange={update} />)}</div>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700"><input className="mt-1 h-4 w-4" type="checkbox" checked={acknowledged} onChange={(event) => setAcknowledged(event.target.checked)} /><span>{agreement}</span></label>
            <div className="flex flex-wrap gap-3"><button type="button" onClick={() => setStep(1)} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-slate-300 px-5 font-bold text-slate-800"><ArrowLeft size={18} /> Back</button><button type="button" disabled={busy} onClick={submit} className="min-h-12 rounded-xl bg-indigo-700 px-5 font-bold text-white disabled:opacity-60">{busy ? "Sending inquiry…" : "Send inquiry"}</button></div>
          </div>}
          <p className="mt-6 text-xs leading-5 text-slate-500">Working agreement: no emergency, medical, financial, or confidential requests; appropriate adult or institutional coordination is expected when needed.</p>
        </div>}
      </>}
    </div>
  </section>;
}
function Field({ label, name, type = "text", value, onChange, helper, required = false }: { label: string; name: string; type?: "text" | "email" | "url" | "textarea"; value: string; onChange: (name: string, value: string) => void; helper?: string; required?: boolean }) {
  const id = useId(); return <div><label htmlFor={id} className="text-sm font-bold text-slate-800">{label}{required && <span aria-hidden="true"> *</span>}</label>{helper && <p className="mt-1 text-xs text-slate-500">{helper}</p>}{type === "textarea" ? <textarea id={id} rows={5} value={value} onChange={(event) => onChange(name, event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100" /> : <input id={id} type={type} value={value} onChange={(event) => onChange(name, event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 px-3 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100" />}</div>;
}
