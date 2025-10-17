import type { Selector } from '~/stores/selector'
import { v4 as uuidv4 } from 'uuid'
import { DEFAULT_FUSE_OPTIONS } from '~/plugins/fuse'
import { SelectorType } from '~/stores/selector'

/**
 * Parse Internet Archive-style query syntax from URL parameters
 * Examples:
 * - "authors:(Playfair, William)" -> { field: 'authors', value: 'Playfair, William' }
 * - "tags:(interactive)" -> { field: 'tags', value: 'interactive' }
 * - "image:(bar chart)" -> { field: 'image', value: 'bar chart' }
 * - "image:(line chart|topk:50)" -> { field: 'image', value: 'line chart', topK: 50 }
 * - "population" -> { field: 'search', value: 'population' }
 */
export interface ParsedQuery {
  field: string
  value: string
  topK?: number
}

const DEFAULT_TOP_K = 50

/**
 * Parse a single query parameter value
 * @param queryValue - The query parameter value (e.g., "authors:(Playfair, William)" or "image:(line chart|topk:50)")
 * @returns Parsed query object or null if invalid format
 */
export const parseQueryValue = (queryValue: string): ParsedQuery | null => {
  // Handle search queries (no field prefix)
  if (!queryValue.includes(':')) {
    return {
      field: 'search',
      value: queryValue,
    }
  }

  // Parse field:(value) format - handle parentheses within the value
  // Find the first colon and opening parenthesis
  const colonIndex = queryValue.indexOf(':')
  if (colonIndex === -1) {
    return null
  }

  const field = queryValue.substring(0, colonIndex)
  const rest = queryValue.substring(colonIndex + 1)

  // Check if it starts with '(' and ends with ')'
  if (!rest.startsWith('(') || !rest.endsWith(')')) {
    return null
  }

  // Extract the value by removing the outer parentheses
  const value = rest.substring(1, rest.length - 1)

  // Check for topK syntax: (description|topk:number) - only valid for image field
  const topKMatch = value.match(/^(.+)\|topk:(\d+)$/)
  if (topKMatch && field.trim() === 'image') {
    const [, description, topKStr] = topKMatch
    const topK = Number.parseInt(topKStr, 10)
    if (!Number.isNaN(topK) && topK > 0) {
      return {
        field: field.trim(),
        value: description.trim(),
        topK,
      }
    }
  }

  return {
    field: field.trim(),
    value: value.trim(),
  }
}

/**
 * Parse URL query parameters into an array of parsed queries
 * Handles individual parameters like ?authors:(william)&tags:(interactive)
 * @param queryParams - URL search params object
 * @returns Array of parsed query objects
 */
export const parseQueryParams = (queryParams: URLSearchParams): ParsedQuery[] => {
  const queries: ParsedQuery[] = []

  queryParams.forEach((value: string, key: string) => {
    // Check if this is a field:(value) pattern in the key
    if (key.includes(':(') && key.endsWith(')')) {
      const parsed = parseQueryValue(key)
      if (parsed) {
        queries.push(parsed)
      }
    }
    // Handle search queries (no field prefix)
    else if (key === 'search') {
      queries.push({
        field: 'search',
        value,
      })
    }
  })

  return queries
}

/**
 * Convert parsed queries to selectors
 * @param queries - Array of parsed query objects
 * @returns Array of selector objects
 */
export const queriesToSelectors = (queries: ParsedQuery[]): Selector[] => {
  const selectors: Selector[] = []

  queries.forEach((query) => {
    if (query.field === 'search') {
      // Create Fuse search selector
      selectors.push({
        type: SelectorType.Fuse,
        query: {
          pattern: query.value,
          options: DEFAULT_FUSE_OPTIONS,
        },
        uuid: uuidv4(),
      })
    }
    else if (query.field === 'image') {
      // Create Image search selector
      selectors.push({
        type: SelectorType.Image,
        query: {
          query: query.value,
          topK: query.topK ?? DEFAULT_TOP_K,
        },
        uuid: uuidv4(),
      })
    }
    else {
      // Create Sift exact match selector
      selectors.push({
        type: SelectorType.Sift,
        query: { [query.field]: { $eq: query.value } },
        uuid: uuidv4(),
      })
    }
  })

  return selectors
}

/**
 * Convert selectors to route query parameters
 * @param selectors - Array of selector objects
 * @returns Object with query parameters for Vue Router
 */
export const selectorsToRouteQuery = (selectors: Selector[]): Record<string, string | null> => {
  const queryParams: Record<string, string | null> = {}

  selectors.forEach((selector) => {
    if (selector.type === SelectorType.Sift) {
      const query = selector.query as Record<string, Record<string, unknown>>
      Object.entries(query).forEach(([field, condition]) => {
        if (condition && typeof condition === 'object' && '$eq' in condition) {
          const value = condition.$eq as string
          queryParams[`${field}:(${value})`] = null
        }
      })
    }
    else if (selector.type === SelectorType.Fuse) {
      const query = selector.query as { pattern: string, options: any }
      queryParams.search = query.pattern
    }
    else if (selector.type === SelectorType.Image) {
      const query = selector.query as { query: string, topK: number }
      const topKParam = query.topK !== DEFAULT_TOP_K ? `|topk:${query.topK}` : ''
      queryParams[`image:(${query.query}${topKParam})`] = null
    }
  })

  return queryParams
}
