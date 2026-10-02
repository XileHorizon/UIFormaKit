import { useEffect, useMemo, useState } from "react";
import { ColorFoundations } from "./ColorFoundations";
import { SliderShowcase } from "./SliderShowcase";
import { StudioRecreation } from "./StudioRecreation";
import {
  Autocomplete,
  Accordion,
  Button,
  Carousel,
  ColorChip,
  ColorPicker,
  ColorWheel,
  ControlStack,
  Dropdown,
  HarmonyWheel,
  Marquee,
  Scroll,
  SegmentedControl,
  Slider,
  Switch,
  Tabs,
  TextArea,
  TextField,
  ThemeSwitch,
  Ticker,
  ButtonBlock,
  ColorFormatPanel,
  ColorRamp,
  ColorRoleCard,
  FieldRow,
  IconLabel,
  SettingsSection,
  SidebarSlider,
  SwatchGroup,
  type ButtonAppearance,
  type ButtonSize,
  type ColorHarmony,
  type ColorPickerValue,
  type StackedItem,
  uiFormaComponentRegistry,
  uiFormaPrimitives,
} from "./ui";
import HarmonyAnalogous from "./ui/tokens/harmony-analogous.svg?react";
import HarmonyComplementary from "./ui/tokens/harmony-complementary.svg?react";
import HarmonyQuad from "./ui/tokens/harmony-quad.svg?react";
import HarmonySplit from "./ui/tokens/harmony-split.svg?react";
import HarmonyTriad from "./ui/tokens/harmony-triad.svg?react";
import HarmonyMonochrome from "./ui/tokens/harmony-monochrome.svg?react";
import { IconArrowRight, IconSearch, IconChevronRight, IconSun, IconMoon, IconRulerMeasure2 } from '@tabler/icons-react';

const harmonyStackItems: readonly StackedItem<ColorHarmony>[] = [
  { value: "monochromatic", label: "Monochrome", buttonProps: { appearance: "surface", shape: "square", leadingIcon: <HarmonyMonochrome /> } },
  { value: "complementary", label: "Complement", buttonProps: { appearance: "surface", shape: "square", leadingIcon: <HarmonyComplementary /> } },
  { value: "split-complementary", label: "Split", buttonProps: { appearance: "surface", shape: "square", leadingIcon: <HarmonySplit /> } },
  { value: "triadic", label: "Triad", buttonProps: { appearance: "surface", shape: "square", leadingIcon: <HarmonyTriad /> } },
  { value: "analogous", label: "Analogous", buttonProps: { appearance: "surface", shape: "square", leadingIcon: <HarmonyAnalogous /> } },
  { value: "quadratic", label: "Quad", buttonProps: { appearance: "surface", shape: "square", leadingIcon: <HarmonyQuad /> } },
];

const componentLevels: Record<string, "Atoms" | "Molecules" | "Organisms"> = {
  button: "Atoms",
  "text-field": "Atoms",
  switch: "Atoms",
  slider: "Atoms",
  dropdown: "Molecules",
  autocomplete: "Molecules",
  "segmented-control": "Molecules",
  "control-stack": "Molecules",
  tabs: "Molecules",
  ticker: "Molecules",
  "settings-section": "Molecules",
  "color-format": "Molecules",
  "color-ramp": "Molecules",
  "icon-label": "Molecules",
  scroll: "Organisms",
  carousel: "Organisms",
  marquee: "Organisms",
  accordion: "Organisms",
};

const sectionOrder: Record<string, number> = {
  button: 21,
  "text-field": 22,
  switch: 23,
  slider: 25,
  dropdown: 30,
  autocomplete: 31,
  "segmented-control": 32,
  "control-stack": 33,
  tabs: 34,
  ticker: 35,
  "settings-section": 36,
  "color-format": 37,
  "color-ramp": 38,
  "icon-label": 39,
  scroll: 40,
  carousel: 41,
  marquee: 42,
  accordion: 43,
};

