import { useState } from "react";
import { ColorSlider, Slider } from "./ui";

const colorHandles = [
  { style: "thin", label: "Thin" },
  { style: "thick", label: "Thick" },
  { style: "notched", label: "Notched" },
] as const;

export function SliderShowcase() {
  const [standard, setStandard] = useState(50);

  return (
    <section className="component-section" id="slider-family">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Slider system</p>
          <h2>Two sliders. Four handles.</h2>
          <p>The standard slider uses a 10px outlined track and a 24px circle, with an 8px / 16px compact size. The color slider uses a 20px track and one of three hollow color handles.</p>
        </div>
        <a href="#slider-family">#</a>
      </div>
      <div className="slider-showcase-grid">
        <article>
          <header><h3>Standard slider</h3><span>10px track · 24px circle</span></header>
          <Slider label="Value" value={standard} onValueChange={setStandard} />
          <p className="slider-note">The circle has no outline at rest. Keyboard focus shows an outline, and dragging shows a white halo.</p>
        </article>
        <article>
          <header><h3>Color slider</h3><span>20px track · 3 hollow handles</span></header>
          <div className="color-handle-list">
            {colorHandles.map(({ style, label }, index) => (
              <label key={style}>
                <span>{label}</span>
                <ColorSlider handleStyle={style} defaultValue={25 + index * 25} label={`${label} color slider`} />
              </label>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
