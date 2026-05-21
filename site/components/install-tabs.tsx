"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import { CopyButton } from "@/components/copy-button"

const MANAGERS = [
  { id: "npm", cmd: "npm i -D critkit react-grab" },
  { id: "pnpm", cmd: "pnpm add -D critkit react-grab" },
  { id: "yarn", cmd: "yarn add -D critkit react-grab" },
  { id: "bun", cmd: "bun add -d critkit react-grab" },
]

export function InstallTabs() {
  const [active, setActive] = useState(0)
  const cmd = MANAGERS[active].cmd

  return (
    <div className="bg-card ring-1 ring-foreground/10">
      <div className="flex items-center justify-between border-b border-border">
        <div className="flex">
          {MANAGERS.map((manager, i) => (
            <button
              key={manager.id}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "border-r border-border px-3.5 py-2 font-mono text-[11px] transition-colors",
                i === active
                  ? "bg-background text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {manager.id}
            </button>
          ))}
        </div>
        <CopyButton value={cmd} className="px-3" />
      </div>
      <div className="flex items-center gap-2.5 px-4 py-3.5 font-mono text-[13px]">
        <span aria-hidden className="select-none text-muted-foreground">
          $
        </span>
        <code className="text-foreground">{cmd}</code>
      </div>
    </div>
  )
}
