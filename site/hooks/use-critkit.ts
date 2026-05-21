"use client"

import { useEffect, useState } from "react"
import { getCritKit, type CritKitSnapshot } from "@/lib/critkit"

/**
 * Subscribes the page to CritKit's live store. The store only exists once
 * `registerCritKit()` has run (lazily, in `CritKitProvider`), so this polls
 * briefly until the `window.__CRITKIT__` handle appears, then subscribes.
 */
export function useCritKit(): CritKitSnapshot | null {
  const [snapshot, setSnapshot] = useState<CritKitSnapshot | null>(null)

  useEffect(() => {
    let unsubscribe: (() => void) | undefined
    let timer = 0

    const attach = () => {
      const critkit = getCritKit()
      if (critkit) {
        const sync = () => setSnapshot({ ...critkit.store.getSnapshot() })
        sync()
        unsubscribe = critkit.store.subscribe(sync)
      } else {
        timer = window.setTimeout(attach, 150)
      }
    }

    attach()

    return () => {
      unsubscribe?.()
      if (timer) window.clearTimeout(timer)
    }
  }, [])

  return snapshot
}
