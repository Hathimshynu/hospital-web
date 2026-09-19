import { ImageResponse } from "next/og";
import { hospital } from "@/data/hospital";

export const alt = `${hospital.name} - ${hospital.tagline}, Eraniel, Kanyakumari`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Shared social-sharing card, generated from the hospital config. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "linear-gradient(135deg,#e4f5f6 0%,#ffffff 60%)", color: "#08233B" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 96, height: 96, borderRadius: 28, background: "#0B7F88", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 72, fontWeight: 800 }}>+</div>
          <div style={{ fontSize: 76, fontWeight: 800 }}>{hospital.name}</div>
        </div>
        <div style={{ marginTop: 36, fontSize: 40, fontWeight: 700, color: "#0B7F88", letterSpacing: 4, textTransform: "uppercase" }}>{hospital.tagline}</div>
        <div style={{ marginTop: 24, fontSize: 34, color: "#5F7485" }}>Eraniel, Kanyakumari District, Tamil Nadu</div>
      </div>
    ),
    size,
  );
}
