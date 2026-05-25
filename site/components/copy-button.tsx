"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

import { copyText } from "@/lib/clipboard"
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
        const ok = await copyText(value)
        if (!ok) return
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1800)
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
