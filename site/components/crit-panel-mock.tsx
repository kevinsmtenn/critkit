"use client"

import { useState } from "react"

import { BorderBeam } from "@/components/border-beam"

/** A faithful still of CritKit's real list panel (`src/overlay/list-panel.tsx`):
 * header is `[count] CRITS` + Clear All + ✕; each row leads with the source
 * location and a delete control, the editable note sits beneath it. The footer
 * "Copy Crit Prompt" button is live — it writes the same prompt shape the real
 * product emits (`src/writer.ts` → `buildPrompt`) to the clipboard. */

const CRITS = [
  {
    source: "<SectionHeader> crit-session.tsx:24",
    note: "Eyebrow should be sentence case, not all-caps.",
  },
  {
    source: "<Hero> hero.tsx:61",
    note: "Tighten the CTA padding to match the card above.",
  },
  {
    source: "<PlanBadge> demo-zone.tsx:48",
    note: "Badge contrast falls below AA on this surface.",
  },
]

/** Assemble CRITS into the ready-to-paste agent prompt — mirrors the real
 * `buildPrompt` in `src/writer.ts` so the mock copies what the product copies. */
function buildCritPrompt(): string {
  const header = [
    "Here's a crit session on the running app — please work through each item top to bottom.",
    "Each item carries a source location and values harvested from the live DOM.",
    "",
  ]
  const items = CRITS.map(
    (crit, index) => `${index + 1}. ${crit.note}\n   source: ${crit.source}`,
  )
  return [...header, items.join("\n\n")].join("\n")
}

/** CritKit's own trash glyph, lifted from `list-panel.tsx`. */
function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden
      className="size-[13px] shrink-0 text-[#7a7a7f]"
    >
      <path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13" />
    </svg>
  )
}

export function CritPanelMock() {
  const [copied, setCopied] = useState(false)

  return (
    <div className="ck-ui relative w-full max-w-[348px] border border-white/[0.14] bg-[#0b0b0c] text-[#f4f4f5] shadow-[0_36px_90px_-30px_rgba(0,0,0,0.85)]">
      <BorderBeam />

      {/* header — [count] CRITS · Clear All · collapse */}
      <div className="flex items-center justify-between border-b border-white/[0.08] px-[13px] py-[11px]">
        <span className="flex items-center gap-2">
          <span className="bg-[#f4f4f5] px-1.5 py-[3px] ck-ui-mono text-[11px] leading-none font-semibold text-[#0b0b0c]">
            3
          </span>
          <span className="ck-ui-mono text-[11px] leading-none font-semibold tracking-[0.09em] uppercase text-[#d4d4d8]">
            Crits
          </span>
        </span>
        <span className="flex items-center gap-2">
          <span className="ck-ui-mono text-[9.5px] leading-none font-semibold tracking-[0.07em] uppercase text-[#7a7a7f]">
            Clear All
          </span>
          <span className="text-[13px] leading-none text-[#7a7a7f]">✕</span>
        </span>
      </div>

      {/* rows — source location leads, note beneath */}
      <div>
        {CRITS.map((crit) => (
          <div
            key={crit.source}
            className="border-b border-white/[0.06] px-[13px] py-[11px]"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="min-w-0 flex-1 ck-ui-mono text-[10px] break-all text-[#7a7a7f]">
                {crit.source}
              </span>
              <TrashIcon />
            </div>
            <p className="mt-1.5 text-[13px] leading-snug text-[#f4f4f5]">
              {crit.note}
            </p>
          </div>
        ))}
      </div>

      {/* footer — copy (live: writes the real prompt shape to the clipboard) */}
      <div className="border-t border-white/[0.08] px-[13px] py-[11px]">
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(buildCritPrompt())
              setCopied(true)
              window.setTimeout(() => setCopied(false), 1800)
            } catch {
              /* clipboard blocked — no-op */
            }
          }}
          className="flex w-full items-center justify-center bg-[#f4f4f5] px-2.5 py-[9px] text-[12px] font-semibold text-[#0b0b0c] transition-opacity hover:opacity-90"
        >
          {copied ? "✓ Copied" : "Copy Crit Prompt"}
        </button>
      </div>
    </div>
  )
}
