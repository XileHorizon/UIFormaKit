# UI Forma component library

This directory is the reusable implementation layer behind the `/components` documentation page.
Showcase files may compose these primitives, but should not create private lookalikes for controls that
already exist here.

## Source of truth

- `tokens/source/*.tokens.json` preserves Kevin's supplied UI Forma variable exports unchanged.
- `tokens/index.ts` provides a typed JavaScript API for primitives, foundations, and semantic modes.
- `tokens/tokens.css` is generated from those sources and exposes the values as `--uf-*` CSS custom properties.
- `componentRegistry.ts` records component status, variants, and Figma-node provenance.

Use semantic variables in component styles whenever a semantic role exists. Reach for primitive values
only when the design intentionally describes a fixed palette value rather than a theme role.

After replacing a variable export, run `npm run tokens:build`. CI-style validation is included in
`npm run check`, which fails when the generated CSS no longer matches the JSON sources.

## Public components

Import public components from `src/ui/index.ts`:

```tsx
import { Button, Dropdown, Slider, Switch, TextField } from "./ui";
```

Each component owns its behavior, accessibility semantics, and variant API. Documentation examples should
configure those APIs instead of duplicating markup and CSS.

## Figma fidelity status

- `verified`: measured against an MCP screenshot and structure response.
- `implemented`: reconstructed from known Figma evidence, but still needs a final page-level MCP audit.
- `provisional`: behavior and architecture are usable, while exact comparison is pending MCP access.

Update `componentRegistry.ts` only after checking the current Figma component page. Do not silently mark a
component verified because it resembles an older screenshot.
