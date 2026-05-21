import type { CritSource } from "./types"

/**
 * CritKit's own source resolver — zero dependencies.
 *
 * React tags every DOM node it renders with a hidden `__reactFiber$…` key. In
 * a dev build each fiber carries `_debugOwner` (the component that created the
 * element) and `_debugStack` (an Error whose frames point back at the JSX call
 * site). We read those directly: owner → component name, stack → source file.
 *
 * React 19 dropped the old `_debugSource` field, so this leans on the owner
 * stack — the same data React's own component-stack warnings are built from.
 *
 * The component name is exact. The file is best-effort: bundlers that keep the
 * source path in the stack frame resolve cleanly; the rest fall back to the
 * component alone. Exact `:line` precision is a build-transform concern.
 */

interface DebugOwner {
  name?: string
  owner?: DebugOwner | null
  debugStack?: { stack?: string } | null
}

interface Fiber {
  type: unknown
  return: Fiber | null
  _debugOwner?: DebugOwner | null
  _debugStack?: { stack?: string } | null
}

/** The React fiber backing a DOM node, found via its `__reactFiber$…` key. */
function fiberOf(element: Element): Fiber | null {
  const key = Object.keys(element).find(
    (k) =>
      k.startsWith("__reactFiber$") ||
      k.startsWith("__reactInternalInstance$"),
  )
  if (!key) return null
  return (element as unknown as Record<string, Fiber | undefined>)[key] ?? null
}

/** The component that rendered this element — the nearest capitalised owner. */
function ownerName(fiber: Fiber): string | undefined {
  let owner: DebugOwner | null | undefined = fiber._debugOwner
  while (owner) {
    if (owner.name && /^[A-Z]/.test(owner.name)) return owner.name
    owner = owner.owner
  }
  // Fallback — nearest named component fiber above this element.
  let node: Fiber | null = fiber.return
  while (node) {
    if (typeof node.type === "function") {
      const fn = node.type as { displayName?: string; name?: string }
      const name = fn.displayName ?? fn.name
      if (name && /^[A-Z]/.test(name)) return name
    }
    node = node.return
  }
  return undefined
}

// Stack-frame locations that are bundler / React-runtime noise, never app code.
const NOISE_LOC =
  /node_modules|next[/\\]dist|next_dist_compiled|react-dom|react-server-dom|react-refresh|webpack-internal|hot-reloader|[/\\]turbopack[/\\]/i

// Frame function names that belong to React's renderer, not the app.
const NOISE_FN =
  /^(fakeJSXCallSite|react_stack|react-stack|initializeElement|renderWith|beginWork|performUnitOfWork|performWork|update\w*Component|updateForwardRef|reconcile|commit|flush|workLoop|runWithFiberInDEV|Object\.|exports\.|jsxDEV|jsxs?|createElement)/

interface Frame {
  fn: string
  loc: string
}

/** Split an Error stack into `{ fn, loc }` frames. */
function parseFrames(stack: string): Frame[] {
  const frames: Frame[] = []
  for (const line of stack.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed.startsWith("at ")) continue
    const body = trimmed.slice(3)
    const paren = body.match(/^(.*?) \((.+)\)$/)
    if (paren) frames.push({ fn: paren[1] ?? "", loc: paren[2] ?? "" })
    else frames.push({ fn: "", loc: body })
  }
  return frames
}

/**
 * Pull an app-source file path out of a stack-frame location, or undefined.
 * Bundlers like Turbopack keep the real path in the frame (often double
 * URL-encoded); build chunks without one resolve to undefined rather than a
 * misleading `chunk.js`.
 */
function fileFromLoc(loc: string): string | undefined {
  let text = loc
  for (let i = 0; i < 2; i++) {
    try {
      const next = decodeURIComponent(text)
      if (next === text) break
      text = next
    } catch {
      break
    }
  }
  const matches = text.match(
    /[\w.\-[\]]+(?:\/[\w.\-[\]]+)*\.(?:tsx|ts|jsx|js|mjs|cjs)/gi,
  )
  if (!matches) return undefined
  const appFile = matches.find(
    (p) => !/chunk|_next|\.next|node_modules|\._\.js$/i.test(p),
  )
  if (!appFile) return undefined
  return appFile
    .replace(/^.*\[project\]\//, "")
    .replace(/^.*?((?:src|app|components|lib|pages)\/)/, "$1")
}

/** First app-code frame in a stack, skipping React/bundler noise. */
function appFrame(stack: string): Frame | undefined {
  for (const frame of parseFrames(stack)) {
    if (NOISE_LOC.test(frame.loc)) continue
    if (frame.fn && NOISE_FN.test(frame.fn)) continue
    if (!/[\w.-]+\.(?:tsx|ts|jsx|js|mjs)/i.test(frame.loc)) continue
    return frame
  }
  return undefined
}

/**
 * Resolve a clicked DOM element to its source — the component that rendered it
 * and, where the bundler exposes it, the file. Best-effort: anything it can't
 * resolve comes back undefined, and the crit keeps whatever it found.
 */
export function resolveSource(element: Element): CritSource {
  const source: CritSource = { tagName: element.tagName.toLowerCase() }
  const fiber = fiberOf(element)
  if (!fiber) return source

  source.componentName = ownerName(fiber)

  const stack = fiber._debugStack?.stack ?? fiber._debugOwner?.debugStack?.stack
  if (stack) {
    const frame = appFrame(stack)
    if (frame) {
      source.filePath = fileFromLoc(frame.loc)
      if (!source.componentName && /^[A-Z]/.test(frame.fn)) {
        source.componentName = frame.fn
      }
    }
  }
  return source
}
