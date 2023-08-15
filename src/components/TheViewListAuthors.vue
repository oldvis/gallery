<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useStore as useVisStore } from '~/stores/visualization'
import { useStore as useSelectorStore } from '~/stores/selector'

const fieldName = 'authors'
const selected = useSelected(fieldName)
const data = computed(() => (
  Object.entries(storeToRefs(useVisStore()).authorFrequencies.value)
    .map(([content, frequency]) => ({
      content,
      frequency,
      selected: selected.value.has(content),
    }))
))
const { toggleEqualSelector } = useSelectorStore()
</script>

<template>
  <div view-container>
    <VViewListHeader
      title="Authors"
      field="authors"
      :count="data.length"
    />
    <VTextFrequency
      class="overflow-auto"
      :data="data"
      @click-datum="toggleEqualSelector(fieldName, $event.content)"
    />
  </div>
</template>
