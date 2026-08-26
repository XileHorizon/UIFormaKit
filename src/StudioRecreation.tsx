import { useMemo, useState } from "react";
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
  SegmentedControl,
  Tabs,
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

const ramps = {
  Primary: ["#eff4ff", "#c4d7ff", "#94b9ff", "#6597fb", "#3d72ec", "#2b5cce", "#2348a9", "#1d3985", "#172a61", "#101c42", "#091126"],
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
  const [picker, setPicker] = useState<ColorPickerValue>({ hue: 217, saturation: 0.85, value: 0.86 });
  const [tab, setTab] = useState("overview");
  const [saved, setSaved] = useState(true);
  const color = useMemo(() => `hsl(${Math.round(picker.hue)} ${Math.round(picker.saturation * 100)}% ${Math.round(picker.value * 52)}%)`, [picker]);

  const markChanged = () => {
    setSaved(false);
    window.setTimeout(() => setSaved(true), 700);
  };

  return (
    <main className="studio" data-uiforma-theme={theme}>
      <header className="studio-topbar">
        <a className="studio-logo" href="/" aria-label="Return to UI Forma Kit"><img src="/uiforma-logo.svg" alt="UI Forma" /><i /></a>
        <div className="studio-history">
          <Button appearance="surface" leadingIcon={<IconArrowBackUp />}>Undo</Button>
          <Button appearance="surface" trailingIcon={<IconArrowForwardUp />}>Redo</Button>
          <span className="studio-saved"><IconCheck />{saved ? "Saved!" : "Saving…"}</span>
        </div>
      </header>

      <aside className="studio-left-rail">
        {railGroups.map((group, groupIndex) => <section key={group.label}>
          <h2>{group.label}</h2>
          {group.icons.map((Icon, index) => <button key={index} className={groupIndex === 0 && index === 0 ? "is-active" : ""} aria-label={`${group.label} tool ${index + 1}`}><Icon /></button>)}
        </section>)}
      </aside>

      <section className="studio-editor" aria-label="Color system editor">
        <div className="studio-color-workspace">
          <ControlStack radio label="Color harmony" value={harmony} onValueChange={(next) => { setHarmony(next); markChanged(); }} items={harmonyItems} />
          <ColorPicker size={224} harmony={harmony} value={picker} onChange={(next) => { setPicker(next); markChanged(); }} />
          <div className="studio-color-data">
            <SegmentedControl label="Color format" value={format} onValueChange={setFormat} items={["HEX", "RGB", "HSL", "CMYK"].map((value) => ({ value, label: value }))} />
            <div className="studio-color-value"><span style={{ background: color }} /><code>#2B5CCE</code></div>
            <p>OKLCH&nbsp; 0.54, 0.19, 260</p><p>HSL&nbsp; 217, 75, 49</p><p>HSV&nbsp; 217, 85, 86</p><p>CMYK&nbsp; 85, 53, 0, 14</p><p>RGB&nbsp; 32, 104, 220</p>
          </div>
          <div className="studio-seeds">
            {[["Cobalt", "#2b5cce"], ["Crimson", "#ed2d57"], ["Emerald", "#2cd47b"], ["Violet", "#9434df"], ["Amber", "#ed9324"], ["Rose", "#df2684"], ["Teal", "#2cd7c8"], ["Indigo", "#5033db"]].map(([name, value], index) => <button className={index === 0 ? "is-active" : ""} key={name}><i style={{ background: value }} />{name}</button>)}
          </div>
        </div>

        <div className="studio-role-cards">
          {Object.entries(ramps).map(([name, colors], index) => <article key={name}><span style={{ background: colors[5] }} /><div><strong>{name}</strong><small>{index === 0 ? "#2B5CCE" : "#2068DC"}</small></div><b>{index === 0 ? "Brand Seed" : "Generated"}</b></article>)}
        </div>
        <div className="studio-ramps">
          <div className="studio-scale-labels"><span />{Array.from({ length: 11 }, (_, index) => <span key={index}>{index * 100}</span>)}</div>
          {Object.entries(ramps).map(([name, colors]) => <Ramp key={name} name={name} colors={colors} />)}
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
        <div className="studio-preview-tabs"><b>Live Preview</b><span>Text Editor</span></div>
        <div className="studio-preview" data-device={device} data-theme={theme}>
          <div className="preview-search"><IconSearch /><span>Search projects, people, or tasks</span></div>
          <button className="preview-bell" aria-label="Notifications"><IconBell /></button><span className="preview-avatar">KM</span>
          <div className="preview-heading"><small>WORKSPACE OVERVIEW</small><h1>Good afternoon,<br />Kevin.</h1><p>Here’s what’s happening across your product workspace.</p></div>
          <div className="preview-actions"><Button onClick={() => markChanged()}>Open dialog</Button><Button leadingIcon={<IconDownload />}>Export</Button><Button leadingIcon={<IconPlus />}>New project</Button></div>
          <div className="preview-stats">{[["Active projects", "24", "↑ 12% this month"], ["Open tasks", "128", "18 due this week"], ["Team members", "16", "3 recently joined"]].map(([label, value, note]) => <article key={label}><small>{label}</small><strong>{value}</strong><span>{note}</span></article>)}</div>
          <div className="preview-details"><h2>Project details</h2><Tabs value={tab} onValueChange={setTab} label="Project details" items={[{ value: "overview", label: "Overview", content: <strong>Project name</strong> }, { value: "activity", label: "Activity", content: <strong>Recent activity</strong> }, { value: "team", label: "Team", content: <strong>Team members</strong> }]} /><p>Native controls and nested patterns respond to the active system.</p></div>
        </div>
      </section>

      <aside className="studio-right-rail">
        <section><h2>View</h2><button className="is-active"><IconPhoto /></button><button><IconCode /></button></section>
        <section><h2>Mode</h2><button className={theme === "light" ? "is-active" : ""} onClick={() => setTheme("light")}><IconSun /></button><button className={theme === "dark" ? "is-active" : ""} onClick={() => setTheme("dark")}><IconMoon /></button></section>
        <section><h2>Device</h2><button className={device === "desktop" ? "is-active" : ""} onClick={() => setDevice("desktop")}><IconDeviceDesktop /></button><button className={device === "tablet" ? "is-active" : ""} onClick={() => setDevice("tablet")}><IconDeviceTablet /></button><button className={device === "mobile" ? "is-active" : ""} onClick={() => setDevice("mobile")}><IconDeviceMobile /></button></section>
      </aside>
    </main>
  );
}
