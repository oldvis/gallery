import type { QueryDraftRow } from '~/plugins/queryDraft'
import { describe, expect, it } from 'vitest'
import {
  applyQueryDrafts,
  createEmptyFieldRow,
  validateQueryDrafts,
} from '~/plugins/queryDraft'

describe('validateQueryDrafts', () => {
  it('rejects when any filter is incomplete', () => {
    const rows: QueryDraftRow[] = [
      { id: '1', type: 'field', field: 'authors', value: '' },
      { id: '2', type: 'search', pattern: '  ' },
    ]
    const result = validateQueryDrafts(rows)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toBe('Complete every filter before Apply.')
    }
  })

  it('rejects incomplete filters even when another filter is valid', () => {
    const rows: QueryDraftRow[] = [
      { id: '1', type: 'field', field: 'authors', value: '' },
      { id: '2', type: 'field', field: 'authors', value: 'Playfair, William' },
      { id: '3', type: 'image', description: 'bar chart', topK: '20' },
    ]
    const result = validateQueryDrafts(rows)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toBe('Complete every filter before Apply.')
    }
  })

  it('rejects year when from >= to', () => {
    const rows: QueryDraftRow[] = [
      { id: '1', type: 'year', from: '1900', to: '1900' },
    ]
    const result = validateQueryDrafts(rows)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toBe('Year range must use from < to (open-closed).')
    }
  })

  it('rejects year when from >= to even if other filters are valid', () => {
    const rows: QueryDraftRow[] = [
      { id: '1', type: 'search', pattern: 'map' },
      { id: '2', type: 'year', from: '1900', to: '1900' },
    ]
    const result = validateQueryDrafts(rows)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toBe('Year range must use from < to (open-closed).')
    }
  })

  it('rejects year with only one bound filled', () => {
    const rows: QueryDraftRow[] = [
      { id: '1', type: 'year', from: '1800', to: '' },
    ]
    const result = validateQueryDrafts(rows)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toBe('Complete every filter before Apply.')
    }
  })

  it('accepts only when every filter is complete', () => {
    const rows: QueryDraftRow[] = [
      { id: '2', type: 'field', field: 'authors', value: 'Playfair, William' },
      { id: '3', type: 'image', description: 'bar chart', topK: '20' },
      { id: '4', type: 'year', from: '1800', to: '1850' },
      { id: '5', type: 'search', pattern: 'map' },
    ]
    const result = validateQueryDrafts(rows)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.actions).toEqual([
        { kind: 'equal', field: 'authors', value: 'Playfair, William' },
        { kind: 'image', query: 'bar chart', topK: 20 },
        { kind: 'year', from: 1800, to: 1850 },
        { kind: 'search', pattern: 'map' },
      ])
    }
  })

  it('defaults image topK to 50 when blank', () => {
    const rows: QueryDraftRow[] = [
      { id: '1', type: 'image', description: 'line chart', topK: '' },
    ]
    const result = validateQueryDrafts(rows)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.actions[0]).toEqual({
        kind: 'image',
        query: 'line chart',
        topK: 50,
      })
    }
  })
})

describe('applyQueryDrafts', () => {
  it('dispatches store actions in order', () => {
    const calls: string[] = []
    const api = {
      toggleEqualSelector: (field: string, value: unknown) => {
        calls.push(`equal:${field}:${value}`)
      },
      addSearchSelector: (pattern: string) => {
        calls.push(`search:${pattern}`)
      },
      addImageSelector: (query: string, topK: number) => {
        calls.push(`image:${query}:${topK}`)
      },
      toggleRangeSelector: (field: string, range: [unknown, unknown]) => {
        calls.push(`year:${field}:${range[0]}:${range[1]}`)
      },
    }
    applyQueryDrafts(api as Parameters<typeof applyQueryDrafts>[0], [
      { kind: 'equal', field: 'tags', value: 'map' },
      { kind: 'search', pattern: 'Playfair' },
      { kind: 'image', query: 'chart', topK: 10 },
      { kind: 'year', from: 1800, to: 1850 },
    ])
    expect(calls).toEqual([
      'equal:tags:map',
      'search:Playfair',
      'image:chart:10',
      'year:publishDate:1800:1850',
    ])
  })
})

describe('createEmptyFieldRow', () => {
  it('returns a field row with default first QUERY_FIELD', () => {
    const row = createEmptyFieldRow()
    expect(row.type).toBe('field')
    if (row.type !== 'field') return
    expect(row.field).toBe('uuid')
    expect(row.value).toBe('')
    expect(row.id).toBeTruthy()
  })
})
