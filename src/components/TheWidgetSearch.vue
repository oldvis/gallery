<script setup lang="ts">
import { onKeyStroke, useFocus } from '@vueuse/core'
import { useStore } from '~/stores/selector'

const input = ref('')
const target = ref<HTMLInputElement>()
const { focused } = useFocus(target)
const { addSearchSelector } = useStore()
const onSearch = () => {
  addSearchSelector(input.value)
  input.value = ''
}
onKeyStroke('Enter', () => {
  if (!focused.value) return
  onSearch()
})
</script>

<template>
  <div class="relative flex">
    <input
      ref="target"
      v-model="input"
      input-area
      type="text"
      class="my-1 w-full text-sm pr-6"
      placeholder="Search"
      required
    >
    <button
      type="submit"
      icon-btn
      class="absolute top-0 right-0 h-full pr-1"
      @click="onSearch"
    >
      <div class="i-fa6-solid:magnifying-glass" />
    </button>
  </div>
</template>
