# Web images

`optimized/` holds the ONLY images the site serves (real WebP, resized). Paths are referenced in one place: `src/data/images.ts`.

Your untouched originals live in `assets-source/` (project root, NOT served). To change or add a picture:

1. put the original in `assets-source/`
2. add/adjust its entry in `scripts/optimize-images.mjs`
3. run `node scripts/optimize-images.mjs`
4. point `src/data/images.ts` at the new file

Pregnancy stage 2 has the unrelated hospital signage painted out by that script. Do not replace `story/02.webp` with the raw original.
