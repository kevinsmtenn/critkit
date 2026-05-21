import { useSyncExternalStore } from "react"
import { critStore } from "../store"
import { CRITKIT_CSS } from "../styles"
import { CritPopover } from "./crit-popover"
import { Highlight } from "./highlight"
import { Launcher } from "./launcher"
import { ListPanel } from "./list-panel"

/**
 * Root of CritKit's overlay — the launcher, the hover highlight, the capture
 * popover, and the running List dock.
 *
 * The stylesheet is rendered here (not injected imperatively) so editing
 * `styles.ts` hot-reloads through Fast Refresh. With no `precedence` prop the
 * `<style>` is not hoisted — it stays inside CritKit's shadow root.
 */
export function OverlayApp() {
  const state = useSyncExternalStore(
    critStore.subscribe,
    critStore.getSnapshot,
    critStore.getSnapshot,
  )

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CRITKIT_CSS }} />
      {state.critMode && !state.pending ? <Highlight /> : null}
      <CritPopover pending={state.pending} />
      <Launcher critMode={state.critMode} />
      <ListPanel
        crits={state.crits}
        open={state.panelOpen}
        anchor={state.anchor}
        critMode={state.critMode}
      />
    </>
  )
}
