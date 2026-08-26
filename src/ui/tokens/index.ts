import foundationsSource from "./source/foundations.tokens.json";
import primitivesSource from "./source/primitives.tokens.json";
import semanticDarkSource from "./source/semantic-dark.tokens.json";
import semanticLightSource from "./source/semantic-light.tokens.json";

type TokenLeaf<T> = { $type: string; $value: T };
type ColorValue = { hex: string };

const color = (value: unknown) => (value as TokenLeaf<ColorValue>).$value.hex;
const number = (value: unknown) => (value as TokenLeaf<number>).$value;
const string = (value: unknown) => (value as TokenLeaf<string>).$value;

const primitives = primitivesSource as unknown as Record<
  string,
  Record<string, TokenLeaf<ColorValue>>
>;
const foundations = foundationsSource as Record<string, unknown>;

export const UI_FORMA_PRIMITIVE_FAMILIES = [
  "Primary",
  "Secondary",
  "Tertiary",
  "Accent",
  "Neutral",
  "Success",
  "Warning",
  "Danger",
  "Info",
] as const;

export type UIFormaPrimitiveFamily = (typeof UI_FORMA_PRIMITIVE_FAMILIES)[number];

export const UI_FORMA_COLOR_STEPS = [
  "0",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "1000",
] as const;

export const uiFormaPrimitives = Object.fromEntries(
  UI_FORMA_PRIMITIVE_FAMILIES.map((family) => [
    family.toLowerCase(),
    Object.fromEntries(
      UI_FORMA_COLOR_STEPS.map((step) => [step, color(primitives[family][step])]),
    ),
  ]),
) as Record<Lowercase<UIFormaPrimitiveFamily>, Record<(typeof UI_FORMA_COLOR_STEPS)[number], string>>;

const spacingSource = foundations.Spacing as Record<string, TokenLeaf<number>>;
const radiusSource = foundations.Radius as Record<string, TokenLeaf<number>>;
const sizeSource = foundations.Size as Record<string, Record<string, TokenLeaf<number>>>;
const borderSource = foundations.BorderWidth as Record<string, TokenLeaf<number>>;
const typographySource = foundations.Typography as Record<string, Record<string, TokenLeaf<number | string>>>;
const fontSource = foundations.FontFamily as Record<string, TokenLeaf<string>>;

export const uiFormaFoundations = {
  spacing: Object.fromEntries(Object.entries(spacingSource).map(([key, token]) => [key, number(token)])),
  radius: Object.fromEntries(
    Object.entries(radiusSource)
      .filter(([, token]) => "$value" in token)
      .map(([key, token]) => [key, number(token)]),
  ),
  controlSize: Object.fromEntries(
    Object.entries(sizeSource.Control).map(([key, token]) => [key, number(token)]),
  ),
  iconSize: Object.fromEntries(
    Object.entries(sizeSource.Icon).map(([key, token]) => [key, number(token)]),
  ),
  borderWidth: Object.fromEntries(
    Object.entries(borderSource).map(([key, token]) => [key, number(token)]),
  ),
  fonts: {
    heading: string(fontSource.Heading),
    body: string(fontSource.Body),
    mono: string(fontSource.Mono),
  },
  typography: Object.fromEntries(
    Object.entries(typographySource).map(([name, values]) => [
      name,
      Object.fromEntries(Object.entries(values).map(([key, token]) => [key, token.$value])),
    ]),
  ),
} as const;

type SemanticSource = typeof semanticLightSource;

function semanticTheme(source: SemanticSource) {
  return {
    background: {
      page: color(source.Background.Page),
      subtle: color(source.Background.Subtle),
      raised: color(source.Background.Raised),
    },
    text: {
      primary: color(source.Text.Primary),
      secondary: color(source.Text.Secondary),
      disabled: color(source.Text.Disabled),
    },
    border: {
      subtle: color(source.Border.Subtle),
      default: color(source.Border.Default),
      strong: color(source.Border.Strong),
    },
    state: {
      selected: color(source.State.Selected.Container),
      disabled: color(source.State.Disabled.Container),
      error: {
        container: color(source.State.Error.Container),
        border: color(source.State.Error.Border),
        text: color(source.State.Error.Text),
      },
    },
    action: {
      primary: {
        subtle: color(source.Action.Primary.Subtle),
        subtleHover: color(source.Action.Primary.SubtleHover),
        border: color(source.Action.Primary.Border),
        default: color(source.Action.Primary.Default),
        hover: color(source.Action.Primary.Hover),
        pressed: color(source.Action.Primary.Pressed),
        text: color(source.Action.Primary.Text),
      },
      secondary: {
        subtle: color(source.Action.Secondary.Subtle),
        subtleHover: color(source.Action.Secondary.SubtleHover),
        border: color(source.Action.Secondary.Border),
        default: color(source.Action.Secondary.Default),
        hover: color(source.Action.Secondary.Hover),
        pressed: color(source.Action.Secondary.Pressed),
        text: color(source.Action.Secondary.Text),
      },
    },
  };
}

export const uiFormaThemes = {
  light: semanticTheme(semanticLightSource),
  dark: semanticTheme(semanticDarkSource),
} as const;

export type UIFormaTheme = keyof typeof uiFormaThemes;

