"use client"

import { useEffect } from "react"

import { getCritKit } from "@/lib/critkit"

/**
 * Boots CritKit on the client so the whole landing page is a live demo:
 * visitors press `C` and crit the page itself, exactly as they would crit
 * their own running app. CritKit mounts its overlay into a shadow root, so
 * none of its styles touch the page.
 */
export function CritKitProvider() {
  useEffect(() => {
    let cancelled = false
    void import("critkit").then(({ registerCritKit }) => {
      if (cancelled) return
      registerCritKit()
      // Dock the live list to the bottom-right corner so it clears the hero's
      // mock panel and the centered launcher.
      getCritKit()?.store.setAnchor({ h: "right", v: "bottom" })
    })
    return () => {
      cancelled = true
    }
  }, [])

  return null
}
