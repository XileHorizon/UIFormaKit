import { UI_FORMA_THEME_TOKENS } from "./contract.generated";

/**
 * The UI Forma theme contract: every CSS custom property a theme file may set to restyle the kit.
 *
 * - primitive: raw scales (colour ramps, spacing, radius, sizes, borders, fonts, motion)
 * - semantic: meanings such as "primary action" or "page background", with light and dark values
 * - component: per-component settings such as button height or slider track colour
 *
 * Components read only contract tokens, so a theme file that overrides these names restyles the
 * whole kit. See docs/theming.md.
 */
export type UIFormaThemeLayer = "primitive" | "semantic" | "component";

export interface UIFormaThemeToken {
  name: `--uf-${string}`;
  layer: UIFormaThemeLayer;
  group: string;
  /** Default value; for semantic tokens this is the light-mode value. */
  value: string;
  /** Dark-mode value when it differs from `value`. */
  dark?: string;
}

export { UI_FORMA_THEME_TOKENS };

export const UI_FORMA_THEME_TOKEN_NAMES: ReadonlySet<string> = new Set(
  UI_FORMA_THEME_TOKENS.map((token) => token.name),
);

/**
 * Variables components set at runtime from props or interaction state. They are not themeable and
 * must never appear in a theme file.
 */
export const UI_FORMA_RUNTIME_VARIABLES = [
  "--uf-angle",
  "--uf-chip-color",
  "--uf-handle-scale",
  "--uf-handle-top",
  "--uf-marquee-duration",
  "--uf-picker-color",
  "--uf-slider-gradient",
  "--uf-slider-progress",
  "--uf-split-pane-position",
  "--uf-ticker-duration",
  "--uf-wheel-size",
] as const;

/** Literal values allowed in component CSS, each with the reason it is not a theme token. */
export const UI_FORMA_LITERAL_EXCEPTIONS = [
  {
    file: "color-controls.css",
    pattern: "conic-gradient hue stops (#f000ff … #ff001a)",
    reason: "The hue wheel must show the full spectrum regardless of theme.",
  },
  {
    file: "color-controls.css",
    pattern: "linear-gradient(90deg, #ff245a, #a518e8 50%, #176cff)",
    reason: "Placeholder gradient for the unconfigured colour slider; real tracks are set at runtime.",
  },
  {
    file: "color-controls.css",
    pattern: "saturation/value field gradients (#000, #fff)",
    reason: "Mathematical HSV surface: black and white are the model's endpoints, not styling.",
  },
  {
    file: "content-components.css",
    pattern: "mask-image gradient (#000)",
    reason: "Mask alpha channel; the colour itself never renders.",
  },
  {
    file: "*.css",
    pattern: "visually hidden 1px box",
    reason: "Accessibility clipping pattern, not a visible size.",
  },
  {
    file: "*.css",
    pattern: "@media breakpoints",
    reason: "CSS custom properties cannot be used in media queries.",
  },
] as const;

export function getThemeToken(name: string): UIFormaThemeToken | undefined {
  return UI_FORMA_THEME_TOKENS.find((token) => token.name === name);
}
