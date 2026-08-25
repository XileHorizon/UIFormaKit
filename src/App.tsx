import { useEffect, useMemo, useState } from "react";
import { ColorFoundations } from "./ColorFoundations";
import { SliderShowcase } from "./SliderShowcase";
import {
  Autocomplete,
  Accordion,
  Button,
  Carousel,
  COLOR_HARMONIES,
  ColorChip,
  ColorPicker,
  ColorWheel,
  Dropdown,
  HarmonyWheel,
  Marquee,
  Scroll,
  SegmentedControl,
  Slider,
  Switch,
  Tabs,
  TextField,
  Ticker,
  type ButtonAppearance,
  type ButtonSize,
  uiFormaComponentRegistry,
  uiFormaPrimitives,
} from "./ui";
import { IconArrowRight, IconSearch, IconChevronRight, IconSun, IconMoon } from '@tabler/icons-react';
const groups = [
  {
    label: "Content & navigation",
    links: [
      ["scroll", "Scroll"],
      ["carousel", "Carousel"],
      ["marquee", "Marquee"],
      ["ticker", "Ticker"],
      ["tabs", "Tabs"],
      ["accordion", "Accordion"],
    ],
  },
  {
    label: "Getting started",
    links: [
      ["overview", "Overview"],
      ["foundations", "Foundations"],
    ],
  },
  {
    label: "Actions",
    links: [
      ["button-playground", "Button playground"],
      ["button", "Button"],
    ],
  },
  {
    label: "Forms",
    links: [
      ["text-field", "Text field"],
      ["dropdown", "Dropdown"],
      ["autocomplete", "Autocomplete"],
      ["switch", "Switch"],
      ["segmented-control", "Segmented control"],
    ],
  },
  {
    label: "Editor controls",
    links: [
      ["color-foundations", "Color foundations"],
      ["color-studio", "Color studio"],
      ["slider", "Slider"],
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
    <section className="component-section" id={id}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">{record?.category}</p>
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

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = window.localStorage.getItem("uiforma-theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  });
  const [query, setQuery] = useState("");
  const [dropdown, setDropdown] = useState("soft");
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
            placeholder="Search components"
            aria-label="Search components"
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
              Reusable React components and design tokens reconstructed from the
              UI Forma Figma library. Browse every component, interact with its
              states, and copy the source into your product.
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
                <Marquee pauseOnHover duration={38}>
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
                <Marquee direction="right" pauseOnHover duration={44}>
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
                <Marquee pauseOnHover duration={40}>
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
            </div>
          </div>
        </section>
        <section className="foundation-section" id="foundations">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Foundations</p>
              <h2>Built from tokens, not guesses.</h2>
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
            <h3>Harmony wheels</h3>
          </div>
          <div className="harmony-grid">
            {COLOR_HARMONIES.map((harmony) => (
              <article key={harmony}>
                <HarmonyWheel harmony={harmony} size={190} />
                <span>{harmony.replace("-", " ")}</span>
              </article>
            ))}
          </div>
          <div className="subsection-heading">
            <p className="eyebrow">Picker variants</p>
            <h3>Every harmony, editable</h3>
          </div>
          <div className="harmony-grid">
            {COLOR_HARMONIES.map((harmony) => (
              <article key={harmony}>
                <ColorPicker harmony={harmony} size={190} />
                <span>{harmony.replace("-", " ")}</span>
              </article>
            ))}
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
            <Slider
              label="Hue"
              value={slider}
              onValueChange={setSlider}
              max={360}
              gradient="linear-gradient(90deg,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)"
            />
          </div>
        </Example>
        <footer>
          <span>UI Forma Kit</span>
          <p>Built from the Figma source at node 193:7341.</p>
        </footer>
      </main>
    </div>
  );
}
