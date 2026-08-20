# UI Forma Kit

The standalone React implementation and documentation site for the UI Forma design system.

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed by Vite. Component source lives in `src/ui`, documentation examples live in
`src/App.tsx`, and design tokens live in `src/ui/tokens`.

## Project structure

- `src/ui/`: reusable components and their colocated CSS
- `src/ui/tokens/source/`: unmodified UI Forma variable exports
- `src/ui/tokens/tokens.css`: generated CSS custom properties; do not edit by hand
- `src/ui/tokens/index.ts`: typed token access for React and TypeScript
- `src/App.tsx` and `src/styles.css`: documentation site only
- `scripts/generate-tokens.mjs`: deterministic JSON-to-CSS token build

Components should only use semantic `--uf-*` variables when a semantic role exists. Primitive color
variables are available for intentionally fixed palettes such as tertiary component variants.

## Updating variables

Replace the JSON files in `src/ui/tokens/source`, then run:

```bash
npm run tokens:build
npm run check
```

`npm run check` fails if `tokens.css` is stale, preventing the theme layer from drifting away from the
source export.

## Checks

```bash
npm run check
```

## Figma source

[UIForma-Kit, frame 193:7341](https://www.figma.com/design/6UMDGsdfnSovglFsEN4L1W/UIForma-Kit?node-id=193-7341&m=dev)
