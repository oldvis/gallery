import type { QueryField } from '~/plugins/queryFields'
import { v4 as uuidv4 } from 'uuid'
import { QUERY_FIELDS } from '~/plugins/queryFields'

export type QueryDraftType = 'field' | 'search' | 'image' | 'year'

export type QueryDraftRow
  = | { id: string, type: 'field', field: QueryField | string, value: string }
    | { id: string, type: 'search', pattern: string }
    | { id: string, type: 'image', description: string, topK: string }
    | { id: string, type: 'year', from: string, to: string }

export type QueryDraftAction
  = | { kind: 'equal', field: string, value: string }
    | { kind: 'search', pattern: string }
    | { kind: 'image', query: string, topK: number }
    | { kind: 'year', from: number, to: number }

export type QueryDraftValidation
  = | { ok: true, actions: QueryDraftAction[] }
    | { ok: false, error: string }

export interface QueryDraftStoreApi {
  toggleEqualSelector: (field: string, value: unknown) => void
  addSearchSelector: (pattern: string) => void
  addImageSelector: (query: string, topK?: number) => void
  toggleRangeSelector: (field: string, range: [unknown, unknown]) => void
}

const DEFAULT_IMAGE_TOP_K = 50

export const createEmptyFieldRow = (): QueryDraftRow => ({
  id: uuidv4(),
  type: 'field',
  field: QUERY_FIELDS[0],
  value: '',
})

const parsePositiveInt = (raw: string, fallback: number): number | null => {
  const trimmed = raw.trim()
  if (trimmed === '') return fallback
  const n = Number(trimmed)
  if (!Number.isInteger(n) || n < 1) return null
  return n
}

/** Build actions from rows; every filter must be complete and valid. */
export const validateQueryDrafts = (rows: QueryDraftRow[]): QueryDraftValidation => {
  const actions: QueryDraftAction[] = []
  const incomplete = 'Complete every filter before Apply.'

  for (const row of rows) {
    if (row.type === 'field') {
      const value = row.value.trim()
      if (value === '') {
        return { ok: false, error: incomplete }
      }
      actions.push({ kind: 'equal', field: row.field, value })
      continue
    }
    if (row.type === 'search') {
      const pattern = row.pattern.trim()
      if (pattern === '') {
        return { ok: false, error: incomplete }
      }
      actions.push({ kind: 'search', pattern })
      continue
    }
    if (row.type === 'image') {
      const query = row.description.trim()
      if (query === '') {
        return { ok: false, error: incomplete }
      }
      const topK = parsePositiveInt(row.topK, DEFAULT_IMAGE_TOP_K)
      if (topK === null) {
        return { ok: false, error: 'Image topK must be an integer ≥ 1.' }
      }
      actions.push({ kind: 'image', query, topK })
      continue
    }
    const fromRaw = row.from.trim()
    const toRaw = row.to.trim()
    if (fromRaw === '' || toRaw === '') {
      return { ok: false, error: incomplete }
    }
    const from = Number(fromRaw)
    const to = Number(toRaw)
    if (!Number.isInteger(from) || !Number.isInteger(to) || from >= to) {
      return { ok: false, error: 'Year range must use from < to (open-closed).' }
    }
    actions.push({ kind: 'year', from, to })
  }

  if (actions.length === 0) {
    return { ok: false, error: incomplete }
  }
  return { ok: true, actions }
}

export const applyQueryDrafts = (
  api: QueryDraftStoreApi,
  actions: QueryDraftAction[],
): void => {
  for (const action of actions) {
    if (action.kind === 'equal') {
      api.toggleEqualSelector(action.field, action.value)
    }
    else if (action.kind === 'search') {
      api.addSearchSelector(action.pattern)
    }
    else if (action.kind === 'image') {
      api.addImageSelector(action.query, action.topK)
    }
    else {
      api.toggleRangeSelector('publishDate', [action.from, action.to])
    }
  }
}
