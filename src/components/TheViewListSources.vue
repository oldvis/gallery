<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useStore as useSelectorStore } from '~/stores/selector'
import { useStore as useVisStore } from '~/stores/visualization'

const fieldName = 'source.name'
const selected = useSelected(fieldName)
const data = computed(() => (
  Object.entries(storeToRefs(useVisStore()).sourceFrequencies.value)
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
      title="Sources"
      field="sources"
      :count="data.length"
    />
    <VTextFrequency
      class="overflow-auto"
      :data="data"
      @click-datum="toggleEqualSelector(fieldName, $event.content)"
    />
  </div>
</template>
