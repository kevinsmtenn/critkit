import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

/** The iOS home-screen icon — the red mark on black, as a PNG. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
        }}
      >
        <div style={{ width: 56, height: 56, background: "#ef4444" }} />
      </div>
    ),
    size,
  )
}
