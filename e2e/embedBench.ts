import type { Page, Request, Response } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { expect } from '@playwright/test'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const benchOutDir = path.resolve(__dirname, '../test-results/embed-bench')

export interface EmbedBenchPhase {
  ms: number
  bytes?: number
}

export interface EmbedBenchQuerySample {
  text: string
  ms: number
}

export interface EmbedBenchBrowserTest {
  name: 'cold' | 'cached-load' | 'in-memory-query'
  download: EmbedBenchPhase
  initMs: number
  query: { meanMs: number, samples: EmbedBenchQuerySample[] }
}

/** HF may serve ONNX via huggingface.co or *.hf.co (including Xet). */
export const isHuggingFaceHost = (hostname: string): boolean => (
  hostname === 'huggingface.co'
  || hostname === 'hf.co'
  || hostname.endsWith('.hf.co')
)

/** Playwright Chromium ignores the OS proxy; pass HTTPS_PROXY through explicitly. */
export const browserProxyFromEnv = (): { server: string } | undefined => {
  const server = process.env.HTTPS_PROXY
    || process.env.https_proxy
    || process.env.HTTP_PROXY
    || process.env.http_proxy
  if (!server) {
    return undefined
  }
  return { server }
}

const pageDiagnostics = new WeakMap<Page, () => { failed: string[], errors: string[] }>()

export const attachDiagnostics = (page: Page) => {
  const failed: string[] = []
  const errors: string[] = []
  page.on('requestfailed', (request) => {
    failed.push(`${request.failure()?.errorText ?? 'failed'} ${request.url()}`)
  })
  page.on('pageerror', (error) => {
    errors.push(error.message)
  })
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text())
    }
  })
  const snapshot = () => ({ failed: failed.slice(-20), errors: errors.slice(-20) })
  pageDiagnostics.set(page, snapshot)
  return { snapshot }
}

export const attachDownloadProbe = (page: Page) => {
  const hits: { start: number, end: number, bytes: number }[] = []
  const requestStartedAt = new Map<Request, number>()
  const onRequest = (request: Request) => {
    let hostname = ''
    try {
      hostname = new URL(request.url()).hostname
    }
    catch {
      return
    }
    if (!isHuggingFaceHost(hostname)) {
      return
    }
    requestStartedAt.set(request, Date.now())
  }
  const onResponse = async (response: Response) => {
    let hostname = ''
    try {
      hostname = new URL(response.url()).hostname
    }
    catch {
      return
    }
    if (!isHuggingFaceHost(hostname)) {
      return
    }
    const start = requestStartedAt.get(response.request()) ?? Date.now()
    const end = Date.now()
    const headers = response.headers()
    const length = Number(headers['content-length'] ?? Number.NaN)
    let bytes = Number.isFinite(length) ? length : 0
    const bodySize = await response.body().then((body) => body.byteLength).catch(() => 0)
    if (bodySize > 0) {
      bytes = bodySize
    }
    hits.push({ start, end, bytes })
  }
  page.on('request', onRequest)
  page.on('response', onResponse)
  return {
    snapshot: (): EmbedBenchPhase => {
      if (hits.length === 0) {
        return { ms: 0, bytes: 0 }
      }
      const start = Math.min(...hits.map((hit) => hit.start))
      const end = Math.max(...hits.map((hit) => hit.end))
      const bytes = hits.reduce((sum, hit) => sum + hit.bytes, 0)
      return { ms: Math.max(0, end - start), bytes }
    },
    detach: () => {
      page.off('request', onRequest)
      page.off('response', onResponse)
    },
  }
}

export const clearOriginCaches = async (page: Page): Promise<void> => {
  await page.evaluate(async () => {
    const keys = await caches.keys()
    await Promise.all(keys.map((key) => caches.delete(key)))
  })
}

export const waitForGalleryReady = async (page: Page): Promise<void> => {
  await page.getByTestId('gallery-entries').waitFor({ state: 'visible' })
  await page.getByTestId('entries-count').waitFor({ state: 'visible' })
}

export const waitForImageSearchDone = async (page: Page): Promise<void> => {
  const searching = page.getByTestId('entries-searching')
  const matched = page.getByTestId('matched-count')
  await matched.waitFor({ state: 'visible', timeout: 60_000 })
  try {
    await searching.waitFor({ state: 'hidden', timeout: 600_000 })
  }
  catch (error) {
    const diag = pageDiagnostics.get(page)?.() ?? { failed: [], errors: [] }
    throw new Error(
      `CLIP search still running after timeout; diagnostics=${JSON.stringify(diag)}`,
      { cause: error },
    )
  }
  const count = Number(await matched.textContent())
  const diag = pageDiagnostics.get(page)?.() ?? { failed: [], errors: [] }
  // applyImageSelector swallows errors and returns []; 0 matches is the failure signal.
  expect(
    count,
    `image search ended with ${count} matches; diagnostics=${JSON.stringify(diag)}`,
  ).toBeGreaterThan(0)
}

/** Wall-clock ms for a Playwright action. */
export const elapsedMs = async (run: () => Promise<void>): Promise<number> => {
  const started = Date.now()
  await run()
  return Date.now() - started
}

/** Clear chips, then submit one `image:(…)` query through the Search box. */
export const replaceImageQueryViaSearch = async (page: Page, text: string): Promise<void> => {
  const remove = page.getByTestId('selector-remove')
  while (await remove.count() > 0) {
    await remove.first().click()
  }
  await page.getByTestId('search-input').fill(`image:(${text})`)
  await page.getByTestId('search-submit').click()
}

export const writeChromiumJson = (tests: EmbedBenchBrowserTest[]): void => {
  fs.mkdirSync(benchOutDir, { recursive: true })
  const payload = {
    runtime: 'chromium' as const,
    model: 'Xenova/clip-vit-base-patch16' as const,
    dtype: 'q8' as const,
    timestamp: new Date().toISOString(),
    tests,
  }
  fs.writeFileSync(
    path.join(benchOutDir, 'chromium.json'),
    `${JSON.stringify(payload, null, 2)}\n`,
  )
  console.warn(`CLIP text model: ${payload.model} (q8)  runtime=chromium`)
  for (const row of tests) {
    console.warn(
      `${row.name.padEnd(16)} download=${row.download.ms.toFixed(0)}ms/${row.download.bytes}B  init=${row.initMs.toFixed(0)}ms  query=${row.query.meanMs.toFixed(1)}ms`,
    )
  }
}