const groups = [
  {
    label: "Getting started",
    links: [
      ["overview", "Overview"],
      ["hierarchy", "How the kit is built"],
    ],
  },
  {
    label: "Subatomic",
    links: [
      ["foundations", "Quarks"],
      ["color-foundations", "Particles"],
    ],
  },
  {
    label: "Atoms",
    links: [
      ["button-playground", "Button playground"],
      ["button", "Button"],
      ["text-field", "Text field"],
      ["switch", "Switch"],
      ["slider", "Slider"],
    ],
  },
  {
    label: "Molecules",
    links: [
      ["dropdown", "Dropdown"],
      ["autocomplete", "Autocomplete"],
      ["segmented-control", "Segmented control"],
      ["control-stack", "Control stack"],
      ["tabs", "Tabs"],
      ["ticker", "Ticker"],
      ["settings-section", "Settings panels"],
      ["color-format", "Color format panel"],
      ["color-ramp", "Color ramp & roles"],
      ["icon-label", "Icon label"],
    ],
  },
  {
    label: "Organisms",
    links: [
      ["scroll", "Scroll"],
      ["carousel", "Carousel"],
      ["marquee", "Marquee"],
      ["accordion", "Accordion"],
    ],
  },
  {
    label: "Structures",
    links: [
      ["layouts", "Layouts"],
      ["pages", "Pages"],
    ],
  },
] as const;

function Example({
  id,
  title,
  description,
  children,
  code,
}: {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
  code: string;
}) {
  const record = uiFormaComponentRegistry.find((item) => item.id === id);
  const [showCode, setShowCode] = useState(false);
  return (
    <section className="component-section" id={id} style={{ order: sectionOrder[id] }}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">{componentLevels[id] ?? record?.category}</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <a href={`#${id}`} aria-label={`Link to ${title}`}>
          #
        </a>
      </div>
      <div className="example-card">
        <div className="example-toolbar">
          <span>Interactive example</span>
          <button onClick={() => setShowCode(!showCode)}>
            {showCode ? "Hide code" : "View code"}
          </button>
        </div>
        <div className="example-stage">{children}</div>
        {showCode && (
          <pre>
            <code>{code}</code>
          </pre>
        )}
      </div>
      <div className="meta-row">
        <span>{record?.variants.length ?? 0} variants</span>
        <span>{record?.status}</span>
        <span>Figma {record?.figmaNodes[0]}</span>
      </div>
    </section>
  );
}

const LIGHTING_PRESETS = [
  { value: "soft-studio", label: "Soft Studio" },
  { value: "bright-product", label: "Bright Product" },
  { value: "dark-dramatic", label: "Dark Dramatic" },
  { value: "cool-technology", label: "Cool Technology" },
  { value: "warm-editorial", label: "Warm Editorial" },
  { value: "minimal", label: "Minimal" },
] as const;
const LIGHTING_CHANNELS = ["Key", "Fill", "Rim", "Environment", "HDRI Rotate", "Temperature", "Key Around", "Key Height"];
const NEUTRAL_SWATCHES = ["#16191D", "#1C1C1E", "#55565A", "#E8E8E8", "#D8CFC2", "#C7A979"];
const VIBRANT_SWATCHES = ["#B7353F", "#D67035", "#D9B83E", "#508B67", "#527FA9", "#745B9A", "#C87B91"];
const RAMP_STEPS = ["0", "100", "200", "300", "400", "500", "600", "700", "800", "900", "1000"];

