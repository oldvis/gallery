<script setup lang="ts">
import type { Visualization } from '~/plugins/visualization'
import { storeToRefs } from 'pinia'
import { useStore as useSelectorStore } from '~/stores/selector'
import { useStore as useVisStore } from '~/stores/visualization'

const { visualizations } = storeToRefs(useVisStore())
/** The number of shown visualizations. */
const showFirst = ref(20)
/** Show n more entries. */
const showMore = (n: number): void => {
  showFirst.value += n
}

const selectorStore = useSelectorStore()
const { selectors } = storeToRefs(selectorStore)

/** The visualizations that match the selectors. */
const matched = ref<Visualization[]>([])
const isLoading = ref(false)

/** Update matched results when selectors or visualizations change */
watch([selectors, visualizations], async () => {
  isLoading.value = true
  try {
    matched.value = await selectorStore.applySelectors(visualizations.value)
  }
  catch (error) {
    console.error('Error applying selectors:', error)
    matched.value = []
  }
  finally {
    isLoading.value = false
  }
}, { immediate: true, deep: true })

/** The visualizations that should be shown. */
const shown = computed(() => (
  matched.value.filter((_, i) => i < showFirst.value)
))
</script>

<template>
  <div view-container>
    <div view-header>
      <div class="i-fa6-solid:table m-auto" />
      <div class="font-bold">
        Entries
      </div>
      <div class="grow" />
      <div
        v-if="selectors.length !== 0"
        class="flex pr-4"
      >
        #matched:&nbsp;
        <div class="font-bold">
          {{ matched.length }}
        </div>
      </div>
      <div class="flex">
        #entries:&nbsp;
        <div class="font-bold">
          {{ visualizations.length }}
        </div>
      </div>
    </div>
    <div
      v-if="isLoading"
      class="m-auto text-xl"
    >
      Searching...
    </div>
    <div
      v-else-if="shown.length !== 0"
      class="overflow-auto"
    >
      <VDataEntry
        v-for="(d, i) in shown"
        :key="d.uuid"
        class="m-1"
        :datum="d"
        :index="i + 1"
      />
      <button
        v-if="matched.length > shown.length"
        btn
        m="b-1 x-1"
        title="Show 20 more entries"
        @click="showMore(20)"
      >
        show 20 more entries
      </button>
    </div>
    <div
      v-else
      class="m-auto text-xl"
    >
      No Entries Matched
    </div>
  </div>
</template>
