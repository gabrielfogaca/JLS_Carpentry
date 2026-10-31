import { test, expect, type Page } from '@playwright/test'
import { readFile } from 'node:fs/promises'

const mock = await readFile(new URL('../fixtures/firebase-mock.js', import.meta.url), 'utf8')
const image = { name: 'project.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aX1kAAAAASUVORK5CYII=', 'base64') }

test.beforeEach(async ({ page }) => {
  // These regression tests intentionally exercise the legacy Firebase upload path.
  await page.route('**/src/App.tsx*', async (route) => {
    const response = await route.fetch()
    await route.fulfill({ response, body: (await response.text()).replaceAll('import.meta.env.VITE_MEDIA_PROVIDER', "'firebase'") })
  })
  await page.route('https://**/*', (route) => route.abort())
  await page.route('**/src/firebase.ts*', (route) => route.fulfill({ contentType: 'text/javascript', body: mock }))
  await page.route(/\/node_modules\/\.vite\/deps\/firebase_(auth|database|storage)\.js/, (route) => route.fulfill({ contentType: 'text/javascript', body: mock }))
})

async function login(page: Page, email = 'admin@example.com') {
  await page.goto('/admin')
  await page.getByLabel('Email', { exact: true }).fill(email)
  await page.getByLabel('Password', { exact: true }).fill('test-password')
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
}

async function portfolio(page: Page) {
  await page.getByRole('button', { name: 'Portfolio', exact: true }).first().click()
}

