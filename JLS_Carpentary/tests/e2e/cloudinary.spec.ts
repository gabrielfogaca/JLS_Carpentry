import { test, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'

const mock = await readFile(new URL('../fixtures/firebase-mock.js', import.meta.url), 'utf8')
const image = { name: 'cloudinary-project.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aX1kAAAAASUVORK5CYII=', 'base64') }
const imageUrl = 'https://res.cloudinary.com/test-cloud/image/upload/jls-carpentry/project.png'

test.beforeEach(async ({ page }) => {
  await page.route('https://**/*', (route) => route.abort())
  await page.route('**/src/firebase.ts*', (route) => route.fulfill({ contentType: 'text/javascript', body: mock }))
  await page.route(/\/node_modules\/\.vite\/deps\/firebase_(auth|database|storage)\.js/, (route) => route.fulfill({ contentType: 'text/javascript', body: mock }))
  await page.route('**/src/App.tsx*', async (route) => {
    const response = await route.fetch()
    const source = await response.text()
    expect(source).toContain('import.meta.env.VITE_MEDIA_PROVIDER')
    // An unset variable must still use Cloudinary, never silently fall back.
    await route.fulfill({ response, body: source.replaceAll('import.meta.env.VITE_MEDIA_PROVIDER', 'undefined') })
  })
  await page.route('**/api/cloudinary-sign', async (route) => {
    expect(route.request().method()).toBe('POST')
    expect(route.request().headers().authorization).toBe('Bearer test-token')
    await route.fulfill({ json: { cloudName: 'test-cloud', apiKey: 'test-key', signature: 'test-signature', params: { timestamp: '123', public_id: 'jls-carpentry/project', overwrite: 'false' } } })
  })
  await page.route('https://api.cloudinary.com/v1_1/test-cloud/image/upload', async (route) => {
    if (route.request().method() === 'OPTIONS') {
      await route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'POST, OPTIONS', 'access-control-allow-headers': '*' } })
      return
    }
    const body = route.request().postDataBuffer()?.toString() || ''
    expect(body).toContain('cloudinary-project.png')
    expect(body).toContain('test-signature')
    await route.fulfill({ headers: { 'access-control-allow-origin': '*' }, json: { secure_url: imageUrl } })
  })
  await page.goto('/admin')
  await page.getByLabel('Email', { exact: true }).fill('admin@example.com')
  await page.getByLabel('Password', { exact: true }).fill('test-password')
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await page.getByRole('button', { name: 'Portfolio', exact: true }).first().click()
})

test('uploads through Cloudinary, reuses the image and publishes persisted content', async ({ page }) => {
  await page.locator('input[type=file]').first().setInputFiles(image)
  await expect(page.getByText('Image uploaded and set as project cover. Click Save changes to publish it.')).toBeVisible()
  expect(await page.evaluate(() => (window as any).__firebaseMock.content)).toBeNull()
  await page.getByRole('button', { name: 'Choose cover from library' }).first().click()
  await page.getByRole('button', { name: 'Select cloudinary-project.png as cover', exact: true }).click()
  await page.getByRole('button', { name: 'Add gallery photo from library' }).first().click()
  await page.getByRole('button', { name: 'Add cloudinary-project.png to gallery', exact: true }).click()
  await page.getByRole('button', { name: 'Done', exact: true }).click()
  await page.getByRole('button', { name: 'Home', exact: true }).first().click()
  await page.getByRole('combobox', { name: 'Select from media library', exact: true }).selectOption(imageUrl)
  await page.getByRole('button', { name: 'Save changes', exact: true }).click()
  await expect(page.getByText('Saved', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Back to site', exact: true }).click()
  await page.reload()
  await expect(page.getByAltText('Master Ensuite Renovation', { exact: true })).toHaveAttribute('src', imageUrl)
  expect(await page.evaluate(() => (window as any).__firebaseMock.content.home.heroImage)).toBe(imageUrl)
  await page.getByRole('button', { name: /Master Ensuite Renovation/ }).click()
  await expect(page.getByRole('dialog').locator(`img[src="${imageUrl}"]`).first()).toBeVisible()
})

test('reports server configuration errors before sending the image', async ({ page }) => {
  await page.route('**/api/cloudinary-sign', (route) => route.fulfill({ status: 503, json: { error: 'Image uploads are not configured on the server.' } }))
  await page.locator('input[type=file]').first().setInputFiles(image)
  await expect(page.getByText('Image uploads are not configured on the server.')).toBeVisible()
  expect(await page.evaluate(() => Object.keys((window as any).__firebaseMock.media))).toHaveLength(0)
})

test('reports Cloudinary rejection and keeps the library unchanged', async ({ page }) => {
  await page.route('https://api.cloudinary.com/v1_1/test-cloud/image/upload', (route) => route.fulfill({ status: 400, headers: { 'access-control-allow-origin': '*' }, json: { error: { message: 'Invalid Signature' } } }))
  await page.locator('input[type=file]').first().setInputFiles(image)
  await expect(page.getByText('Invalid Signature', { exact: true })).toBeVisible()
  expect(await page.evaluate(() => Object.keys((window as any).__firebaseMock.media))).toHaveLength(0)
})
