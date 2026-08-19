import { useMemo, useState } from "react";
import {
  Autocomplete,
  Button,
  Dropdown,
  IconArrowRight,
  IconSearch,
  SegmentedControl,
  Slider,
  Switch,
  TextField,
  uiFormaComponentRegistry,
  uiFormaPrimitives,
} from "./ui";

const groups = [
  { label: "Getting started", links: [["overview", "Overview"], ["foundations", "Foundations"]] },
  { label: "Actions", links: [["button", "Button"]] },
  { label: "Forms", links: [["text-field", "Text field"], ["dropdown", "Dropdown"], ["autocomplete", "Autocomplete"], ["switch", "Switch"], ["segmented-control", "Segmented control"]] },
  { label: "Editor controls", links: [["slider", "Slider"]] },
] as const;

function Example({ id, title, description, children, code }: { id: string; title: string; description: string; children: React.ReactNode; code: string }) {
  const record = uiFormaComponentRegistry.find((item) => item.id === id);
  const [showCode, setShowCode] = useState(false);
  return (
    <section className="component-section" id={id}>
      <div className="section-heading">
        <div><p className="eyebrow">{record?.category}</p><h2>{title}</h2><p>{description}</p></div>
        <a href={`#${id}`} aria-label={`Link to ${title}`}>#</a>
      </div>
      <div className="example-card">
        <div className="example-toolbar"><span>Interactive example</span><button onClick={() => setShowCode(!showCode)}>{showCode ? "Hide code" : "View code"}</button></div>
        <div className="example-stage">{children}</div>
        {showCode && <pre><code>{code}</code></pre>}
      </div>
      <div className="meta-row"><span>{record?.variants.length ?? 0} variants</span><span>{record?.status}</span><span>Figma {record?.figmaNodes[0]}</span></div>
    </section>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [dropdown, setDropdown] = useState("soft");
  const [autocomplete, setAutocomplete] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [format, setFormat] = useState("HEX");
  const [slider, setSlider] = useState(64);
  const filteredGroups = useMemo(() => groups.map((group) => ({ ...group, links: group.links.filter(([, label]) => label.toLowerCase().includes(query.toLowerCase())) })).filter((group) => group.links.length), [query]);

  return (
    <div className="docs" data-uiforma-theme="dark">
      <header className="topbar">
        <a className="brand" href="#overview"><img src="/uiforma-logo.svg" alt="UI Forma" /><span>Kit</span></a>
        <label className="search"><IconSearch /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search components" aria-label="Search components" /><kbd>⌘ K</kbd></label>
        <a className="figma-link" href="https://www.figma.com/design/6UMDGsdfnSovglFsEN4L1W/UIForma-Kit?node-id=193-7341&m=dev">Open in Figma <IconArrowRight /></a>
      </header>
      <aside className="sidebar">
        {filteredGroups.map((group) => <nav key={group.label} aria-label={group.label}><h3>{group.label}</h3>{group.links.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>)}
        <div className="sidebar-footer"><span>UI Forma Kit</span><small>v0.1.0 · React</small></div>
      </aside>
      <main className="content">
        <section className="hero" id="overview">
          <div><p className="eyebrow">UI Forma design system</p><h1>A flexible kit for expressive product interfaces.</h1><p className="lede">Reusable React components and design tokens reconstructed from the UI Forma Figma library. Browse every component, interact with its states, and copy the source into your product.</p><div className="hero-actions"><Button size="huge" shape="rounded" trailingIcon={<IconArrowRight />}>Explore components</Button><a href="#foundations">View foundations</a></div></div>
          <div className="hero-art" aria-hidden="true"><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="token-card"><small>Action / Primary</small><strong>#3F2DC3</strong><div>{Object.values(uiFormaPrimitives.primary).map((color) => <i key={color} style={{ background: color }}/>)}</div></div></div>
        </section>
        <section className="foundation-section" id="foundations"><div className="section-heading"><div><p className="eyebrow">Foundations</p><h2>Built from tokens, not guesses.</h2><p>Primitive color ramps, semantic roles, spacing, shape, typography, and control dimensions stay synchronized beneath every component.</p></div></div><div className="foundation-grid">{[["Color", "9 families · 99 tokens"], ["Spacing", "4px base grid"], ["Shape", "7 radii"], ["Type", "Instrument Sans + DM Mono"]].map(([name, value], index) => <article key={name}><span>0{index + 1}</span><h3>{name}</h3><p>{value}</p></article>)}</div></section>
        <Example id="button" title="Button" description="Universal actions in multiple appearances, scales, shapes, and content configurations." code={'<Button appearance="primary" size="standard">\n  Create project\n</Button>'}><div className="row"><Button>Primary</Button><Button appearance="surface">Surface</Button><Button appearance="secondary">Secondary</Button><Button appearance="tertiary">Tertiary</Button><Button appearance="link">Link</Button></div></Example>
        <Example id="text-field" title="Text field" description="Labeled inputs with icons, supporting copy, errors, and disabled states." code={'<TextField label="Project name" placeholder="Untitled project" />'}><div className="form-grid"><TextField label="Project name" placeholder="Untitled project" hint="Shown to collaborators"/><TextField label="Email" value="not-an-email" readOnly error="Enter a valid email address"/></div></Example>
        <Example id="dropdown" title="Dropdown" description="A compact choice control with keyboard navigation and an action-based tray." code={'<Dropdown value={value} options={options} onValueChange={setValue} />'}><Dropdown label="Lighting preset" value={dropdown} onValueChange={setDropdown} options={[{ value: "soft", label: "Soft studio" }, { value: "bright", label: "Bright product" }, { value: "editorial", label: "Warm editorial" }]} /></Example>
        <Example id="autocomplete" title="Autocomplete" description="Searchable suggestions with complete keyboard and screen-reader behavior." code={'<Autocomplete value={query} options={options} onValueChange={setQuery} />'}><Autocomplete label="Component" value={autocomplete} onValueChange={setAutocomplete} options={uiFormaComponentRegistry.map((item) => ({ value: item.id, label: item.name }))}/></Example>
        <Example id="switch" title="Switch" description="A compact binary control for immediate settings." code={'<Switch checked={enabled} onCheckedChange={setEnabled} label="Snap to grid" />'}><div className="row"><Switch checked={enabled} onCheckedChange={setEnabled} label="Snap to grid"/><Switch checked={false} disabled label="Disabled"/></div></Example>
        <Example id="segmented-control" title="Segmented control" description="Mutually exclusive options presented as a connected control group." code={'<SegmentedControl label="Color format" value={format} items={items} onValueChange={setFormat} />'}><SegmentedControl label="Color format" value={format} onValueChange={setFormat} items={["HEX", "RGB", "HSL", "CMYK"].map((value) => ({ value, label: value }))}/></Example>
        <Example id="slider" title="Slider" description="Continuous values with standard and gradient track support." code={'<Slider label="Exposure" value={value} onValueChange={setValue} />'}><div className="slider-stack"><Slider label="Exposure" value={slider} onValueChange={setSlider}/><Slider label="Hue" value={slider} onValueChange={setSlider} max={360} gradient="linear-gradient(90deg,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)"/></div></Example>
        <footer><span>UI Forma Kit</span><p>Built from the Figma source at node 193:7341.</p></footer>
      </main>
    </div>
  );
}
