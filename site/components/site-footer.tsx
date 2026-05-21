import { CritMark } from "@/components/crit-mark"
import { GithubIcon, NpmIcon } from "@/components/icons"
import { Kbd } from "@/components/kbd"

const LINK_GROUPS = [
  {
    title: "Project",
    links: [
      { label: "GitHub", href: "https://github.com/kevinsmtenn/critkit" },
      { label: "npm", href: "https://www.npmjs.com/package/critkit" },
      {
        label: "Issues",
        href: "https://github.com/kevinsmtenn/critkit/issues",
      },
      {
        label: "MIT License",
        href: "https://github.com/kevinsmtenn/critkit/blob/main/LICENSE",
      },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "Twitter", href: "https://x.com/critkitdev" },
      { label: "Threads", href: "https://www.threads.com/@critkitdev" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto w-full max-w-[1120px] px-6 md:px-8">
        <div className="grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <CritMark />
              <span className="font-mono text-sm font-medium tracking-tight">
                CritKit
              </span>
            </div>
            <p className="mt-4 max-w-xs font-sans text-[13px] leading-relaxed text-muted-foreground">
              Design crit with your coding agents.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
              Press <Kbd>C</Kbd> anywhere to try it.
            </p>
            <p className="mt-4 font-sans text-[13px] text-muted-foreground">
              Inspired by{" "}
              <a
                href="https://github.com/aidenybai/react-grab"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 transition-colors hover:text-foreground"
              >
                React Grab
              </a>
              .
            </p>
          </div>

          {LINK_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-muted-foreground/60">
                {group.title}
              </p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="font-sans text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-border py-6 font-mono text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>MIT © {new Date().getFullYear()} Kevin Tenn</span>
          <span className="flex items-center gap-4">
            <span className="hidden sm:inline">
              An open-source design-crit tool
            </span>
            <a
              href="https://github.com/kevinsmtenn/critkit"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="transition-colors hover:text-foreground"
            >
              <GithubIcon className="size-3.5" />
            </a>
            <a
              href="https://www.npmjs.com/package/critkit"
              target="_blank"
              rel="noreferrer"
              aria-label="npm"
              className="transition-colors hover:text-foreground"
            >
              <NpmIcon className="size-3.5" />
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
