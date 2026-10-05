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
