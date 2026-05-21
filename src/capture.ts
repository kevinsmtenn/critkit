import { getGlobalApi } from "react-grab"
import { harvest, inferCategory } from "./harvest"
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
 * Open a capture for an element: the popover appears immediately with the tag
 * name, and react-grab's resolved source location is folded in as soon as it
 * resolves. The shared path behind `onElementSelect` and `window.__CRITKIT__`.
 */
export function captureElement(element: Element): void {
  captureCrit(element, { tagName: element.tagName.toLowerCase() })

  const reactGrab = getGlobalApi()
  if (!reactGrab) return

  void reactGrab
    .getSource(element)
    .then((info) => {
      if (!info) return
      critStore.patchPendingSource(element, {
        filePath: info.filePath,
        lineNumber: info.lineNumber ?? undefined,
        componentName: info.componentName ?? undefined,
      })
    })
    .catch(() => {
      // Source resolution failed — the crit keeps its tag name alone.
    })
}
