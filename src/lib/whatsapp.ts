import { hospital } from "@/data/hospital";

export interface AppointmentDetails {
  name?: string;
  phone?: string;
  department?: string;
  doctor?: string;
  service?: string;
  date?: string;
  time?: string;
  message?: string;
}

/** Builds the pre-filled WhatsApp text. Anything the visitor hasn't chosen is left blank for them to complete. */
export function createWhatsAppAppointmentMessage(d: AppointmentDetails = {}): string {
  const rows = [
    "Hello, I would like to book an appointment.",
    "",
    `Name: ${d.name ?? ""}`,
    `Phone: ${d.phone ?? ""}`,
    `Department: ${d.department ?? ""}`,
    `Doctor: ${d.doctor ?? ""}`,
  ];
  if (d.service) rows.push(`Service: ${d.service}`);
  rows.push(`Preferred Date: ${d.date ?? ""}`, `Preferred Time: ${d.time ?? ""}`);
  if (d.message) rows.push(`Message: ${d.message}`);
  rows.push("", "Please confirm the appointment.");
  return rows.join("\n");
}

/** https://wa.me/<number>?text=<url-encoded message> */
export function whatsAppUrl(message: string): string {
  return `https://wa.me/${hospital.contact.whatsapp.e164}?text=${encodeURIComponent(message)}`;
}

/** Convenience: appointment link for any combination of preset details. */
export const appointmentUrl = (d: AppointmentDetails = {}) =>
  whatsAppUrl(createWhatsAppAppointmentMessage(d));

/** Opens WhatsApp from a click handler; falls back to same-tab navigation if a popup is blocked. */
export function openWhatsAppAppointment(d: AppointmentDetails): void {
  const url = appointmentUrl(d);
  const w = window.open(url, "_blank", "noopener,noreferrer");
  if (!w) window.location.href = url;
}
