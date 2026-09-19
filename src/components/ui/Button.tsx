import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "whatsapp" | "light" | "outline-light";

const styles: Record<ButtonVariant, string> = {
  primary: "bg-brand-600 text-white shadow-[0_10px_28px_-10px_rgba(11,127,136,0.7)] hover:bg-brand-700",
  secondary: "border border-navy-950/15 bg-white text-navy-950 hover:border-brand-500 hover:text-brand-700",
  ghost: "border border-brand-600/30 text-brand-700 hover:bg-mint",
  whatsapp: "wa-btn bg-wa text-white shadow-[0_10px_28px_-10px_rgba(15,123,69,0.7)] hover:bg-wa-dark",
  light: "bg-white text-navy-950 hover:bg-mint",
  "outline-light": "border border-white/40 text-white hover:bg-white/10",
};

/** Single button primitive: internal link, external link (new tab) or <button>. */
export const buttonClass = (variant: ButtonVariant = "primary", className?: string) =>
  cn(
    "btn-sweep group inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-center text-[15px] font-semibold leading-tight transition-all duration-300 active:scale-[0.98]",
    styles[variant],
    className,
  );

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  href?: string;
  /** opens in a new tab (used for WhatsApp / maps) */
  external?: boolean;
  variant?: ButtonVariant;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
}

export function Button({ href, external, variant = "primary", arrow, className, children, ...rest }: Props) {
  const cls = buttonClass(variant, className);
  const inner = (
    <>
      {children}
      {arrow && <ArrowRight className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />}
    </>
  );
  if (href && external) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>;
  }
  if (href) {
    // tel:, mailto: and in-page anchors must not go through the client router
    if (/^(tel|mailto):|^#/.test(href)) return <a href={href} className={cls}>{inner}</a>;
    return <Link href={href} className={cls}>{inner}</Link>;
  }
  return <button className={cls} {...rest}>{inner}</button>;
}
