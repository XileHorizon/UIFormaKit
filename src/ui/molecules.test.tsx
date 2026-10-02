import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ButtonBlock } from "./ButtonBlock";
import { ColorFormatPanel } from "./ColorFormatPanel";
import { ColorRamp } from "./ColorRamp";
import { ColorRoleCard } from "./ColorRoleCard";
import { ColorSlider } from "./ColorControls";
import { FieldRow } from "./FieldRow";
import { IconLabel } from "./IconLabel";
import { SettingsSection } from "./SettingsSection";
import { SidebarSlider } from "./SidebarSlider";
import { SwatchGroup } from "./SwatchGroup";
import { TextField } from "./TextField";

const noop = () => undefined;

describe("UI Forma molecules", () => {
  it("renders a collapsible settings section", () => {
    const open = renderToStaticMarkup(<SettingsSection title="Transform" spacing="tight">Body</SettingsSection>);
    expect(open).toContain('aria-expanded="true"');
    expect(open).toContain('data-spacing="tight"');
    expect(renderToStaticMarkup(<SettingsSection title="Lighting" defaultOpen={false}>Body</SettingsSection>)).toContain("hidden");
  });

  it("marks the selected preset in a button block", () => {
    const markup = renderToStaticMarkup(
      <ButtonBlock label="Lighting presets" value="soft" items={[{ value: "soft", label: "Soft Studio" }, { value: "bright", label: "Bright Product" }]} />,
    );
    expect(markup).toContain('aria-pressed="true"');
    expect(markup).toContain('aria-pressed="false"');
    expect(markup).toContain("uf-button--compact");
  });

  it("lays out fields, sidebar sliders, and icon labels", () => {
    expect(renderToStaticMarkup(<FieldRow><TextField label="Rot X" defaultValue="0.0" /></FieldRow>)).toContain("uf-field-row");
    const slider = renderToStaticMarkup(<SidebarSlider label="Key" value={0.25} onValueChange={noop} />);
    expect(slider).toContain("uf-slider--compact");
    expect(slider).toContain(">0.3<");
    expect(renderToStaticMarkup(<IconLabel icon={<svg />} label="Measure" appearance="plain" size="large" />)).toContain('aria-label="Measure"');
  });

  it("renders swatches, ramps, and role cards", () => {
    const swatches = renderToStaticMarkup(<SwatchGroup label="Neutral" colors={["#16191D", "#E8E8E8"]} value="#e8e8e8" custom />);
    expect(swatches).toContain('aria-pressed="true"');
    expect(swatches).toContain('type="color"');
    const ramp = renderToStaticMarkup(<ColorRamp name="Primary" colors={["#F8FAFF", "#0F003F"]} steps={["0", "1000"]} />);
    expect(ramp).toContain("data-has-steps");
    expect(ramp).toContain("linear-gradient(90deg, #F8FAFF, #0F003F)");
    expect(renderToStaticMarkup(<ColorRoleCard name="Primary" color="#2068DC" tag="Steered" tone="warning" />)).toContain('data-tone="warning"');
  });

  it("supports colour slider ranges, gradients, and readouts", () => {
    const markup = renderToStaticMarkup(<ColorSlider value={128} max={255} gradient="linear-gradient(90deg, #000, #f00)" showValue />);
    expect(markup).toContain('aria-valuemax="255"');
    expect(markup).toContain("uf-color-slider-field__value");
    expect(markup).toContain(">128<");
  });

  it("shows format-specific controls in the colour format panel", () => {
    const hex = renderToStaticMarkup(<ColorFormatPanel color="#2068DC" onColorChange={noop} />);
    expect(hex).toContain("32, 104, 220");
    expect(hex).toContain("85, 53, 0, 14");
    const rgb = renderToStaticMarkup(<ColorFormatPanel color="#2068DC" onColorChange={noop} defaultFormat="rgb" />);
    expect(rgb.match(/role="slider"/g)).toHaveLength(3);
    const cmyk = renderToStaticMarkup(<ColorFormatPanel color="#2068DC" onColorChange={noop} defaultFormat="cmyk" />);
    expect(cmyk.match(/role="slider"/g)).toHaveLength(4);
  });
});
