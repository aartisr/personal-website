"use client";

import { ShieldCheck } from "lucide-react";
import { WalletProofClient } from "./wallet-proof-client";

export type WalletProofBlockProps = {
  anchorId?: string;
  heading: string;
  description: string;
  note?: string;
};

export function WalletProofBlock({ anchorId = "wallet-proof", heading, description, note }: WalletProofBlockProps) {
  return (
    <section id={anchorId || undefined} className="scroll-mt-24 border-b border-border/70 bg-card px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-border bg-background p-6 shadow-[0_14px_36px_rgba(12,22,48,.06)] sm:p-8">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true"><ShieldCheck size={22} /></span>
          <h2 className="mt-5 text-3xl font-bold text-foreground">{heading}</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">{description}</p>
          <div className="mt-7"><WalletProofClient /></div>
          {note && <p className="mt-6 border-t border-border pt-5 text-sm leading-6 text-muted-foreground">{note}</p>}
        </div>
      </div>
    </section>
  );
}
