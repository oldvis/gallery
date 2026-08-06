<script setup lang="ts">
interface Datum {
  label?: string
  content: string
  frequency: number
  selected?: boolean
}

const props = defineProps({
  data: {
    type: Array as PropType<Datum[]>,
    required: true,
  },
})
const emit = defineEmits<{
  (e: 'clickDatum', d: Datum): void
}>()

const { data } = toRefs(props)
const dataSorted = computed(() => (
  [...data.value].sort((a, b) => (b.frequency - a.frequency))
))
</script>

<template>
  <div class="px-2 pb-2 pt-1 text-sm leading-relaxed">
    <button
      v-for="(d, i) in dataSorted"
      :key="i"
      type="button"
      class="mr-2 inline-block text-left text-gray-700 opacity-75 transition hover:opacity-100 hover:text-teal-600 dark:text-gray-200"
      @click="emit('clickDatum', d)"
    >
      <span :class="{ underline: d.selected === true }">{{ d.label ?? d.content }}</span> ({{ d.frequency }})
    </button>
  </div>
</template>
