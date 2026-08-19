import { useState, type CSSProperties } from "react";

type SliderScale = "standard" | "compact";

function FigmaSlider({ value, onChange, scale = "standard", label }: { value: number; onChange: (value: number) => void; scale?: SliderScale; label?: string }) {
  return <input className={`figma-slider figma-slider--${scale}`} aria-label={label ?? "Slider"} type="range" min={0} max={100} value={value} onChange={(event) => onChange(Number(event.target.value))} style={{ "--figma-progress": `${value}%` } as CSSProperties} />;
}

function ColorValueSlider({ initialValue, node }: { initialValue: number; node: string }) {
  const [value,setValue] = useState(initialValue);
  return <label className="figma-color-value" data-figma-node={node}><span><input aria-label={`Color value ${value}`} type="range" min={0} max={255} value={value} onChange={(event) => setValue(Number(event.target.value))} style={{ "--figma-color-position": `${(value / 255) * 100}%` } as CSSProperties}/></span><input aria-label="Numeric color value" type="number" min={0} max={255} value={value} onChange={(event) => setValue(Math.min(255,Math.max(0,Number(event.target.value))))}/></label>;
}

export function SliderShowcase() {
  const [standard,setStandard] = useState(50);
  const [sidebar,setSidebar] = useState(25);
  return <section className="component-section" id="slider-family">
    <div className="section-heading"><div><p className="eyebrow">Slider system</p><h2>One family, every Figma variant.</h2><p>Interactive implementations of the standard slider, compact sidebar slider, color value control, bar, and all three handles.</p></div><a href="#slider-family">#</a></div>
    <div className="slider-showcase-grid">
      <article className="standard-slider-card"><header><h3>Standard slider</h3><code>193:4554–4577</code></header><div className="standard-slider-demo"><FigmaSlider value={standard} onChange={setStandard}/><output>{standard}</output></div><div className="slider-state-row">{[0,25,50,75,100].map((value) => <button key={value} data-active={standard === value || undefined} onClick={() => setStandard(value)}>{value}</button>)}</div></article>
      <article><header><h3>Sidebar slider</h3><code>193:4597</code></header><label className="figma-sidebar-slider"><span>Temperature</span><FigmaSlider value={sidebar} onChange={setSidebar} scale="compact" label="Temperature"/><output>{sidebar.toFixed(1)}</output></label></article>
      <article className="color-value-card"><header><h3>Color value sliders</h3><code>193:5039 · 5044 · 5049</code></header><div className="figma-color-value-stack"><ColorValueSlider initialValue={255} node="193:5039"/><ColorValueSlider initialValue={127} node="193:5044"/><ColorValueSlider initialValue={0} node="193:5049"/></div></article>
      <article><header><h3>Slider primitives</h3><code>193:4998 · 4997 · 4993 · 4995</code></header><div className="slider-primitives"><span className="slider-bar-primitive"/><span className="slider-handle-primitive is-thin"/><span className="slider-handle-primitive is-thick"/><span className="slider-handle-primitive is-notched"/></div></article>
    </div>
  </section>;
}
