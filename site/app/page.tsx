import { SiteNav } from "@/components/site-nav"
import { Hero } from "@/components/hero"
import { CritPass } from "@/components/crit-pass"
import { DemoZone } from "@/components/demo-zone"
import { PromptOutput } from "@/components/prompt-output"
import { Install } from "@/components/install"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <CritPass />
        <DemoZone />
        <PromptOutput />
        <Install />
      </main>
      <SiteFooter />
    </>
  )
}
