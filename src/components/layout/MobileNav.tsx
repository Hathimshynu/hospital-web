"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { MobileMenu } from "./MobileMenu";

const LEAVE_MS = 280;

/** Hamburger + menu state. The menu closes on route change because state is tied to the path it opened on. */
export function MobileNav() {
  const pathname = usePathname();
  const [openFor, setOpenFor] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);
  const open = openFor === pathname;

  const close = () => {
    if (leaving) return;
    setLeaving(true);
    window.setTimeout(() => { setOpenFor(null); setLeaving(false); }, LEAVE_MS);
  };

  return (
    <>
      <button
        className="grid size-11 place-items-center rounded-full text-navy-950 transition-colors hover:bg-mint"
        aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-menu"
        onClick={() => (open ? close() : setOpenFor(pathname))}
      >
        <span className="relative block h-3.5 w-6" aria-hidden="true">
          <span className="absolute left-0 top-0 h-0.5 w-6 rounded bg-current" />
          <span className="absolute left-0 top-[6px] h-0.5 w-4 rounded bg-current" />
          <span className="absolute left-0 top-3 h-0.5 w-6 rounded bg-current" />
        </span>
      </button>
      {open && <MobileMenu leaving={leaving} onClose={close} pathname={pathname} />}
    </>
  );
}
