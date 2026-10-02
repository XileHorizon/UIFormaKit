// Drives every interactive demo on the docs site and the studio view, asserting each one visibly responds.
// Usage: start `npx vite --port 5199`, then `node scripts/check-interactions.cjs [baseUrl]`.
// Needs playwright-core with a Chromium build; set PLAYWRIGHT_CORE to its path if it is not installed here.
const { chromium } = require(process.env.PLAYWRIGHT_CORE || "playwright-core");

const base = process.argv[2] || "http://localhost:5199/";
const results = [];
async function check(name, fn) {
  try {
    await fn();
    results.push({ name, ok: true });
  } catch (error) {
    results.push({ name, ok: false, detail: error.message.split("\n")[0] });
  }
}
function expect(condition, message) {
  if (!condition) throw new Error(message);
}
const css = (locator, property) => locator.evaluate((el, prop) => getComputedStyle(el).getPropertyValue(prop).trim(), property);

function rgbToHue([r, g, b]) {
  const [red, green, blue] = [r / 255, g / 255, b / 255];
  const max = Math.max(red, green, blue);
  const delta = max - Math.min(red, green, blue);
  if (!delta) return 0;
  const hue = max === red ? ((green - blue) / delta) % 6 : max === green ? (blue - red) / delta + 2 : (red - green) / delta + 4;
  return (hue * 60 + 360) % 360;
}
const hueDistance = (a, b) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b));

async function pixel(page, x, y) {
  const shot = await page.screenshot({ clip: { x: Math.round(x), y: Math.round(y), width: 1, height: 1 } });
  return page.evaluate((b64) => new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0);
      resolve([...context.getImageData(0, 0, 1, 1).data].slice(0, 3));
    };
    image.src = `data:image/png;base64,${b64}`;
  }), shot.toString("base64"));
}

