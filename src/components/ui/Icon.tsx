import {
  HeartPulse, Brain, Bone, Baby, Stethoscope, Scissors, Sparkles, Ear, Eye, ScanLine,
  Siren, Ambulance, Pill, FlaskConical, ShieldCheck, Activity, BedDouble, Microscope,
  Droplet, Users, CalendarCheck, Monitor, ClipboardList, Flower2, Building2, Smile, Car,
  type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/types";

const map: Record<IconName, LucideIcon> = {
  heart: HeartPulse, brain: Brain, bone: Bone, baby: Baby, stethoscope: Stethoscope,
  scissors: Scissors, sparkles: Sparkles, ear: Ear, eye: Eye, scan: ScanLine, siren: Siren,
  ambulance: Ambulance, pill: Pill, flask: FlaskConical, shield: ShieldCheck, activity: Activity,
  bed: BedDouble, microscope: Microscope, droplet: Droplet, users: Users, calendar: CalendarCheck,
  monitor: Monitor, clipboard: ClipboardList, flower: Flower2, building: Building2, smile: Smile, car: Car,
};

export function Icon({ name, className, strokeWidth = 1.6 }: { name: IconName; className?: string; strokeWidth?: number }) {
  const C = map[name];
  return <C className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
