"use client"

import { useEffect, useState } from "react"

/**
 * True on touch-first devices (phones, tablets) — ones that can't hover.
 * CritKit's crit mode is hover-to-highlight-then-pick, so the page disables
 * its crit CTAs here rather than let users into a broken flow.
 *
 * SSR-safe: starts `false` so server and first client render agree, then
 * settles on mount. Tracks live changes (e.g. a tablet docking a mouse).
 */
export function useCoarsePointer(): boolean {
  const [coarse, setCoarse] = useState(false)

  useEffect(() => {
    const query = window.matchMedia("(hover: none) and (pointer: coarse)")
    const sync = () => setCoarse(query.matches)
    sync()
    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [])

  return coarse
}
