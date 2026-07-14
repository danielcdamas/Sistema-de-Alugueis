import { existsSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";

// Usa o Chromium pré-instalado do ambiente quando disponível; caso contrário,
// deixa o Playwright resolver o navegador normalmente (portável em outras máquinas).
const chromiumDoAmbiente = "/opt/pw-browsers/chromium";
const launchOptions = existsSync(chromiumDoAmbiente)
  ? { executablePath: chromiumDoAmbiente }
  : {};

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], launchOptions },
    },
  ],
  // Sobe o servidor de desenvolvimento automaticamente para os testes e2e.
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
