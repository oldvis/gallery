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
    && ('$gt' in Object.values(query)[0])
    && ('$lte' in Object.values(query)[0])
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
    return `'${(Object.values(query)[0]).$eq}' ∈ ${Object.keys(query)[0]}`
  }
  if (isRangeSelector.value) {
    const query = selector.value.query as Selector<SelectorType.Sift>['query']
    return `${Object.keys(query)[0]} ∈ (${(Object.values(query)[0]).$gt}, ${(Object.values(query)[0]).$lte}]`
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
  <div chip>
    <span class="whitespace-nowrap">{{ text }}</span>
    <button
      type="button"
      icon-btn
      title="Remove"
      data-testid="selector-remove"
      @click="emit('removeSelector', selector)"
    >
      <div class="i-fa6-solid:xmark m-auto" />
    </button>
  </div>
</template>
