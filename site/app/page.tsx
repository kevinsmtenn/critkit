import { SiteNav } from "@/components/site-nav"
import { Hero } from "@/components/hero"
import { PromptOutput } from "@/components/prompt-output"
import { Install } from "@/components/install"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <PromptOutput />
        <Install />
      </main>
      <SiteFooter />
    </>
  )
}
