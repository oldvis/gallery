<script setup lang="ts">
interface Datum {
  label?: string
  content: string
  frequency: number
  selected?: boolean
}

const { data } = defineProps({
  data: {
    type: Array as PropType<Datum[]>,
    required: true,
  },
})
const emit = defineEmits<{
  (e: 'clickDatum', d: Datum): void
}>()

const dataSorted = computed(() => (
  [...data].sort((a, b) => (b.frequency - a.frequency))
))
</script>

<template>
  <div p="b-2">
    <div
      v-for="(d, i) in dataSorted"
      :key="i"
      icon-btn
      p="x-2 t-1"
      @click="emit('clickDatum', d)"
    >
      <span :class="{ underline: d.selected === true }">
        {{ d.label ?? d.content }}
      </span>
      <span>
        ({{ d.frequency }})
      </span>
    </div>
  </div>
</template>
