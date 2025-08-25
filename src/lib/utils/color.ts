// src/lib/utils/color.ts
export type RGB = [number, number, number];

export function hexToRgb(hex: string): RGB | null {
  const raw = hex.replace("#", "").trim();
  if (!/^[0-9a-f]{3,6}$/i.test(raw)) return null;
  const h =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw.toLowerCase();
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return [r, g, b];
}

export function rgbToString([r, g, b]: RGB): string {
  return `${r},${g},${b}`;
}
export function rgbaString([r, g, b]: RGB, a = 1): string {
  return `${r},${g},${b},${clamp01(a)}`;
}
function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

export function rgbToHslString([r, g, b]: RGB): string {
  // returns "H,S%,L%" (e.g. "40,76%,52%") to match your current data
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  const H = Math.round(h * 360);
  const S = Math.round(s * 100);
  const L = Math.round(l * 100);
  return `${H},${S}%,${L}%`;
}

/**
 * Static-friendly, human-ish color name generator.
 * We synthesize names from H/S/L so we don't depend on external services (CORS/server).
 * Examples: "Vivid Amber", "Muted Teal", "Pale Violet", "Deep Blue"
 */
export function descriptiveNameFromHex(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return "Unknown";
  const hsl = rgbToHslString(rgb).split(",");
  const h = parseInt(hsl[0], 10);
  const s = parseInt(hsl[1], 10);
  const l = parseInt(hsl[2], 10);

  const hueName = hueToLabel(h);
  const vivid = s >= 70;
  const muted = s < 35;
  const dark = l < 30;
  const light = l > 75;

  let tone: string;
  if (dark) tone = "Deep";
  else if (light) tone = "Light";
  else if (vivid) tone = "Vivid";
  else if (muted) tone = "Muted";
  else tone = "Mid";

  // Make "Mid Amber" → just "Amber"
  if (tone === "Mid") return hueName;
  return `${tone} ${hueName}`;
}

function hueToLabel(h: number): string {
  // 24 hues, OKLab-ish buckets, readable names
  const labels = [
    "Red",
    "Red-Orange",
    "Orange",
    "Amber",
    "Yellow",
    "Lime",
    "Chartreuse",
    "Green",
    "Emerald",
    "Teal",
    "Cyan",
    "Sky",
    "Azure",
    "Blue",
    "Indigo",
    "Violet",
    "Purple",
    "Magenta",
    "Cerise",
    "Pink",
    "Rose",
    "Coral",
    "Apricot",
    "Gold",
  ];
  // map 0..360 to a label index
  const idx = Math.round(((h % 360) / 360) * (labels.length - 1));
  return labels[(idx + labels.length) % labels.length];
}

/**
 * Parse a Google Fonts CSS2 href and extract family + weights.
 * Example:
 *  https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap
 */
export function parseGoogleFontsHref(
  href: string
): { family: string; weights: string[] } | null {
  try {
    const u = new URL(href);
    const fam = u.searchParams.get("family");
    if (!fam) return null;

    // "Inter:wght@400;600;800" or "Outfit:wght@500;700"
    const [familyRaw, axisRaw] = fam.split(":");
    const family = decodeURIComponent(familyRaw.replace(/\+/g, " "));
    let weights: string[] = [];

    if (axisRaw && /wght@/i.test(axisRaw)) {
      weights = axisRaw.split("@")[1].split(";").filter(Boolean);
    }
    if (!weights.length) weights = ["400"];

    return { family, weights };
  } catch {
    return null;
  }
}
