export type ColorFormat = "hex" | "rgb" | "hsl" | "cmyk";

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const round = (value: number, digits = 0) => Number(value.toFixed(digits));

export function hexToRgb(hex: string): Rgb | undefined {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return undefined;
  const digits = match[1].length === 3 ? [...match[1]].map((digit) => digit + digit).join("") : match[1];
  const value = Number.parseInt(digits, 16);
  return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 };
}

export function rgbToHex({ r, g, b }: Rgb): string {
  return `#${[r, g, b]
    .map((channel) => Math.round(clamp(channel, 0, 255)).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
}

/** Hue in degrees, saturation and lightness in percent. */
export function rgbToHsl({ r, g, b }: Rgb) {
  const [red, green, blue] = [r / 255, g / 255, b / 255];
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;
  const delta = max - min;
  if (delta === 0) return { h: 0, s: 0, l: round(lightness * 100) };
  const saturation = delta / (1 - Math.abs(2 * lightness - 1));
  const hue =
    max === red ? ((green - blue) / delta) % 6 : max === green ? (blue - red) / delta + 2 : (red - green) / delta + 4;
  return { h: round((hue * 60 + 360) % 360), s: round(saturation * 100), l: round(lightness * 100) };
}

export function hslToRgb({ h, s, l }: { h: number; s: number; l: number }): Rgb {
  const saturation = clamp(s, 0, 100) / 100;
  const lightness = clamp(l, 0, 100) / 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const sector = (((h % 360) + 360) % 360) / 60;
  const second = chroma * (1 - Math.abs((sector % 2) - 1));
  const [red, green, blue] =
    sector < 1 ? [chroma, second, 0]
    : sector < 2 ? [second, chroma, 0]
    : sector < 3 ? [0, chroma, second]
    : sector < 4 ? [0, second, chroma]
    : sector < 5 ? [second, 0, chroma]
    : [chroma, 0, second];
  const offset = lightness - chroma / 2;
  return { r: (red + offset) * 255, g: (green + offset) * 255, b: (blue + offset) * 255 };
}

/** Hue in degrees, saturation and value in percent. */
export function rgbToHsv({ r, g, b }: Rgb) {
  const [red, green, blue] = [r / 255, g / 255, b / 255];
  const max = Math.max(red, green, blue);
  const delta = max - Math.min(red, green, blue);
  const { h } = rgbToHsl({ r, g, b });
  return { h, s: round(max === 0 ? 0 : (delta / max) * 100), v: round(max * 100) };
}

/** Percentages, 0–100. */
export function rgbToCmyk({ r, g, b }: Rgb) {
  const [red, green, blue] = [r / 255, g / 255, b / 255];
  const key = 1 - Math.max(red, green, blue);
  if (key === 1) return { c: 0, m: 0, y: 0, k: 100 };
  const ink = (channel: number) => round(((1 - channel - key) / (1 - key)) * 100);
  return { c: ink(red), m: ink(green), y: ink(blue), k: round(key * 100) };
}

export function cmykToRgb({ c, m, y, k }: { c: number; m: number; y: number; k: number }): Rgb {
  const key = 1 - clamp(k, 0, 100) / 100;
  const channel = (ink: number) => 255 * (1 - clamp(ink, 0, 100) / 100) * key;
  return { r: channel(c), g: channel(m), b: channel(y) };
}

/** OKLCH lightness 0–1, chroma, and hue in degrees. */
export function rgbToOklch({ r, g, b }: Rgb) {
  const linear = (channel: number) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  const [red, green, blue] = [linear(r), linear(g), linear(b)];
  const l = Math.cbrt(0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue);
  const m = Math.cbrt(0.2119034982 * red + 0.6806995451 * green + 0.1073969566 * blue);
  const s = Math.cbrt(0.0883024619 * red + 0.2817188376 * green + 0.6299787005 * blue);
  const lightness = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bAxis = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const chroma = Math.hypot(a, bAxis);
  const hue = (Math.atan2(bAxis, a) * 180) / Math.PI;
  return { l: round(lightness, 2), c: round(chroma, 2), h: round((hue + 360) % 360) };
}

/** Relative luminance check used to pick readable text on a colour fill. */
export function prefersDarkText({ r, g, b }: Rgb) {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55;
}
