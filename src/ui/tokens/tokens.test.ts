import { describe, expect, it } from "vitest";
import {
  UI_FORMA_COLOR_STEPS,
  UI_FORMA_PRIMITIVE_FAMILIES,
  uiFormaFoundations,
  uiFormaPrimitives,
  uiFormaThemes,
} from ".";

describe("UI Forma tokens", () => {
  it("preserves every supplied primitive color family and step", () => {
    expect(UI_FORMA_PRIMITIVE_FAMILIES).toHaveLength(9);
    expect(UI_FORMA_COLOR_STEPS).toHaveLength(11);
    expect(uiFormaPrimitives.primary[600]).toBe("#3F2DC3");
    expect(uiFormaPrimitives.neutral[1000]).toBe("#121212");
    expect(uiFormaPrimitives.danger[400]).toBe("#D63D7A");
  });

  it("maps supplied foundations without rounding or renaming values", () => {
    expect(uiFormaFoundations.spacing[6]).toBe(24);
    expect(uiFormaFoundations.radius.full).toBe(9999);
    expect(uiFormaFoundations.controlSize.md).toBe(40);
    expect(uiFormaFoundations.fonts.mono).toBe("DM Mono");
  });

  it("keeps light and dark semantic modes distinct", () => {
    expect(uiFormaThemes.light.background.page).toBe("#FAFAFA");
    expect(uiFormaThemes.dark.background.page).toBe("#121212");
    expect(uiFormaThemes.light.action.primary.default).toBe("#3F2DC3");
    expect(uiFormaThemes.dark.action.primary.default).toBe("#636AFC");
  });
});
