import {
  Home,
  User,
  Briefcase,
  AlignLeft,
  Shapes,
  LayoutGrid,
  MessageSquare,
  Mail,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const items = [
  { id: "intro", icon: Home, label: "Intro" },
  { id: "about", icon: User, label: "About" },
  { id: "resume", icon: Briefcase, label: "Resume" },
  { id: "services", icon: AlignLeft, label: "Services" },
  { id: "skills", icon: Shapes, label: "Skills" },
  { id: "portfolio", icon: LayoutGrid, label: "Portfolio" },
  { id: "testimonial", icon: MessageSquare, label: "Testimonial" },
  { id: "contact", icon: Mail, label: "Contact" },
];

export function SideNav() {
  const [active, setActive] = useState("intro");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-1 py-4 px-1.5 rounded-full glass shadow-card"
    >
      {items.map(({ id, icon: Icon, label }) => {
        const isActive = active === id;
        return (
          <a
            key={id}
            href={`#${id}`}
            aria-label={label}
            className="group relative size-10 flex items-center justify-center rounded-full transition"
          >
            <Icon
              className={`size-[18px] transition ${isActive ? "text-secondary" : "text-muted-foreground group-hover:text-foreground"}`}
            />
            <span className="absolute right-full mr-3 whitespace-nowrap text-xs font-medium px-2.5 py-1 rounded-md bg-card border border-border opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition pointer-events-none">
              {label}
            </span>
          </a>
        );
      })}
    </motion.nav>
  );
}
