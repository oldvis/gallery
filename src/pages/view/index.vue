<script setup lang="ts">
import { isEqual } from 'lodash'
import { storeToRefs } from 'pinia'
import { selectorsToRouteQuery } from '~/plugins/queryParams'
import { useStore } from '~/stores/selector'

const selectorStore = useStore()
const { selectors } = storeToRefs(selectorStore)
const { initializeFromQuery } = selectorStore

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
  <TheViewSelectors m="x-1 t-1" />
  <div class="m-1 gap-1 overflow-auto flex">
    <div
      class="gap-1 flex-1"
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
