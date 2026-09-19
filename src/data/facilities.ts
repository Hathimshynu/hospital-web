import type { Facility } from "@/types";

/** Facilities that follow directly from the confirmed services. */
export const facilities: Facility[] = [
  { slug: "consultation-rooms", name: "Consultation Rooms", icon: "stethoscope", summary: "Comfortable, private rooms for unhurried consultations with your doctor.", imageKey: "facilities/consultation-rooms" },
  { slug: "laboratory", name: "Laboratory", icon: "flask", summary: "In-house laboratory for blood checking, typing and other investigations.", imageKey: "facilities/laboratory" },
  { slug: "ultrasound", name: "Ultrasound Scanning", icon: "scan", summary: "Ultrasound scanning for diagnosis and pregnancy care.", imageKey: "facilities/ultrasound" },
  { slug: "pharmacy", name: "Pharmacy", icon: "pill", summary: "Prescribed medicines available without leaving the building.", imageKey: "facilities/pharmacy" },
];
