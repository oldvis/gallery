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
