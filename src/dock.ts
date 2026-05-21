import type { DockAnchor } from "./types"

/** Gap between the docked List and the viewport edge. */
export const DOCK_MARGIN = 16

/**
 * The 7 snap anchors — a 3×3 grid minus the dead centre and 6 o'clock
 * (bottom-centre). The List magnetizes to the nearest of these on release.
 */
export const DOCK_ANCHORS: DockAnchor[] = [
  { h: "left", v: "top" }, //     ┐
  { h: "center", v: "top" }, //   │ 12 o'clock
  { h: "right", v: "top" }, //    ┘
  { h: "left", v: "center" }, //    9 o'clock
  { h: "right", v: "center" }, //   3 o'clock
  { h: "left", v: "bottom" }, //  ┐ (6 o'clock skipped)
  { h: "right", v: "bottom" }, // ┘
]

export interface DockSize {
  w: number
  h: number
}

/** Top-left origin (px) for a dock of the given size resting at an anchor. */
export function anchorOrigin(
  anchor: DockAnchor,
  size: DockSize,
): { x: number; y: number } {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const x =
    anchor.h === "left"
      ? DOCK_MARGIN
      : anchor.h === "right"
        ? Math.max(DOCK_MARGIN, vw - size.w - DOCK_MARGIN)
        : (vw - size.w) / 2
  const y =
    anchor.v === "top"
      ? DOCK_MARGIN
      : anchor.v === "bottom"
        ? Math.max(DOCK_MARGIN, vh - size.h - DOCK_MARGIN)
        : (vh - size.h) / 2
  return { x, y }
}

/** The anchor whose resting position is closest to the given top-left origin. */
export function nearestAnchor(
  origin: { x: number; y: number },
  size: DockSize,
): DockAnchor {
  const centerX = origin.x + size.w / 2
  const centerY = origin.y + size.h / 2
  let best: DockAnchor = { h: "right", v: "bottom" }
  let bestDistance = Infinity
  for (const anchor of DOCK_ANCHORS) {
    const resting = anchorOrigin(anchor, size)
    const dx = resting.x + size.w / 2 - centerX
    const dy = resting.y + size.h / 2 - centerY
    const distance = dx * dx + dy * dy
    if (distance < bestDistance) {
      bestDistance = distance
      best = anchor
    }
  }
  return best
}
