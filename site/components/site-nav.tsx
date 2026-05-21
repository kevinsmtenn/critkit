import { CritMark } from "@/components/crit-mark"
import { GithubIcon } from "@/components/icons"
import { LiveStatus } from "@/components/live-status"

const LINKS = [
  { href: "#crit-session", label: "Crit" },
  { href: "#demo", label: "Demo" },
  { href: "#output", label: "Output" },
  { href: "#install", label: "Install" },
]

export function SiteNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-[1120px] items-center justify-between px-6 md:px-8">
        <a href="#top" className="flex items-center gap-2.5">
          <CritMark />
          <span className="font-mono text-sm font-medium tracking-tight">
            CritKit
          </span>
          <span className="hidden border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
            v0.1.1
          </span>
        </a>

        <nav className="hidden items-center gap-7 font-mono text-xs text-muted-foreground md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <LiveStatus className="hidden sm:inline-flex" />
          <span aria-hidden className="hidden h-4 w-px bg-border sm:block" />
          <a
            href="https://github.com/kevinsmtenn/critkit"
            target="_blank"
            rel="noreferrer"
            aria-label="CritKit on GitHub"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <GithubIcon className="size-4" />
          </a>
        </div>
      </div>
    </header>
  )
}
