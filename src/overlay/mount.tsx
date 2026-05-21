import { createRoot, type Root } from "react-dom/client"
import { OverlayApp } from "./overlay-app"

const HOST_ID = "critkit-overlay-root"

let root: Root | null = null

/**
 * Mount CritKit's overlay into a dedicated shadow root on `<body>`. Idempotent
 * — safe across HMR. The shadow root isolates CritKit's styles from the host
 * app and keeps its motion exempt from react-grab's main-document page-freeze.
 *
 * The stylesheet itself is rendered inside {@link OverlayApp} (not injected
 * here) so that editing it hot-reloads via Fast Refresh.
 */
export function mountOverlay(): void {
  if (typeof document === "undefined") return
  if (document.getElementById(HOST_ID)) return

  const host = document.createElement("div")
  host.id = HOST_ID
  host.style.cssText =
    "position:fixed;inset:0;z-index:2147483600;pointer-events:none;"

  const attach = (): void => {
    document.body.appendChild(host)

    const shadow = host.attachShadow({ mode: "open" })
    const container = document.createElement("div")
    container.className = "ck-container"
    shadow.appendChild(container)

    root = createRoot(container)
    root.render(<OverlayApp />)
  }

  if (document.body) attach()
  else document.addEventListener("DOMContentLoaded", attach, { once: true })
}
