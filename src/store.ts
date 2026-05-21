import type { Crit, DockAnchor, PendingCapture } from "./types"

const STORAGE_KEY = "critkit:crits:v1"
const ANCHOR_KEY = "critkit:anchor:v1"
const DEFAULT_ANCHOR: DockAnchor = { h: "right", v: "center" }

export interface CritKitState {
  /** Committed crits, oldest first. */
  crits: Crit[]
  /** A selection awaiting a note, or null when no capture is in progress. */
  pending: PendingCapture | null
  /** Whether the List panel is expanded. */
  panelOpen: boolean
  /** Which of the 7 snap points the List is docked at. */
  anchor: DockAnchor
  /** Whether crit mode (CritKit's own hover-to-pick) is on. */
  critMode: boolean
}

const listeners = new Set<() => void>()

let state: CritKitState = {
  crits: loadCrits(),
  pending: null,
  panelOpen: false,
  anchor: loadAnchor(),
  critMode: false,
}

function loadCrits(): Crit[] {
  if (typeof sessionStorage === "undefined") return []
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Crit[]) : []
  } catch {
    return []
  }
}

function persist(crits: Crit[]): void {
  if (typeof sessionStorage === "undefined") return
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(crits))
  } catch {
    // sessionStorage unavailable or full — in-memory state still works.
  }
}

function loadAnchor(): DockAnchor {
  if (typeof sessionStorage === "undefined") return DEFAULT_ANCHOR
  try {
    const raw = sessionStorage.getItem(ANCHOR_KEY)
    return raw ? (JSON.parse(raw) as DockAnchor) : DEFAULT_ANCHOR
  } catch {
    return DEFAULT_ANCHOR
  }
}

function persistAnchor(anchor: DockAnchor): void {
  if (typeof sessionStorage === "undefined") return
  try {
    sessionStorage.setItem(ANCHOR_KEY, JSON.stringify(anchor))
  } catch {
    // sessionStorage unavailable — in-memory anchor still works.
  }
}

function setState(patch: Partial<CritKitState>): void {
  state = { ...state, ...patch }
  for (const listener of listeners) listener()
}

function makeId(): string {
  return Math.random().toString(36).slice(2, 6)
}

/**
 * Module-singleton store for the crit session. Drives the overlay via
 * `useSyncExternalStore`; mirrors committed crits to `sessionStorage` so a
 * reload doesn't drop a session in progress.
 */
export const critStore = {
  subscribe(listener: () => void): () => void {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },

  getSnapshot(): CritKitState {
    return state
  },

  /** Open a capture for a freshly selected element. */
  beginCapture(pending: PendingCapture): void {
    setState({ pending })
  },

  /** Dismiss the in-progress capture without recording anything. */
  cancelCapture(): void {
    setState({ pending: null })
  },

  /** Turn the in-progress capture into a committed crit; reveal the List. */
  commitCrit(note: string): void {
    const pending = state.pending
    if (!pending) return
    const crit: Crit = {
      id: makeId(),
      category: pending.category,
      note: note.trim(),
      filePath: pending.filePath,
      lineNumber: pending.lineNumber,
      componentName: pending.componentName,
      tagName: pending.tagName,
      observed: pending.observed,
      createdAt: Date.now(),
    }
    const crits = [...state.crits, crit]
    persist(crits)
    // Leaving a crit expands the List so the running session stays in view.
    setState({ crits, pending: null, panelOpen: true })
  },

  updateNote(id: string, note: string): void {
    const crits = state.crits.map((crit) =>
      crit.id === id ? { ...crit, note } : crit,
    )
    persist(crits)
    setState({ crits })
  },

  removeCrit(id: string): void {
    const crits = state.crits.filter((crit) => crit.id !== id)
    persist(crits)
    setState({ crits, panelOpen: crits.length > 0 && state.panelOpen })
  },

  clearCrits(): void {
    persist([])
    setState({ crits: [], panelOpen: false })
  },

  setPanelOpen(panelOpen: boolean): void {
    setState({ panelOpen })
  },

  setAnchor(anchor: DockAnchor): void {
    persistAnchor(anchor)
    setState({ anchor })
  },

  setCritMode(critMode: boolean): void {
    if (state.critMode === critMode) return
    setState({ critMode })
  },

  toggleCritMode(): void {
    setState({ critMode: !state.critMode })
  },
}
