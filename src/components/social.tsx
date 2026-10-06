export const HIRE_EMAIL = "bakht.ghl@gmail.com";
/** Opens Gmail compose in the browser (works when `mailto:` has no handler, e.g. some previews). */
export const hireMeHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(HIRE_EMAIL)}&su=${encodeURIComponent("Hire Me Request")}`;
export const facebookUrl =
  "https://www.facebook.com/bakhtaliniazi.niazi?rdid=W2LWVJVlmzUaRnKi&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1DjRNtt5wu%2F#";
export const linkedinUrl =
  "https://www.linkedin.com/in/bakht-ali-niazi-a118282b2?utm_source=share_via&utm_content=profile&utm_medium=member_android";

export function FacebookIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06C2 17.08 5.657 21.23 10.438 22v-7.03H7.898v-2.91h2.54V9.845c0-2.522 1.492-3.915 3.777-3.915 1.094 0 2.238.197 2.238.197v2.475h-1.26c-1.242 0-1.63.776-1.63 1.571v1.887h2.773l-.443 2.91h-2.33V22C18.343 21.23 22 17.08 22 12.06Z" />
    </svg>
  );
}

export function LinkedInIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5ZM.5 23.5h4V7.98h-4V23.5ZM8.5 7.98h3.84v2.12h.05c.54-1.02 1.86-2.1 3.83-2.1 4.1 0 4.86 2.7 4.86 6.2v9.3h-4v-8.25c0-1.97-.03-4.5-2.74-4.5-2.75 0-3.17 2.14-3.17 4.36v8.39h-4V7.98Z" />
    </svg>
  );
}

/** Opens a WhatsApp chat directly (app on phones, web/desktop app elsewhere). */
export const whatsappHref = `https://wa.me/923251203232?text=${encodeURIComponent(
  "Hi Bakht, I'd like to talk about a GoHighLevel project.",
)}`;

export function WhatsAppIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.01Zm-7.01 15.24h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.23 8.23 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}

/** Direct-to-WhatsApp call to action (no number shown on the page). */
export function WhatsAppButton({
  className = "",
  label = "Chat on WhatsApp",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-[#0b2915] shadow-[0_12px_30px_-12px_rgba(37,211,102,0.8)] transition hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] ${className}`}
    >
      <WhatsAppIcon className="size-5" />
      {label}
    </a>
  );
}
