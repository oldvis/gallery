import { acceptHMRUpdate, defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import sift from 'sift'
import type { Query } from 'sift'
import Fuse from 'fuse.js'
import { isEqual } from 'lodash'
import type { Visualization } from '~/plugins/visualization'

export enum SelectorType {
  /** The type of selectors that follow Mongodb query schema. */
  Sift = 'Sift',
  /** The type of selectors that follow Fuse.js options schema. */
  Fuse = 'Fuse',
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
            options: Fuse.IFuseOptions<Visualization>
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
  options: Fuse.IFuseOptions<Visualization>,
): Selector<SelectorType.Fuse> => ({
  type: SelectorType.Fuse,
  query: { pattern, options },
  uuid: uuidv4(),
})

/** Apply a selector to the data entries. */
const applySelector = (
  data: Visualization[],
  selector: Selector,
): Visualization[] => {
  if (selector.type === SelectorType.Sift) {
    const { query } = selector as Selector<SelectorType.Sift>
    return data.filter(sift(query))
  }
  if (selector.type === SelectorType.Fuse) {
    const { query } = selector as Selector<SelectorType.Fuse>
    const fuse = new Fuse(data, query.options)
    return fuse.search(query.pattern).map((d) => d.item)
  }
  return []
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
    /** Add/Remove a selector checking datum[field] in closed range [left, right]. */
    addSearchSelector(pattern: string): void {
      const options = {
        threshold: 0,
        keys: ['uuid', 'authors', 'displayName', 'publishDate', 'tags'],
      }
      this.selectors.push(buildSearchSelector(pattern, options))
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
    /** Apply a selector to the data entries. */
    applySelector,
    /** Apply all the stored selector to the data entries. */
    applySelectors(data: Visualization[]): Visualization[] {
      let kept = data
      this.selectors.forEach((d) => {
        kept = this.applySelector(kept, d)
      })
      return kept
    },
  },
  persist: true,
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot))
}
