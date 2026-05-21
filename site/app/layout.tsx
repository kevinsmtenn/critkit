import type { Metadata, Viewport } from "next"
import { Geist, JetBrains_Mono } from "next/font/google"

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

export const metadata: Metadata = {
  title: "CritKit—Design crit for your coding agents",
  description:
    "CritKit is the design QA step in the agentic coding loop. Walk your running app, crit every flaw, and hand your coding agent a source-anchored to-do list.",
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
  openGraph: {
    type: "website",
    title: "CritKit—Design crit for your coding agents",
    description:
      "The human QA step in the agent loop. Crit your running app, hand your coding agent a source-anchored to-do list.",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@kevinsmtenn",
    title: "CritKit—Design crit for your coding agents",
    description:
      "The human QA step in the agent loop. Crit your running app, hand your coding agent a source-anchored to-do list.",
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
      </body>
    </html>
  )
}
