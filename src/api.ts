import { captureElement } from "./capture"
import { critStore } from "./store"

/**
 * The `window.__CRITKIT__` handle — a small dev-only API, in the spirit of
 * react-grab's own `window.__REACT_GRAB__`. Lets you script a crit pass or
 * inspect the running list without going through react-grab's overlay.
 */
export interface CritKitApi {
  /** Open a capture on an element — source resolves via react-grab. */
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
