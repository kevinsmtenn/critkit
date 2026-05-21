import type { Plugin } from "react-grab"

/**
 * A deliberately minimal react-grab plugin. CritKit drives its own element
 * picker (see `picker.ts`), so this plugin exists only to switch off every
 * piece of react-grab's overlay — toolbar, labels, selection box, flashes.
 *
 * CritKit then uses react-grab purely headless: `getGlobalApi().getSource()`
 * for source resolution (file path + line + component), nothing visual. The
 * top-level `theme.enabled` flag doesn't reliably hide the toolbar, so each
 * surface is switched off individually.
 */
export function createCritPlugin(): Plugin {
  return {
    name: "critkit",
    theme: {
      toolbar: { enabled: false },
      elementLabel: { enabled: false },
      selectionBox: { enabled: false },
      dragBox: { enabled: false },
      grabbedBoxes: { enabled: false },
    },
  }
}
