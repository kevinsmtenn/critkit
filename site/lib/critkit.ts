/**
 * Minimal typed handle onto CritKit's runtime API (`window.__CRITKIT__`),
 * installed by `registerCritKit()`. The site uses it to drive crit mode from
 * its own UI and to read the live crit count into the page.
 */

export interface CritKitSnapshot {
  crits: Crit[]
  critMode: boolean
  panelOpen: boolean
  pending: unknown
}

export interface DockAnchor {
  h: "left" | "center" | "right"
  v: "top" | "center" | "bottom"
}

export interface CritKitStore {
  subscribe(listener: () => void): () => void
  getSnapshot(): CritKitSnapshot
  setCritMode(on: boolean): void
  toggleCritMode(): void
  setPanelOpen(open: boolean): void
  setAnchor(anchor: DockAnchor): void
}

export interface CritKitBridge {
  store: CritKitStore
  capture(element: Element): void
}

export function getCritKit(): CritKitBridge | undefined {
  if (typeof window === "undefined") return undefined
  return (window as unknown as { __CRITKIT__?: CritKitBridge }).__CRITKIT__
}

/* ── Crit shape + prompt builder ───────────────────────────────────────────
 * Mirrors `src/types.ts` and `src/writer.ts` in the critkit package, kept in
 * step here so the site can read the live crit store and assemble the exact
 * prompt the product copies — without reaching into the package internals. */

export type CritCategory = "interaction" | "media" | "copy" | "layout"

/** Source + identity info CritKit resolves for a selected element. */
export interface CritSource {
  filePath?: string
  lineNumber?: number
  componentName?: string
  tagName?: string
}

/** A finished crit — one line item in the session. */
export interface Crit extends CritSource {
  id: string
  category: CritCategory
  note: string
  /** Context harvested from the live DOM, label → value. */
  observed: Record<string, string>
  createdAt: number
}

function formatSource(crit: Crit): string {
  const location = crit.filePath
    ? crit.lineNumber != null
      ? `${crit.filePath}:${crit.lineNumber}`
      : crit.filePath
    : null
  if (location && crit.componentName)
    return `${location} — <${crit.componentName}>`
  if (location) return location
  if (crit.componentName) return `<${crit.componentName}> (file unresolved)`
  return "(source unresolved)"
}

/**
 * Assemble crits into a ready-to-paste agent prompt — a faithful copy of
 * `buildPrompt` in `src/writer.ts`, so a copy button on the site emits the
 * exact text the real list panel does.
 */
export function buildPrompt(crits: Crit[]): string {
  if (crits.length === 0) return ""

  const single = crits.length === 1

  const header = single
    ? [
        "Here's a piece of design feedback from a crit session.",
        "It carries a source location and values harvested from the live DOM.",
        "",
      ]
    : [
        "Here's a list of feedback from a crit session. Please work through it top to bottom.",
        "First, turn every item below into a to-do for yourself so you don't skip any.",
        "Each item carries a source location and values harvested from the live DOM.",
        "",
      ]

  const items = crits.map((crit, index) => {
    const lines = [
      `${single ? "" : `${index + 1}. `}${
        crit.note.trim() || "(needs attention — see observed values)"
      }`,
      `   source: ${formatSource(crit)}`,
    ]
    if (crit.tagName) lines.push(`   element: <${crit.tagName}>`)
    for (const [key, value] of Object.entries(crit.observed)) {
      lines.push(`   ${key}: ${value}`)
    }
    return lines.join("\n")
  })

  return [...header, items.join("\n\n")].join("\n")
}
