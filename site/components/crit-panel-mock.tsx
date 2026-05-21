"use client"

import { useEffect, useState } from "react"

import { BorderBeam } from "@/components/border-beam"

/** An interactive miniature of CritKit's real list panel (`src/overlay/list-panel.tsx`):
 * header is `[count] CRITS` + Clear All + ✕; each row leads with the source
 * location, then a copy and a delete control, with the note beneath it. Unlike a
 * real crit session this runs on a fixed demo set — Clear All and ✕ empty the
 * panel, the trash glyph drops a single row, the per-row copy writes just that
 * crit as a prompt, and "Restore demo" seeds it again. The
 * panel itself never collapses away, so the example stays on the page. The footer
 * "Copy N crits as a prompt" button is live — it writes the same prompt shape the
 * real product emits (`src/writer.ts` → `buildPrompt`) to the clipboard. */

type DemoCrit = {
  id: string
  source: string
  note: string
}

const SEED_CRITS: DemoCrit[] = [
  {
    id: "section-header",
    source: "<SectionHeader> crit-session.tsx:24",
    note: "Eyebrow should be sentence case, not all-caps.",
  },
  {
    id: "hero",
    source: "<Hero> hero.tsx:61",
    note: "Tighten the CTA padding to match the card above.",
  },
  {
    id: "plan-badge",
    source: "<PlanBadge> demo-zone.tsx:48",
    note: "Badge contrast falls below AA on this surface.",
  },
]

/** The panel's noun — singular for an empty or single-crit session, matching the
 * real `critsLabel` in `list-panel.tsx`. */
function critsLabel(count: number): string {
  return count <= 1 ? "Crit" : "Crits"
}

/** "Copy 3 crits as a prompt" — count-aware, pluralized footer label. */
function copyLabel(count: number, verb: "Copy" | "Copied"): string {
  return `${verb} ${count} ${count === 1 ? "crit" : "crits"} as a prompt`
}

/** Assemble the live crits into the ready-to-paste agent prompt — mirrors the
 * real `buildPrompt` in `src/writer.ts` so the mock copies what the product
 * copies. */
function buildCritPrompt(crits: DemoCrit[]): string {
  const header = [
    "Here's a list of feedback from a crit session. Please work through it top to bottom.",
    "First, turn every item below into a to-do for yourself so you don't skip any.",
    "Each item carries a source location and values harvested from the live DOM.",
    "",
  ]
  const items = crits.map(
    (crit, index) => `${index + 1}. ${crit.note}\n   source: ${crit.source}`,
  )
  return [...header, items.join("\n\n")].join("\n")
}

/** CritKit's own trash glyph, lifted from `list-panel.tsx`. Color is inherited
 * so the wrapping button can drive its hover state. */
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
      className="size-[13px] shrink-0"
    >
      <path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13" />
    </svg>
  )
}

/** Copy glyph for the per-row copy control, lifted from `list-panel.tsx`. */
function CopyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden
      className="size-[13px] shrink-0"
    >
      <path d="M8 8h12v12H8zM16 8V4H4v12h4" />
    </svg>
  )
}

/** ✓ shown for ~1.5s after a per-row copy, matching `list-panel.tsx`. */
function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden
      className="size-[13px] shrink-0"
    >
      <path d="M5 13l4 4 10-11" />
    </svg>
  )
}

/** One crit row — source location leads, then copy + delete controls, with the
 * note beneath. The copy control writes just this crit as a prompt and flashes
 * a ✓, mirroring the real panel's per-row copy. */
function CritRow({ crit, onDelete }: { crit: DemoCrit; onDelete: () => void }) {
  const [copied, setCopied] = useState(false)

  return (
    <div className="border-b border-white/[0.06] px-[13px] py-[11px]">
      <div className="flex items-center justify-between gap-2">
        <span className="min-w-0 flex-1 ck-ui-mono text-[10px] break-all text-[#7a7a7f]">
          {crit.source}
        </span>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(buildCritPrompt([crit]))
              setCopied(true)
              window.setTimeout(() => setCopied(false), 1500)
            } catch {
              /* clipboard blocked — no-op */
            }
          }}
          aria-label={copied ? "Copied" : "Copy crit as a prompt"}
          className={`shrink-0 transition-colors ${
            copied ? "text-[#4ade80]" : "text-[#7a7a7f] hover:text-[#f4f4f5]"
          }`}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label="Delete crit"
          className="shrink-0 text-[#7a7a7f] transition-colors hover:text-[#f4f4f5]"
        >
          <TrashIcon />
        </button>
      </div>
      <p className="mt-1.5 text-[13px] leading-snug text-[#f4f4f5]">
        {crit.note}
      </p>
    </div>
  )
}

