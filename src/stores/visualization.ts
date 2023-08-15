import { acceptHMRUpdate, defineStore } from 'pinia'
import { visualizations } from '~/plugins/visualization'

const getFrequencies = (
  values: string[],
): Record<string, number> => {
  const frequencies: Record<string, number> = {}
  values.forEach((d) => {
    frequencies[d] = d in frequencies ? frequencies[d] += 1 : 1
  })
  return frequencies
}

export const useStore = defineStore('visualizations', {
  state: () => ({ visualizations }),
  getters: {
    tagFrequencies: (state): Record<string, number> => {
      return getFrequencies(([] as string[])
        .concat(...state.visualizations.map((d) => d.tags)))
    },
    tags(): string[] {
      return Object.keys(this.tagFrequencies)
    },
    authorFrequencies: (state): Record<string, number> => {
      return getFrequencies(([] as string[])
        .concat(...state.visualizations.map((d) => d.authors ?? [])))
    },
    authors(): string[] {
      return Object.keys(this.authorFrequencies)
    },
    languageFrequencies: (state): Record<string, number> => {
      return getFrequencies(([] as string[])
        .concat(...state.visualizations.map((d) => d.languages)))
    },
    languages(): string[] {
      return Object.keys(this.languageFrequencies)
    },
    sourceFrequencies: (state): Record<string, number> => {
      return getFrequencies(state.visualizations.map((d) => d.source.name))
    },
    sources(): string[] {
      return Object.keys(this.sourceFrequencies)
    },
  },
  persist: true,
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot))
}
