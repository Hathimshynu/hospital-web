import { MessageCircle, Phone } from "lucide-react";
import { appointmentUrl } from "@/lib/whatsapp";
import { hospital, telHref, urgentPhone } from "@/data/hospital";

/** Fixed bottom bar for phones/tablets: one tap to call or book on WhatsApp. */
export function MobileActionBar() {
  const phone = urgentPhone();
  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-[90] border-t border-navy-950/10 bg-white/95 px-3 pt-2.5 shadow-[0_-12px_30px_-20px_rgba(8,35,59,0.4)] backdrop-blur xl:hidden">
      <div className="mx-auto flex max-w-xl gap-2.5">
        <a href={telHref(phone)} aria-label={`Call ${hospital.name} on ${phone.display}`} className="grid min-h-12 w-14 shrink-0 place-items-center rounded-full border border-navy-950/15 text-navy-950">
          <Phone className="size-5" aria-hidden="true" />
        </a>
        <a href={appointmentUrl()} target="_blank" rel="noopener noreferrer" className="flex min-h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-wa px-4 text-[15px] font-bold text-white shadow-[0_10px_24px_-10px_rgba(15,123,69,0.8)] active:scale-[0.99]">
          <MessageCircle className="size-5 shrink-0" aria-hidden="true" />
          <span className="truncate max-[379px]:hidden">Book Appointment on WhatsApp</span>
          <span className="min-[380px]:hidden">Book on WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
