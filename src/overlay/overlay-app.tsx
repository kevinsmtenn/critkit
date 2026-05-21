import { useSyncExternalStore } from "react"
import { critStore } from "../store"
import { CRITKIT_CSS } from "../styles"
import { CritPopover } from "./crit-popover"
import { Highlight } from "./highlight"
import { Launcher } from "./launcher"
import { ListPanel } from "./list-panel"
import { useCoarsePointer } from "./use-coarse-pointer"

/**
 * Root of CritKit's overlay — the launcher, the hover highlight, the capture
 * popover, and the running List dock.
 *
 * The stylesheet is rendered here (not injected imperatively) so editing
 * `styles.ts` hot-reloads through Fast Refresh. With no `precedence` prop the
 * `<style>` is not hoisted — it stays inside CritKit's shadow root.
 *
 * On touch-first devices the launcher is dropped entirely: crit mode is
 * hover-to-pick and there's no keyboard for the `C` shortcut, so there's no
 * working way into a crit there — and the rest of the overlay stays inert
 * since `critMode` can never be entered.
 */
export function OverlayApp() {
  const state = useSyncExternalStore(
    critStore.subscribe,
    critStore.getSnapshot,
    critStore.getSnapshot,
  )
  const touchOnly = useCoarsePointer()

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CRITKIT_CSS }} />
      {state.critMode && !state.pending ? <Highlight /> : null}
      <CritPopover pending={state.pending} />
      {touchOnly ? null : <Launcher critMode={state.critMode} />}
      <ListPanel
        crits={state.crits}
        open={state.panelOpen}
        anchor={state.anchor}
        critMode={state.critMode}
      />
    </>
  )
}
