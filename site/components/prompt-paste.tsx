"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"

const PLACEHOLDER = `Paste your crit prompt here.

Run the live demo above—press C, crit a few elements, write notes, then hit Copy Crit Prompt. Paste it in to see exactly what lands in your coding agent.`

/** The empty paste target for section 03 — a visitor copies a real prompt out
 * of the live demo and drops it here, closing the crit → copy → paste loop. */
export function PromptPaste() {
  const [value, setValue] = useState("")
  const empty = value.trim().length === 0
  const lineCount = empty ? 0 : value.replace(/\n$/, "").split("\n").length

  return (
    <div className="bg-card ring-1 ring-foreground/10">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <span className="font-mono text-[11px] text-muted-foreground">
          crit-prompt.txt
        </span>
        {empty ? (
          <span className="font-mono text-[11px] text-muted-foreground/50">
            paste target
          </span>
        ) : (
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-muted-foreground/50 tabular-nums">
              {lineCount} {lineCount === 1 ? "line" : "lines"}
            </span>
            <button
              type="button"
              onClick={() => setValue("")}
              className="font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
            >
              Clear
            </button>
          </div>
        )}
      </div>
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={PLACEHOLDER}
        spellCheck={false}
        rows={14}
        aria-label="Paste your crit prompt"
        className={cn(
          "block w-full resize-y bg-transparent p-5 font-mono text-[12px] leading-relaxed text-foreground outline-none",
          "placeholder:text-muted-foreground/45",
        )}
      />
    </div>
  )
}
