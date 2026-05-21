import { ImageResponse } from "next/og"

export const alt = "CritKit — Design crit with your coding agents"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

/** The social card — a branded 1200×630 still, rendered at build time.
 * Next wires this into both `openGraph.images` and `twitter.images`. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          padding: "72px 80px",
        }}
      >
        {/* mark + wordmark */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: 48, height: 48, background: "#ef4444" }} />
          <div
            style={{
              display: "flex",
              marginLeft: 20,
              color: "#fafafa",
              fontSize: 38,
              fontWeight: 600,
            }}
          >
            CritKit
          </div>
        </div>

        {/* headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: "#fafafa",
              fontSize: 82,
              fontWeight: 700,
              letterSpacing: -3,
            }}
          >
            Design crit with your
          </div>
          <div
            style={{
              display: "flex",
              color: "#fafafa",
              fontSize: 82,
              fontWeight: 700,
              letterSpacing: -3,
            }}
          >
            coding agents.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 30,
              maxWidth: 900,
              color: "#8a8a8f",
              fontSize: 28,
            }}
          >
            Walk your build, crit what's wrong, hand your agent a
            source-anchored to-do list.
          </div>
        </div>

        {/* footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "#6a6a6f",
            fontSize: 24,
          }}
        >
          <div style={{ display: "flex" }}>critkit.dev</div>
          <div
            style={{
              width: 5,
              height: 5,
              background: "#4a4a4f",
              margin: "0 18px",
            }}
          />
          <div style={{ display: "flex" }}>npm i -D critkit</div>
        </div>
      </div>
    ),
    size,
  )
}
