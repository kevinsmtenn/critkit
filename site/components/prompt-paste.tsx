"use client"

import { useState } from "react"

const PLACEHOLDER = `Paste a copied crit prompt here to see exactly what lands in your coding agent.`

/** The paste target for section 03 — styled as a terminal: window chrome, a
 * prompt caret, monospace. A visitor copies a real prompt out of the live demo
 * and drops it in, closing the crit → copy → paste loop. */
export function PromptPaste() {
  const [value, setValue] = useState("")
  const empty = value.trim().length === 0
  const lineCount = empty ? 0 : value.replace(/\n$/, "").split("\n").length

  return (
    <div className="bg-[#0b0b0c] ring-1 ring-foreground/10">
      {/* terminal title bar */}
      <div className="flex items-center justify-between border-b border-white/[0.08] px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span aria-hidden className="flex gap-1.5">
            <span className="size-2 border border-white/15" />
            <span className="size-2 border border-white/15" />
            <span className="size-2 border border-white/15" />
          </span>
          <span className="ml-1 font-mono text-[11px] text-muted-foreground">
            crit-prompt.txt
          </span>
        </div>
        {empty ? (
          <span className="font-mono text-[11px] text-muted-foreground/45">
            awaiting paste
          </span>
        ) : (
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] tabular-nums text-muted-foreground/45">
              {lineCount} {lineCount === 1 ? "line" : "lines"}
            </span>
            <button
              type="button"
              onClick={() => setValue("")}
              className="font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
            >
              clear
            </button>
          </div>
        )}
      </div>

      {/* terminal body — a prompt caret, then the input */}
      <div className="relative">
        <span
          aria-hidden
          className="pointer-events-none absolute top-4 left-4 font-mono text-[12px] leading-relaxed text-[oklch(0.72_0.16_150)]"
        >
          ›
        </span>
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={PLACEHOLDER}
          spellCheck={false}
          rows={14}
          aria-label="Paste your crit prompt"
          className="block w-full resize-y bg-transparent py-4 pr-4 pl-8 font-mono text-[12px] leading-relaxed text-foreground caret-[oklch(0.72_0.16_150)] outline-none placeholder:text-muted-foreground/40"
        />
      </div>
    </div>
  )
}
