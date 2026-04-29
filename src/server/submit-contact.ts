import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import { parseContactFormData } from "@/lib/parse-contact-form";
import { getSupabaseServer } from "@/lib/supabase-admin";

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    if (!(input instanceof FormData)) {
      throw new Error("Invalid form submission.");
    }
    return parseContactFormData(input);
  })
  .handler(async ({ data }) => {
    const { form } = data;
    const supabase = getSupabaseServer();

    const submitter_ip = getRequestIP({ xForwardedFor: true }) ?? null;

    const { error } = await supabase.from("contact_submissions").insert({
      full_name: form.full_name,
      email: form.email,
      phone: form.phone ?? null,
      subject: form.subject,
      budget: form.budget ?? null,
      message: form.message ?? null,
      submitter_ip,
    });

    if (error) {
      console.error("[submitContact]", error.message, error.code);
      throw new Error("Could not save your message. Please try again later.");
    }

    // Email delivery is handled client-side via EmailJS.
    return { ok: true as const, emailSent: false as const };
  });
