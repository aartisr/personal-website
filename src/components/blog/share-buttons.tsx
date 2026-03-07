"use client";

import { useState } from "react";

type ShareButtonsProps = {
  url: string;
  title: string;
};

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
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
      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noreferrer"
        className="text-xs rounded-full px-3 py-1.5 border"
        style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
      >
        Share on LinkedIn
      </a>
      <a
        href={shareLinks.x}
        target="_blank"
        rel="noreferrer"
        className="text-xs rounded-full px-3 py-1.5 border"
        style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
      >
        Share on X
      </a>
      <a
        href={shareLinks.email}
        className="text-xs rounded-full px-3 py-1.5 border"
        style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
      >
        Share via Email
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="text-xs rounded-full px-3 py-1.5 border"
        style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
      >
        {copied ? "Link Copied" : "Copy Link"}
      </button>
    </div>
  );
}
