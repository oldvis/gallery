<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useStore as useSelectorStore } from '~/stores/selector'
import { useStore as useVisStore } from '~/stores/visualization'

const binStep = defineModel({
  type: Number as PropType<number>,
})

const { visualizations } = storeToRefs(useVisStore())
const years = computed(() => (
  visualizations.value.map((d) => d.publishDate)
))
const nNull = computed(() => (
  years.value.filter((d) => d === null).length
))
const minYear = computed(() => (
  Math.min(...years.value.filter((d) => d !== null) as number[])
))
const maxYear = computed(() => (
  Math.max(...years.value.filter((d) => d !== null) as number[])
))

const { toggleEqualSelector } = useSelectorStore()
</script>

<template>
  <div view-header>
    <div class="i-fa6-solid:info text-gray-500" />
    <div strip-label>
      Temporal
    </div>
    <div class="strip-meta flex ml-auto flex-wrap gap-x-1.5 gap-y-1 items-center">
      <label class="flex gap-1 items-center">
        <span>Bin size</span>
        <input
          v-model="binStep"
          input-area
          type="number"
          min="1"
          max="1000"
          class="w-14"
          title="Bin size"
        >
        <span>years</span>
      </label>
      <span
        strip-sep
        aria-hidden="true"
      >·</span>
      <span>
        Year range
        <span strip-meta-em>[{{ minYear }}, {{ maxYear }}]</span>
      </span>
      <template v-if="nNull !== 0">
        <span
          strip-sep
          aria-hidden="true"
        >·</span>
        <button
          type="button"
          btn-ghost
          class="flex gap-0.5 items-center px-1!"
          title="Filter entries with unknown publish year"
          @click="toggleEqualSelector('publishDate', null)"
        >
          Unknown year
          <span strip-meta-em>({{ nNull }})</span>
        </button>
      </template>
    </div>
  </div>
</template>
