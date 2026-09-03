import { expect, test } from '@playwright/test'

test('gallery loads entries', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(page.getByTestId('gallery-entries')).toBeVisible()
  await expect(page.getByTestId('entries-count')).not.toHaveText('0', { timeout: 60_000 })
  await expect(page.getByTestId('gallery-entries').locator('.text-sm').first()).toBeVisible({ timeout: 60_000 })
})

test('URL freeform search filters results', async ({ page }) => {
  await page.goto('/?search=Playfair', { waitUntil: 'domcontentloaded' })
  await expect(page.getByTestId('matched-count')).toBeVisible({ timeout: 60_000 })
  const matched = Number(await page.getByTestId('matched-count').textContent())
  const total = Number(await page.getByTestId('entries-count').textContent())
  expect(matched).toBeGreaterThan(0)
  expect(matched).toBeLessThan(total)
})

test('search widget adds and removes a selector', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(page.getByTestId('gallery-entries')).toBeVisible()
  await expect(page.getByTestId('entries-count')).not.toHaveText('0', { timeout: 60_000 })
  await page.getByTestId('search-input').fill('Playfair')
  await page.getByTestId('search-submit').click()
  await expect(page.getByTestId('matched-count')).toBeVisible({ timeout: 60_000 })
  const matched = Number(await page.getByTestId('matched-count').textContent())
  const total = Number(await page.getByTestId('entries-count').textContent())
  expect(matched).toBeGreaterThan(0)
  expect(matched).toBeLessThan(total)
  await page.getByTestId('selector-remove').click()
  await expect(page.getByTestId('matched-count')).toHaveCount(0)
})

test('URL field query filters by author', async ({ page }) => {
  await page.goto('/?authors:(Playfair,%20William)', { waitUntil: 'domcontentloaded' })
  await expect(page.getByTestId('matched-count')).toBeVisible({ timeout: 60_000 })
  const matched = Number(await page.getByTestId('matched-count').textContent())
  expect(matched).toBeGreaterThan(0)
  await expect(page.getByText('Playfair, William').first()).toBeVisible()
})
