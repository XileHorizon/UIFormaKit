import { useState } from "react";
import { ColorChip, ColorFormatPanel, ColorRamp, SettingsSection, SidebarSlider, SwatchGroup, uiFormaPrimitives } from "./ui";

const levels = ["0", "100", "200", "300", "400", "500", "600", "700", "800", "900", "1000"] as const;
const neutral = ["#111319", "#252832", "#666970", "#E5E5E5", "#DDD5CA", "#CFAD78"];
const vibrant = ["#D93B4A", "#DF7A2E", "#E0BD3F", "#4C956C", "#4E86B2", "#76659E", "#C0798E"];

function SwatchSettings() {
  const [selected, setSelected] = useState("#D93B4A");
  return (
    <SettingsSection title="Colors" spacing="compact">
      <SwatchGroup label="Neutral" colors={neutral} value={selected} onValueChange={setSelected} />
      <SwatchGroup label="Vibrant" colors={vibrant} value={selected} onValueChange={setSelected} />
      <SwatchGroup label="Custom" custom value={selected} onValueChange={setSelected} />
    </SettingsSection>
  );
}

function SidebarSliders() {
  const [temperature, setTemperature] = useState(0.2);
  const [exposure, setExposure] = useState(0.5);
  return (
    <div className="spec-range-stack">
      <SidebarSlider label="Temperature" value={temperature} onValueChange={setTemperature} />
      <SidebarSlider label="Exposure" value={exposure} onValueChange={setExposure} />
    </div>
  );
}

export function ColorFoundations() {
  const [color, setColor] = useState("#2068DC");
  const ramp = (family: "primary" | "secondary") => levels.map((level) => uiFormaPrimitives[family][level]);
  return <section className="component-section" id="color-foundations">
    <div className="section-heading"><div><p className="eyebrow">Color controls</p><h2>The complete color toolkit.</h2><p>Swatches, primitive ramps, channel controls, and editor sliders at their defined dimensions and token values.</p></div><a href="#color-foundations">#</a></div>
    <div className="source-control-grid">
      <article><header><h3>Color format panel</h3><code>193:4999</code></header><ColorFormatPanel color={color} onColorChange={setColor} /></article>
      <article><header><h3>Color settings</h3><code>193:4606</code></header><SwatchSettings /></article>
      <article><header><h3>Sidebar sliders</h3><code>193:4597</code></header><SidebarSliders /></article>
      <article><header><h3>Color chip variants</h3><code>193:4601</code></header><div className="chip-variants"><div><ColorChip/><span>Large · 60 × 40</span></div><div><ColorChip size="medium"/><span>Medium · 32 × 32</span></div><div><ColorChip size="wide"/><span>Wide · 205 × 24</span></div><div><ColorChip size="small"/><span>Small · 24 × 24</span></div></div></article>
      <article className="primitive-card"><header><h3>Color primitive scale</h3><code>193:4609</code></header><div className="primitive-scroll"><ColorRamp name="Secondary" detail="H ####" colors={ramp("secondary")} /><ColorRamp name="Primary" detail="H ####" colors={ramp("primary")} steps={levels} /></div></article>
    </div>
  </section>;
}
