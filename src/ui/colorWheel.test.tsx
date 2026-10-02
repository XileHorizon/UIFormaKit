import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { COLOR_WHEEL_STOPS, HarmonyWheel, hueForWheelAngle, wheelAngleForHue } from "./ColorControls";
import { hexToRgb, rgbToHsl } from "./colorFormats";

const hueDistance = (a: number, b: number) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b));

describe("color wheel hue mapping", () => {
  it("reads each gradient stop's hue at its position on the ring", () => {
    COLOR_WHEEL_STOPS.slice(0, -1).forEach((stop, index) => {
      const angle = (index / (COLOR_WHEEL_STOPS.length - 1)) * 360 - 90;
      expect(hueDistance(hueForWheelAngle(angle), rgbToHsl(hexToRgb(stop)!).h)).toBeLessThanOrEqual(1);
    });
  });

  it("round-trips hue through the handle angle", () => {
    for (let hue = 0; hue < 360; hue += 15) {
      expect(hueDistance(hueForWheelAngle(wheelAngleForHue(hue)), hue)).toBeLessThanOrEqual(2);
    }
  });

  it("shows the current colour in the relation wheel's centre", () => {
    const markup = renderToStaticMarkup(<HarmonyWheel value={{ hue: 120, saturation: 1, value: 1 }} />);
    expect(markup).toContain("--uf-picker-color:rgb(0 255 0)");
  });
});
