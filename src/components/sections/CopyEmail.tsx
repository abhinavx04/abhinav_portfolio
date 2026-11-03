"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** Copies the address and confirms in place; the label change is announced to screen readers. */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (permissions, insecure context): the mailto link still works.
    }
  }

  const Icon = copied ? Check : Copy;
  return (
    <button
      type="button"
      onClick={copy}
      className="press inline-flex items-center gap-2 rounded-ui border border-border px-4 py-2.5 text-ui font-semibold text-text transition-colors duration-200 hover:border-text-muted hover:bg-surface"
    >
      <Icon aria-hidden="true" className={`size-4 ${copied ? "text-success" : ""}`} />
      <span aria-live="polite">{copied ? "Copied" : "Copy email"}</span>
    </button>
  );
}
