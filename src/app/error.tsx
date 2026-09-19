"use client";

import { Button } from "@/components/ui/Button";
import { hospital, telHref, urgentPhone } from "@/data/hospital";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  const phone = urgentPhone();
  return (
    <section className="grid min-h-[70dvh] place-items-center bg-mint px-6 pt-24 text-center">
      <div>
        <h1 className="text-3xl font-semibold text-navy-950">Something went wrong</h1>
        <p className="mt-3 text-slate-body">Please try again. For urgent help, call {hospital.name} on <a className="font-bold text-brand-700" href={telHref(phone)}>{phone.display}</a>.</p>
        <div className="mt-8"><Button onClick={reset}>Try again</Button></div>
      </div>
    </section>
  );
}
