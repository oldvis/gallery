import { describe, expect, it } from 'vitest'
import { parseQueryParams, parseQueryValue, queriesToSelectors, selectorsToRouteQuery } from '~/plugins/queryParams'
import { SelectorType } from '~/stores/selector'

describe('query parsing', () => {
  it('should parse basic queries', () => {
    expect(parseQueryValue('authors:(Playfair, William)')).toEqual({
      field: 'authors',
      value: 'Playfair, William',
    })
  })

  it('should parse image queries with topK syntax', () => {
    expect(parseQueryValue('image:(line chart|topk:50)')).toEqual({
      field: 'image',
      value: 'line chart',
      topK: 50,
    })
  })

  it('should parse image queries without topK syntax', () => {
    expect(parseQueryValue('image:(bar chart)')).toEqual({
      field: 'image',
      value: 'bar chart',
    })
  })

  it('should convert queries to selectors with topK', () => {
    const queries = [
      { field: 'image', value: 'line chart', topK: 50 },
    ]
    const selectors = queriesToSelectors(queries)

    expect(selectors).toHaveLength(1)
    expect(selectors[0].type).toBe(SelectorType.Image)
    expect(selectors[0].query).toEqual({
      query: 'line chart',
      topK: 50,
    })
  })

  it('should use default topK when not specified', () => {
    const queries = [
      { field: 'image', value: 'bar chart' },
    ]
    const selectors = queriesToSelectors(queries)

    expect(selectors).toHaveLength(1)
    expect(selectors[0].type).toBe(SelectorType.Image)
    expect(selectors[0].query).toEqual({
      query: 'bar chart',
      topK: 50,
    })
  })

  it('should ignore topK syntax for non-image fields', () => {
    expect(parseQueryValue('authors:(Playfair, William|topk:50)')).toEqual({
      field: 'authors',
      value: 'Playfair, William|topk:50',
    })
  })

  it('should ignore topK syntax for tags field', () => {
    expect(parseQueryValue('tags:(interactive|topk:30)')).toEqual({
      field: 'tags',
      value: 'interactive|topk:30',
    })
  })
})

describe('parseQueryParams', () => {
  it('parses search and field keys from URLSearchParams', () => {
    const params = new URLSearchParams()
    params.set('search', 'Playfair')
    params.append('authors:(Playfair, William)', '')
    const parsed = parseQueryParams(params)
    expect(parsed).toEqual(expect.arrayContaining([
      { field: 'search', value: 'Playfair' },
      { field: 'authors', value: 'Playfair, William' },
    ]))
  })

  it('parses image topK from key-style params', () => {
    const params = new URLSearchParams()
    params.append('image:(bar chart|topk:20)', '')
    expect(parseQueryParams(params)).toEqual([
      { field: 'image', value: 'bar chart', topK: 20 },
    ])
  })
})

describe('selectorsToRouteQuery', () => {
  it('emits search, field, and image query keys', () => {
    const selectors = queriesToSelectors([
      { field: 'search', value: 'population' },
      { field: 'tags', value: 'interactive' },
      { field: 'image', value: 'line chart', topK: 20 },
    ])
    expect(selectorsToRouteQuery(selectors)).toEqual({
      'search': 'population',
      'tags:(interactive)': null,
      'image:(line chart|topk:20)': null,
    })
  })

  it('omits topK when image uses default 50', () => {
    const selectors = queriesToSelectors([
      { field: 'image', value: 'map' },
    ])
    expect(selectorsToRouteQuery(selectors)).toEqual({
      'image:(map)': null,
    })
  })
})

describe('query round-trip', () => {
  it('preserves shareable URL shape for search + field + image', () => {
    const params = new URLSearchParams()
    params.set('search', 'Playfair')
    params.append('authors:(Playfair, William)', '')
    params.append('image:(bar chart|topk:20)', '')
    const routeQuery = selectorsToRouteQuery(queriesToSelectors(parseQueryParams(params)))
    expect(routeQuery.search).toBe('Playfair')
    expect(routeQuery['authors:(Playfair, William)']).toBeNull()
    expect(routeQuery['image:(bar chart|topk:20)']).toBeNull()
  })
})
