/**
 * Internal hint for which context {@link harvest} collects, inferred from the
 * selected element. A heuristic guess — never shown in the UI or written to
 * `CRIT.md`, since a wrong tag would read as authoritative.
 */
export type CritCategory = "interaction" | "media" | "copy" | "layout"

export type DockH = "left" | "center" | "right"
export type DockV = "top" | "center" | "bottom"

/**
 * Where the List docks. One of 7 snap points: a 3×3 grid minus the dead
 * centre and 6 o'clock (bottom-centre, left clear for the cursor).
 */
export interface DockAnchor {
  h: DockH
  v: DockV
}

/** Source + identity info react-grab resolves for a selected element. */
export interface CritSource {
  filePath?: string
  lineNumber?: number
  componentName?: string
  tagName?: string
}

/** A bounding rect captured at selection time, for popover anchoring. */
export interface CapturedRect {
  top: number
  left: number
  right: number
  bottom: number
  width: number
  height: number
}

/** A finished crit — one line item in the pass. */
export interface Crit extends CritSource {
  id: string
  category: CritCategory
  note: string
  /** Computed context harvested from the live DOM, label → value. */
  observed: Record<string, string>
  createdAt: number
}

/** A selection captured from react-grab, awaiting a note. */
export interface PendingCapture extends CritSource {
  /** Live element reference — re-measured when the popover opens. */
  element: Element
  category: CritCategory
  observed: Record<string, string>
  rect: CapturedRect
}
