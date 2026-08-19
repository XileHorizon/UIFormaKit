import { useMemo, useState, type CSSProperties } from "react";
import { ColorChip, uiFormaPrimitives } from "./ui";

const levels = ["0", "100", "200", "300", "400", "500", "600", "700", "800", "900", "1000"] as const;

function PrimitiveRamp({ name, numbered = false }: { name: "Primary" | "Secondary"; numbered?: boolean }) {
  const ramp = name === "Primary" ? uiFormaPrimitives.primary : uiFormaPrimitives.secondary;
  const colors = levels.map((level) => ramp[level]);
  return (
    <div className="primitive-ramp" data-figma-node={numbered ? "25:746" : "24:721"}>
      <div className={`primitive-ramp__label${numbered ? " is-numbered" : ""}`}><strong>{name}</strong><small>H ####</small></div>
      <div className="primitive-ramp__body">
        <div className="primitive-ramp__chips">
          {colors.map((color, index) => (
            <div className="primitive-ramp__stop" key={color}>
              {numbered && <span>{levels[index]}</span>}
              <ColorChip color={color} title={`${name} ${levels[index]}`} />
            </div>
          ))}
        </div>
        <div className="primitive-ramp__gradient" style={{ background: `linear-gradient(90deg, ${colors.join(",")})` }} />
      </div>
    </div>
  );
}

function Channel({ label, value, max = 255, gradient, onChange }: { label: string; value: number; max?: number; gradient: string; onChange: (value: number) => void }) {
  return <label className="channel"><span>{label}</span><input type="range" min={0} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} style={{ "--channel-gradient": gradient } as CSSProperties} /><output>{value}</output></label>;
}

function ColorFormatPanel() {
  const [format, setFormat] = useState("HEX");
  const [rgb, setRgb] = useState([32, 104, 220]);
  const [hsl, setHsl] = useState([217, 75, 49]);
  const [cmyk, setCmyk] = useState([85, 53, 0, 14]);
  const hex = `#${rgb.map((value) => value.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
  const update = (values: number[], setValues: (values: number[]) => void, index: number, value: number) => setValues(values.map((old, i) => i === index ? value : old));
  return <div className="format-panel" data-figma-node="56:1901">
    <div className="format-tabs">{["HEX", "RGB", "HSL", "CMYK"].map((item) => <button key={item} data-active={format === item || undefined} onClick={() => setFormat(item)}>{item}</button>)}</div>
    {format === "HEX" ? <>
      <div className="hex-row"><label><input aria-label="Choose color" type="color" value={hex} onChange={(event) => { const value = event.target.value; setRgb([1,3,5].map((i) => parseInt(value.slice(i,i+2),16))); }} /><ColorChip color={hex} style={{ width: 48, height: 32 }} /></label><code>{hex}</code></div>
      <div className="color-readouts"><div>RGB {rgb.join(", ")}</div><div>HSL 217, 75, 49</div><div>HSV 217, 85, 86</div><div>CMYK 85, 53, 0, 14</div><div>OKLCH 0.54, 0.19, 260</div></div>
    </> : <div className="channel-stack"><div className="channel-preview" style={{ background: hex }}>{hex}</div>
      {format === "RGB" && ["R","G","B"].map((label,index) => <Channel key={label} label={label} value={rgb[index]} gradient={["linear-gradient(90deg,#fff1f1,#ff0713)","linear-gradient(90deg,#effff2,#08e63e)","linear-gradient(90deg,#f3f2ff,#1728e8)"][index]} onChange={(value) => update(rgb,setRgb,index,value)} />)}
      {format === "HSL" && ["H","S","L"].map((label,index) => <Channel key={label} label={label} value={hsl[index]} max={index === 0 ? 360 : 100} gradient={["linear-gradient(90deg,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)","linear-gradient(90deg,#8e8e8e,#ff131d)","linear-gradient(90deg,#fff0f0,#f20b17,#050000)"][index]} onChange={(value) => update(hsl,setHsl,index,value)} />)}
      {format === "CMYK" && ["C","M","Y","K"].map((label,index) => <Channel key={label} label={label} value={cmyk[index]} max={100} gradient={["linear-gradient(90deg,#fff,#08e9e7)","linear-gradient(90deg,#fff,#ee09df)","linear-gradient(90deg,#fff,#fff600)","linear-gradient(90deg,#fff,#050505)"][index]} onChange={(value) => update(cmyk,setCmyk,index,value)} />)}
    </div>}
  </div>;
}

function SwatchSettings() {
  const groups = useMemo(() => [["#111319","#252832","#666970","#e5e5e5","#ddd5ca","#cfad78"],["#d93b4a","#df7a2e","#e0bd3f","#4c956c","#4e86b2","#76659e","#c0798e"]], []);
  const [selected, setSelected] = useState("#d93b4a");
  return <div className="swatch-settings"><h3>Colors <span>⌄</span></h3>{["Neutral","Vibrant"].map((name,i) => <div className="swatch-group" key={name}><span>{name}</span><div>{groups[i].map((color) => <button aria-label={`${name} ${color}`} aria-pressed={selected === color} key={color} onClick={() => setSelected(color)}><ColorChip size="small" color={color} /></button>)}</div></div>)}<div className="swatch-group"><span>Custom</span><label className="custom-swatch"><ColorChip size="small" color={selected} /><input aria-label="Custom color" type="color" value={selected} onChange={(event) => setSelected(event.target.value)} /></label></div></div>;
}

function SpecRange({ label, initial }: { label: string; initial: number }) {
  const [value,setValue] = useState(initial);
  return <label className="spec-range"><span>{label}</span><input type="range" value={value} onChange={(event) => setValue(Number(event.target.value))} /><output>{value.toFixed(1)}</output></label>;
}

export function ColorFoundations() {
  return <section className="component-section" id="color-foundations">
    <div className="section-heading"><div><p className="eyebrow">Color controls</p><h2>The complete color toolkit.</h2><p>Swatches, primitive ramps, channel controls, and editor sliders at their defined dimensions and token values.</p></div><a href="#color-foundations">#</a></div>
    <div className="source-control-grid">
      <article><header><h3>Color format panel</h3><code>56:1901</code></header><ColorFormatPanel /></article>
      <article><header><h3>Color settings</h3><code>23:436 · 23:593</code></header><SwatchSettings /></article>
      <article><header><h3>Sidebar sliders</h3><code>10:473</code></header><div className="spec-range-stack"><SpecRange label="Temperature" initial={25}/><SpecRange label="Exposure" initial={50}/></div></article>
      <article><header><h3>Color chip variants</h3><code>23:432 · 23:434 · 54:1522 · 23:435</code></header><div className="chip-variants"><div><ColorChip/><span>Large · 60 × 40</span></div><div><ColorChip size="medium"/><span>Medium · 32 × 32</span></div><div><ColorChip size="wide"/><span>Wide · 205 × 24</span></div><div><ColorChip size="small"/><span>Small · 24 × 24</span></div></div></article>
      <article className="primitive-card"><header><h3>Color primitive scale</h3><code>24:721 · 25:746</code></header><div className="primitive-scroll"><PrimitiveRamp name="Secondary"/><PrimitiveRamp name="Primary" numbered/></div></article>
    </div>
  </section>;
}
