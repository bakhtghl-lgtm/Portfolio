import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { centreOf, revealFrom } from "./reveal";

export const ACCENT_KEY = "accent";

/** Order = order in the picker. Colours live in styles.css ([data-accent="…"]). */
export const ACCENTS = [
  { id: "sunbeam", name: "Sunbeam" },
  { id: "mocha", name: "Mocha" },
  { id: "teal", name: "Teal" },
  { id: "tangerine", name: "Tangerine" },
  { id: "cobalt", name: "Cobalt" },
  { id: "rose", name: "Rose" },
] as const;
export type AccentId = (typeof ACCENTS)[number]["id"];
const DEFAULT: AccentId = "sunbeam";
const isAccent = (v: unknown): v is AccentId => ACCENTS.some((a) => a.id === v);

/** Runs in <head> before first paint: a returning visitor's accent, with no yellow flash. */
export const accentInitScript = `try{var a=localStorage.getItem("${ACCENT_KEY}");if(${JSON.stringify(
  ACCENTS.map((a) => a.id).filter((id) => id !== DEFAULT),
)}.indexOf(a)>-1)document.documentElement.setAttribute("data-accent",a)}catch(e){}`;

// tiny store so the header picker and the menu picker stay in sync
const listeners = new Set<() => void>();
const read = (): AccentId => {
  const a = document.documentElement.getAttribute("data-accent");
  return isAccent(a) ? a : DEFAULT;
};
function useAccent() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    read,
    () => DEFAULT,
  );
}
function setAccent(id: AccentId) {
  const root = document.documentElement;
  if (id === DEFAULT) root.removeAttribute("data-accent");
  else root.setAttribute("data-accent", id);
  try {
    localStorage.setItem(ACCENT_KEY, id);
  } catch {
    /* private mode: the choice just isn't remembered */
  }
  listeners.forEach((l) => l());
}

/** A round swatch painting its own accent (data-accent re-scopes the colour vars to it). */
function Swatch({
  id,
  name,
  selected,
  size,
  onPick,
}: {
  id: AccentId;
  name: string;
  selected: boolean;
  size: "sm" | "lg";
  onPick: (id: AccentId, el: HTMLElement) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={name}
      title={name}
      data-accent={id}
      onClick={(e) => onPick(id, e.currentTarget)}
      className={`group relative grid shrink-0 place-items-center rounded-full bg-[oklch(var(--a-l)_var(--a-c)_var(--a-h))] text-[var(--a-ink)] shadow-[inset_0_0_0_1px_oklch(0_0_0/0.12)] transition-transform duration-300 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] ${
        size === "lg" ? "size-10" : "size-8"
      }`}
    >
      {/* selected: a ring in the surrounding ink, set off by a gap */}
      <span
        aria-hidden
        className={`pointer-events-none absolute -inset-[5px] rounded-full border-2 transition-opacity duration-300 ${
          selected ? "opacity-100" : "opacity-0"
        } border-current`}
        style={{ color: "var(--picker-ring, currentColor)" }}
      />
      <AnimatePresence>
        {selected ? (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
          >
            <Check className={size === "lg" ? "size-4" : "size-3.5"} strokeWidth={3} />
          </motion.span>
        ) : null}
      </AnimatePresence>
    </button>
  );
}

function pick(id: AccentId, el: HTMLElement) {
  if (id === read()) return;
  const [x, y] = centreOf(el);
  revealFrom(x, y, () => setAccent(id));
}

/** Inline row of swatches (used in the menu overlay). */
export function AccentSwatches({ className = "" }: { className?: string }) {
  const current = useAccent();
  return (
    <div role="group" aria-label="Accent colour" className={`flex flex-wrap gap-4 ${className}`}>
      {ACCENTS.map((a) => (
        <Swatch key={a.id} {...a} selected={a.id === current} size="lg" onPick={pick} />
      ))}
    </div>
  );
}

/** Header button: the current accent as a dot; opens a small panel of swatches. */
export function AccentPicker({ className = "" }: { className?: string }) {
  const current = useAccent();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", away);
    window.addEventListener("keydown", esc);
    return () => {
      window.removeEventListener("pointerdown", away);
      window.removeEventListener("keydown", esc);
    };
  }, [open]);

  const name = ACCENTS.find((a) => a.id === current)?.name;
  return (
    <div ref={box} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Accent colour: ${name}. Change colour`}
        title="Accent colour"
        className="grid size-10 shrink-0 place-items-center rounded-full border border-border bg-background/70 backdrop-blur transition-colors hover:border-foreground/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
      >
        {/* a conic ring of all the accents around the current one */}
        <span className="relative grid size-6 place-items-center rounded-full bg-[conic-gradient(from_0deg,#fdd506,#f78439,#f290a2,#3061d8,#027c7c,#936147,#fdd506)]">
          <span className="size-[18px] rounded-full border-2 border-background bg-secondary" />
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-[calc(100%+0.75rem)] z-[70] w-max origin-top-right rounded-2xl border border-border bg-background p-4 shadow-[0_24px_60px_-20px_oklch(0_0_0/0.45)] [--picker-ring:var(--foreground)]"
          >
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Accent · <span className="text-foreground">{name}</span>
            </p>
            <div role="group" aria-label="Accent colour" className="flex gap-3">
              {ACCENTS.map((a) => (
                <Swatch key={a.id} {...a} selected={a.id === current} size="sm" onPick={pick} />
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
