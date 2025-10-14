<script setup lang="ts">
import type { ParsedQuery } from '~/plugins/queryParams'
import { onKeyStroke, useFocus } from '@vueuse/core'
import { parseQueryValue, queriesToSelectors } from '~/plugins/queryParams'
import { useStore } from '~/stores/selector'

const input = ref('')
const target = ref<HTMLInputElement>()
const { focused } = useFocus(target)
const { toggleSelector } = useStore()

/**
 * Parse search input to detect attribute-based queries vs freeform text
 * @param searchInput - The search input string
 * @returns Array of parsed queries
 */
const parseSearchInput = (searchInput: string) => {
  const queries: ParsedQuery[] = []

  // Check if input contains attribute-based queries (contains ':(')
  if (searchInput.includes(':(')) {
    // Split by '&' to handle multiple queries
    const parts = searchInput.split('&')

    parts.forEach((part) => {
      const trimmed = part.trim()
      if (trimmed === '') return
      const parsed = parseQueryValue(trimmed)
      if (parsed) {
        queries.push(parsed)
      }
    })
  }
  else {
    // Treat as freeform search
    queries.push({
      field: 'search',
      value: searchInput,
    })
  }

  return queries
}

const onSearch = () => {
  if (!input.value.trim()) return

  const queries = parseSearchInput(input.value)
  const newSelectors = queriesToSelectors(queries)

  // Add new selectors to existing ones
  newSelectors.forEach((selector) => {
    toggleSelector(selector)
  })

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
      icon-btn
      class="absolute top-0 right-0 h-full pr-1"
      @click="onSearch"
    >
      <div class="i-fa6-solid:magnifying-glass" />
    </button>
  </div>
</template>
