import type { IFuseOptions } from 'fuse.js'
import type { Query } from 'sift'
import type { Visualization } from '~/plugins/visualization'
import Fuse from 'fuse.js'
import { isEqual } from 'lodash'
import { acceptHMRUpdate, defineStore } from 'pinia'
import sift from 'sift'
import { v4 as uuidv4 } from 'uuid'
import { useSearchByText } from '~/composables/imageSearch'
import { DEFAULT_FUSE_OPTIONS } from '~/plugins/fuse'
import { parseQueryParams, queriesToSelectors } from '~/plugins/queryParams'

export enum SelectorType {
  /**
   * The type of selectors that follow Mongodb query schema.
   * Used for metadata exact matches.
   */
  Sift = 'Sift',
  /**
   * The type of selectors that follow Fuse.js options schema.
   * Used for metadata search.
   */
  Fuse = 'Fuse',
  /**
   * The type of selectors for image semantic search.
   * Used for finding similar visualizations.
   */
  Image = 'Image',
}

export interface Selector<Type extends SelectorType = SelectorType> {
  /** The type of the selector. */
  type: Type
  /** The query selector. */
  query: Type extends SelectorType.Sift
    ? Query<Visualization>
    : (Type extends SelectorType.Fuse
        ? {
            pattern: string
            options: IFuseOptions<Visualization>
          }
        : Type extends SelectorType.Image
          ? {
              query: string
              topK: number
            }
          : null)
  /** The uuid of the selector. */
  uuid: string
}

const buildEqualSelector = (
  field: string,
  value: unknown,
): Selector<SelectorType.Sift> => ({
  type: SelectorType.Sift,
  query: { [field]: { $eq: value } },
  uuid: uuidv4(),
})

/** Build a range selector selecting value in [range[0], range[1]). */
const buildRangeSelector = (
  field: string,
  range: [unknown, unknown],
): Selector<SelectorType.Sift> => ({
  type: SelectorType.Sift,
  query: { [field]: { $gte: range[0], $lt: range[1] } },
  uuid: uuidv4(),
})

const buildSearchSelector = (
  pattern: string,
  options: IFuseOptions<Visualization>,
): Selector<SelectorType.Fuse> => ({
  type: SelectorType.Fuse,
  query: { pattern, options },
  uuid: uuidv4(),
})

const buildImageSelector = (
  query: string,
  topK: number = 20,
): Selector<SelectorType.Image> => ({
  type: SelectorType.Image,
  query: { query, topK },
  uuid: uuidv4(),
})

/** Apply a Sift selector (metadata exact match). */
const applySiftSelector = (
  data: Visualization[],
  selector: Selector<SelectorType.Sift>,
): Visualization[] => {
  return data.filter(sift(selector.query))
}

/** Apply a Fuse selector (metadata search). */
const applyFuseSelector = (
  data: Visualization[],
  selector: Selector<SelectorType.Fuse>,
): Visualization[] => {
  const fuse = new Fuse(data, selector.query.options)
  return fuse.search(selector.query.pattern).map((d) => d.item)
}

/** Apply an Image selector (image semantic search). */
const applyImageSelector = async (
  data: Visualization[],
  selector: Selector<SelectorType.Image>,
): Promise<Visualization[]> => {
  const { searchByText } = useSearchByText()

  const getFilenameStem = (filename: string): string => (
    filename.split('.').slice(0, -1).join('.') || filename
  )

  try {
    const results = await searchByText(selector.query.query, selector.query.topK)
    const orderedUuids = results.map((r) => getFilenameStem(r.filename))
    const uuidToVisualization = new Map(data.map((v) => [v.uuid, v]))
    return orderedUuids
      .map((uuid) => uuidToVisualization.get(uuid))
      .filter((v): v is Visualization => v !== undefined)
  }
  catch (error) {
    console.error('Image search failed:', error)
    return []
  }
}

/** Apply a selector to the data entries. */
const applySelector = async (
  data: Visualization[],
  selector: Selector,
): Promise<Visualization[]> => {
  switch (selector.type) {
    case SelectorType.Sift:
      return applySiftSelector(data, selector as Selector<SelectorType.Sift>)
    case SelectorType.Fuse:
      return applyFuseSelector(data, selector as Selector<SelectorType.Fuse>)
    case SelectorType.Image:
      return applyImageSelector(data, selector as Selector<SelectorType.Image>)
    default:
      return []
  }
}

export const useStore = defineStore('selectors', {
  state: () => ({
    selectors: [] as Selector[],
  }),
  actions: {
    /** Add/Remove a selector checking datum[field] === value or datum[field].includes(value). */
    toggleEqualSelector(field: string, value: unknown): void {
      this.toggleSelector(buildEqualSelector(field, value))
    },
    /** Add/Remove a selector checking datum[field] in closed range [left, right]. */
    toggleRangeSelector(field: string, range: [unknown, unknown]): void {
      this.toggleSelector(buildRangeSelector(field, range))
    },
    /** Add a selector matching the pattern with data entries. */
    addSearchSelector(pattern: string): void {
      this.selectors.push(buildSearchSelector(pattern, DEFAULT_FUSE_OPTIONS))
    },
    /** Add an image search selector. */
    addImageSelector(query: string, topK: number = 20): void {
      this.selectors.push(buildImageSelector(query, topK))
    },
    /**
     * Add/Remove a selector if selector(s)
     * with the same query don't/do exist.
     */
    toggleSelector(selector: Selector): void {
      const match = this.selectors
        .find((d) => (
          selector.type === d.type
          && isEqual(selector.query, d.query)
        ))
      if (match === undefined) this.selectors.push(selector)
      else this.removeSelector(match.uuid)
    },
    /** Remove selector by uuid. */
    removeSelector(uuid: string): void {
      const index = this.selectors.findIndex((d) => d.uuid === uuid)
      this.selectors.splice(index, 1)
    },
    /** Initialize selectors from URL query parameters */
    initializeFromQuery(queryParams: URLSearchParams): void {
      const queries = parseQueryParams(queryParams)
      const newSelectors = queriesToSelectors(queries)

      // Clear existing selectors and add new ones
      this.selectors = newSelectors
    },
    /** Apply a selector to the data entries. */
    applySelector,
    /** Apply all the stored selector to the data entries. */
    async applySelectors(data: Visualization[]): Promise<Visualization[]> {
      let kept = data
      for (const selector of this.selectors) {
        kept = await this.applySelector(kept, selector)
      }
      return kept
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot))
}
