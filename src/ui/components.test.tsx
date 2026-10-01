import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";
import { Accordion } from "./Accordion";
import { Carousel } from "./Carousel";
import { ControlStack } from "./ControlStack";
import { Marquee } from "./Marquee";
import { Scroll } from "./Scroll";
import { SegmentedControl } from "./SegmentedControl";
import { Switch } from "./Switch";
import { TextField } from "./TextField";
import { Tabs } from "./Tabs";
import { Ticker } from "./Ticker";
import { Alert, Status } from "./Alert";
import { CodeBlock } from "./CodeBlock";
import { FileInput } from "./FileInput";
import { NumberField } from "./NumberField";
import { Panel } from "./Panel";
import { Select } from "./Select";
import { Sidebar } from "./Sidebar";
import { SplitPane } from "./SplitPane";
import { WorkbenchShell } from "./WorkbenchShell";
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
    expect(renderToStaticMarkup(<Button wrapLabel={false}><strong>Rich action</strong></Button>)).not.toContain("uf-button__label");
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

  it("renders control stacks as actions or a radio group", () => {
    const markup = renderToStaticMarkup(
      <ControlStack
        radio
        label="Harmony"
        value="triad"
        onValueChange={() => undefined}
        items={[
          { value: "mono", label: "Monochrome" },
          { value: "triad", label: "Triad" },
        ]}
      />,
    );
    expect(markup).toContain('class="uf-control-stack"');
    expect(markup).toContain('role="radiogroup"');
    expect(markup).toContain('aria-label="Harmony"');
    expect(markup).toContain('aria-checked="true"');
    expect(markup).toContain('data-state="checked"');
  });

  it("links field errors to the input", () => {
    const markup = renderToStaticMarkup(<TextField id="name" label="Name" error="Required" />);
    expect(markup).toContain('aria-invalid="true"');
    expect(markup).toContain('aria-describedby="name-description"');
    expect(markup).toContain('id="name-description"');
  });

  it("renders reusable form fields with native semantics", () => {
    const select = renderToStaticMarkup(<Select id="theme" label="Theme" value="dark" onChange={() => undefined} options={[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }]} />);
    expect(select).toContain("<select");
    expect(select).toContain('value="dark" selected=""');
    const number = renderToStaticMarkup(<NumberField id="columns" label="Columns" value={12} suffix="cols" readOnly />);
    expect(number).toContain('type="number"');
    expect(number).toContain("cols");
    const file = renderToStaticMarkup(<FileInput label="Import project" accept="application/json" />);
    expect(file).toContain('type="file"');
    expect(file).toContain("Choose file");
  });

  it("renders semantic surfaces and application layout primitives", () => {
    const alert = renderToStaticMarkup(<Alert tone="danger" title="Not saved">Try again</Alert>);
    expect(alert).toContain('role="alert"');
    expect(alert).toContain('data-tone="danger"');
    expect(renderToStaticMarkup(<Status tone="success">Saved</Status>)).toContain("Saved");
    expect(renderToStaticMarkup(<Panel header="Header" footer="Footer">Body</Panel>)).toContain("uf-panel__body");
    const codeBlock = renderToStaticMarkup(<CodeBlock code="const value = 1;" language="ts" />);
    expect(codeBlock).toContain('data-language="ts"');
    expect(codeBlock).toContain('<pre tabindex="0">');
    const shell = renderToStaticMarkup(<WorkbenchShell header="Header" navigation="Nav" tools="Tools">Main</WorkbenchShell>);
    expect(shell).toContain("uf-workbench__main");
    const split = renderToStaticMarkup(<SplitPane value={40} onValueChange={() => undefined} first="Editor" second="Preview" />);
    expect(split).toContain('role="separator"');
    expect(split).toContain('aria-valuenow="40"');
  });

  it("renders adaptive sidebars at compact rail or wide panel sizes", () => {
    const rail = renderToStaticMarkup(<Sidebar label="Tools" size="rail">Rail actions</Sidebar>);
    expect(rail).toContain('data-size="rail"');
    expect(rail).toContain('aria-label="Tools"');
    const panel = renderToStaticMarkup(<Sidebar label="Properties" side="right" size="wide" open onOpenChange={() => undefined}>Form controls</Sidebar>);
    expect(panel).toContain('data-size="wide"');
    expect(panel).toContain('data-adaptive="sidebar"');
  });

  it("tracks implementation and Figma provenance for every public component", () => {
    expect(uiFormaComponentRegistry.length).toBeGreaterThanOrEqual(9);
    for (const component of uiFormaComponentRegistry) {
      expect(component.figmaNodes.length).toBeGreaterThan(0);
      expect(component.variants.length).toBeGreaterThan(0);
    }
  });

  it("renders accessible content and navigation primitives", () => {
    const tabs = renderToStaticMarkup(<Tabs value="one" onValueChange={() => undefined} items={[{ value: "one", label: "One", content: "Panel one" }, { value: "two", label: "Two", content: "Panel two" }]} />);
    expect(tabs).toContain('role="tablist"');
    expect(tabs).toContain('role="tabpanel"');

    const accordion = renderToStaticMarkup(<Accordion defaultValue="one" items={[{ value: "one", trigger: "Question", content: "Answer" }]} />);
    expect(accordion).toContain('aria-expanded="true"');
    expect(accordion).toContain('role="region"');

    const carousel = renderToStaticMarkup(<Carousel><div>One</div><div>Two</div></Carousel>);
    expect(carousel).toContain('aria-roledescription="carousel"');
    expect(carousel).toContain('aria-label="Next slide"');

    const scroll = renderToStaticMarkup(<Scroll items={[{ id: "one", content: "Alert" }]} />);
    expect(scroll).toContain('aria-live="polite"');

    const ticker = renderToStaticMarkup(<Ticker variant="warning" action={{ label: "Details", href: "/details" }}>Alert</Ticker>);
    expect(ticker).toContain('data-variant="warning"');
    expect(ticker).toContain('href="/details"');
    expect(ticker).toContain('aria-hidden="true"');

    const marquee = renderToStaticMarkup(<Marquee><span>Loop</span></Marquee>);
    expect(marquee).toContain('aria-hidden="true"');
  });
});
