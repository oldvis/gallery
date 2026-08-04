import { afterEach, describe, expect, it, vi } from 'vitest'
import { loadVisualizations } from '~/plugins/visualization'

describe('loadVisualizations', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('converts publish dates and language codes through the public loader', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: async () => ([
        {
          uuid: 'single-year',
          authors: null,
          displayName: 'A',
          publishDate: { year: 1786 },
          viewUrl: '',
          downloadUrl: '',
          languages: ['eng', 'sla'],
          tags: [],
          abstract: null,
          rights: '',
          source: { name: 'src-a', url: '', accessDate: '' },
        },
        {
          uuid: 'interval-year',
          authors: null,
          displayName: 'B',
          publishDate: [{ year: 1800 }, { year: 1850 }],
          viewUrl: '',
          downloadUrl: '',
          languages: [],
          tags: [],
          abstract: null,
          rights: '',
          source: { name: 'src-a', url: '', accessDate: '' },
        },
        {
          uuid: 'null-year',
          authors: null,
          displayName: 'C',
          publishDate: null,
          viewUrl: '',
          downloadUrl: '',
          languages: [],
          tags: [],
          abstract: null,
          rights: '',
          source: { name: 'src-b', url: '', accessDate: '' },
        },
      ]),
    }))

    const visualizations = await loadVisualizations()
    const byUuid = Object.fromEntries(visualizations.map(d => [d.uuid, d]))

    expect(byUuid['single-year'].publishDate).toBe(1786)
    expect(byUuid['single-year'].languages).toEqual(['English', 'Slavic'])
    expect(byUuid['interval-year'].publishDate).toBe(1800)
    expect(byUuid['null-year'].publishDate).toBeNull()
  })
})
