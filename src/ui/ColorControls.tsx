import {
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import "./content-components.css";

export type ColorHarmony =
  | "monochromatic"
  | "complementary"
  | "quadratic"
  | "triadic"
  | "analogous"
  | "split-complementary";

const harmonyAngles: Record<ColorHarmony, number[]> = {
  monochromatic: [0],
  complementary: [0, 180],
  quadratic: [0, 90, 180, 270],
  triadic: [0, 120, 240],
  analogous: [0, -45, 45],
  "split-complementary": [0, 150, 210],
};

interface ColorWheelProps {
  size?: number;
  className?: string;
}

export function ColorWheel({ size = 250, className = "" }: ColorWheelProps) {
  return (
    <div
      className={`uf-color-wheel ${className}`.trim()}
      style={{ "--uf-wheel-size": `${size}px` } as CSSProperties}
      aria-hidden="true"
    />
  );
}

interface HarmonyWheelProps extends ColorWheelProps {
  harmony?: ColorHarmony;
  picker?: boolean;
  color?: string;
  value?: ColorPickerValue;
  defaultValue?: ColorPickerValue;
  onChange?: (value: ColorPickerValue) => void;
}

export interface ColorPickerValue {
  hue: number;
  saturation: number;
  value: number;
}

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

function hsvColor(hue: number, saturation: number, value: number) {
  const chroma = value * saturation;
  const section = hue / 60;
  const x = chroma * (1 - Math.abs((section % 2) - 1));
  const [r, g, b] =
    section < 1
      ? [chroma, x, 0]
      : section < 2
        ? [x, chroma, 0]
        : section < 3
          ? [0, chroma, x]
          : section < 4
            ? [0, x, chroma]
            : section < 5
              ? [x, 0, chroma]
              : [chroma, 0, x];
  const m = value - chroma;
  return `rgb(${Math.round((r + m) * 255)} ${Math.round((g + m) * 255)} ${Math.round((b + m) * 255)})`;
}

export function HarmonyWheel({
  harmony = "monochromatic",
  picker = false,
  color = "#1285e7",
  size = 250,
  className = "",
  value: controlledValue,
  defaultValue = { hue: 190, saturation: 0.82, value: 0.92 },
  onChange,
}: HarmonyWheelProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const dragMode = useRef<"hue" | "sv" | null>(null);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const { hue, saturation, value } = controlledValue ?? internalValue;
  const markerScale = size / 250;
  const pickerColor = picker ? `hsl(${hue} 100% 50%)` : color;

  const updateHue = (clientX: number, clientY: number) => {
    const bounds = rootRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const angle =
      (Math.atan2(
        clientY - bounds.top - bounds.height / 2,
        clientX - bounds.left - bounds.width / 2,
      ) *
        180) /
      Math.PI;
    const nextHue = (angle + 190 + 360) % 360;
    const next = { hue: nextHue, saturation, value };
    if (!controlledValue) setInternalValue(next);
    onChange?.(next);
  };

  const updateSv = (clientX: number, clientY: number) => {
    const bounds = rootRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const inset = bounds.width * 0.16;
    const fieldSize = bounds.width * 0.68;
    const nextSaturation = clamp((clientX - bounds.left - inset) / fieldSize);
    const nextValue = 1 - clamp((clientY - bounds.top - inset) / fieldSize);
    const next = { hue, saturation: nextSaturation, value: nextValue };
    if (!controlledValue) setInternalValue(next);
    onChange?.(next);
  };

  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = rootRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const distance = Math.hypot(
      event.clientX - bounds.left - bounds.width / 2,
      event.clientY - bounds.top - bounds.height / 2,
    );
    dragMode.current = picker && distance < bounds.width * 0.34 ? "sv" : "hue";
    event.currentTarget.setPointerCapture(event.pointerId);
    if (dragMode.current === "sv") updateSv(event.clientX, event.clientY);
    else updateHue(event.clientX, event.clientY);
  };

  const moveDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragMode.current === "sv") updateSv(event.clientX, event.clientY);
    if (dragMode.current === "hue") updateHue(event.clientX, event.clientY);
  };

  return (
    <div
      ref={rootRef}
      className={`uf-harmony-wheel ${className}`.trim()}
      style={{ "--uf-wheel-size": `${size}px`, "--uf-picker-color": pickerColor } as CSSProperties}
      data-picker={picker || undefined}
      role="slider"
      aria-label={`${harmony} color ${picker ? "picker" : "relation"}`}
      aria-valuemin={0}
      aria-valuemax={360}
      aria-valuenow={Math.round(hue)}
      tabIndex={0}
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={() => {
        dragMode.current = null;
      }}
      onPointerCancel={() => {
        dragMode.current = null;
      }}
      onKeyDown={(event) => {
        const hueKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];
        if (!hueKeys.includes(event.key)) return;
        event.preventDefault();
        const delta = event.shiftKey ? 10 : 2;
        const nextHue = event.key === "Home"
          ? 0
          : event.key === "End"
            ? 359
            : (hue + (["ArrowRight", "ArrowUp"].includes(event.key) ? delta : -delta) + 360) % 360;
        const next = { hue: nextHue, saturation, value };
        if (!controlledValue) setInternalValue(next);
        onChange?.(next);
      }}
    >
      <ColorWheel size={size} />
      <div className={picker ? "uf-sv-field" : "uf-color-seed"} />
      {picker && (
        <span
          className="uf-sv-handle"
          style={{
            left: `${16 + saturation * 68}%`,
            top: `${16 + (1 - value) * 68}%`,
            background: hsvColor(hue, saturation, value),
          }}
        />
      )}
      {harmonyAngles[harmony].map((angle, index) => (
        <span
          key={`${angle}-${index}`}
          className={`uf-wheel-handle${index === 0 ? " uf-wheel-handle--primary" : ""}`}
          style={
            {
              "--uf-angle": `${angle + hue - 190}deg`,
              "--uf-handle-scale": markerScale,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

export function ColorPicker(props: Omit<HarmonyWheelProps, "picker">) {
  return <HarmonyWheel {...props} picker />;
}

export type SliderHandleStyle = "thin" | "thick" | "notched";

export function ColorSliderHandle({ style = "thin" }: { style?: SliderHandleStyle }) {
  if (style === "notched") {
    return (
      <svg
        className="uf-slider-handle uf-slider-handle--notched"
        width="17"
        height="30"
        viewBox="0 0 17 30"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M14 0C15.6569 -7.00872e-08 17 1.29991 17 2.90332V27.0967C17 28.65 15.7394 29.9184 14.1543 29.9961L14 30H3L2.8457 29.9961C1.26056 29.9184 7.01622e-08 28.65 0 27.0967V25H12V5H0V2.90332C-7.24225e-08 1.29991 1.34315 7.00872e-08 3 0H14Z"
          fill="#FAFAFA"
        />
      </svg>
    );
  }
  return <span className={`uf-slider-handle uf-slider-handle--${style}`} aria-hidden="true" />;
}

export interface ColorSliderProps {
  handleStyle?: SliderHandleStyle;
  value?: number;
  defaultValue?: number;
  /** @deprecated Use defaultValue for an uncontrolled slider. */
  initialValue?: number;
  onValueChange?: (value: number) => void;
  label?: string;
}

export function ColorSlider({
  handleStyle = "thin",
  value: controlledValue,
  defaultValue,
  initialValue = 50,
  onValueChange,
  label,
}: ColorSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [internalValue, setInternalValue] = useState(defaultValue ?? initialValue);
  const value = controlledValue ?? internalValue;
  const commit = (nextValue: number) => {
    const next = clamp(nextValue / 100) * 100;
    if (controlledValue === undefined) setInternalValue(next);
    onValueChange?.(next);
  };
  const update = (clientX: number) => {
    const bounds = trackRef.current?.getBoundingClientRect();
    if (!bounds) return;
    // Keep the widest color handle fully inside the bar at 0 and 100.
    const handleInset = 9;
    commit(clamp((clientX - bounds.left - handleInset) / (bounds.width - handleInset * 2)) * 100);
  };
  return (
    <div
      ref={trackRef}
      className="uf-color-slider"
      role="slider"
      tabIndex={0}
      aria-label={label ?? "Color slider"}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value)}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        update(event.clientX);
      }}
      onPointerMove={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) update(event.clientX);
      }}
      onKeyDown={(event) => {
        const step = event.shiftKey ? 10 : 2;
        if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
          event.preventDefault();
          commit(value - step);
        }
        if (event.key === "ArrowRight" || event.key === "ArrowUp") {
          event.preventDefault();
          commit(value + step);
        }
        if (event.key === "Home") {
          event.preventDefault();
          commit(0);
        }
        if (event.key === "End") {
          event.preventDefault();
          commit(100);
        }
      }}
    >
      <span
        className="uf-color-slider__handle"
        style={{ left: `calc(9px + (100% - 18px) * ${value / 100})` }}
      >
        <ColorSliderHandle style={handleStyle} />
      </span>
    </div>
  );
}

export const COLOR_HARMONIES = Object.keys(harmonyAngles) as ColorHarmony[];