function MoleculeExamples() {
  const [preset, setPreset] = useState<(typeof LIGHTING_PRESETS)[number]["value"]>("soft-studio");
  const [lights, setLights] = useState<Record<string, number>>(() => Object.fromEntries(LIGHTING_CHANNELS.map((name) => [name, 0.25])));
  const [swatch, setSwatch] = useState("#527FA9");
  const [formatColor, setFormatColor] = useState("#2068DC");
  const primaryRamp = Object.values(uiFormaPrimitives.primary);
  const secondaryRamp = Object.values(uiFormaPrimitives.secondary);
  return (
    <>
      <Example
        id="settings-section"
        title="Settings panels"
        description="Collapsible sidebar sections built from field rows, preset blocks, sidebar sliders, and swatch groups."
        code={'<SettingsSection title="Lighting">\n  <ButtonBlock label="Lighting presets" items={presets} value={preset} onValueChange={setPreset} />\n  <SidebarSlider label="Key" value={key} onValueChange={setKey} />\n</SettingsSection>'}
      >
        <div className="molecule-panels">
          <SettingsSection title="Transform" spacing="tight">
            <FieldRow>
              <TextField label="Rot X" defaultValue="0.0" inputMode="decimal" />
              <TextField label="Rot Y" defaultValue="0.0" inputMode="decimal" />
              <TextField label="Rot Z" defaultValue="0.0" inputMode="decimal" />
            </FieldRow>
            <TextField label="Scale" defaultValue="1.0" inputMode="decimal" />
          </SettingsSection>
          <SettingsSection title="Lighting">
            <ButtonBlock label="Lighting presets" items={LIGHTING_PRESETS} value={preset} onValueChange={setPreset} />
            {LIGHTING_CHANNELS.map((name) => (
              <SidebarSlider
                key={name}
                label={name}
                value={lights[name]}
                onValueChange={(value) => setLights((current) => ({ ...current, [name]: value }))}
              />
            ))}
          </SettingsSection>
          <SettingsSection title="Colors" spacing="compact">
            <SwatchGroup label="Neutral" colors={NEUTRAL_SWATCHES} value={swatch} onValueChange={setSwatch} />
            <SwatchGroup label="Vibrant" colors={VIBRANT_SWATCHES} value={swatch} onValueChange={setSwatch} />
            <SwatchGroup label="Custom" custom value={swatch} onValueChange={setSwatch} />
          </SettingsSection>
        </div>
      </Example>
      <Example
        id="color-format"
        title="Color format panel"
        description="Edit one colour as HEX, RGB, HSL, or CMYK with channel sliders and live readouts."
        code={'<ColorFormatPanel color={color} onColorChange={setColor} />'}
      >
        <div className="molecule-row">
          {(["hex", "rgb", "hsl", "cmyk"] as const).map((format) => (
            <ColorFormatPanel key={format} defaultFormat={format} color={formatColor} onColorChange={setFormatColor} />
          ))}
        </div>
      </Example>
      <Example
        id="color-ramp"
        title="Color ramp and roles"
        description="Tonal ramps with step labels and blend bars, plus cards that show where each colour role came from."
        code={'<ColorRamp name="Primary" detail="#3F2DC3" colors={ramp} steps={steps} />\n<ColorRoleCard name="Primary" color="#2068DC" tag="Brand Seed" />'}
      >
        <div className="molecule-stack">
          <ColorRamp name="Secondary" detail="H ####" colors={secondaryRamp} />
          <ColorRamp name="Primary" detail="H ####" colors={primaryRamp} steps={RAMP_STEPS} />
          <div className="molecule-row">
            <ColorRoleCard name="Primary" color="#3F2DC3" value="#2068DC" tag="Brand Seed" tone="info" />
            <ColorRoleCard name="Primary" color="#3F2DC3" value="#2068DC" tag="Generated" tone="success" />
            <ColorRoleCard name="Primary" color="#3F2DC3" value="#2068DC" tag="Steered" tone="warning" />
          </div>
        </div>
      </Example>
      <Example
        id="icon-label"
        title="Icon label"
        description="A 54px icon tile for tool rails, filled or bare, in standard and large icon sizes."
        code={'<IconLabel icon={<IconRulerMeasure2 />} label="Measure" />'}
      >
        <div className="row">
          <IconLabel icon={<IconRulerMeasure2 />} label="Measure" />
          <IconLabel icon={<IconRulerMeasure2 />} label="Measure" appearance="plain" />
          <IconLabel icon={<IconRulerMeasure2 />} label="Measure" size="large" />
          <IconLabel icon={<IconRulerMeasure2 />} label="Measure" appearance="plain" size="large" />
        </div>
      </Example>
    </>
  );
}

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = window.localStorage.getItem("uiforma-theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  });
  const [query, setQuery] = useState("");
  const [dropdown, setDropdown] = useState("soft");
  const [harmony, setHarmony] = useState<ColorHarmony>("monochromatic");
  const [harmonyColor, setHarmonyColor] = useState<ColorPickerValue>({ hue: 208, saturation: 0.92, value: 0.91 });
  const [autocomplete, setAutocomplete] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [format, setFormat] = useState("HEX");
  const [slider, setSlider] = useState(64);
  const [activeTab, setActiveTab] = useState("overview");
  const [buttonAppearance, setButtonAppearance] =
    useState<ButtonAppearance>("primary");
  const [buttonSize, setButtonSize] = useState<ButtonSize>("standard");
  const [buttonText, setButtonText] = useState(true);
  const [buttonLeftIcon, setButtonLeftIcon] = useState(false);
  const [buttonRightIcon, setButtonRightIcon] = useState(true);
  const [buttonRound, setButtonRound] = useState(false);
  const [buttonGap, setButtonGap] = useState(8);
  const filteredGroups = useMemo(
    () =>
      groups
        .map((group) => ({
          ...group,
          links: group.links.filter(([, label]) =>
            label.toLowerCase().includes(query.toLowerCase()),
          ),
        }))
        .filter((group) => group.links.length),
    [query],
  );

  if (new URLSearchParams(window.location.search).get("view") === "studio") {
    return <StudioRecreation />;
  }

  useEffect(() => {
    window.localStorage.setItem("uiforma-theme", theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return (
    <div className="docs" data-uiforma-theme={theme}>
      <header className="topbar">
        <a className="brand" href="#overview">
          <img src="/uiforma-logo.svg" alt="UI Forma" />
          <span>Kit</span>
        </a>
        <label className="search">
          <IconSearch />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search the kit"
            aria-label="Search the kit"
          />
          <kbd>⌘ K</kbd>
        </label>
        <div className="topbar-actions">
          <button
            className="theme-toggle"
            type="button"
            role="switch"
            aria-checked={theme === "dark"}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <span aria-hidden="true"><IconSun /></span>
            <i aria-hidden="true" />
            <span aria-hidden="true"><IconMoon /></span>
          </button>
          <a
            className="figma-link"
            href="?view=studio"
          >
            Open studio demo <IconArrowRight />
          </a>
          <a
            className="figma-link"
            href="https://www.figma.com/design/6UMDGsdfnSovglFsEN4L1W/UIForma-Kit?node-id=193-7341&m=dev"
          >
            Open in Figma <IconArrowRight />
          </a>
        </div>
      </header>
      <aside className="sidebar">
        {filteredGroups.map((group) => (
          <nav key={group.label} aria-label={group.label}>
            <h3>{group.label}</h3>
            {group.links.map(([id, label]) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </nav>
        ))}
        <div className="sidebar-footer">
          <span>UI Forma Kit</span>
          <small>v0.1.0 · React</small>
        </div>
      </aside>
      <main className="content">
        <section className="hero" id="overview">
          <div>
            <p className="eyebrow">UI Forma design system</p>
            <h1>A flexible kit for expressive product interfaces.</h1>
            <p className="lede">
              Start with the smallest design decisions, then follow them as they
              grow into components and complete interfaces. Everything in the
              kit has a place, from a single color value to an entire page.
            </p>
            <div className="hero-actions">
              <Button
                size="huge"
                shape="rounded"
                trailingIcon={<IconChevronRight />}
              >
                Explore components
              </Button>
              <a href="#foundations">View foundations</a>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="hero-marquee-field">
              <div className="hero-marquee hero-marquee-one">
                <Marquee pauseOnHover={false} duration={38}>
                  <span className="hero-component-card hero-component-buttons">
                    <Button tabIndex={-1}>Create project</Button>
                    <Button appearance="secondary" shape="rounded" tabIndex={-1}>Preview</Button>
                  </span>
                  <span className="hero-component-card hero-component-segments">
                    <SegmentedControl
                      label="View"
                      value="canvas"
                      onValueChange={() => undefined}
                      items={[
                        { value: "canvas", label: "Canvas" },
                        { value: "code", label: "Code" },
                        { value: "inspect", label: "Inspect" },
                      ]}
                    />
                  </span>
                  <span className="hero-component-card hero-component-buttons">
                    <Button appearance="surface" leadingIcon={<span>＋</span>} tabIndex={-1}>Add layer</Button>
                    <Button appearance="tertiary" trailingIcon={<IconArrowRight />} tabIndex={-1}>Share</Button>
                  </span>
                </Marquee>
              </div>
              <div className="hero-marquee hero-marquee-two">
                <Marquee direction="right" pauseOnHover={false} duration={44}>
                  <span className="hero-component-card hero-component-field">
                    <TextField
                      label="Project name"
                      value="Untitled interface"
                      readOnly
                      tabIndex={-1}
                    />
                  </span>
                  <span className="hero-component-card hero-component-switches">
                    <Switch checked label="Snap to grid" tabIndex={-1} />
                    <Switch checked={false} label="Dark mode" tabIndex={-1} />
                  </span>
                  <span className="hero-component-card hero-component-slider">
                    <Slider
                      label="Radius"
                      value={64}
                      onValueChange={() => undefined}
                      tabIndex={-1}
                    />
                  </span>
                </Marquee>
              </div>
              <div className="hero-marquee hero-marquee-three">
                <Marquee pauseOnHover={false} duration={40}>
                  <span className="hero-component-card hero-component-colors">
                    <span className="hero-component-label">Primary</span>
                    {["#10003f", "#3412a5", "#6669fb", "#9faeff", "#c6d1ff"].map((color) => (
                      <ColorChip key={color} size="small" color={color} />
                    ))}
                  </span>
                  <span className="hero-component-card hero-component-status">
                    <span className="hero-status-dot" />
                    <span><b>All systems ready</b><small>12 components available</small></span>
                  </span>
                  <span className="hero-component-card hero-component-colors">
                    <span className="hero-component-label">Secondary</span>
                    {["#352e00", "#7a6800", "#b59700", "#d6b100", "#f2d163"].map((color) => (
                      <ColorChip key={color} size="small" color={color} />
                    ))}
                  </span>
                </Marquee>
              </div>
              <div className="hero-marquee hero-marquee-one">
                <Marquee direction="right" pauseOnHover={false} duration={60}>
                  
                  <span className="hero-component-card hero-component-segments">
                    <SegmentedControl
                      label="View"
                      value="canvas"
                      onValueChange={() => undefined}
                      items={[
                        { value: "canvas", label: "Canvas" },
                        { value: "code", label: "Code" },
                        { value: "inspect", label: "Inspect" },
                      ]}
                    />
                  </span>
                  <span className="hero-component-card hero-component-buttons">
                    <Button appearance="surface" leadingIcon={<span>＋</span>} tabIndex={-1}>Add layer</Button>
                    <Button appearance="tertiary" trailingIcon={<IconArrowRight />} tabIndex={-1}>Share</Button>
                  </span>
                  <span className="hero-component-card hero-component-buttons">
                    <Button tabIndex={-1}>Create project</Button>
                    <Button appearance="secondary" shape="rounded" tabIndex={-1}>Preview</Button>
                  </span>
                </Marquee>
              </div>
              <div className="hero-marquee hero-marquee-two">
                <Marquee pauseOnHover={false} duration={78}>
                  <span className="hero-component-card hero-component-switches">
                    <Switch checked label="Snap to grid" tabIndex={-1} />
                    <Switch checked={false} label="Dark mode" tabIndex={-1} />
                  </span>
                  <span className="hero-component-card hero-component-field">
                    <TextField
                      label="Project name"
                      value="Untitled interface"
                      readOnly
                      tabIndex={-1}
                    />
                  </span>
                  <span className="hero-component-card hero-component-slider">
                    <Slider
                      label="Radius"
                      value={64}
                      onValueChange={() => undefined}
                      tabIndex={-1}
                    />
                  </span>
                </Marquee>
              </div>
              <div className="hero-marquee hero-marquee-three">
                <Marquee direction="right" pauseOnHover={false} duration={88}>
                  <span className="hero-component-card hero-component-colors">
                    <span className="hero-component-label">Primary</span>
                    {["#10003f", "#3412a5", "#6669fb", "#9faeff", "#c6d1ff"].map((color) => (
                      <ColorChip key={color} size="small" color={color} />
                    ))}
                  </span>
                  <span className="hero-component-card hero-component-colors">
                    <span className="hero-component-label">Secondary</span>
                    {["#352e00", "#7a6800", "#b59700", "#d6b100", "#f2d163"].map((color) => (
                      <ColorChip key={color} size="small" color={color} />
                    ))}
                  </span>
                  <span className="hero-component-card hero-component-status">
                    <span className="hero-status-dot" />
                    <span><b>All systems ready</b><small>12 components available</small></span>
                  </span>
                </Marquee>
              </div>
            </div>
          </div>
        </section>
        <section className="hierarchy-section" id="hierarchy">
          <div className="section-heading">
            <div>
              <p className="eyebrow">How the kit is built</p>
              <h2>Small decisions become complete interfaces.</h2>
              <p>
                UI Forma follows atomic design, with a subatomic layer for the
                values and styles that exist before a component takes shape.
              </p>
            </div>
          </div>
          <div className="hierarchy-grid">
            <article>
              <span>Subatomic</span>
              <h3>Quarks</h3>
              <p>Raw values for color, spacing, type, shape, and motion.</p>
            </article>
            <article>
              <span>Subatomic</span>
              <h3>Particles</h3>
              <p>Named styles and roles made from the raw values beneath them.</p>
            </article>
            <article>
              <span>Atomic</span>
              <h3>Atoms</h3>
              <p>The smallest interactive pieces, ready to do one clear job.</p>
            </article>
            <article>
              <span>Atomic</span>
              <h3>Molecules</h3>
              <p>Small groups of atoms working together as one control.</p>
            </article>
            <article>
              <span>Atomic</span>
              <h3>Organisms</h3>
              <p>Reusable sections that coordinate content, controls, and behavior.</p>
            </article>
            <article>
              <span>Structures</span>
              <h3>Layouts &amp; pages</h3>
              <p>Arrangements and finished examples that show the full system at work.</p>
            </article>
          </div>
        </section>
        <section className="foundation-section" id="foundations">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Subatomic · Quarks</p>
              <h2>The smallest decisions in the system.</h2>
              <p>
                Primitive color ramps, semantic roles, spacing, shape,
                typography, and control dimensions stay synchronized beneath
                every component.
              </p>
            </div>
          </div>
          <div className="foundation-grid">
            {[
              ["Color", "9 families · 99 tokens"],
              ["Spacing", "4px base grid"],
              ["Shape", "7 radii"],
              ["Type", "Instrument Sans + DM Mono"],
            ].map(([name, value], index) => (
              <article key={name}>
                <span>0{index + 1}</span>
                <h3>{name}</h3>
                <p>{value}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="component-section" id="button-playground">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Interactive anatomy</p>
              <h2>Build a button.</h2>
              <p>
                Configure the same primitive across appearance, scale, content,
                icons, radius, and internal spacing.
              </p>
            </div>
            <a href="#button-playground">#</a>
          </div>
          <div className="playground-card">
            <div className="button-preview">
              <Button
                appearance={buttonAppearance}
                size={buttonSize}
                shape={buttonRound ? "rounded" : "square"}
                contentGap={buttonGap}
                leadingIcon={
                  buttonLeftIcon ? (
                    <span aria-hidden="true">＋</span>
                  ) : undefined
                }
                trailingIcon={buttonRightIcon ? <IconArrowRight /> : undefined}
                aria-label={buttonText ? undefined : "Continue"}
              >
                {buttonText ? "Continue" : undefined}
              </Button>
              <p>
                {buttonText
                  ? "A familiar call to action"
                  : "The same component, now icon-only"}
              </p>
            </div>
            <div className="config-panel">
              <fieldset>
                <legend>Color style</legend>
                <div className="choice-row">
                  {(
                    [
                      "primary",
                      "surface",
                      "secondary",
                      "tertiary",
                      "link",
                    ] as ButtonAppearance[]
                  ).map((item) => (
                    <button
                      key={item}
                      data-active={buttonAppearance === item || undefined}
                      onClick={() => setButtonAppearance(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend>Scale</legend>
                <SegmentedControl
                  value={buttonSize}
                  onValueChange={setButtonSize}
                  label="Button scale"
                  items={(["compact", "standard", "huge"] as ButtonSize[]).map(
                    (value) => ({
                      value,
                      label:
                        value === "compact"
                          ? "Small"
                          : value === "standard"
                            ? "Medium"
                            : "Large",
                    }),
                  )}
                />
              </fieldset>
              <div className="switch-grid">
                <Switch
                  checked={buttonText}
                  onCheckedChange={setButtonText}
                  label="Text"
                />
                <Switch
                  checked={buttonLeftIcon}
                  onCheckedChange={setButtonLeftIcon}
                  label="Left icon"
                />
                <Switch
                  checked={buttonRightIcon}
                  onCheckedChange={setButtonRightIcon}
                  label="Right icon"
                />
                <Switch
                  checked={buttonRound}
                  onCheckedChange={setButtonRound}
                  label="Round"
                />
              </div>
              <label className="gap-control">
                <span>
                  Internal spacing <output>{buttonGap}px</output>
                </span>
                <input
                  type="range"
                  min="0"
                  max="24"
                  step="2"
                  value={buttonGap}
                  onChange={(event) => setButtonGap(Number(event.target.value))}
                />
              </label>
            </div>
          </div>
        </section>
        <Example
          id="scroll"
          title="Scroll"
          description="A polite live region that rotates concise alerts, updates, or system status messages."
          code={'<Scroll items={updates} interval={4000} />'}
        >
          <Scroll items={[
            { id: "deploy", content: "Deployment completed successfully" },
            { id: "team", content: "Three teammates are editing this project" },
            { id: "save", content: "All changes saved 12 seconds ago" },
          ]} />
        </Example>
        <Example
          id="carousel"
          title="Carousel"
          description="A manual or auto-playing content sequence with arrows, pagination, and keyboard navigation."
          code={'<Carousel label="Featured workflows">{slides}</Carousel>'}
        >
          <Carousel label="Featured workflows">
            {["Generate a theme", "Review your components", "Publish the system"].map((title, index) => <article className="starter-slide" key={title}><span>0{index + 1}</span><h3>{title}</h3><p>A flexible content area ready for imagery, product cards, or editorial copy.</p></article>)}
          </Carousel>
        </Example>
        <Example
          id="marquee"
          title="Scrolling marquee"
          description="A continuous content rail for logos, tags, stats, or expressive display text."
          code={'<Marquee><span>Design</span><span>Build</span><span>Ship</span></Marquee>'}
        >
          <Marquee label="UI Forma capabilities">
            {["Tokens", "Components", "Themes", "Accessibility", "React", "Figma"].map((item) => <span className="marquee-pill" key={item}>{item}</span>)}
          </Marquee>
          <Marquee>
            <button>test 1</button>
            <button>test 2</button>
            <button>test 3</button>
            <button>test 4</button>
            <Ticker>the text is scrolling on this ticker the opposite of the marquee</Ticker>
          </Marquee>
        </Example>
        <Example
          id="ticker"
          title="Ticker"
          description="A semantic scrolling message with an optional status icon and redirect or action control."
          code={'<Ticker variant="info" action={{ label: "Learn more", href: "/updates" }}>Information ticker</Ticker>'}
        >
          <Ticker
            variant="info"
            label="Information ticker"
            action={{ label: "Details", href: "#overview", ariaLabel: "View information details" }}
          >
            <span>This is an information ticker, not anything super serious, just info.</span>
          </Ticker>
        </Example>
        <MoleculeExamples />
        <Example
          id="tabs"
          title="Tabs"
          description="Related views with arrow-key navigation, roving focus, and a disabled state."
          code={'<Tabs value={tab} onValueChange={setTab} items={items} />'}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} label="Project details" items={[
            { value: "overview", label: "Overview", content: <><h3>Overview</h3><p>The high-level story and current project status.</p></> },
            { value: "activity", label: "Activity", content: <><h3>Activity</h3><p>Recent edits, comments, and publishing events.</p></> },
            { value: "settings", label: "Settings", content: <><h3>Settings</h3><p>Project visibility and collaboration controls.</p></> },
            { value: "settingss", label: "Settings", content: <><h3>Settings</h3><p>Project visibility and collaboration controls.</p></> },
            { value: "archive", label: "Archive", content: null, disabled: true },
          ]} />
        </Example>
        <Example
          id="accordion"
          title="Accordion"
          description="Single or multiple disclosure sections with semantic buttons and regions."
          code={'<Accordion type="multiple" items={items} />'}
        >
          <Accordion type="multiple" defaultValue="tokens" items={[
            { value: "tokens", trigger: "What are design tokens?", content: "Named decisions for color, spacing, typography, shape, and motion that keep interfaces consistent." },
            { value: "themes", trigger: "How do themes work?", content: "Semantic tokens remap the same component structure for light, dark, and future brand themes." },
            { value: "export", trigger: "Can I export components?", content: "Yes. These React primitives are intentionally small, typed, and composable." },
          ]} />
        </Example>
        <Example
          id="button"
          title="Button"
          description="Universal actions in multiple appearances, scales, shapes, and content configurations."
          code={
            '<Button appearance="primary" size="standard">\n  Create project\n</Button>'
          }
        >
          <div className="row">
            <Button>Primary</Button>
            <Button appearance="surface">Surface</Button>
            <Button appearance="secondary">Secondary</Button>
            <Button appearance="tertiary">Tertiary</Button>
            <Button appearance="link">Link</Button>
          </div>
        </Example>
        <Example
          id="text-field"
          title="Text field"
          description="Labeled inputs with icons, supporting copy, errors, and disabled states."
          code={
            '<TextField label="Project name" placeholder="Untitled project" />'
          }
        >
          <div className="form-grid">
            <TextField
              label="Project name"
              placeholder="Untitled project"
              hint="Shown to collaborators"
            />
            <TextField
              label="Email"
              value="not-an-email"
              readOnly
              error="Enter a valid email address"
            />
            <TextField
              label="Seed color"
              defaultValue="#3F2DC3"
              supportingText="HEX"
            />
            <TextField
              label="Slim"
              size="slim"
              defaultValue="0.0"
              supportingText="deg"
            />
            <TextArea label="Notes" placeholder="Describe the palette intent" />
          </div>
        </Example>
        <Example
          id="dropdown"
          title="Dropdown"
          description="A compact choice control with keyboard navigation and an action-based tray."
          code={
            "<Dropdown value={value} options={options} onValueChange={setValue} />"
          }
        >
          <Dropdown
            label="Lighting preset"
            value={dropdown}
            onValueChange={setDropdown}
            options={[
              { value: "soft", label: "Soft studio" },
              { value: "bright", label: "Bright product" },
              { value: "editorial", label: "Warm editorial" },
            ]}
          />
        </Example>
        <Example
          id="autocomplete"
          title="Autocomplete"
          description="Searchable suggestions with complete keyboard and screen-reader behavior."
          code={
            "<Autocomplete value={query} options={options} onValueChange={setQuery} />"
          }
        >
          <Autocomplete
            label="Component"
            value={autocomplete}
            onValueChange={setAutocomplete}
            options={uiFormaComponentRegistry.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
          />
        </Example>
        <Example
          id="switch"
          title="Switch"
          description="A compact binary control for immediate settings."
          code={
            '<Switch checked={enabled} onCheckedChange={setEnabled} label="Snap to grid" />'
          }
        >
          <div className="row">
            <Switch
              checked={enabled}
              onCheckedChange={setEnabled}
              label="Snap to grid"
            />
            <Switch checked={false} disabled label="Disabled" />
            <ThemeSwitch theme={theme} onThemeChange={setTheme} />
          </div>
        </Example>
        <Example
          id="segmented-control"
          title="Segmented control"
          description="Mutually exclusive options presented as a connected control group."
          code={
            '<SegmentedControl label="Color format" value={format} items={items} onValueChange={setFormat} />'
          }
        >
          <SegmentedControl
            label="Color format"
            value={format}
            onValueChange={setFormat}
            items={["HEX", "RGB", "HSL", "CMYK"].map((value) => ({
              value,
              label: value,
            }))}
          />
        </Example>
        <Example
          id="control-stack"
          title="Control stack"
          description="Actions or mutually exclusive choices arranged as one connected vertical control."
          code={
            '<ControlStack radio label="Color harmony" value={harmony} items={items} onValueChange={setHarmony} />'
          }
        >
          <ControlStack
            radio
            label="Color harmony"
            value={harmony}
            onValueChange={setHarmony}
            className="harmony-stack"
            items={harmonyStackItems}
          />
        </Example>
        <ColorFoundations />
        <section className="component-section" id="color-studio">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Color controls</p>
              <h2>A hands-on color studio.</h2>
              <p>
                Interactive hue wheels, saturation/value pickers, harmony
                relationships, and gradient sliders from the original UI Forma
                work.
              </p>
            </div>
            <a href="#color-studio">#</a>
          </div>
          <div className="color-feature-grid">
            <article>
              <ColorWheel />
              <h3>Hue wheel</h3>
              <p>The full perceptual hue spectrum.</p>
            </article>
            <article>
              <ColorPicker />
              <h3>Color picker</h3>
              <p>
                Drag the ring and inner field to choose hue, saturation, and
                value.
              </p>
            </article>
          </div>
          <div className="subsection-heading">
            <p className="eyebrow">Color relations</p>
            <h3>Harmony workspace</h3>
          </div>
          <div className="harmony-workspace">
            <aside>
              <span className="harmony-workspace-label">Relationship</span>
              <ControlStack
                radio
                label="Choose a color harmony"
                value={harmony}
                onValueChange={setHarmony}
                className="harmony-stack"
                items={harmonyStackItems}
              />
            </aside>
            <article>
              <header>
                <span>Relationship</span>
                <strong>{harmony.replace("-", " ")}</strong>
              </header>
              <HarmonyWheel harmony={harmony} size={250} value={harmonyColor} onChange={setHarmonyColor} />
              <p>See the selected hues distributed around the color wheel.</p>
            </article>
            <article>
              <header>
                <span>Editable picker</span>
                <strong>{harmony.replace("-", " ")}</strong>
              </header>
              <ColorPicker harmony={harmony} size={250} value={harmonyColor} onChange={setHarmonyColor} />
              <p>Adjust hue, saturation, and value while preserving the relationship.</p>
            </article>
          </div>
        </section>
        <SliderShowcase />
        <Example
          id="slider"
          title="Slider"
          description="Continuous values with standard and gradient track support."
          code={
            '<Slider label="Exposure" value={value} onValueChange={setValue} />'
          }
        >
          <div className="slider-stack">
            <Slider label="Exposure" value={slider} onValueChange={setSlider} />
            <Slider label="Compact" size="compact" value={slider} onValueChange={setSlider} />
            <Slider
              label="Hue"
              value={slider}
              onValueChange={setSlider}
              max={360}
              gradient="linear-gradient(90deg,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)"
            />
          </div>
        </Example>
        <section className="structures-section" id="layouts">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Structures · Layouts</p>
              <h2>Where components find their place.</h2>
              <p>
                Layout documentation will collect the shells, grids, and
                responsive arrangements built from UI Forma organisms.
              </p>
            </div>
            <span className="collection-status">Collection growing</span>
          </div>
        </section>
        <section className="structures-section" id="pages">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Structures · Pages</p>
              <h2>The whole system, working together.</h2>
              <p>
                Page examples will show UI Forma layouts filled with realistic
                components, content, and responsive behavior.
              </p>
            </div>
            <span className="collection-status">Collection growing</span>
          </div>
        </section>
        <footer>
          <span>UI Forma Kit</span>
          <p>Built from the Figma source at node 193:7341.</p>
        </footer>
      </main>
    </div>
  );
}
