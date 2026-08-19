<script setup lang="ts">
import type { Visualization } from '~/plugins/visualization'
import { storeToRefs } from 'pinia'
import { useStore as useSelectorStore } from '~/stores/selector'
import { useStore as useVisStore } from '~/stores/visualization'

const PAGE_SIZE = 20

/** Largest valid startIndex (multiple of pageSize) that still shows items. */
const maxStartIndex = (total: number, pageSize: number): number => {
  if (total <= 0) return 0
  return Math.floor((total - 1) / pageSize) * pageSize
}

/**
 * Segment-style position label for the current window.
 * @param startIndex 0-based index of first shown item
 * @param pageSize window size
 * @param total matched length
 */
const formatEntriesPosition = (
  startIndex: number,
  pageSize: number,
  total: number,
): string => {
  if (total === 0) return '0 / 0'
  const from = startIndex + 1
  const to = Math.min(startIndex + pageSize, total)
  if (from === to) return `${from} / ${total}`
  return `${from}–${to} / ${total}`
}

const { visualizations } = storeToRefs(useVisStore())
const selectorStore = useSelectorStore()
const { selectors } = storeToRefs(selectorStore)

const matched = ref<Visualization[]>([])
const isLoading = ref(false)
const startIndex = ref(0)
const listEl = ref<HTMLDivElement | null>(null)

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

/** Reset to first page when the matched set changes. */
watch(
  () => matched.value.map((d) => d.uuid).join('\0'),
  () => {
    startIndex.value = 0
  },
)

const shown = computed(() => (
  matched.value.slice(startIndex.value, startIndex.value + PAGE_SIZE)
))

const positionLabel = computed(() => (
  formatEntriesPosition(startIndex.value, PAGE_SIZE, matched.value.length)
))

const canPrev = computed(() => startIndex.value > 0)
const canNext = computed(() => (
  startIndex.value + PAGE_SIZE < matched.value.length
))

const scrollListToTop = (): void => {
  if (listEl.value !== null) listEl.value.scrollTop = 0
}

const showPrevious = (): void => {
  startIndex.value = Math.max(0, startIndex.value - PAGE_SIZE)
  scrollListToTop()
}

const showNext = (): void => {
  startIndex.value = Math.min(
    maxStartIndex(matched.value.length, PAGE_SIZE),
    startIndex.value + PAGE_SIZE,
  )
  scrollListToTop()
}
</script>

<template>
  <div
    view-container
    data-testid="gallery-entries"
  >
    <div
      data-testid="entries-stats"
      view-header
    >
      <div class="i-fa6-solid:images text-gray-500 shrink-0" />
      <div strip-label>
        Entries
      </div>
      <div class="grow" />
      <div class="strip-meta flex flex-wrap gap-x-1.5 gap-y-1 items-center">
        <template v-if="selectors.length !== 0">
          <span>
            <span
              strip-meta-em
              data-testid="matched-count"
            >{{ matched.length }}</span>
            matched
          </span>
          <span
            strip-sep
            aria-hidden="true"
          >·</span>
        </template>
        <span>
          <span
            strip-meta-em
            data-testid="entries-count"
          >{{ visualizations.length }}</span>
          entries
        </span>
      </div>
    </div>
    <div
      v-if="isLoading"
      class="m-auto text-sm text-gray-500 p-3 dark:text-gray-400"
    >
      Searching…
    </div>
    <div
      v-else-if="shown.length !== 0"
      class="min-h-0 flex flex-col grow overflow-hidden"
    >
      <div
        ref="listEl"
        class="min-h-0 grow overflow-auto divide-y divide-gray-200 dark:divide-gray-700"
      >
        <VDataEntry
          v-for="(d, i) in shown"
          :key="d.uuid"
          :datum="d"
          :index="startIndex + i + 1"
        />
      </div>
      <div class="status-strip border-t border-gray-200 shrink-0 dark:border-gray-700">
        <div class="flex flex-wrap gap-1 items-center">
          <button
            type="button"
            btn-secondary
            data-testid="entries-previous"
            title="Show previous 20 entries"
            :disabled="!canPrev"
            @click="showPrevious"
          >
            Previous
          </button>
          <button
            type="button"
            btn-secondary
            data-testid="entries-next"
            title="Show next 20 entries"
            :disabled="!canNext"
            @click="showNext"
          >
            Next
          </button>
        </div>
        <span
          class="strip-meta ml-auto"
          data-testid="entries-position"
        >{{ positionLabel }}</span>
      </div>
    </div>
    <div
      v-else
      class="m-auto text-sm text-gray-500 p-3 dark:text-gray-400"
    >
      No entries matched
    </div>
  </div>
</template>
