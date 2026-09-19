"use client";

import { useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Field, inputClass } from "@/components/ui/Field";
import { listedDepartments } from "@/data/departments";
import { doctors } from "@/data/doctors";
import { services } from "@/data/services";
import { openWhatsAppAppointment } from "@/lib/whatsapp";

interface Preset { department?: string; doctor?: string; service?: string }
type Values = { name: string; phone: string; department: string; doctor: string; service: string; date: string; time: string; message: string };

const validate = (v: Values): Partial<Record<keyof Values, string>> => {
  const e: Partial<Record<keyof Values, string>> = {};
  if (v.name.trim().length < 2) e.name = "Please enter your full name";
  const digits = v.phone.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15 || !/^[+()\d\s-]+$/.test(v.phone.trim())) e.phone = "Enter a valid phone number";
  if (v.date && new Date(v.date + "T00:00:00") < new Date(new Date().toDateString())) e.date = "Choose today or a future date";
  return e;
};

/**
 * Collects details and hands them to WhatsApp via lib/whatsapp.ts.
 * Nothing is sent to or stored on our server - and the UI never claims a booking is confirmed.
 * `preset` holds slugs (department / doctor / service) to pre-select.
 */
export function AppointmentForm({ preset = {} }: { preset?: Preset }) {
  const [v, setV] = useState<Values>({ name: "", phone: "", department: preset.department ?? "", doctor: preset.doctor ?? "", service: preset.service ?? "", date: "", time: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});

  const doctorOptions = useMemo(() => doctors.filter((d) => !v.department || d.departmentSlug === v.department), [v.department]);
  const today = new Date().toISOString().split("T")[0];

  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setV((s) => ({ ...s, [k]: e.target.value, ...(k === "department" ? { doctor: "" } : {}) }));
    if (errors[k]) setErrors((s) => ({ ...s, [k]: undefined }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(v);
    setErrors(found);
    if (Object.keys(found).length) return;
    openWhatsAppAppointment({
      name: v.name.trim(),
      phone: v.phone.trim(),
      department: listedDepartments.find((d) => d.slug === v.department)?.name,
      doctor: doctors.find((d) => d.slug === v.doctor)?.name,
      service: services.find((s) => s.slug === v.service)?.name,
      date: v.date || undefined,
      time: v.time || undefined,
      message: v.message.trim() || undefined,
    });
  };

  const ic = (k: keyof Values) => inputClass(!!errors[k]);
  const aria = (k: keyof Values) => ({ "aria-invalid": !!errors[k] || undefined, "aria-describedby": errors[k] ? `${k}-error` : undefined });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
      <Field id="name" label="Full name" required error={errors.name}>
        <input id="name" name="name" autoComplete="name" className={ic("name")} value={v.name} onChange={set("name")} placeholder="Your full name" {...aria("name")} />
      </Field>
      <Field id="phone" label="Phone number" required error={errors.phone}>
        <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" className={ic("phone")} value={v.phone} onChange={set("phone")} placeholder="Your mobile number" {...aria("phone")} />
      </Field>
      <Field id="department" label="Department">
        <select id="department" className={ic("department")} value={v.department} onChange={set("department")}>
          <option value="">Not sure / any</option>
          {listedDepartments.map((d) => <option key={d.slug} value={d.slug}>{d.name}</option>)}
        </select>
      </Field>
      <Field id="doctor" label="Doctor">
        <select id="doctor" className={ic("doctor")} value={v.doctor} onChange={set("doctor")}>
          <option value="">Any available doctor</option>
          {doctorOptions.map((d) => <option key={d.slug} value={d.slug}>{d.name}</option>)}
        </select>
      </Field>
      <Field id="service" label="Service (optional)" className="sm:col-span-2">
        <select id="service" className={ic("service")} value={v.service} onChange={set("service")}>
          <option value="">No specific service</option>
          {services.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
        </select>
      </Field>
      <Field id="date" label="Preferred date" error={errors.date}>
        <input id="date" type="date" min={today} className={ic("date")} value={v.date} onChange={set("date")} {...aria("date")} />
      </Field>
      <Field id="time" label="Preferred time">
        <input id="time" type="time" className={ic("time")} value={v.time} onChange={set("time")} />
      </Field>
      <Field id="message" label="Message (optional)" className="sm:col-span-2">
        <textarea id="message" rows={3} maxLength={500} className={ic("message")} value={v.message} onChange={set("message")} placeholder="Briefly tell us the reason for your visit" />
      </Field>

      <div className="sm:col-span-2">
        <button type="submit" className="inline-flex min-h-14 w-full items-center justify-center gap-2.5 rounded-full bg-wa px-6 text-base font-bold text-white shadow-[0_12px_28px_-12px_rgba(15,123,69,0.8)] transition-colors hover:bg-wa-dark active:scale-[0.99]">
          <MessageCircle className="size-5" aria-hidden="true" /> Continue on WhatsApp
        </button>
        <p className="mt-3 text-center text-sm text-slate-body">Your request will open WhatsApp so our team can confirm your appointment. It is not confirmed until we reply.</p>
      </div>
    </form>
  );
}
