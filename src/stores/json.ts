import { acceptHMRUpdate, defineStore } from 'pinia'
import { validateInput } from '~/plugins/json'

export const useStore = defineStore('json', {
  state: () => ({ text: '' }),
  getters: {
    validationResult: (state) => validateInput(state.text),
    parsed(): object | null {
      return this.validationResult.parsed
    },
    validJson(): boolean {
      return this.validationResult.validJson
    },
    validVisualization(): boolean {
      return this.validationResult.validVisualization
    },
  },
  persist: true,
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot))
}
