import type { BrowserContext, Page } from '@playwright/test'
import type { EmbedBenchBrowserTest } from './embedBench'
import { expect, test } from '@playwright/test'
import {
  attachDiagnostics,
  attachDownloadProbe,
  browserProxyFromEnv,
  clearOriginCaches,
  elapsedMs,
  replaceImageQueryViaSearch,
  waitForGalleryReady,
  waitForImageSearchDone,
  writeChromiumJson,
} from './embedBench'

// These three tests share one browser session and must run in this order:
// 1. cold — empty cache, first search downloads CLIP
// 2. in-memory — same tab, model already loaded
// 3. cached-load — new tab, files still in the browser cache
test.describe('CLIP embed latency', () => {
  test.describe.configure({ mode: 'serial', timeout: 700_000 })

  const tests: EmbedBenchBrowserTest[] = []
  let context: BrowserContext
  let coldPage: Page

  test.beforeAll(async ({ browser }) => {
    const proxy = browserProxyFromEnv()
    if (proxy) {
      console.warn(`Playwright proxy ${proxy.server}`)
    }
    context = await browser.newContext({
      ...(proxy ? { proxy, ignoreHTTPSErrors: true } : {}),
    })
    coldPage = await context.newPage()
    attachDiagnostics(coldPage)
  })

  test.afterAll(async () => {
    writeChromiumJson(tests)
    await context.close()
  })

  test('cold download + init + query', async () => {
    await coldPage.goto('/', { waitUntil: 'domcontentloaded' })
    await waitForGalleryReady(coldPage)
    await clearOriginCaches(coldPage)
    const probe = attachDownloadProbe(coldPage)
    const initMs = await elapsedMs(async () => {
      await coldPage.goto('/?image:(bar%20chart)', { waitUntil: 'domcontentloaded' })
      await waitForGalleryReady(coldPage)
      await waitForImageSearchDone(coldPage)
    })
    const matched = Number(await coldPage.getByTestId('matched-count').textContent())
    expect(matched).toBeGreaterThan(0)
    const download = probe.snapshot()
    probe.detach()
    expect(download.bytes).toBeGreaterThan(1_000_000)
    tests.push({
      name: 'cold',
      download,
      initMs,
      query: {
        meanMs: 0,
        samples: [{ text: 'bar chart', ms: 0 }],
      },
    })
  })

  // Different text from cold so encode is not a cached forward of "bar chart".
  test('in-memory query skips init', async () => {
    const probe = attachDownloadProbe(coldPage)
    const queryMs = await elapsedMs(async () => {
      await replaceImageQueryViaSearch(coldPage, 'line chart')
      await waitForImageSearchDone(coldPage)
    })
    const matched = Number(await coldPage.getByTestId('matched-count').textContent())
    expect(matched).toBeGreaterThan(0)
    const download = probe.snapshot()
    probe.detach()
    expect(download.bytes).toBe(0)
    tests.push({
      name: 'in-memory-query',
      download,
      initMs: 0,
      query: {
        meanMs: queryMs,
        samples: [{ text: 'line chart', ms: queryMs }],
      },
    })
  })

  test('cached load uses Cache API', async () => {
    const page = await context.newPage()
    const probe = attachDownloadProbe(page)
    const initMs = await elapsedMs(async () => {
      await page.goto('/?image:(bar%20chart)', { waitUntil: 'domcontentloaded' })
      await waitForGalleryReady(page)
      await waitForImageSearchDone(page)
    })
    const matched = Number(await page.getByTestId('matched-count').textContent())
    expect(matched).toBeGreaterThan(0)
    const download = probe.snapshot()
    probe.detach()
    expect(download.bytes).toBeLessThan(1_000_000)
    tests.push({
      name: 'cached-load',
      download,
      initMs,
      query: {
        meanMs: 0,
        samples: [{ text: 'bar chart', ms: 0 }],
      },
    })
    await page.close()
  })
})
