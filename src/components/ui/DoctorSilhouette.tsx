/** Neutral portrait stand-in shown until a real photograph is added. Not a likeness of anyone. */
export function DoctorSilhouette() {
  return (
    <svg viewBox="0 0 400 440" className="size-full" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="ds-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e4f5f6" /><stop offset="1" stopColor="#b7e6e8" />
        </linearGradient>
      </defs>
      <rect width="400" height="440" fill="url(#ds-bg)" />
      <circle cx="320" cy="90" r="90" fill="#fff" opacity=".45" />
      <circle cx="200" cy="150" r="62" fill="#0b7f88" opacity=".9" />
      <path d="M60 440c0-88 62-140 140-140s140 52 140 140z" fill="#fff" />
      <path d="M200 300l-46 44 46 96 46-96z" fill="#e4f5f6" />
      <path d="M154 344l46 96 46-96" fill="none" stroke="#0b7f88" strokeWidth="6" strokeLinejoin="round" opacity=".5" />
    </svg>
  );
}
