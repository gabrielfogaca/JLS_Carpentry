import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  timeout: 25_000,
  use: {
    baseURL: 'http://127.0.0.1:8443',
    channel: 'chrome',
    headless: true,
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 8443',
    url: 'http://127.0.0.1:8443',
    reuseExistingServer: true,
  },
})
