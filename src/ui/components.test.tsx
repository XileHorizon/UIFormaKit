import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";
import { SegmentedControl } from "./SegmentedControl";
import { Switch } from "./Switch";
import { TextField } from "./TextField";
import { uiFormaComponentRegistry } from "./componentRegistry";

describe("UI Forma component primitives", () => {
  it("exposes button variants through stable data and class hooks", () => {
    const markup = renderToStaticMarkup(
      <Button appearance="secondary" size="huge" shape="rounded" aria-label="Add" />,
    );
    expect(markup).toContain("uf-button--secondary");
    expect(markup).toContain("uf-button--huge");
    expect(markup).toContain("uf-button--rounded");
    expect(markup).toContain('data-icon-only="true"');
  });

  it("renders accessible switch and segmented states", () => {
    const switchMarkup = renderToStaticMarkup(<Switch checked label="Enabled" />);
    expect(switchMarkup).toContain('role="switch"');
    expect(switchMarkup).toContain('aria-checked="true"');

    const segmentedMarkup = renderToStaticMarkup(
      <SegmentedControl
        label="Scale"
        value="md"
        onValueChange={() => undefined}
        items={[
          { value: "sm", label: "Small" },
          { value: "md", label: "Medium" },
        ]}
      />,
    );
    expect(segmentedMarkup).toContain('role="radiogroup"');
    expect(segmentedMarkup).toContain('aria-checked="true"');
  });

  it("links field errors to the input", () => {
    const markup = renderToStaticMarkup(<TextField id="name" label="Name" error="Required" />);
    expect(markup).toContain('aria-invalid="true"');
    expect(markup).toContain('aria-describedby="name-description"');
    expect(markup).toContain('id="name-description"');
  });

  it("tracks implementation and Figma provenance for every public component", () => {
    expect(uiFormaComponentRegistry.length).toBeGreaterThanOrEqual(9);
    for (const component of uiFormaComponentRegistry) {
      expect(component.figmaNodes.length).toBeGreaterThan(0);
      expect(component.variants.length).toBeGreaterThan(0);
    }
  });
});
