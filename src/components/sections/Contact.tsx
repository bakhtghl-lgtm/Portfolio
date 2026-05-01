import { useRef, useState, type FormEvent } from "react";
import { Mail, Send } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";
import { Section, SectionTag } from "../Section";
import { submitContact } from "@/server/submit-contact";

const initialForm = {
  full_name: "",
  email: "",
  phone: "",
  subject: "",
  budget: "",
  message: "",
  company_website: "",
};

export function Contact() {
  const [form, setForm] = useState(initialForm);
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const emailJsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
    const emailJsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
    const emailJsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

    const fd = new FormData();
    fd.append("full_name", form.full_name);
    fd.append("email", form.email);
    fd.append("phone", form.phone);
    fd.append("subject", form.subject);
    fd.append("budget", form.budget);
    fd.append("message", form.message);
    fd.append("company_website", form.company_website);

    setPending(true);
    try {
      const res = await submitContact({ data: fd });

      let emailSent = Boolean(res.emailSent);
      const emailjsConfigured = Boolean(
        emailJsServiceId?.trim() && emailJsTemplateId?.trim() && emailJsPublicKey?.trim(),
      );
      let emailAttempted = false;
      let emailFailureReason: string | null = null;

      if (!emailSent && emailjsConfigured && formRef.current) {
        try {
          emailAttempted = true;
          // NOTE: Do NOT use sendForm when a file input exists: EmailJS can hit the 50KB variables limit (413)
          // because it may serialize large values. We only send text + metadata; attachments are stored in Supabase.
          await emailjs.send(
            emailJsServiceId!.trim(),
            emailJsTemplateId!.trim(),
            {
              to_email: "bakht.ghl@gmail.com",
              from_name: form.full_name,
              reply_to: form.email,
              full_name: form.full_name,
              email: form.email,
              phone: form.phone || "-",
              subject: form.subject,
              budget: form.budget || "-",
              message: form.message || "-",
              attachment_name: "-",
            },
            { publicKey: emailJsPublicKey!.trim() },
          );
          emailSent = true;
        } catch (err) {
          const message =
            err instanceof Error
              ? err.message
              : typeof err === "string"
                ? err
                : JSON.stringify(err);
          emailFailureReason = message || "EmailJS failed.";
          toast.error("Email not sent", { description: emailFailureReason });
        }
      } else if (!emailSent && !emailjsConfigured) {
        toast.error("Email not configured", {
          description:
            "Set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY in .env.",
        });
      }

      const description = emailSent
        ? "Thanks for reaching out — I'll reply within 24 hours."
        : !emailjsConfigured
          ? "Your message was received, but email delivery isn’t configured."
          : emailAttempted
            ? "Your message was saved, but email delivery failed."
            : "Your message was received.";

      toast.success(emailSent ? "Message sent!" : "Message saved!", { description });

      setForm(initialForm);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast.error("Could not send", { description: message });
    } finally {
      setPending(false);
    }
  }

  return (
    <Section id="contact">
      <SectionTag icon={<Mail className="size-3.5" />} label="Contact" />
      <h2 className="mt-8 font-display text-4xl md:text-6xl font-bold">
        Let's Work <span className="text-gradient-yellow">Together!</span>
      </h2>
      <p className="mt-6 text-lg text-foreground font-medium">
        bakht.ghl@gmail.com · +92 325 1203232
      </p>

      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="relative mt-10 grid md:grid-cols-2 gap-x-10 gap-y-8"
      >
        {(
          [
            {
              key: "full_name" as const,
              label: "Full Name *",
              placeholder: "Your full name",
              type: "text",
            },
            {
              key: "email" as const,
              label: "Email *",
              placeholder: "Your email address",
              type: "email",
            },
            {
              key: "phone" as const,
              label: "Phone (Optional)",
              placeholder: "Your phone number",
              type: "tel",
            },
            { key: "subject" as const, label: "Subject *", placeholder: "Subject", type: "text" },
          ] as const
        ).map((f, i) => (
          <motion.div
            key={f.key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <label
              htmlFor={f.key}
              className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3 font-semibold"
            >
              {f.label}
            </label>
            <input
              id={f.key}
              name={f.key}
              type={f.type}
              placeholder={f.placeholder}
              value={form[f.key]}
              onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
              required={f.key === "full_name" || f.key === "email" || f.key === "subject"}
              className="w-full bg-transparent border-b border-border pb-3 focus:border-secondary outline-none transition placeholder:text-muted-foreground/60"
            />
          </motion.div>
        ))}
        <div className="md:col-span-2">
          <label
            htmlFor="budget"
            className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3 font-semibold"
          >
            Your Budget (Optional)
          </label>
          <input
            id="budget"
            name="budget"
            value={form.budget}
            onChange={(e) => setForm((s) => ({ ...s, budget: e.target.value }))}
            className="w-full bg-transparent border-b border-border pb-3 focus:border-secondary outline-none transition placeholder:text-muted-foreground/60"
            placeholder="A range budget for your project"
          />
        </div>
        <div className="md:col-span-2">
          <label
            htmlFor="message"
            className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3 font-semibold"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={form.message}
            onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
            placeholder="Write your message here..."
            className="w-full bg-transparent border-b border-border pb-3 focus:border-secondary outline-none transition placeholder:text-muted-foreground/60 resize-none"
          />
        </div>

        <div
          className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden opacity-0"
          aria-hidden
        >
          <label htmlFor="company_website">Company website</label>
          <input
            id="company_website"
            name="company_website"
            tabIndex={-1}
            autoComplete="off"
            value={form.company_website}
            onChange={(e) => setForm((s) => ({ ...s, company_website: e.target.value }))}
          />
        </div>

        <motion.button
          type="submit"
          disabled={pending}
          whileHover={pending ? undefined : { scale: 1.03 }}
          whileTap={pending ? undefined : { scale: 0.97 }}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-secondary px-10 py-4 font-semibold tracking-wide text-secondary-foreground shadow-glow transition hover:brightness-110 disabled:pointer-events-none disabled:opacity-60 sm:w-fit"
        >
          <Send className="size-4" /> {pending ? "SENDING…" : "SEND MESSAGE"}
        </motion.button>
      </form>
    </Section>
  );
}