async function docs(page) {
  await page.goto(base, { waitUntil: "networkidle" });
  const root = page.locator(".docs");

  await check("Topbar theme toggle switches the docs theme", async () => {
    const before = await root.getAttribute("data-uiforma-theme");
    await page.locator(".theme-toggle").click();
    expect((await root.getAttribute("data-uiforma-theme")) !== before, "theme attribute did not change");
    await page.locator(".theme-toggle").click();
  });

  await check("ThemeSwitch switches the docs theme", async () => {
    const control = page.locator("#switch .uf-control-switch--theme");
    const before = await root.getAttribute("data-uiforma-theme");
    await control.click();
    expect((await root.getAttribute("data-uiforma-theme")) !== before, "theme attribute did not change");
    await control.click();
  });

  await check("Switch toggles", async () => {
    const control = page.locator("#switch .uf-control-switch:not(.uf-control-switch--theme):not([disabled])").first();
    const before = await control.getAttribute("aria-checked");
    await control.click();
    expect((await control.getAttribute("aria-checked")) !== before, "aria-checked did not change");
  });

  await check("Segmented control selects", async () => {
    const option = page.locator('#segmented-control [role="radio"]').nth(2);
    await option.click();
    expect((await option.getAttribute("aria-checked")) === "true", "third option not checked");
  });

  await check("Control stack selects", async () => {
    const option = page.locator("#control-stack .uf-control-stack .uf-button").nth(1);
    await option.click();
    expect((await option.getAttribute("data-state")) === "checked" || (await option.getAttribute("aria-checked")) === "true", "second item not selected");
  });

  await check("Dropdown opens and picks an option", async () => {
    const trigger = page.locator("#dropdown .uf-dropdown > .uf-button");
    const before = await trigger.innerText();
    await trigger.click();
    const option = page.locator('#dropdown [role="menuitemradio"]').nth(1);
    const label = (await option.innerText()).split("\n")[0];
    await option.click();
    const after = await trigger.innerText();
    expect(after.includes(label) && after !== before, `trigger shows "${after}", expected "${label}"`);
  });

  await check("Autocomplete filters and fills", async () => {
    const input = page.locator("#autocomplete input");
    await input.fill("side");
    const options = page.locator('#autocomplete [role="option"]');
    const count = await options.count();
    expect(count >= 1, "no filtered results");
    const label = await options.first().innerText();
    expect(label.toLowerCase().includes("side"), `first result "${label}" does not match`);
    await options.first().click();
    expect((await input.inputValue()) === label, "input not filled with the chosen option");
  });

  await check("Tabs switch panels", async () => {
    const tab = page.locator('#tabs [role="tab"]').nth(1);
    await tab.click();
    expect((await tab.getAttribute("aria-selected")) === "true", "second tab not selected");
    expect((await page.locator('#tabs [role="tabpanel"]').innerText()).includes("Activity"), "panel did not change");
  });

  await check("Accordion expands", async () => {
    const triggers = page.locator("#accordion h3 button");
    const index = await triggers.evaluateAll((els) => els.findIndex((el) => el.getAttribute("aria-expanded") === "false"));
    expect(index >= 0, "no collapsed section to open");
    const trigger = triggers.nth(index);
    await trigger.click();
    expect((await trigger.getAttribute("aria-expanded")) === "true", "section did not expand");
  });

  await check("Carousel advances", async () => {
    const current = () => page.locator("#carousel .uf-carousel__dots button[aria-current]").getAttribute("aria-label");
    const before = await current();
    await page.locator("#carousel .uf-carousel__controls > button").last().click();
    expect((await current()) !== before, "active slide did not change");
  });

  await check("Slider moves by keyboard and updates its readout", async () => {
    const input = page.locator("#slider .uf-slider input").first();
    const output = page.locator("#slider .uf-slider__heading output").first();
    const before = await output.innerText();
    await input.focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    expect((await output.innerText()) !== before, "readout did not change");
  });

  await check("Color sliders move by keyboard", async () => {
    const slider = page.locator('.color-handle-list [role="slider"]').first();
    expect((await slider.count()) === 1, "no colour slider found");
    const before = await slider.getAttribute("aria-valuenow");
    await slider.focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    expect((await slider.getAttribute("aria-valuenow")) !== before, "aria-valuenow did not change");
  });

  await check("Picker hue matches the ring colour under the handle", async () => {
    const wheel = page.locator("#color-studio .color-feature-grid .uf-harmony-wheel[data-picker]");
    await wheel.scrollIntoViewIfNeeded();
    const box = await wheel.boundingBox();
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    const ringRadius = box.width * 0.45;
    const misses = [];
    for (const degrees of [0, 45, 90, 135, 180, 225, 270, 315]) {
      const radians = (degrees * Math.PI) / 180;
      await page.mouse.click(cx + ringRadius * Math.cos(radians), cy + ringRadius * Math.sin(radians));
      await page.mouse.move(0, 0);
      // Sample the ring just past the handle so the white handle does not cover the colour.
      const sample = await pixel(page, cx + ringRadius * Math.cos(radians + 0.12), cy + ringRadius * Math.sin(radians + 0.12));
      const reported = Number(await wheel.getAttribute("aria-valuenow"));
      const ringHue = rgbToHue(sample);
      if (hueDistance(ringHue, reported) > 12) misses.push(`${degrees}°: ring ${Math.round(ringHue)} vs picked ${reported}`);
    }
    expect(!misses.length, misses.join("; "));
  });

  await check("Picker field and handle follow the wheel", async () => {
    const wheel = page.locator("#color-studio .color-feature-grid .uf-harmony-wheel[data-picker]");
    const handle = wheel.locator(".uf-sv-handle");
    const before = await css(handle, "background-color");
    const box = await wheel.boundingBox();
    await page.mouse.click(box.x + box.width * 0.3, box.y + box.height * 0.7);
    expect((await css(handle, "background-color")) !== before, "handle colour did not change");
  });

  await check("Harmony workspace: picker drives the relation wheel's centre blob", async () => {
    const relation = page.locator(".harmony-workspace .uf-harmony-wheel:not([data-picker])");
    const picker = page.locator(".harmony-workspace .uf-harmony-wheel[data-picker]");
    await picker.scrollIntoViewIfNeeded();
    const blob = () => css(relation, "--uf-picker-color");
    const before = await blob();
    const box = await picker.boundingBox();
    await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.05);
    const afterHue = await blob();
    expect(afterHue !== before, "blob colour did not change after moving the hue");
    await page.mouse.click(box.x + box.width * 0.35, box.y + box.height * 0.6);
    expect((await blob()) !== afterHue, "blob colour did not change after moving saturation/value");
    expect((await relation.getAttribute("aria-valuenow")) === (await picker.getAttribute("aria-valuenow")), "wheels disagree on hue");
  });

  await check("Harmony workspace: relation wheel drives the picker", async () => {
    const relation = page.locator(".harmony-workspace .uf-harmony-wheel:not([data-picker])");
    const picker = page.locator(".harmony-workspace .uf-harmony-wheel[data-picker]");
    const before = await picker.getAttribute("aria-valuenow");
    const box = await relation.boundingBox();
    await page.mouse.click(box.x + box.width * 0.05, box.y + box.height * 0.5);
    expect((await picker.getAttribute("aria-valuenow")) !== before, "picker hue did not follow");
  });

  await check("Harmony choice changes the number of handles", async () => {
    const handles = page.locator(".harmony-workspace .uf-harmony-wheel:not([data-picker]) .uf-wheel-handle");
    const before = await handles.count();
    await page.locator(".harmony-workspace .uf-control-stack .uf-button").nth(5).click();
    expect((await handles.count()) !== before, `still ${before} handles`);
  });

  await check("Button playground changes the preview", async () => {
    const preview = page.locator("#button-playground .uf-button").last();
    const before = await preview.evaluate((el) => el.className + el.outerHTML.length);
    const toggles = page.locator('#button-playground [role="switch"]');
    await toggles.nth(1).click();
    await page.locator('#button-playground [role="radio"]').last().click();
    expect((await preview.evaluate((el) => el.className + el.outerHTML.length)) !== before, "preview button unchanged");
  });

  await check("Settings section collapses and expands", async () => {
    const toggle = page.locator("#settings-section .uf-settings-section__header button").first();
    await toggle.click();
    expect((await toggle.getAttribute("aria-expanded")) === "false", "did not collapse");
    await toggle.click();
    expect((await toggle.getAttribute("aria-expanded")) === "true", "did not expand");
  });

  await check("Button block selects a preset", async () => {
    const preset = page.locator("#settings-section .uf-button-block .uf-button").nth(3);
    await preset.click();
    expect((await preset.getAttribute("aria-pressed")) === "true", "preset not pressed");
  });

  await check("Sidebar slider updates its readout", async () => {
    const row = page.locator("#settings-section .uf-sidebar-slider").first();
    const before = await row.locator("output").innerText();
    await row.locator("input").focus();
    await page.keyboard.press("ArrowRight");
    expect((await row.locator("output").innerText()) !== before, "readout did not change");
  });

  await check("Swatch group selects a colour", async () => {
    const swatch = page.locator("#settings-section .uf-swatch-group__swatch").nth(2);
    await swatch.click();
    expect((await swatch.getAttribute("aria-pressed")) === "true", "swatch not selected");
  });

  await check("Color format panels: typing a hex syncs every panel", async () => {
    const field = page.locator("#color-format .uf-color-format").first().locator("input");
    await field.fill("#FF8800");
    const fields = page.locator("#color-format .uf-color-format input[aria-label='Hex color']");
    const values = await fields.evaluateAll((els) => els.map((el) => el.value));
    expect(values.every((value) => value === "#FF8800"), `panels show ${values.join(", ")}`);
    const readout = await page.locator("#color-format .uf-color-format__readout").innerText();
    expect(readout.includes("255, 136, 0"), "RGB readout did not update");
  });

  await check("Color format panels: a channel slider changes the colour", async () => {
    const panel = page.locator('#color-format .uf-color-format[data-format="rgb"]');
    const field = panel.locator("input");
    const before = await field.inputValue();
    await panel.locator('[role="slider"]').nth(2).focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    expect((await field.inputValue()) !== before, "hex did not change");
  });

  await check("Color format panel switches format", async () => {
    const panel = page.locator("#color-format .uf-color-format").first();
    await panel.locator('[role="radio"]').nth(3).click();
    expect((await panel.getAttribute("data-format")) === "cmyk", "format did not switch");
    expect((await panel.locator('[role="slider"]').count()) === 4, "CMYK should show four sliders");
  });

  await check("Toolkit format panel HSL slider changes the colour", async () => {
    const panel = page.locator("#color-foundations .uf-color-format");
    await panel.locator('[role="radio"]').nth(2).click();
    const field = panel.locator("input");
    const before = await field.inputValue();
    await panel.locator('[role="slider"]').first().focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    expect((await field.inputValue()) !== before, "hex did not change");
  });

  await check("Toolkit swatches and sidebar sliders respond", async () => {
    const swatch = page.locator("#color-foundations .uf-swatch-group__swatch").nth(1);
    await swatch.click();
    expect((await swatch.getAttribute("aria-pressed")) === "true", "swatch not selected");
    const row = page.locator("#color-foundations .uf-sidebar-slider").first();
    const before = await row.locator("output").innerText();
    await row.locator("input").focus();
    await page.keyboard.press("ArrowRight");
    expect((await row.locator("output").innerText()) !== before, "sidebar slider readout did not change");
  });
}