export function CritPanelMock() {
  const [crits, setCrits] = useState<DemoCrit[]>(SEED_CRITS)
  const [copied, setCopied] = useState(false)

  // ⌘⌥C on macOS, Ctrl+Alt+C elsewhere — mirrors the real panel's copy
  // shortcut chips (`COPY_KEYS` in `list-panel.tsx`). Defaults to the mac keys
  // so server and first client render agree, then corrects after mount.
  const [copyKeys, setCopyKeys] = useState<string[]>(["⌘", "⌥", "C"])
  useEffect(() => {
    if (typeof navigator !== "undefined" && !/Mac/i.test(navigator.userAgent)) {
      setCopyKeys(["Ctrl", "Alt", "C"])
    }
  }, [])

  const count = crits.length

  return (
    <div className="ck-ui relative w-full max-w-[348px] border border-white/[0.14] bg-[#0b0b0c] text-[#f4f4f5] shadow-[0_36px_90px_-30px_rgba(0,0,0,0.85)]">
      <BorderBeam />

      {/* header — [count] CRITS · Clear All · ✕ */}
      <div className="flex items-center justify-between border-b border-white/[0.08] px-[13px] py-[11px]">
        <span className="flex items-center gap-2">
          {count > 0 ? (
            <span className="bg-[#f4f4f5] px-1.5 py-[3px] ck-ui-mono text-[11px] leading-none font-semibold text-[#0b0b0c]">
              {count}
            </span>
          ) : null}
          <span className="ck-ui-mono text-[11px] leading-none font-semibold tracking-[0.09em] uppercase text-[#d4d4d8]">
            {critsLabel(count)}
          </span>
        </span>
        <span className="flex items-center gap-2">
          {count > 0 ? (
            <button
              type="button"
              onClick={() => setCrits([])}
              className="ck-ui-mono text-[9.5px] leading-none font-semibold tracking-[0.07em] uppercase text-[#7a7a7f] transition-colors hover:text-[#f4f4f5]"
            >
              Clear All
            </button>
          ) : null}
          {/* ✕ — clears the panel (it never hides the example) */}
          <button
            type="button"
            onClick={() => setCrits([])}
            aria-label="Clear all crits"
            className="text-[13px] leading-none text-[#7a7a7f] transition-colors hover:text-[#f4f4f5] disabled:cursor-not-allowed disabled:opacity-40"
            disabled={count === 0}
          >
            ✕
          </button>
        </span>
      </div>

      {/* rows — source location leads, copy + trash follow, note beneath */}
      <div>
        {count === 0 ? (
          <div className="px-[13px] py-[26px] text-center">
            <p className="text-[12px] leading-snug text-[#7a7a7f]">
              No crits left — this is a live demo of the panel.
            </p>
            <button
              type="button"
              onClick={() => {
                setCrits(SEED_CRITS)
                setCopied(false)
              }}
              className="mt-3 ck-ui-mono text-[10px] font-semibold tracking-[0.07em] uppercase text-[#7a7a7f] underline decoration-white/20 underline-offset-4 transition-colors hover:text-[#f4f4f5]"
            >
              Restore demo
            </button>
          </div>
        ) : (
          crits.map((crit) => (
            <CritRow
              key={crit.id}
              crit={crit}
              onDelete={() =>
                setCrits((current) =>
                  current.filter((item) => item.id !== crit.id),
                )
              }
            />
          ))
        )}
      </div>

      {/* footer — copy (live: writes the real prompt shape to the clipboard) */}
      <div className="border-t border-white/[0.08] px-[13px] py-[11px]">
        <button
          type="button"
          disabled={count === 0}
          onClick={async () => {
            if (count === 0) return
            try {
              await navigator.clipboard.writeText(buildCritPrompt(crits))
              setCopied(true)
              window.setTimeout(() => setCopied(false), 1800)
            } catch {
              /* clipboard blocked — no-op */
            }
          }}
          className={`flex w-full items-center justify-center gap-[7px] px-2.5 py-[9px] text-[12px] font-semibold transition-colors active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 ${
            copied
              ? "bg-[#4ade80] text-[#052e12]"
              : "bg-[#f4f4f5] text-[#0b0b0c] hover:bg-white"
          }`}
        >
          {count === 0 ? (
            "No crits to copy"
          ) : copied ? (
            `✓ ${copyLabel(count, "Copied")}`
          ) : (
            <>
              {copyLabel(count, "Copy")}
              {/* shortcut chips — same ⌘⌥C hint the real panel's button carries */}
              <span className="inline-flex items-center gap-[3px]">
                {copyKeys.map((key) => (
                  <kbd
                    key={key}
                    className="inline-flex h-4 min-w-4 items-center justify-center border border-white/[0.16] bg-[#232325] px-1 ck-ui-mono text-[9.5px] leading-none font-semibold text-[#c4c4c8]"
                  >
                    {key}
                  </kbd>
                ))}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
