import { describe, expect, it } from "vitest";
import { cmykToRgb, hexToRgb, hslToRgb, rgbToCmyk, rgbToHex, rgbToHsl, rgbToHsv, rgbToOklch } from "./colorFormats";

// Readout values for #2068DC from the Figma HEX format panel (193:5000).
describe("color formats", () => {
  const rgb = hexToRgb("#2068DC")!;

  it("matches the Figma readout for #2068DC", () => {
    expect(rgb).toEqual({ r: 32, g: 104, b: 220 });
    expect(rgbToHsl(rgb)).toEqual({ h: 217, s: 75, l: 49 });
    expect(rgbToHsv(rgb)).toEqual({ h: 217, s: 85, v: 86 });
    expect(rgbToCmyk(rgb)).toEqual({ c: 85, m: 53, y: 0, k: 14 });
    const oklch = rgbToOklch(rgb);
    expect(oklch.l).toBeCloseTo(0.54, 2);
    expect(oklch.c).toBeCloseTo(0.19, 2);
    expect(Math.abs(oklch.h - 260)).toBeLessThanOrEqual(1);
  });

  it("round-trips through HSL and CMYK within one step", () => {
    for (const hex of ["#2068DC", "#3F2DC3", "#FAFAFA", "#000000", "#81A300"]) {
      const source = hexToRgb(hex)!;
      const viaHsl = hslToRgb(rgbToHsl(source));
      const viaCmyk = cmykToRgb(rgbToCmyk(source));
      for (const key of ["r", "g", "b"] as const) {
        expect(Math.abs(viaHsl[key] - source[key])).toBeLessThanOrEqual(3);
        expect(Math.abs(viaCmyk[key] - source[key])).toBeLessThanOrEqual(3);
      }
    }
  });

  it("parses short hex and rejects junk", () => {
    expect(rgbToHex(hexToRgb("#0ff")!)).toBe("#00FFFF");
    expect(hexToRgb("blue")).toBeUndefined();
  });
});
