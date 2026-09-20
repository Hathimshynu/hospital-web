/**
 * Regenerates every web image in public/images/optimized/ from the untouched originals in
 * assets-source/ (which is NOT served). Run: node scripts/optimize-images.mjs
 *
 * Output is real WebP (the originals are PNG data with a .webp extension).
 * Two edits are applied to the originals, both documented here:
 *  - doctor portrait: cropped to the photo (removes the UI frame and a name badge that reads a different name)
 *  - pregnancy stage 2: the fascia sign and signpost header, which carried an UNRELATED hospital's name,
 *    are painted out so the arrival scene shows a neutral, unbranded entrance.
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const SRC = "assets-source";
const OUT = "public/images/optimized";
const w = (from, to, width, quality = 78) => ({ from, to, width, quality });

const jobs = [
  w("hospital/hospital.webp", "hospital/building.webp", 2000, 80),
  w("facilities/consulation_room.webp", "facilities/consultation-room.webp", 1000),
  w("facilities/laboratory.webp", "facilities/laboratory.webp", 1000),
  w("facilities/ultrasoun_scanning.webp", "facilities/ultrasound-scanning.webp", 1000),
  w("facilities/pharmacy.webp", "facilities/pharmacy.webp", 1000),
  w("facilities/general_medicine.webp", "departments/general-medicine.webp", 1600),
  w("facilities/obstetrics_gynecology.webp", "departments/obstetrics-gynecology.webp", 1600),
  ...[1, 3, 4, 5, 6].map((n) => w(`preganacy_${n}.webp`, `story/0${n}.webp`, 1600)),
];

async function write(input, to, width, quality) {
  fs.mkdirSync(path.dirname(path.join(OUT, to)), { recursive: true });
  const r = await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality }).toFile(path.join(OUT, to));
  console.log(to.padEnd(40), `${r.width}x${r.height}`, `${Math.round(r.size / 1024)}KB`);
}

for (const j of jobs) await write(path.join(SRC, j.from), j.to, j.width, j.quality);

// doctor: crop to the portrait photo
{
  const buf = await sharp(path.join(SRC, "doctors/doctor.webp")).extract({ left: 330, top: 180, width: 1495, height: 1250 }).toBuffer();
  await write(buf, "doctors/dr-melbin.webp", 1100, 82);
}

// pregnancy stage 2: paint out the unrelated hospital's signage
{
  const { data, info } = await sharp(path.join(SRC, "preganacy_2.webp")).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, C = 4;
  const px = (x, y, c) => data[(y * W + x) * C + c];
  const avgCol = (xa, xb, y, c) => { let s = 0; for (let x = xa; x < xb; x++) s += px(x, y, c); return s / (xb - xa); };
  // fascia banner: per row, blend the plain fascia left of the lettering into the plain fascia right of it
  const bx0 = 436, bx1 = 1572, by0 = 16, by1 = 212;
  for (let y = by0; y < by1; y++) for (let c = 0; c < 3; c++) {
    const L = avgCol(bx0 - 14, bx0 - 2, y, c), R = avgCol(bx1 + 2, bx1 + 14, y, c);
    for (let x = bx0; x < bx1; x++) {
      const t = (x - bx0) / (bx1 - bx0);
      data[(y * W + x) * C + c] = Math.max(0, Math.min(255, Math.round(L * (1 - t) + R * t + Math.sin(x * 12.9898 + y * 78.233) * 1.1)));
    }
  }
  // signpost header (logo + name): vertical blend
  for (let x = 246; x < 392; x++) {
    const top = [0, 1, 2].map((c) => (px(x, 328, c) + px(x, 327, c) + px(x, 326, c)) / 3);
    const bot = [0, 1, 2].map((c) => (px(x, 402, c) + px(x, 403, c) + px(x, 404, c)) / 3);
    for (let y = 334; y < 396; y++) { const t = (y - 334) / 62; for (let c = 0; c < 3; c++) data[(y * W + x) * C + c] = Math.round(top[c] * (1 - t) + bot[c] * t); }
  }
  const cleaned = await sharp(data, { raw: { width: W, height: info.height, channels: C } }).png().toBuffer();
  await write(cleaned, "story/02.webp", 1600, 78);
}
