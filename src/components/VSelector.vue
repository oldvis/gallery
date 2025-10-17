<script setup lang="ts">
import type { Selector } from '~/stores/selector'
import { SelectorType } from '~/stores/selector'

const props = defineProps({
  selector: {
    type: Object as PropType<Selector>,
    required: true,
  },
})
const emit = defineEmits<{
  (e: 'removeSelector', d: Selector<SelectorType>): void
}>()

const { selector } = toRefs(props)

const isEqualSelector = computed(() => {
  if (selector.value.type !== SelectorType.Sift) return false
  const { query } = selector.value as Selector<SelectorType.Sift>
  return (Object.values(query).length === 1)
    && ('$eq' in Object.values(query)[0])
})
const isRangeSelector = computed(() => {
  if (selector.value.type !== SelectorType.Sift) return false
  const { query } = selector.value as Selector<SelectorType.Sift>
  return (Object.values(query).length === 1)
    && ('$gte' in Object.values(query)[0])
    && ('$lt' in Object.values(query)[0])
})
const isSearchSelector = computed(() => (
  selector.value.type === SelectorType.Fuse
))
const isImageSelector = computed(() => (
  selector.value.type === SelectorType.Image
))
const text = computed(() => {
  if (isEqualSelector.value) {
    const query = selector.value.query as Selector<SelectorType.Sift>['query']
    return `
      '${(Object.values(query)[0]).$eq}'
      ∈ ${Object.keys(query)[0]}
    `
  }
  if (isRangeSelector.value) {
    const query = selector.value.query as Selector<SelectorType.Sift>['query']
    return `
      ${Object.keys(query)[0]}
      ∈ [${(Object.values(query)[0]).$gte},
      ${(Object.values(query)[0]).$lt})
    `
  }
  if (isSearchSelector.value) {
    return `search: '${(selector.value as Selector<SelectorType.Fuse>).query.pattern}'`
  }
  if (isImageSelector.value) {
    return `image: '${(selector.value as Selector<SelectorType.Image>).query.query}' (topK=${(selector.value as Selector<SelectorType.Image>).query.topK})`
  }
  throw new Error('Invalid selector type')
})
</script>

<template>
  <div class="border flex gap-1 px-1">
    {{ text }}
    <button
      icon-btn
      title="Remove"
      @click="emit('removeSelector', selector)"
    >
      <div class="i-fa6-solid:xmark m-auto" />
    </button>
  </div>
</template>
