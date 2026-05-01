import { motion } from "framer-motion";
import { Mail, Settings } from "lucide-react";
import portrait from "@/assets/portrait.jpg";

const HIRE_EMAIL = "bakht.ghl@gmail.com";
/** Opens Gmail compose in the browser (works when `mailto:` has no handler, e.g. some previews). */
const hireMeHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(HIRE_EMAIL)}&su=${encodeURIComponent("Hire Me Request")}`;
const facebookUrl =
  "https://www.facebook.com/bakhtaliniazi.niazi?rdid=W2LWVJVlmzUaRnKi&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1DjRNtt5wu%2F#";
const linkedinUrl =
  "https://www.linkedin.com/in/bakht-ali-niazi-a118282b2?utm_source=share_via&utm_content=profile&utm_medium=member_android";

function FacebookIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06C2 17.08 5.657 21.23 10.438 22v-7.03H7.898v-2.91h2.54V9.845c0-2.522 1.492-3.915 3.777-3.915 1.094 0 2.238.197 2.238.197v2.475h-1.26c-1.242 0-1.63.776-1.63 1.571v1.887h2.773l-.443 2.91h-2.33V22C18.343 21.23 22 17.08 22 12.06Z" />
    </svg>
  );
}

function LinkedInIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5ZM.5 23.5h4V7.98h-4V23.5ZM8.5 7.98h3.84v2.12h.05c.54-1.02 1.86-2.1 3.83-2.1 4.1 0 4.86 2.7 4.86 6.2v9.3h-4v-8.25c0-1.97-.03-4.5-2.74-4.5-2.75 0-3.17 2.14-3.17 4.36v8.39h-4V7.98Z" />
    </svg>
  );
}
export function ProfileCard() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative bg-card-gradient rounded-3xl border border-border p-6 shadow-card overflow-hidden"
    >
      <button
        aria-label="Settings"
        className="absolute left-4 top-4 size-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-secondary transition"
      >
        <Settings className="size-4 animate-spin-slow" />
      </button>

      <div className="flex items-start justify-between mb-6 pl-12">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-2xl font-bold tracking-tight">Bakht Ali</h2>
          <span className="size-5 rounded-full border border-border text-[10px] flex items-center justify-center text-muted-foreground">
            B
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground text-right leading-tight">
          GoHighLevel
          <br />
          Expert
        </p>
      </div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="relative aspect-square rounded-2xl overflow-hidden mb-6 group bg-secondary/20"
      >
        <img
          src={portrait}
          alt="Bakht Ali Niazi portrait"
          width={768}
          height={768}
          className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
      </motion.div>

      <div className="text-center space-y-1 mb-6">
        <p className="text-foreground font-medium">bakht.ghl@gmail.com</p>
        <p className="text-foreground font-medium">Gulgasht, Multan, Pakistan</p>
      </div>

      <div className="border-t border-border pt-5 mb-5">
        <p className="text-center text-xs text-muted-foreground mb-4">
          © 2026 Bakht Ali. All Rights Reserved
        </p>
        <div className="flex justify-center gap-3">
          <motion.a
            href={facebookUrl}
            target="_blank"
            rel="noreferrer"
            whileHover={{ y: -3 }}
            className="size-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-secondary hover:border-secondary transition"
            aria-label="Facebook"
          >
            <FacebookIcon className="size-4" />
          </motion.a>
          <motion.a
            href={linkedinUrl}
            target="_blank"
            rel="noreferrer"
            whileHover={{ y: -3 }}
            className="size-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-secondary hover:border-secondary transition"
            aria-label="LinkedIn"
          >
            <LinkedInIcon className="size-4" />
          </motion.a>
        </div>
      </div>

      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full">
        <a
          href={hireMeHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-secondary text-secondary-foreground font-semibold tracking-wide shadow-glow hover:brightness-110 transition"
        >
          <Mail className="size-4" />
          HIRE ME!
        </a>
      </motion.div>
    </motion.aside>
  );
}
