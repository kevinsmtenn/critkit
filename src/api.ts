import { captureElement } from "./capture"
import { critStore } from "./store"

/**
 * The `window.__CRITKIT__` handle — a small dev-only API. Lets you script a
 * crit session or inspect the running list straight from the console.
 */
export interface CritKitApi {
  /** Open a capture on an element — source resolves from the React fiber. */
  capture: (element: Element) => void
  /** The crit store: `subscribe`, `getSnapshot`, and mutators. */
  store: typeof critStore
}

declare global {
  interface Window {
    __CRITKIT__?: CritKitApi
  }
}

/** Install the `window.__CRITKIT__` handle. Idempotent. */
export function installApi(): void {
  if (typeof window === "undefined") return
  window.__CRITKIT__ = {
    store: critStore,
    capture: (element) => captureElement(element),
  }
}
