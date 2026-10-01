# Figma snapshot · 2026-10-01

Offline copy of the UIForma-Kit file (`6UMDGsdfnSovglFsEN4L1W`) so fidelity work does not depend on the
desktop Dev Mode MCP server being reachable.

| Folder | Contents |
| --- | --- |
| `screenshots/` | `shot-282-3173.png` (Atoms page), `shot-193-7341.png` (Molecules page), one PNG per atom frame |
| `metadata/` | Node trees for both pages: ids, names, variant names, positions, sizes |
| `context/` | MCP `get_design_context` output per atom frame (React + Tailwind reference, not production code) |
| `assets/` | Exported SVGs: toggle and slider handles, drag halo, sun/moon thumbs, relation icons |
| `variables.json` | Every variable value MCP exposed from the components on both pages |

## Atoms fidelity pass

| Atom | Figma | Result |
| --- | --- | --- |
| Button (193:4208 / 4317 / 4426) | 36 / 50 / 70px tall; 12px inline padding (20px huge); 6px block (4px compact); Space Mono 16 regular, 20 bold on huge; 24px icons (44px huge) | Padding, huge weight, and states fixed. Surface uses the primary border, Subtle on hover, SubtleHover on press. Secondary uses `Border/Default`. |
| Toggle (193:4592) | Off = `State/Selected/Container`, no border, `#fafafa` handle. New 52×28 theme variants 298:3174 (sun on `Action/Secondary/SubtleHover`) and 298:3176 (moon on `Action/Primary/SubtleHover`) | Off state fixed. Added `ThemeSwitch`. |
| Basic Text Input (193:4537) | Primary border, 8px radius, 12×6 padding, Space Mono 16, inline 12px secondary text in primary; Slim is 20px tall with 12px text; Tall is 200px with 24px body text | Restyled. Added `size="slim"`, `supportingText`, and `TextArea` for Tall. |
| Slider (193:4553) | 10px track, primary fill, `#ede8f2` remainder with 1px primary outline, 24px thumb; 25% row is a compact 8px / 16px version; dragging adds a 34px white halo | Restyled. Added `size="compact"` and the drag halo. Gradient tracks keep no outline. |
| Color Chips (193:4601) | 60×40, 32, 24, 205×24, 8px radius | Already matched. |
| Space Mono | Used by every atom | Was never loaded and the fallback monospace rendered instead. Now imported by `button.css` and `form-controls.css`. |

## Token drift (blocks full colour fidelity)

The variables in `src/ui/tokens/source/` are older than the current Figma file. MCP only exposes variables
that the components use, so the full collections still need a fresh Figma Variables export. Do not patch
partial ramps by hand.

| Variable | Figma now | Kit token |
| --- | --- | --- |
| Primary 0–1000 | `#f8faff #c5d1ff #9eafff #7d8dff #636afc #514de3 #3f2dc3 #3311a7 #270085 #1a0060 #0f003f` | each 1–2 RGB values off (e.g. 600 `#412ec2`) |
| Secondary 600 | `#5e5000` | `#5d5100` |
| Secondary 200 | `#d7b100` | `#d6b100` |
| Tertiary 600 / 700 / 800 | `#7062ad` / `#56458d` / `#3e2c6d` (blue-violet) | `#653886` / `#52256e` / `#401557` (magenta-violet) |
| Success 500 / 800 | `#00ad88` / `#004636` | `#007b65` / `#00372c` |
| Warning 500 | `#81a300` (yellow-green) | `#a74900` (orange) |
| Info 500 / 800 | `#3196fa` / `#003a72` | `#0065cc` / `#002b62` |
| Border/Subtle | `#b2b4bd` | `#b3b4bd` |

Remaining non-token gaps:

- Text Input fills with legacy `color/surface` `#ffffff`. The kit uses `Background/Page` `#fafafa` until a
  semantic surface token exists.
- Text Input labels and the Tall body text use Geist in Figma. The kit's `--uf-font-body` is Instrument Sans.
- The slider's `#ede8f2` remainder is a raw value in Figma with no variable.
