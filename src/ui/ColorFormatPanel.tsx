import { useEffect, useState, type CSSProperties } from "react";
import { ColorSlider } from "./ColorControls";
import { SegmentedControl } from "./SegmentedControl";
import {
  cmykToRgb,
  hexToRgb,
  hslToRgb,
  prefersDarkText,
  rgbToCmyk,
  rgbToHex,
  rgbToHsl,
  rgbToHsv,
  rgbToOklch,
  type ColorFormat,
  type Rgb,
} from "./colorFormats";
import "./tokens/components.css";
import "./molecules.css";

export interface ColorFormatPanelProps {
  /** Current colour as a hex string. */
  color: string;
  onColorChange: (hex: string) => void;
  format?: ColorFormat;
  defaultFormat?: ColorFormat;
  onFormatChange?: (format: ColorFormat) => void;
  className?: string;
}

const FORMATS = [
  { value: "hex", label: "HEX" },
  { value: "rgb", label: "RGB" },
  { value: "hsl", label: "HSL" },
  { value: "cmyk", label: "CMYK" },
] as const;

interface Channel {
  label: string;
  value: number;
  max: number;
  gradient: string;
  apply: (value: number) => Rgb;
}

function channelsFor(format: Exclude<ColorFormat, "hex">, rgb: Rgb): Channel[] {
  const css = (color: Rgb) => rgbToHex(color);
  if (format === "rgb") {
    return (["r", "g", "b"] as const).map((key) => ({
      label: { r: "Red", g: "Green", b: "Blue" }[key],
      value: rgb[key],
      max: 255,
      gradient: `linear-gradient(90deg, ${css({ ...rgb, [key]: 0 })}, ${css({ ...rgb, [key]: 255 })})`,
      apply: (value) => ({ ...rgb, [key]: value }),
    }));
  }
  if (format === "hsl") {
    const hsl = rgbToHsl(rgb);
    return [
      {
        label: "Hue",
        value: hsl.h,
        max: 360,
        gradient: `linear-gradient(90deg, ${[0, 60, 120, 180, 240, 300, 360].map((h) => css(hslToRgb({ ...hsl, h }))).join(", ")})`,
        apply: (h) => hslToRgb({ ...hsl, h }),
      },
      {
        label: "Saturation",
        value: hsl.s,
        max: 100,
        gradient: `linear-gradient(90deg, ${css(hslToRgb({ ...hsl, s: 0 }))}, ${css(hslToRgb({ ...hsl, s: 100 }))})`,
        apply: (s) => hslToRgb({ ...hsl, s }),
      },
      {
        label: "Lightness",
        value: 100 - hsl.l,
        max: 100,
        gradient: `linear-gradient(90deg, ${css(hslToRgb({ ...hsl, l: 100 }))}, ${css(hslToRgb({ ...hsl, l: 50 }))}, ${css(hslToRgb({ ...hsl, l: 0 }))})`,
        apply: (l) => hslToRgb({ ...hsl, l: 100 - l }),
      },
    ];
  }
  const cmyk = rgbToCmyk(rgb);
  const inks = [
    ["c", "Cyan", "#00FFFF"],
    ["m", "Magenta", "#FF00FF"],
    ["y", "Yellow", "#FFFF00"],
    ["k", "Key", "#000000"],
  ] as const;
  return inks.map(([key, label, ink]) => ({
    label,
    value: cmyk[key],
    max: 100,
    gradient: `linear-gradient(90deg, #FFFFFF, ${ink})`,
    apply: (value) => cmykToRgb({ ...cmyk, [key]: value }),
  }));
}

/** Edit one colour as HEX, RGB, HSL, or CMYK, matching the Figma colour format panels. */
export function ColorFormatPanel({
  color,
  onColorChange,
  format: controlledFormat,
  defaultFormat = "hex",
  onFormatChange,
  className = "",
}: ColorFormatPanelProps) {
  const [internalFormat, setInternalFormat] = useState<ColorFormat>(defaultFormat);
  const format = controlledFormat ?? internalFormat;
  const rgb = hexToRgb(color) ?? { r: 0, g: 0, b: 0 };
  const hex = rgbToHex(rgb);
  const [draft, setDraft] = useState(hex);
  useEffect(() => setDraft(hex), [hex]);

  const commitDraft = (next: string) => {
    setDraft(next);
    const parsed = hexToRgb(next);
    if (parsed) onColorChange(rgbToHex(parsed));
  };
  const setFormat = (next: ColorFormat) => {
    if (controlledFormat === undefined) setInternalFormat(next);
    onFormatChange?.(next);
  };
  const hsl = rgbToHsl(rgb);
  const hsv = rgbToHsv(rgb);
  const cmyk = rgbToCmyk(rgb);
  const oklch = rgbToOklch(rgb);

  return (
    <div className={`uf-color-format ${className}`.trim()} data-format={format}>
      <SegmentedControl label="Color format" value={format} items={FORMATS} onValueChange={setFormat} />
      {format === "hex" ? (
        <>
          <div className="uf-color-format__swatch-row">
            <span className="uf-color-format__swatch" style={{ background: hex }} aria-hidden="true" />
            <input
              className="uf-color-format__field"
              aria-label="Hex color"
              value={draft}
              spellCheck={false}
              onChange={(event) => commitDraft(event.currentTarget.value)}
            />
          </div>
          <dl className="uf-color-format__readout">
            <div><dt>RGB</dt><dd>{`${rgb.r}, ${rgb.g}, ${rgb.b}`}</dd></div>
            <div><dt>HSL</dt><dd>{`${hsl.h}, ${hsl.s}, ${hsl.l}`}</dd></div>
            <div><dt>HSV</dt><dd>{`${hsv.h}, ${hsv.s}, ${hsv.v}`}</dd></div>
            <div><dt>CMYK</dt><dd>{`${cmyk.c}, ${cmyk.m}, ${cmyk.y}, ${cmyk.k}`}</dd></div>
            <div><dt>OKLCH</dt><dd>{`${oklch.l.toFixed(2)}, ${oklch.c.toFixed(2)}, ${oklch.h}`}</dd></div>
          </dl>
        </>
      ) : (
        <>
          <input
            className="uf-color-format__field uf-color-format__field--filled"
            aria-label="Hex color"
            value={draft}
            spellCheck={false}
            data-text={prefersDarkText(rgb) ? "dark" : "light"}
            style={{ "--uf-color-format-fill": hex } as CSSProperties}
            onChange={(event) => commitDraft(event.currentTarget.value)}
          />
          {channelsFor(format, rgb).map((channel) => (
            <ColorSlider
              key={channel.label}
              label={channel.label}
              handleStyle="notched"
              showValue
              max={channel.max}
              value={channel.value}
              gradient={channel.gradient}
              onValueChange={(value) => onColorChange(rgbToHex(channel.apply(Math.round(value))))}
            />
          ))}
        </>
      )}
    </div>
  );
}
