import { Section, SectionHeader } from "@/components/section"
import { Reveal } from "@/components/reveal"
import { Kbd } from "@/components/kbd"
import { LiveCritCount } from "@/components/live-crit-count"
import { StartCritButton } from "@/components/start-crit-button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const STEPS: React.ReactNode[] = [
  <>
    Press <Kbd>C</Kbd>. Crit mode arms across the whole page.
  </>,
  <>Hover the panel; elements highlight. Click one that&apos;s off.</>,
  <>
    Type a note, hit <Kbd>⏎</Kbd>. CritKit harvests the DOM context for you.
  </>,
  <>The crit list docks to your screen edge. Open it, copy the crit prompt.</>,
]

/** An ordinary app surface, built from the same shadcn primitives as the rest
 * of the site, there to be crit exactly like your own running build. */
function DemoApp() {
  return (
    <div className="w-full max-w-[380px] bg-card ring-1 ring-foreground/10">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
        <span aria-hidden className="flex gap-1.5">
          <span className="size-2.5 border border-border" />
          <span className="size-2.5 border border-border" />
          <span className="size-2.5 border border-border" />
        </span>
        <span className="ml-1 font-mono text-[11px] text-muted-foreground">
          localhost:3000
        </span>
      </div>

      <div className="p-5">
        <Card size="sm" className="bg-background">
          <CardHeader className="border-b">
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              How you show up across the workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3.5 text-xs">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="size-9 shrink-0 bg-secondary ring-1 ring-foreground/10"
                />
                <div>
                  <p className="font-heading text-[13px] text-foreground">
                    Richard Hendricks
                  </p>
                  <p className="text-muted-foreground">@richard</p>
                </div>
              </div>
              <Badge variant="secondary">Maintainer</Badge>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-border pt-3.5">
              <div>
                <p className="text-foreground">Email</p>
                <p className="font-mono text-muted-foreground">
                  richard@piedpiper.com
                </p>
              </div>
              <Button variant="outline" size="xs">
                Edit
              </Button>
            </div>
            <p className="text-muted-foreground/45">
              Your profile is visible to everyone in the workspace.
            </p>
          </CardContent>
          <CardFooter className="gap-2">
            <Button size="sm">Save changes</Button>
            <Button variant="ghost" size="sm">
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export function DemoZone() {
  return (
    <Section id="demo" className="py-20 md:py-28">
      <Reveal whileInView>
        <SectionHeader
          index="02"
          label="Live demo"
          title="Crit this page. Right now."
          description="CritKit is already running. No install, no sandbox. The panel below is an ordinary app surface. Walk it the way you'd walk your own build."
        />
      </Reveal>

      <div className="mt-12 grid gap-px border border-border bg-border lg:grid-cols-[0.82fr_1.18fr]">
        <Reveal whileInView className="bg-background">
          <div className="flex h-full flex-col gap-7 p-6 md:p-8">
            <ol className="flex flex-col gap-4">
              {STEPS.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-px font-mono text-[11px] text-muted-foreground/45">
                    0{i + 1}
                  </span>
                  <span className="font-sans text-[13px] leading-relaxed text-muted-foreground">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-auto flex flex-col gap-3">
              <LiveCritCount />
              <StartCritButton size="default" />
            </div>
          </div>
        </Reveal>

        <Reveal whileInView delay={0.1} className="bg-background">
          <div className="flex h-full items-center justify-center p-6 md:p-8">
            <DemoApp />
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
