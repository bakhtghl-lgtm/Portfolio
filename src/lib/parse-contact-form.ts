import { contactFormSchema, type ContactFormData } from "./contact-schema";

/** Server + client: max attachment size (matches Supabase bucket limit). */
export const CONTACT_MAX_FILE_BYTES = 5 * 1024 * 1024;

const ALLOWED_MIME = new Set([
  "application/pdf",
  "text/plain",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function isAllowedFile(file: File): boolean {
  if (ALLOWED_MIME.has(file.type)) return true;
  if (file.type.startsWith("image/")) return true;
  return false;
}

export type ParsedContactForm = {
  form: ContactFormData;
  file?: File;
};

/** Parse multipart fields + optional attachment (use in server function). */
export function parseContactFormData(fd: FormData): ParsedContactForm {
  const obj = {
    full_name: String(fd.get("full_name") ?? ""),
    email: String(fd.get("email") ?? ""),
    phone: String(fd.get("phone") ?? ""),
    subject: String(fd.get("subject") ?? ""),
    budget: String(fd.get("budget") ?? ""),
    message: String(fd.get("message") ?? ""),
    company_website: String(fd.get("company_website") ?? ""),
  };

  const form = contactFormSchema.parse(obj);

  const raw = fd.get("attachment");
  if (!(raw instanceof File) || raw.size === 0) {
    return { form };
  }

  if (raw.size > CONTACT_MAX_FILE_BYTES) {
    throw new Error("Attachment must be 5 MB or smaller.");
  }
  if (!isAllowedFile(raw)) {
    throw new Error("Use PDF, an image, or plain text.");
  }

  return { form, file: raw };
}
