import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function SectionTag({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-border glass text-xs font-semibold tracking-[0.2em] uppercase"
    >
      <span className="text-secondary">{icon}</span>
      {label}
    </motion.div>
  );
}

export function Section({
  id,
  children,
  className = "",
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`min-h-screen flex flex-col justify-center py-24 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </section>
  );
}
