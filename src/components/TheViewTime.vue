<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useElementSize } from '@vueuse/core'
import { useStore as useVisStore } from '~/stores/visualization'
import { useStore as useSelectorStore } from '~/stores/selector'

const { visualizations } = storeToRefs(useVisStore())
const binStep = ref(50)
const years = computed(() => (
  visualizations.value.map((d) => d.publishDate)
    .filter((d) => d !== null) as number[]
))
const minYear = computed(() => Math.min(...years.value))
const maxYear = computed(() => Math.max(...years.value))
const nThresholds = computed(() => (
  Math.ceil((maxYear.value - minYear.value) / binStep.value)
))
const xDomain = computed((): [number, number] => ([
  binStep.value * Math.floor(minYear.value / binStep.value),
  binStep.value * Math.ceil(maxYear.value / binStep.value),
]))
const chartContainer = ref<HTMLDivElement>()
const { width, height } = useElementSize(chartContainer)
const { toggleRangeSelector } = useSelectorStore()
</script>

<template>
  <div view-container>
    <TheViewTimeHeader v-model="binStep" />
    <div
      ref="chartContainer"
      class="overflow-auto pr-1 flex-1 flex"
    >
      <VHistogram
        v-if="binStep >= 1 && binStep <= 1000"
        :data="years"
        :n-thresholds="nThresholds"
        :width="width"
        :height="height"
        :x-domain="xDomain"
        @click-bar="(d) => toggleRangeSelector('publishDate', d)"
      />
      <div
        v-else
        class="text-red m-auto"
      >
        Invalid Bin Size
      </div>
    </div>
  </div>
</template>
