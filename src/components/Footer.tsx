import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useRef } from "react";
import { scrollToId } from "./fx/SmoothScroll";
import { Magnetic } from "./fx/Magnetic";
import { FacebookIcon, LinkedInIcon, facebookUrl, linkedinUrl } from "./social";

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["60%", "0%"]);

  return (
    <footer
      ref={ref}
      className="relative overflow-hidden border-t border-border px-4 md:px-10 pt-16"
    >
      <div className="flex flex-col md:flex-row justify-between gap-10 text-sm">
        <div className="space-y-1 text-muted-foreground">
          <p className="text-foreground font-medium">bakht.ghl@gmail.com</p>
          <p>Gulgasht, Multan, Pakistan</p>
          <p>© 2026 Bakht Ali. All Rights Reserved</p>
        </div>
        <div className="flex items-center gap-3">
          {[
            { href: facebookUrl, label: "Facebook", Icon: FacebookIcon },
            { href: linkedinUrl, label: "LinkedIn", Icon: LinkedInIcon },
          ].map(({ href, label, Icon }) => (
            <Magnetic key={label}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid size-12 place-items-center rounded-full border border-border text-muted-foreground transition hover:bg-secondary hover:text-secondary-foreground hover:border-secondary"
              >
                <Icon />
              </a>
            </Magnetic>
          ))}
          <Magnetic>
            <button
              type="button"
              onClick={() => scrollToId("intro")}
              aria-label="Back to top"
              className="grid size-12 place-items-center rounded-full bg-foreground text-background transition hover:bg-secondary hover:text-secondary-foreground"
            >
              <ArrowUp className="size-5" />
            </button>
          </Magnetic>
        </div>
      </div>

      <motion.p
        aria-hidden
        style={{ y }}
        // BAKHT ALI = 3.58em: fits the gutters at every width; settles fully inside the footer
        className="mt-10 pb-4 font-mega text-[min(24vw,calc((100vw-2rem)/3.75))] leading-[0.95] text-center whitespace-nowrap select-none"
      >
        Bakht <span className="text-highlight">Ali</span>
      </motion.p>
    </footer>
  );
}
