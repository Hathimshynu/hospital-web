import type { Variants, Transition } from "framer-motion";

/** One easing + duration language used across the whole site. */
export const ease = [0.22, 1, 0.36, 1] as const;

export const t = (duration = 0.8, delay = 0): Transition => ({ duration, delay, ease });

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (delay: number = 0) => ({ opacity: 1, y: 0, transition: t(0.8, delay) }),
};

export const stagger = (gap = 0.08): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap } },
});

export const viewportOnce = { once: true, margin: "-80px" } as const;

/** Spring used by every pointer-driven 3D tilt so the whole site moves the same way. */
export const tiltSpring = { stiffness: 150, damping: 18, mass: 0.6 } as const;
