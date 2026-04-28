"use client";

import { useEffect, useState } from "react";
import {
  Link as LinkIcon,
  Linkedin,
  Mail,
  MessageCircle,
  Send,
  Share2,
} from "lucide-react";

type ShareButtonsProps = {
  url: string;
  title: string;
};

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
  };

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && "share" in navigator);
  }, []);

  const handleNativeShare = async () => {
    if (!navigator.share) {
      return;
    }

    try {
      await navigator.share({ title, url });
    } catch {
      // The user can cancel native sharing; no UI state is needed.
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {canNativeShare && (
        <button
          type="button"
          onClick={handleNativeShare}
          className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium border border-[color:var(--border)] text-[color:var(--muted-foreground)]"
        >
          <Share2 size={13} aria-hidden="true" />
          Share
        </button>
      )}
      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium border border-[color:var(--border)] text-[color:var(--muted-foreground)]"
      >
        <Linkedin size={13} aria-hidden="true" />
        LinkedIn
      </a>
      <a
        href={shareLinks.x}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium border border-[color:var(--border)] text-[color:var(--muted-foreground)]"
      >
        <Send size={13} aria-hidden="true" />
        X
      </a>
      <a
        href={shareLinks.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium border border-[color:var(--border)] text-[color:var(--muted-foreground)]"
      >
        <MessageCircle size={13} aria-hidden="true" />
        WhatsApp
      </a>
      <a
        href={shareLinks.email}
        className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium border border-[color:var(--border)] text-[color:var(--muted-foreground)]"
      >
        <Mail size={13} aria-hidden="true" />
        Email
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium border border-[color:var(--border)] text-[color:var(--muted-foreground)]"
      >
        <LinkIcon size={13} aria-hidden="true" />
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
