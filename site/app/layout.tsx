import type { Metadata, Viewport } from "next"
import { Geist, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"

import "./globals.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { CritKitProvider } from "@/components/critkit-provider"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const DESCRIPTION =
  "CritKit is the design QA step in the agentic coding loop. Walk your running app, crit every flaw, and hand your coding agent a source-anchored to-do list."

const CARD_DESCRIPTION =
  "Walk your running app, crit every flaw, and hand your coding agent a source-anchored to-do list."

export const metadata: Metadata = {
  metadataBase: new URL("https://critkit.dev"),
  title: "CritKit: Design crit with your coding agents",
  description: DESCRIPTION,
  applicationName: "CritKit",
  keywords: [
    "react",
    "design review",
    "coding agent",
    "Claude Code",
    "Cursor",
    "QA",
    "devtools",
  ],
  authors: [{ name: "Kevin Tenn" }],
  creator: "Kevin Tenn",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://critkit.dev",
    siteName: "CritKit",
    title: "CritKit: Design crit with your coding agents",
    description: CARD_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    site: "@critkitdev",
    creator: "@critkitdev",
    title: "CritKit: Design crit with your coding agents",
    description: CARD_DESCRIPTION,
  },
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontSans.variable, fontMono.variable)}
    >
      <body>
        <ThemeProvider defaultTheme="dark">
          {children}
          <CritKitProvider />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
