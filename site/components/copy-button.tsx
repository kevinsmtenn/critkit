"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

import { cn } from "@/lib/utils"

/** A small inline copy control — flips to a check for ~1.8s after a copy. */
export function CopyButton({
  value,
  label,
  className,
}: {
  value: string
  label?: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      type="button"
      aria-label={label ?? "Copy to clipboard"}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value)
          setCopied(true)
          window.setTimeout(() => setCopied(false), 1800)
        } catch {
          /* clipboard blocked — no-op */
        }
      }}
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wide whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground",
        className,
      )}
    >
      {copied ? (
        <Check className="size-3.5 text-[oklch(0.7_0.16_150)]" />
      ) : (
        <Copy className="size-3.5" />
      )}
      {label ? <span>{copied ? "Copied" : label}</span> : null}
    </button>
  )
}
