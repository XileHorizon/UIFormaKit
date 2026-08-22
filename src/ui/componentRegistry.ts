export type ComponentStatus = "verified" | "implemented" | "provisional";

export interface UIFormaComponentRecord {
  id: string;
  name: string;
  category: "Actions" | "Forms" | "Color" | "Editor controls" | "Navigation" | "Content";
  description: string;
  figmaNodes: readonly string[];
  status: ComponentStatus;
  variants: readonly string[];
}

export const uiFormaComponentRegistry: readonly UIFormaComponentRecord[] = [
  {
    id: "scroll", name: "Scroll", category: "Content", description: "Rotating live status and alert messages.", figmaNodes: ["provisional:scroll"], status: "provisional", variants: ["automatic", "paused"],
  },
  {
    id: "carousel", name: "Carousel", category: "Content", description: "Sequential content with arrow, dot, and keyboard navigation.", figmaNodes: ["provisional:carousel"], status: "provisional", variants: ["manual", "auto play"],
  },
  {
    id: "marquee", name: "Marquee", category: "Content", description: "Continuous looping content strip with reduced-motion support.", figmaNodes: ["provisional:marquee"], status: "provisional", variants: ["left", "right", "pause on hover"],
  },
  {
    id: "ticker", name: "Ticker", category: "Content", description: "Semantic scrolling message with optional icon and action.", figmaNodes: ["provisional:ticker"], status: "provisional", variants: ["info", "warning", "danger", "success"],
  },
  {
    id: "tabs", name: "Tabs", category: "Navigation", description: "Keyboard-navigable views with roving focus.", figmaNodes: ["provisional:tabs"], status: "provisional", variants: ["active", "disabled"],
  },
  {
    id: "accordion", name: "Accordion", category: "Content", description: "Expandable disclosure sections in single or multiple mode.", figmaNodes: ["provisional:accordion"], status: "provisional", variants: ["single", "multiple", "disabled"],
  },
  {
    id: "button",
    name: "Button",
    category: "Actions",
    description: "Universal action primitive with appearance, scale, shape, content, and icon controls.",
    figmaNodes: ["193:4208", "193:4317", "193:4426"],
    status: "implemented",
    variants: ["primary", "surface", "secondary", "tertiary", "link", "compact", "standard", "huge", "square", "rounded"],
  },
  {
    id: "color-chip",
    name: "Color chip",
    category: "Color",
    description: "Reusable swatch primitive for palettes, fields, and compact color selection.",
    figmaNodes: ["193:4601", "193:4602", "193:4603", "193:4604", "193:4605"],
    status: "verified",
    variants: ["large", "medium", "wide", "small"],
  },
  {
    id: "color-picker",
    name: "Color picker",
    category: "Color",
    description: "Hue wheel and saturation/value surface with reusable harmony handles.",
    figmaNodes: ["193:4600", "193:4667", "193:4668", "193:4818"],
    status: "implemented",
    variants: ["monochromatic", "complementary", "quadratic", "triadic", "analogous", "split complementary"],
  },
  {
    id: "dropdown",
    name: "Dropdown",
    category: "Forms",
    description: "Button-triggered choice control with an action-based dropdown tray.",
    figmaNodes: ["193:7236", "193:7237", "193:7243"],
    status: "implemented",
    variants: ["collapsed", "expanded", "selected"],
  },
  {
    id: "autocomplete",
    name: "Autocomplete",
    category: "Forms",
    description: "Search field with filtered results and tray actions.",
    figmaNodes: ["193:7227", "193:7228", "193:7234"],
    status: "provisional",
    variants: ["closed", "open", "query", "empty"],
  },
  {
    id: "switch",
    name: "Switch",
    category: "Forms",
    description: "Compact binary control backed by semantic selected and disabled roles.",
    figmaNodes: ["193:4592", "193:4593", "193:4595"],
    status: "verified",
    variants: ["toggle on", "toggle off", "disabled"],
  },
  {
    id: "segmented-control",
    name: "Segmented control",
    category: "Forms",
    description: "Mutually exclusive choices presented as a single compact control group.",
    figmaNodes: ["193:7174", "193:7175", "193:7180", "193:7182", "193:7184"],
    status: "implemented",
    variants: ["two items", "three items", "four items"],
  },
  {
    id: "slider",
    name: "Slider",
    category: "Editor controls",
    description: "Continuous value control with standard or color-gradient tracks.",
    figmaNodes: ["193:4553", "193:4554", "193:4559", "193:4565", "193:4571", "193:4577", "193:5038"],
    status: "implemented",
    variants: ["standard", "color", "circle handle", "thin color handle", "thick color handle", "notched color handle"],
  },
  {
    id: "text-field",
    name: "Text field",
    category: "Forms",
    description: "Labeled input with optional icons, hint text, and validation state.",
    figmaNodes: ["193:4537", "193:4538", "193:4543", "193:4548"],
    status: "implemented",
    variants: ["standard", "slim", "tall", "focused", "error", "disabled"],
  },
] as const;