async function studio(page) {
  await page.goto(`${base}?view=studio`, { waitUntil: "networkidle" });
  const value = page.locator('[data-testid="studio-color-value"]');
  const picker = page.locator(".studio .uf-harmony-wheel[data-picker]");
  const previewButton = page.locator(".studio-preview .preview-actions .uf-button").first();

  await check("Studio: picker updates readouts, brand card, ramp, and preview", async () => {
    const before = await value.innerText();
    const buttonBefore = await css(previewButton, "background-color");
    const box = await picker.boundingBox();
    await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.05);
    expect((await value.innerText()) !== before, "hex readout did not change");
    expect((await page.locator(".studio-role-cards article small").first().innerText()) === (await value.innerText()), "brand seed card disagrees with readout");
    expect((await css(previewButton, "background-color")) !== buttonBefore, "preview button did not restyle");
  });

  await check("Studio: seed buttons set the colour", async () => {
    const seed = page.locator(".studio-seeds button").nth(1);
    await seed.click();
    expect((await value.innerText()) === "#ED2D57", `readout shows ${await value.innerText()}`);
    expect((await seed.getAttribute("aria-pressed")) === "true", "seed not marked active");
  });

  await check("Studio: undo and redo", async () => {
    await page.getByRole("button", { name: "Undo" }).click();
    const undone = await value.innerText();
    expect(undone !== "#ED2D57", "undo did not restore the previous colour");
    await page.getByRole("button", { name: "Redo" }).click();
    expect((await value.innerText()) === "#ED2D57", "redo did not reapply");
  });

  await check("Studio: format switch changes the readout", async () => {
    await page.locator('.studio [role="radio"]', { hasText: "RGB" }).click();
    expect(/^\d+, \d+, \d+$/.test(await value.innerText()), `RGB readout is "${await value.innerText()}"`);
  });

  await check("Studio: tool rail selects tools", async () => {
    const tool = page.getByRole("button", { name: "Build tool 1" });
    await tool.click();
    expect((await tool.getAttribute("aria-pressed")) === "true", "tool not active");
  });

  await check("Studio: mode and device buttons restyle the preview", async () => {
    const preview = page.locator(".studio-preview");
    await page.locator(".studio-right-rail section").nth(1).locator("button").nth(1).click();
    expect((await preview.getAttribute("data-theme")) === "dark", "dark mode not applied");
    await page.locator(".studio-right-rail section").nth(2).locator("button").nth(2).click();
    expect((await preview.getAttribute("data-device")) === "mobile", "mobile device not applied");
  });

  await check("Studio: preview buttons work", async () => {
    const stat = page.locator(".preview-stats article strong").first();
    const before = Number(await stat.innerText());
    await page.getByRole("button", { name: "New project" }).click();
    expect(Number(await stat.innerText()) === before + 1, "project count did not increase");
    await page.getByRole("button", { name: "Open dialog" }).click();
    expect(await page.locator("dialog.uf-dialog[open]").isVisible(), "dialog did not open");
    await page.getByRole("button", { name: "Done" }).click();
    const download = page.waitForEvent("download", { timeout: 3000 });
    await page.getByRole("button", { name: "Export" }).click();
    expect((await download).suggestedFilename() === "uiforma-theme.css", "export did not download a theme");
  });

  await check("Studio: code view shows the generated theme", async () => {
    await page.getByRole("button", { name: "Theme code" }).click();
    const code = await page.locator('[data-testid="studio-theme-code"]').innerText();
    expect(code.includes("--uf-color-action-primary-default"), "theme CSS missing");
    await page.getByRole("tab", { name: "Live Preview" }).click();
    expect(await page.locator(".studio-preview").isVisible(), "preview did not return");
  });
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => message.type() === "error" && errors.push(message.text()));
  await docs(page);
  await studio(page);
  await browser.close();
  for (const { name, ok, detail } of results) console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `\n      ${detail}` : ""}`);
  if (errors.length) console.log(`Console errors:\n  ${errors.join("\n  ")}`);
  const failed = results.filter((result) => !result.ok).length;
  console.log(`\n${results.length - failed}/${results.length} passed`);
  process.exitCode = failed || errors.length ? 1 : 0;
})();
