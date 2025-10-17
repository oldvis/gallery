import { describe, expect, it } from 'vitest'
import { parseQueryValue, queriesToSelectors } from '~/plugins/queryParams'
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
