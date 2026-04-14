<script setup lang="ts">
import isEqual from 'lodash/isEqual'
import { storeToRefs } from 'pinia'
import { selectorsToRouteQuery } from '~/plugins/queryParams'
import { useStore } from '~/stores/selector'
import { useStore as useVisualizationStore } from '~/stores/visualization'

const selectorStore = useStore()
const { selectors } = storeToRefs(selectorStore)
const { initializeFromQuery } = selectorStore

const visualizationStore = useVisualizationStore()
const { initialized, isLoading } = storeToRefs(visualizationStore)

const route = useRoute()
const router = useRouter()

// Initialize selectors from URL query parameters on mount
onMounted(() => {
  // Use URLSearchParams directly from the browser URL
  const queryParams = new URLSearchParams(window.location.search)
  initializeFromQuery(queryParams)
})

// Watch for selector changes and update URL
watch(selectors, () => {
  // Convert selectors to individual query parameters for clean URLs
  // Format: ?authors:(william playfair)&tags:(interactive)&search=population
  const newQueryParams = selectorsToRouteQuery(selectors.value)

  // Check if the query parameters have changed
  const currentParams = { ...route.query }
  const hasChanged = !isEqual(newQueryParams, currentParams)

  if (hasChanged) {
    if (Object.keys(newQueryParams).length > 0) {
      router.replace({ query: newQueryParams })
    }
    else {
      router.replace({ query: {} })
    }
  }
}, { deep: true })
</script>

<template>
  <div
    v-if="isLoading || !initialized"
    class="m-auto text-xl flex gap-2"
  >
    Loading
    <div i-fa6-solid:spinner animate-spin />
  </div>
  <template v-else>
    <TheViewSelectors m="x-1 t-1" />
    <div
      class="m-1 gap-1 overflow-auto"
      flex="~ col sm:row"
    >
      <div
        class="gap-1 flex-1 min-h-50"
        display="none sm:flex"
        flex="~ col"
      >
        <TheViewTime class="basis-1/4" />
        <div
          class="col-span-2 overflow-auto basis-3/4 gap-1"
          grid="~ cols-2"
        >
          <TheViewListTags />
          <TheViewListAuthors />
          <TheViewListLanguages />
          <TheViewListSources />
        </div>
      </div>
      <TheViewEntries class="flex-1" />
    </div>
  </template>
</template>
