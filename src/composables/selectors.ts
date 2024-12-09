import type { Selector } from '~/stores/selector'
import { storeToRefs } from 'pinia'
import { SelectorType, useStore as useSelectorStore } from '~/stores/selector'

/** Use the selected values for the given field. */
export const useSelected = (fieldName: string): ComputedRef<Set<string>> => {
  const { selectors } = storeToRefs(useSelectorStore())
  const selected = computed((): Set<string> => (
    new Set(selectors.value
      .filter((d) => {
        if (d.type !== SelectorType.Sift) return false
        const query = d.query as Selector<SelectorType.Sift>['query'] as Record<string, Record<string, unknown>>
        return (fieldName in query)
          && (query[fieldName] !== undefined && query[fieldName] !== null)
          && ('$eq' in query[fieldName])
      })
      .map((d) => (
        (d.query as Record<string, Record<'$eq', string>>)[fieldName].$eq
      )))
  ))
  return selected
}
