import { registerPlugin } from "react-grab"
import { installApi } from "./api"
import { mountOverlay } from "./overlay/mount"
import { syncPicker } from "./picker"
import { createCritPlugin } from "./plugin"
import { installShortcut } from "./shortcut"
import { critStore } from "./store"

let registered = false

/**
 * Register CritKit and mount its overlay. Call once, on the client, in dev
 * only. Safe to call repeatedly — extra calls are ignored.
 *
 * CritKit owns its own element picker; react-grab is loaded purely as a
 * headless source resolver (its overlay is switched off — see `plugin.ts`).
 * Toggle crit mode from the dock, or via `window.__CRITKIT__`.
 */
export function registerCritKit(): void {
  if (registered || typeof window === "undefined") return
  registered = true
  mountOverlay()
  installApi()
  installShortcut()
  registerPlugin(createCritPlugin())
  // Keep the element picker in sync with crit mode.
  critStore.subscribe(syncPicker)
}

export type { CritKitApi } from "./api"
export type { Crit, CritCategory } from "./types"
