/**
 * Minimal typed handle onto CritKit's runtime API (`window.__CRITKIT__`),
 * installed by `registerCritKit()`. The site uses it to drive crit mode from
 * its own UI and to read the live crit count into the page.
 */

export interface CritKitSnapshot {
  crits: unknown[]
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
