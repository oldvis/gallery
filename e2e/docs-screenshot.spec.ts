import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from '@playwright/test'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outPath = path.resolve(__dirname, '../docs/images/screenshot.png')
const fixturesDir = path.resolve(__dirname, 'fixtures/readme-entries')
const realVisualizations = path.resolve(__dirname, '../src/assets/visualizations.json')

interface ReadmeEntryFixture {
  uuid: string
  file: string
}

/**
 * Captures the gallery workspace for the README.
 * Run via: `pnpm docs:screenshot` (excluded from default e2e).
 *
 * Keeps production metadata (facet counts stay real) but rewrites download
 * URLs for the first entries to local fixtures under
 * `e2e/fixtures/readme-entries/` so the shot shows distinct plates offline.
 */
test('capture gallery overview for README', async ({ page }) => {
  test.setTimeout(180_000)

  const fixtures = JSON.parse(
    fs.readFileSync(path.join(fixturesDir, 'manifest.json'), 'utf8'),
  ) as ReadmeEntryFixture[]
  const fixtureByUuid = new Map(
    fixtures.map((f) => [f.uuid, path.join(fixturesDir, f.file)]),
  )
  for (const filePath of fixtureByUuid.values()) {
    expect(fs.existsSync(filePath), `missing fixture ${filePath}`).toBe(true)
  }

  await page.addInitScript(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
    window.localStorage.setItem('color-schema', 'light')
  })

  // Serve stored plates; abort other remote images so the shot stays offline.
  await page.route('**/*.{jpg,jpeg,png,webp}', async (route) => {
    const url = route.request().url()
    if (url.includes('127.0.0.1') || url.includes('localhost')) {
      await route.continue()
      return
    }
    const match = url.match(/\/entries\/([0-9a-f-]+)\.jpg(?:\?.*)?$/i)
    if (match !== null) {
      const filePath = fixtureByUuid.get(match[1])
      if (filePath === undefined) {
        await route.fulfill({ status: 404, body: 'missing fixture' })
        return
      }
      await route.fulfill({ path: filePath, contentType: 'image/jpeg' })
      return
    }
    await route.abort()
  })

  await page.route(/visualizations(?:-[^/]+)?\.json(?:\?.*)?$/, async (route) => {
    if (new URL(route.request().url()).searchParams.has('import')) {
      await route.continue()
      return
    }
    const raw = JSON.parse(fs.readFileSync(realVisualizations, 'utf8')) as Array<{
      uuid: string
      downloadUrl?: string | null
    }>
    for (const entry of raw) {
      if (fixtureByUuid.has(entry.uuid)) {
        entry.downloadUrl = `https://readme.local/entries/${entry.uuid}.jpg`
      }
      else {
        // Keep facet metadata; hide remote plates that are not stored as fixtures.
        entry.downloadUrl = null
      }
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(raw),
    })
  })

  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await page.getByTestId('entries-stats').waitFor({ state: 'visible', timeout: 180_000 })
  await expect(page.getByTestId('entries-count')).not.toHaveText('0', { timeout: 60_000 })

  const imgs = page.getByTestId('gallery-entries').locator('img')
  await expect(imgs).toHaveCount(fixtures.length, { timeout: 30_000 })
  // First page shows several fixture plates; wait until the visible ones decode.
  const visibleCount = Math.min(3, fixtures.length)
  for (let i = 0; i < visibleCount; i += 1) {
    const img = imgs.nth(i)
    await expect.poll(async () => img.evaluate((el) => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
  }
  // Distinct srcs — not one shared stub.
  const srcs = await imgs.evaluateAll((nodes) => (
    nodes.map((n) => (n as HTMLImageElement).currentSrc || (n as HTMLImageElement).src)
  ))
  expect(new Set(srcs).size).toBe(srcs.length)
  await expect(page.getByText('Image failed to load')).toHaveCount(0)
  await expect(page.getByText('served over HTTP')).toHaveCount(0)
  await page.getByText('Authors', { exact: true }).first().waitFor({ state: 'visible' })
  await new Promise((r) => setTimeout(r, 500))

  await page.screenshot({
    path: outPath,
    type: 'png',
    animations: 'disabled',
  })
})
