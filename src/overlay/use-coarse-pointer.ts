import { useEffect, useState } from "react"

const QUERY = "(hover: none) and (pointer: coarse)"

/**
 * True on touch-first devices (phones, tablets) — ones that can't hover.
 * Crit mode is hover-to-highlight-then-pick, so the overlay keeps its launcher
 * off these devices entirely rather than offer a control that can't work.
 *
 * The overlay only ever mounts client-side (see `mountOverlay`), so the first
 * value is read straight from `matchMedia` — no flash of a launcher that then
 * vanishes. Tracks live changes too, e.g. a tablet docking a mouse.
 */
export function useCoarsePointer(): boolean {
  const [coarse, setCoarse] = useState(() => window.matchMedia(QUERY).matches)

  useEffect(() => {
    const query = window.matchMedia(QUERY)
    const sync = () => setCoarse(query.matches)
    sync()
    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [])

  return coarse
}
