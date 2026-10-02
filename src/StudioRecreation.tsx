import { useMemo, useState, type CSSProperties } from "react";
import {
  IconArrowBackUp,
  IconArrowForwardUp,
  IconBell,
  IconBrandCodesandbox,
  IconBrush,
  IconCheck,
  IconCode,
  IconDeviceDesktop,
  IconDeviceMobile,
  IconDeviceTablet,
  IconDownload,
  IconHammer,
  IconMoon,
  IconPhoto,
  IconPlus,
  IconSearch,
  IconShieldCheck,
  IconSun,
  IconTag,
  IconTypography,
} from "@tabler/icons-react";
import {
  Button,
  ColorPicker,
  ControlStack,
  Dialog,
  SegmentedControl,
  Tabs,
  hexToRgb,
  hsvColor,
  rgbToCmyk,
  rgbToHex,
  rgbToHsl,
  rgbToHsv,
  rgbToOklch,
  type ColorHarmony,
  type ColorPickerValue,
  type StackedItem,
} from "./ui";
import HarmonyAnalogous from "./ui/tokens/harmony-analogous.svg?react";
import HarmonyComplementary from "./ui/tokens/harmony-complementary.svg?react";
import HarmonyMonochrome from "./ui/tokens/harmony-monochrome.svg?react";
import HarmonyQuad from "./ui/tokens/harmony-quad.svg?react";
import HarmonySplit from "./ui/tokens/harmony-split.svg?react";
import HarmonyTriad from "./ui/tokens/harmony-triad.svg?react";

type Theme = "light" | "dark";
type Device = "desktop" | "tablet" | "mobile";

const harmonyItems: readonly StackedItem<ColorHarmony>[] = [
  { value: "monochromatic", label: "Monochrome", buttonProps: { leadingIcon: <HarmonyMonochrome /> } },
  { value: "complementary", label: "Complement", buttonProps: { leadingIcon: <HarmonyComplementary /> } },
  { value: "split-complementary", label: "Split", buttonProps: { leadingIcon: <HarmonySplit /> } },
  { value: "triadic", label: "Triad", buttonProps: { leadingIcon: <HarmonyTriad /> } },
  { value: "analogous", label: "Analogous", buttonProps: { leadingIcon: <HarmonyAnalogous /> } },
  { value: "quadratic", label: "Quadrad", buttonProps: { leadingIcon: <HarmonyQuad /> } },
];

const SEEDS = [["Cobalt", "#2b5cce"], ["Crimson", "#ed2d57"], ["Emerald", "#2cd47b"], ["Violet", "#9434df"], ["Amber", "#ed9324"], ["Rose", "#df2684"], ["Teal", "#2cd7c8"], ["Indigo", "#5033db"]] as const;
const RAMP_LIGHTNESS = [97, 89, 79, 68, 57, 47, 39, 31, 23, 16, 9];

function pickerFromHex(hex: string): ColorPickerValue {
  const { h, s, v } = rgbToHsv(hexToRgb(hex)!);
  return { hue: h, saturation: s / 100, value: v / 100 };
}

function rgbFromCss(color: string) {
  const [r, g, b] = color.match(/\d+/g)!.map(Number);
  return { r, g, b };
}

/** Eleven tonal steps around the picked hue, lightest first. */
function rampFor({ hue, saturation }: ColorPickerValue) {
  return RAMP_LIGHTNESS.map((lightness) => `hsl(${Math.round(hue)} ${Math.round(Math.max(saturation, 0.35) * 100)}% ${lightness}%)`);
}

const ramps = {
  Secondary: ["#fff8e8", "#ffd470", "#f4b400", "#d39a00", "#b18100", "#916a00", "#735400", "#584000", "#402f00", "#2b2000", "#191200"],
  Tertiary: ["#f5f2ff", "#d5c9ff", "#b39ff0", "#937cdb", "#785ec0", "#6247a3", "#4f3786", "#3e2a69", "#2e1d4e", "#201238", "#130824"],
  Accent: ["#effaff", "#9adcf6", "#69c5e8", "#38add6", "#1292be", "#08799f", "#07617e", "#064a62", "#05374a", "#032736", "#011925"],
  Neutral: ["#fafafa", "#d6d8dc", "#babdc3", "#9ca0a8", "#7d828d", "#656a74", "#50555e", "#3d4148", "#2d3035", "#1f2125", "#111214"],
};

