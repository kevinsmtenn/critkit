import { ShieldCheck } from "lucide-react"

import { Section, SectionHeader } from "@/components/section"
import { Reveal } from "@/components/reveal"
import { InstallTabs } from "@/components/install-tabs"
import { CodeBlock } from "@/components/code-block"

const CRITKIT_DEV = `// critkit-dev.tsx
"use client"
import { useEffect } from "react"

export function CritKitDev() {
  useEffect(() => {
    void import("critkit").then(({ registerCritKit }) =>
      registerCritKit(),
    )
  }, [])
  return null
}
`

const LAYOUT = `// app/layout.tsx (development only)
{process.env.NODE_ENV === "development" && <CritKitDev />}
`

export function Install() {
  return (
    <Section id="install" className="py-20 md:py-28">
      <Reveal whileInView>
        <SectionHeader
          index="04"
          label="Install"
          title="Two installs. Dev only."
          description="CritKit is built on react-grab—it comes in as a peer dependency. Register it once, on the client, in development. It never reaches a production build."
        />
      </Reveal>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <Reveal whileInView className="flex flex-col gap-6">
          <InstallTabs />
          <div className="flex gap-3 border border-border bg-card p-4">
            <ShieldCheck
              className="size-4 shrink-0 text-[oklch(0.72_0.16_150)]"
              strokeWidth={1.75}
            />
            <p className="font-sans text-[13px] leading-relaxed text-muted-foreground">
              <span className="text-foreground">
                Zero production footprint.
              </span>{" "}
              The dynamic import is gated on{" "}
              <code className="font-mono text-xs text-foreground">
                NODE_ENV
              </code>
              —neither CritKit nor react-grab ships in your production bundle.
              Nothing to misconfigure into production.
            </p>
          </div>
        </Reveal>

        <Reveal whileInView delay={0.1} className="flex flex-col gap-6">
          <CodeBlock file="critkit-dev.tsx" code={CRITKIT_DEV} />
          <CodeBlock file="app/layout.tsx" code={LAYOUT} />
        </Reveal>
      </div>
    </Section>
  )
}
