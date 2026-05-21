import { harvest, inferCategory } from "./harvest"
import { resolveSource } from "./source"
import { critStore } from "./store"
import type { CritSource } from "./types"

/** Open a capture for an element with already-resolved source info. */
export function captureCrit(element: Element, source: CritSource): void {
  const category = inferCategory(element)
  const rect = element.getBoundingClientRect()

  critStore.beginCapture({
    element,
    category,
    observed: harvest(element, category),
    filePath: source.filePath,
    lineNumber: source.lineNumber,
    componentName: source.componentName,
    tagName: source.tagName,
    rect: {
      top: rect.top,
      left: rect.left,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height,
    },
  })
}

/**
 * Open a capture for an element — resolve its source from the React fiber's
 * owner and debug stack (see `source.ts`), then hand it to the popover. The
 * shared entry point for the picker and `window.__CRITKIT__`.
 */
export function captureElement(element: Element): void {
  captureCrit(element, resolveSource(element))
}
