/**
 * Designed stand-in shown until the real building photograph is added at
 * public/images/hospital/building.jpg. It is an illustration, not a photo.
 */
export function HospitalIllustration() {
  return (
    <svg viewBox="0 0 800 600" className="size-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="hi-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d6f1f3" /><stop offset="1" stopColor="#f7fcfc" />
        </linearGradient>
        <linearGradient id="hi-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#e4f5f6" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#hi-sky)" />
      <circle cx="660" cy="120" r="54" fill="#fff" opacity=".7" />
      <rect y="470" width="800" height="130" fill="#cfe9ea" />
      <rect y="500" width="800" height="100" fill="#b9dfe1" />
      {/* main block */}
      <rect x="170" y="190" width="460" height="290" rx="10" fill="url(#hi-wall)" stroke="#0b7f88" strokeOpacity=".25" />
      <rect x="170" y="190" width="460" height="34" rx="10" fill="#0b7f88" />
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3, 4, 5].map((c) => (
          <rect key={`${r}-${c}`} x={200 + c * 68} y={246 + r * 62} width="44" height="38" rx="5" fill="#8fe3e5" opacity={c === 2 || c === 3 ? 0 : 0.85} />
        )),
      )}
      {/* entrance */}
      <rect x="352" y="340" width="96" height="140" rx="8" fill="#08233b" />
      <rect x="360" y="348" width="38" height="132" fill="#27c4c8" opacity=".55" />
      <rect x="402" y="348" width="38" height="132" fill="#27c4c8" opacity=".35" />
      <rect x="330" y="322" width="140" height="18" rx="6" fill="#0b7f88" />
      {/* cross sign */}
      <circle cx="400" cy="272" r="34" fill="#fff" stroke="#0b7f88" strokeWidth="4" />
      <path d="M394 252h12v14h14v12h-14v14h-12v-14h-14v-12h14z" fill="#0f9fa8" />
      {/* wings */}
      <rect x="60" y="300" width="120" height="180" rx="8" fill="#f1fafa" stroke="#0b7f88" strokeOpacity=".2" />
      <rect x="620" y="300" width="120" height="180" rx="8" fill="#f1fafa" stroke="#0b7f88" strokeOpacity=".2" />
      {[0, 1].map((r) => [0, 1].map((c) => (
        <g key={`w-${r}-${c}`}>
          <rect x={80 + c * 50} y={324 + r * 70} width="34" height="40" rx="5" fill="#8fe3e5" opacity=".8" />
          <rect x={640 + c * 50} y={324 + r * 70} width="34" height="40" rx="5" fill="#8fe3e5" opacity=".8" />
        </g>
      )))}
      {/* trees */}
      {[110, 700].map((x) => (
        <g key={x}><rect x={x - 4} y="452" width="8" height="30" fill="#7fa9ab" /><circle cx={x} cy="440" r="26" fill="#6fc3c5" opacity=".7" /></g>
      ))}
    </svg>
  );
}
