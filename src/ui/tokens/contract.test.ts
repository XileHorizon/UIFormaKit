import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  UI_FORMA_RUNTIME_VARIABLES,
  UI_FORMA_THEME_TOKENS,
  UI_FORMA_THEME_TOKEN_NAMES,
} from "./contract";

// Read files from disk: Vitest stubs imported CSS to an empty string.
const uiDir = fileURLToPath(new URL("../", import.meta.url));
const read = (file: string) => readFileSync(`${uiDir}${file}`, "utf8");
const componentCss = readdirSync(uiDir)
  .filter((file) => file.endsWith(".css") && file !== "styles.css")
  .map((file) => ({ file, source: read(file).replace(/\/\*[\s\S]*?\*\//g, "") }));
const componentTsx = readdirSync(uiDir)
  .filter((file) => file.endsWith(".tsx") && !file.endsWith(".test.tsx"))
  .map((file) => ({ file, source: read(file) }));
const definedCss = read("tokens/tokens.css") + read("tokens/components.css");

const runtime = new Set<string>(UI_FORMA_RUNTIME_VARIABLES);
const referenced = (source: string) => [...source.matchAll(/var\((--uf-[a-z0-9-]+)/g)].map((match) => match[1]);
const declaredLocally = (source: string) =>
  new Set([...source.matchAll(/(--uf-[a-z0-9-]+)\s*:/g)].map((match) => match[1]));

// Declarations that may legitimately keep literals; see UI_FORMA_LITERAL_EXCEPTIONS.
const isException = (declaration: string) =>
  /conic-gradient|#ff245a|mask-image|clip-path:\s*inset\(50%\)|^(width|height):\s*1px$/.test(declaration.trim()) ||
  /linear-gradient\(to (bottom|right)/.test(declaration);

function declarations(source: string) {
  return source
    .replace(/@media[^{]+\{/g, "{")
    .replace(/@import[^;]+;/g, "")
    .split(/[{};]/)
    .map((part) => part.trim())
    .filter((part) => /^[a-z-]+\s*:/.test(part) && !part.startsWith("--uf-"));
}

describe("UI Forma theme contract", () => {
  it("has unique token names in three layers", () => {
    expect(UI_FORMA_THEME_TOKEN_NAMES.size).toBe(UI_FORMA_THEME_TOKENS.length);
    const layers = new Set(UI_FORMA_THEME_TOKENS.map((token) => token.layer));
    expect([...layers].sort()).toEqual(["component", "primitive", "semantic"]);
  });

  it("defines a default for every contract token", () => {
    const missing = UI_FORMA_THEME_TOKENS.filter((token) => !definedCss.includes(`${token.name}:`)).map((t) => t.name);
    expect(missing).toEqual([]);
  });

  it("keeps runtime variables out of the themeable contract", () => {
    expect(UI_FORMA_RUNTIME_VARIABLES.filter((name) => UI_FORMA_THEME_TOKEN_NAMES.has(name))).toEqual([]);
  });

  it("only reads contract, runtime, or component-local variables", () => {
    const unknown = [...componentCss, ...componentTsx].flatMap(({ file, source }) => {
      const local = declaredLocally(source);
      return referenced(source)
        .filter((name) => !UI_FORMA_THEME_TOKEN_NAMES.has(name) && !runtime.has(name) && !local.has(name))
        .map((name) => `${file}: ${name}`);
    });
    expect([...new Set(unknown)]).toEqual([]);
  });

  it("keeps component-local variables as aliases of contract tokens", () => {
    const literalLocals = componentCss.flatMap(({ file, source }) =>
      [...source.matchAll(/(--uf-[a-z0-9-]+)\s*:\s*([^;}]+)/g)]
        .filter(([, , assigned]) => /#[0-9a-f]{3,8}\b|\d+(px|ms|s)\b/i.test(assigned))
        .map(([, name, assigned]) => `${file}: ${name}: ${assigned.trim()}`),
    );
    expect(literalLocals).toEqual([]);
  });

  it("keeps raw colours, lengths, durations, and font names out of component CSS", () => {
    const violations = componentCss.flatMap(({ file, source }) =>
      declarations(source)
        .filter((declaration) => !isException(declaration))
        .filter((declaration) => {
          const withoutVars = declaration.replace(/var\(--uf-[a-z0-9-]+\)/g, "");
          return (
            /#[0-9a-f]{3,8}\b/i.test(withoutVars) ||
            /rgba?\(/.test(withoutVars) ||
            /(?<![\w.-])-?\d*\.?\d+(px|ms|s)\b/.test(withoutVars) ||
            /"[A-Z][^"]*"/.test(withoutVars)
          );
        })
        .map((declaration) => `${file}: ${declaration}`),
    );
    expect(violations).toEqual([]);
  });
});
