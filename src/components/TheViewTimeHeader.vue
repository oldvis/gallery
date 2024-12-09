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
    <div class="i-fa6-solid:info" />
    <div class="font-bold">
      Temporal
    </div>
    <div class="flex ml-auto">
      <div class="my-auto">
        bin size:&nbsp;
      </div>
      <input
        v-model="binStep"
        input-area
        type="number"
        min="1"
        max="1000"
        class="w-15 text-xs"
      >
      <div class="my-auto">
        &nbsp;years
      </div>
    </div>
    <div border="r gray-200" />
    <div class="text-sm my-auto flex">
      year range:&nbsp;
      <div class="font-bold">
        [{{ minYear }}, {{ maxYear }}]
      </div>
      <div
        v-if="nNull !== 0"
        icon-btn
        class="flex pl-1"
        @click="toggleEqualSelector('publishDate', null)"
      >
        (#unknown:&nbsp;
        <div class="font-bold">
          {{ nNull }}
        </div>
        )
      </div>
    </div>
  </div>
</template>
