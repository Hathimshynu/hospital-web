import type { ReactNode } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { buttonClass, type ButtonVariant } from "@/components/ui/Button";
import { appointmentUrl, type AppointmentDetails } from "@/lib/whatsapp";

/**
 * Every appointment CTA on the site is this component, so the WhatsApp
 * number and message format live in exactly one place (lib/whatsapp.ts).
 * Pass `details` to pre-fill the doctor / department / service in the message.
 */
export function WhatsAppButton({
  details, children = "Book Appointment on WhatsApp", variant = "whatsapp", className, icon = true, arrow,
}: {
  details?: AppointmentDetails;
  children?: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  icon?: boolean;
  arrow?: boolean;
}) {
  return (
    <a href={appointmentUrl(details)} target="_blank" rel="noopener noreferrer" className={buttonClass(variant, className)}>
      {icon && <MessageCircle className="wa-icon size-5 shrink-0" aria-hidden="true" />}
      {children}
      {arrow && <ArrowRight className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />}
    </a>
  );
}