test('saves formatted contact numbers and keeps correct public links after reload', async ({ page }) => {
  await login(page)
  await page.getByRole('button', { name: 'General', exact: true }).first().click()
  await page.getByLabel('WhatsApp number', { exact: true }).fill('+61 450 973 980')
  await page.getByLabel('SMS number', { exact: true }).fill('+61 450 973 980')
  await page.getByRole('button', { name: 'Save changes', exact: true }).click()
  await expect(page.getByText('Saved', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Back to site', exact: true }).click()
  await page.reload()
  await expect(page.getByRole('link', { name: 'Message on WhatsApp', exact: true })).toHaveAttribute('href', /^https:\/\/wa\.me\/61450973980\?text=/)
  await expect(page.getByRole('link', { name: 'Open Messages', exact: true })).toHaveAttribute('href', 'sms:+61450973980')
})

test('navigates between public site, login and admin without changing Hook order', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await login(page)
  await expect(page.getByRole('heading', { name: 'Content Dashboard' })).toBeVisible()
  await page.getByRole('button', { name: 'Back to site', exact: true }).click()
  await expect(page.getByRole('heading', { name: /Premium Home Renovations/ })).toBeVisible()
  await page.goto('/admin')
  await expect(page.getByRole('heading', { name: 'Content Dashboard' })).toBeVisible()
  await page.getByRole('button', { name: 'Log out', exact: true }).click()
  await expect(page.getByRole('heading', { name: /Premium Home Renovations/ })).toBeVisible()
  expect(errors).toEqual([])
})

test('an ordinary authenticated account cannot open the editor', async ({ page }) => {
  await login(page, 'ordinary@example.com')
  await expect(page.getByRole('heading', { name: 'Administrator access required' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Save changes' })).toHaveCount(0)
})

test('uploads, selects a cover/gallery and publishes changes that survive reload', async ({ page }) => {
  await login(page)
  await portfolio(page)
  await page.locator('input[type=file]').first().setInputFiles(image)
  await expect(page.getByText('Image uploaded and set as project cover. Click Save changes to publish it.')).toBeVisible()
  await page.getByRole('button', { name: 'Choose cover from library' }).first().click()
  await page.getByRole('button', { name: 'Select project.png as cover', exact: true }).click()
  await page.getByRole('button', { name: 'Add gallery photo from library' }).first().click()
  await page.getByRole('button', { name: 'Add project.png to gallery', exact: true }).click()
  await page.getByRole('button', { name: 'Save changes', exact: true }).click()
  await expect(page.getByText('Saved', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Back to site', exact: true }).click()
  await page.reload()
  await expect(page.getByAltText('Master Ensuite Renovation', { exact: true })).toHaveAttribute('src', /upload=/)
  await page.getByRole('button', { name: /Master Ensuite Renovation/ }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('dialog').getByRole('button', { name: /Open image/ })).toHaveCount(6)
})

test('uploads multiple photos, preserves the first cover and highlights selected gallery photos', async ({ page }) => {
  await login(page)
  await portfolio(page)
  await page.locator('input[type=file]').first().setInputFiles([image, { ...image, name: 'second.png' }])
  await expect(page.getByText(/2 of 2 images uploaded/)).toBeVisible()
  const urls = await page.getByRole('textbox', { name: /Gallery images.*one URL per line/ }).first().inputValue()
  const images = urls.split('\n')
  await expect(page.getByLabel('Main image URL', { exact: true }).first()).toHaveValue(images[images.length - 2])
  await page.getByRole('button', { name: 'Add gallery photo from library' }).first().click()
  for (const name of ['project.png', 'second.png']) {
    const selected = page.getByRole('button', { name: `Add ${name} to gallery`, exact: true })
    await expect(selected).toHaveAttribute('aria-pressed', 'true')
    await expect(selected.getByText('Selected', { exact: true })).toBeVisible()
  }
  await page.getByRole('button', { name: 'Save changes', exact: true }).click()
  await expect(page.getByText('Saved', { exact: true })).toBeVisible()
  expect(await page.evaluate(() => (window as any).__firebaseMock.content.portfolio.items[0].images.length)).toBe(7)
})

test('continues a batch after an invalid file and preserves successful uploads', async ({ page }) => {
  await login(page)
  await portfolio(page)
  await page.locator('input[type=file]').first().setInputFiles([
    { name: 'invalid.txt', mimeType: 'text/plain', buffer: Buffer.from('invalid') }, image,
  ])
  await expect(page.getByText(/1 of 2 images uploaded/)).toBeVisible()
  await expect(page.getByText(/invalid.txt: Choose a JPG/)).toBeVisible()
  await expect(page.getByLabel('Main image URL', { exact: true }).first()).toHaveValue(/upload=/)
  await expect(page.getByRole('button', { name: 'Save changes', exact: true })).toBeEnabled()
})

test('shows empty library feedback and recovers from a library permission error', async ({ page }) => {
  await login(page)
  await portfolio(page)
  await page.getByRole('button', { name: 'Choose cover from library' }).first().click()
  await expect(page.getByText(/Your library is empty/)).toBeVisible()
  await page.evaluate(() => { (window as any).__firebaseMock.libraryError = true })
  await page.getByRole('button', { name: 'Back to site', exact: true }).click()
  await page.evaluate(() => { history.pushState({}, '', '/admin'); dispatchEvent(new PopStateEvent('popstate')) })
  await portfolio(page)
  await page.getByRole('button', { name: 'Choose cover from library' }).first().click()
  await expect(page.getByRole('alert')).toContainText('permission')
  await page.evaluate(() => { (window as any).__firebaseMock.libraryError = false })
  await page.getByRole('button', { name: 'Try again', exact: true }).click()
  await expect(page.getByText(/Your library is empty/)).toBeVisible()
  await expect(page.getByRole('alert')).toHaveCount(0)
})

test('reports storage failures and removes an uploaded file if library registration fails', async ({ page }) => {
  await login(page)
  await portfolio(page)
  await page.evaluate(() => { (window as any).__firebaseMock.storageError = 'storage/unauthorized' })
  await page.locator('input[type=file]').first().setInputFiles(image)
  await expect(page.getByRole('status').filter({ hasText: 'Your account cannot upload images' })).toBeVisible()
  await page.evaluate(() => { const state = (window as any).__firebaseMock; state.storageError = null; state.metadataError = true })
  await page.locator('input[type=file]').first().setInputFiles(image)
  await expect(page.getByText(/The image could not be added to the library/)).toBeVisible()
  expect(await page.evaluate(() => (window as any).__firebaseMock.deleted.length)).toBe(1)
})

test('keeps unsaved edits after remote updates, token refresh and save failure', async ({ page }) => {
  await login(page)
  const title = page.getByLabel('Hero title', { exact: true })
  await title.fill('My unsaved renovation title')
  await page.evaluate(async () => {
    const state = (window as any).__firebaseMock
    state.emitContent({ home: { title: 'Another remote title' } })
    await state.auth.currentUser.getIdToken(true)
    state.saveError = true
  })
  await expect(title).toHaveValue('My unsaved renovation title')
  await page.getByRole('button', { name: 'Save changes', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('permission to save')
  await expect(title).toHaveValue('My unsaved renovation title')
  await expect(page.getByText('Unsaved', { exact: true })).toBeVisible()
})

test('keeps edits made during a save unsaved and prevents overlapping writes', async ({ page }) => {
  await login(page)
  const title = page.getByLabel('Hero title', { exact: true })
  await title.fill('First version')
  await page.evaluate(() => { (window as any).__firebaseMock.writeDelay = 1000 })
  await page.getByRole('button', { name: 'Save changes', exact: true }).click()
  await title.fill('Edited while saving')
  await expect(page.getByRole('button', { name: 'Saving...', exact: true })).toBeDisabled()
  await expect(page.getByText('Unsaved', { exact: true })).toBeVisible()
  await expect(title).toHaveValue('Edited while saving')
  expect(await page.evaluate(() => (window as any).__firebaseMock.content.home.title)).toBe('First version')
})