const semanticRamps = {
  Success: ["#effcf8", "#93e5ce", "#58d0af", "#22b993", "#0b9e7d", "#087f65", "#086451", "#074d40", "#063a31", "#04291f", "#021a14"],
  Warning: ["#f9ffe9", "#cee88d", "#a8ce57", "#82b626", "#639800", "#507a00", "#3e6000", "#304900", "#243700", "#192600", "#101800"],
  Danger: ["#fff1f6", "#ffafd0", "#fb7cb1", "#ec4b94", "#d9277b", "#bb1264", "#961050", "#74103f", "#570e31", "#3d0921", "#270513"],
  Info: ["#eff7ff", "#a8d1ff", "#76b5fb", "#4599ef", "#207ddd", "#1066bd", "#0d5097", "#0b3d74", "#092d57", "#061f3d", "#031426"],
};

const railGroups = [
  { label: "Start", icons: [IconBrush, IconBrandCodesandbox, IconTag] },
  { label: "Build", icons: [IconHammer, IconTypography] },
  { label: "Style", icons: [IconBrush, IconBrandCodesandbox] },
  { label: "Finish", icons: [IconShieldCheck, IconDownload] },
];

function Ramp({ name, colors }: { name: string; colors: string[] }) {
  return (
    <div className="studio-ramp">
      <div className="studio-ramp__label"><strong>{name}</strong><small>H ####</small></div>
      <div className="studio-ramp__colors">
        {colors.map((color, index) => <span key={color} style={{ background: color }} title={`${name} ${index * 100}: ${color}`} />)}
      </div>
      <div className="studio-ramp__bar" style={{ background: `linear-gradient(90deg, ${colors.join(",")})` }} />
    </div>
  );
}

