import type { Visualization } from '~/plugins/visualization'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { SelectorType, useStore } from '~/stores/selector'

const fixture = (partial: Partial<Visualization> & Pick<Visualization, 'uuid'>): Visualization => ({
  authors: null,
  displayName: 'Untitled',
  publishDate: null,
  viewUrl: '',
  downloadUrl: '',
  languages: [],
  tags: [],
  abstract: null,
  rights: '',
  source: { name: 'test', url: '', accessDate: '' },
  ...partial,
})

const data: Visualization[] = [
  fixture({ uuid: 'a', authors: ['Playfair, William'], tags: ['chart'], displayName: 'Exports', publishDate: 1786 }),
  fixture({ uuid: 'b', authors: ['Neurath, Otto'], tags: ['map'], displayName: 'Isotype', publishDate: 1936 }),
  fixture({ uuid: 'c', authors: ['Playfair, William'], tags: ['map'], displayName: 'Debt', publishDate: 1801 }),
]

describe('selector store applySelectors', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('filters with exact sift equality', async () => {
    const store = useStore()
    store.toggleEqualSelector('tags', 'chart')
    const result = await store.applySelectors(data)
    expect(result.map((d) => d.uuid)).toEqual(['a'])
  })

  it('filters with open-closed range on publishDate', async () => {
    const store = useStore()
    const ranged = [
      ...data,
      fixture({ uuid: 'd', displayName: 'EdgeLeft', publishDate: 1800 }),
      fixture({ uuid: 'e', displayName: 'EdgeRight', publishDate: 1940 }),
    ]
    store.toggleRangeSelector('publishDate', [1800, 1940])
    const result = await store.applySelectors(ranged)
    expect(result.map((d) => d.uuid).sort()).toEqual(['b', 'c', 'e'])
    expect(store.selectors[0].query).toEqual({
      publishDate: { $gt: 1800, $lte: 1940 },
    })
  })

  it('filters with fuse search pattern', async () => {
    const store = useStore()
    store.addSearchSelector('Playfair, William')
    const result = await store.applySelectors(data)
    expect(result.map((d) => d.uuid).sort()).toEqual(['a', 'c'])
  })

  it('and-chains multiple selectors', async () => {
    const store = useStore()
    store.toggleEqualSelector('tags', 'map')
    store.addSearchSelector('Playfair, William')
    const result = await store.applySelectors(data)
    expect(result.map((d) => d.uuid)).toEqual(['c'])
  })

  it('initializeFromQuery builds image selector without running model', () => {
    const store = useStore()
    const params = new URLSearchParams()
    params.append('image:(bar chart|topk:20)', '')
    store.initializeFromQuery(params)
    expect(store.selectors).toHaveLength(1)
    expect(store.selectors[0].type).toBe(SelectorType.Image)
    expect(store.selectors[0].query).toEqual({ query: 'bar chart', topK: 20 })
  })
})