export function StudioRecreation() {
  const [theme, setTheme] = useState<Theme>("light");
  const [device, setDevice] = useState<Device>("desktop");
  const [format, setFormat] = useState("HEX");
  const [harmony, setHarmony] = useState<ColorHarmony>("complementary");
  const [picker, setPicker] = useState<ColorPickerValue>(() => pickerFromHex(SEEDS[0][1]));
  const [history, setHistory] = useState<{ past: ColorPickerValue[]; future: ColorPickerValue[] }>({ past: [], future: [] });
  const [tab, setTab] = useState("overview");
  const [saved, setSaved] = useState(true);
  const [tool, setTool] = useState("Start-0");
  const [view, setView] = useState<"preview" | "code">("preview");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [projects, setProjects] = useState(24);
  const rgb = useMemo(() => rgbFromCss(hsvColor(picker.hue, picker.saturation, picker.value)), [picker]);
  const hex = rgbToHex(rgb);
  const color = hex;
  const primaryRamp = useMemo(() => rampFor(picker), [picker]);
  const hsl = rgbToHsl(rgb);
  const hsv = rgbToHsv(rgb);
  const cmyk = rgbToCmyk(rgb);
  const oklch = rgbToOklch(rgb);
  const readouts: Record<string, string> = {
    HEX: hex,
    RGB: `${rgb.r}, ${rgb.g}, ${rgb.b}`,
    HSL: `${hsl.h}, ${hsl.s}, ${hsl.l}`,
    CMYK: `${cmyk.c}, ${cmyk.m}, ${cmyk.y}, ${cmyk.k}`,
  };
  // Feed the picked colour into the theme contract so the preview's kit components restyle live.
  const previewTheme = {
    "--uf-color-action-primary-default": primaryRamp[5],
    "--uf-color-action-primary-hover": primaryRamp[6],
    "--uf-color-action-primary-pressed": primaryRamp[7],
    "--uf-color-action-primary-subtle": primaryRamp[1],
    "--uf-color-action-primary-subtle-hover": primaryRamp[2],
    "--uf-color-action-primary-border": primaryRamp[4],
  } as CSSProperties;
  const themeCss = `:root {\n${Object.entries(previewTheme).map(([name, value]) => `  ${name}: ${value};`).join("\n")}\n}\n`;
  const allRamps = { Primary: primaryRamp, ...ramps };

  const choose = (next: ColorPickerValue) => {
    setHistory(({ past }) => ({ past: [...past.slice(-49), picker], future: [] }));
    setPicker(next);
    markChanged();
  };
  const undo = () => {
    const previous = history.past.at(-1);
    if (!previous) return;
    setHistory(({ past, future }) => ({ past: past.slice(0, -1), future: [picker, ...future] }));
    setPicker(previous);
    markChanged();
  };
  const redo = () => {
    const next = history.future[0];
    if (!next) return;
    setHistory(({ past, future }) => ({ past: [...past, picker], future: future.slice(1) }));
    setPicker(next);
    markChanged();
  };
  const exportTheme = () => {
    const url = URL.createObjectURL(new Blob([themeCss], { type: "text/css" }));
    const link = Object.assign(document.createElement("a"), { href: url, download: "uiforma-theme.css" });
    link.click();
    URL.revokeObjectURL(url);
  };

  const markChanged = () => {
    setSaved(false);
    window.setTimeout(() => setSaved(true), 700);
  };

  return (
    <main className="studio" data-uiforma-theme={theme}>
      <header className="studio-topbar">
        <a className="studio-logo" href="/" aria-label="Return to UI Forma Kit"><img src="/uiforma-logo.svg" alt="UI Forma" /><i /></a>
        <div className="studio-history">
          <Button appearance="surface" leadingIcon={<IconArrowBackUp />} disabled={!history.past.length} onClick={undo}>Undo</Button>
          <Button appearance="surface" trailingIcon={<IconArrowForwardUp />} disabled={!history.future.length} onClick={redo}>Redo</Button>
          <span className="studio-saved"><IconCheck />{saved ? "Saved!" : "Saving…"}</span>
        </div>
      </header>

      <aside className="studio-left-rail">
        {railGroups.map((group, groupIndex) => <section key={group.label}>
          <h2>{group.label}</h2>
          {group.icons.map((Icon, index) => <button key={index} className={tool === `${group.label}-${index}` ? "is-active" : ""} aria-pressed={tool === `${group.label}-${index}`} aria-label={`${group.label} tool ${index + 1}`} onClick={() => setTool(`${group.label}-${index}`)}><Icon /></button>)}
        </section>)}
      </aside>

      <section className="studio-editor" aria-label="Color system editor">
        <div className="studio-color-workspace">
          <ControlStack radio label="Color harmony" value={harmony} onValueChange={(next) => { setHarmony(next); markChanged(); }} items={harmonyItems} />
          <ColorPicker size={224} harmony={harmony} value={picker} onChange={choose} />
          <div className="studio-color-data">
            <SegmentedControl label="Color format" value={format} onValueChange={setFormat} items={["HEX", "RGB", "HSL", "CMYK"].map((value) => ({ value, label: value }))} />
            <div className="studio-color-value"><span style={{ background: color }} /><code data-testid="studio-color-value">{readouts[format]}</code></div>
            <p>OKLCH&nbsp; {oklch.l.toFixed(2)}, {oklch.c.toFixed(2)}, {oklch.h}</p><p>HSL&nbsp; {hsl.h}, {hsl.s}, {hsl.l}</p><p>HSV&nbsp; {hsv.h}, {hsv.s}, {hsv.v}</p><p>CMYK&nbsp; {cmyk.c}, {cmyk.m}, {cmyk.y}, {cmyk.k}</p><p>RGB&nbsp; {rgb.r}, {rgb.g}, {rgb.b}</p>
          </div>
          <div className="studio-seeds">
            {SEEDS.map(([name, value]) => <button className={hex === value.toUpperCase() ? "is-active" : ""} aria-pressed={hex === value.toUpperCase()} key={name} onClick={() => choose(pickerFromHex(value))}><i style={{ background: value }} />{name}</button>)}
          </div>
        </div>

        <div className="studio-role-cards">
          {Object.entries(allRamps).map(([name, colors], index) => <article key={name}><span style={{ background: index === 0 ? color : colors[5] }} /><div><strong>{name}</strong><small>{index === 0 ? hex : "#2068DC"}</small></div><b>{index === 0 ? "Brand Seed" : "Generated"}</b></article>)}
        </div>
        <div className="studio-ramps">
          <div className="studio-scale-labels"><span />{Array.from({ length: 11 }, (_, index) => <span key={index}>{index * 100}</span>)}</div>
          {Object.entries(allRamps).map(([name, colors]) => <Ramp key={name} name={name} colors={colors} />)}
        </div>
        <div className="studio-role-cards studio-role-cards--semantic">
          {Object.entries(semanticRamps).map(([name, colors]) => <article key={name}><span style={{ background: colors[5] }} /><div><strong>{name}</strong><small>#2068DC</small></div><b>Generated</b></article>)}
        </div>
        <div className="studio-ramps studio-ramps--semantic">
          <div className="studio-scale-labels"><span />{Array.from({ length: 11 }, (_, index) => <span key={index}>{index * 100}</span>)}</div>
          {Object.entries(semanticRamps).map(([name, colors]) => <Ramp key={name} name={name} colors={colors} />)}
        </div>
      </section>

      <section className="studio-preview-shell">
        <div className="studio-preview-tabs" role="tablist" aria-label="Preview mode">
          <button role="tab" aria-selected={view === "preview"} className={view === "preview" ? "is-active" : ""} onClick={() => setView("preview")}>Live Preview</button>
          <button role="tab" aria-selected={view === "code"} className={view === "code" ? "is-active" : ""} onClick={() => setView("code")}>Text Editor</button>
        </div>
        {view === "code" ? <pre className="studio-theme-code" data-testid="studio-theme-code"><code>{themeCss}</code></pre> : (
        <div className="studio-preview" data-device={device} data-theme={theme} data-uiforma-theme={theme} style={previewTheme}>
          <div className="preview-search"><IconSearch /><span>Search projects, people, or tasks</span></div>
          <button className="preview-bell" aria-label="Notifications"><IconBell /></button><span className="preview-avatar">KM</span>
          <div className="preview-heading"><small>WORKSPACE OVERVIEW</small><h1>Good afternoon,<br />Kevin.</h1><p>Here’s what’s happening across your product workspace.</p></div>
          <div className="preview-actions"><Button onClick={() => setDialogOpen(true)}>Open dialog</Button><Button leadingIcon={<IconDownload />} onClick={exportTheme}>Export</Button><Button leadingIcon={<IconPlus />} onClick={() => setProjects((count) => count + 1)}>New project</Button></div>
          <div className="preview-stats">{[["Active projects", String(projects), "↑ 12% this month"], ["Open tasks", "128", "18 due this week"], ["Team members", "16", "3 recently joined"]].map(([label, value, note]) => <article key={label}><small>{label}</small><strong>{value}</strong><span>{note}</span></article>)}</div>
          <div className="preview-details"><h2>Project details</h2><Tabs value={tab} onValueChange={setTab} label="Project details" items={[{ value: "overview", label: "Overview", content: <strong>Project name</strong> }, { value: "activity", label: "Activity", content: <strong>Recent activity</strong> }, { value: "team", label: "Team", content: <strong>Team members</strong> }]} /><p>Native controls and nested patterns respond to the active system.</p></div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen} title="Theme applied" description="Everything in this preview reads the picked colour through the theme contract." footer={<Button onClick={() => setDialogOpen(false)}>Done</Button>}>
            <p>Primary action: <code>{primaryRamp[5]}</code></p>
          </Dialog>
        </div>
        )}
      </section>

      <aside className="studio-right-rail">
        <section><h2>View</h2><button className={view === "preview" ? "is-active" : ""} aria-label="Live preview" onClick={() => setView("preview")}><IconPhoto /></button><button className={view === "code" ? "is-active" : ""} aria-label="Theme code" onClick={() => setView("code")}><IconCode /></button></section>
        <section><h2>Mode</h2><button className={theme === "light" ? "is-active" : ""} onClick={() => setTheme("light")}><IconSun /></button><button className={theme === "dark" ? "is-active" : ""} onClick={() => setTheme("dark")}><IconMoon /></button></section>
        <section><h2>Device</h2><button className={device === "desktop" ? "is-active" : ""} onClick={() => setDevice("desktop")}><IconDeviceDesktop /></button><button className={device === "tablet" ? "is-active" : ""} onClick={() => setDevice("tablet")}><IconDeviceTablet /></button><button className={device === "mobile" ? "is-active" : ""} onClick={() => setDevice("mobile")}><IconDeviceMobile /></button></section>
      </aside>
    </main>
  );
}
