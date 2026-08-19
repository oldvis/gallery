<script setup lang="ts">
import { storeToRefs } from 'pinia'
import TheDialogQuery from '~/components/TheDialogQuery.vue'
import { useStore } from '~/stores/selector'

const store = useStore()
const { selectors } = storeToRefs(store)
const { removeSelector } = store
</script>

<template>
  <!--
    Override strip flex-wrap: chips must scroll inside a width-bounded
    flex child (basis-0), not expand the page or wrap under Temporal/Entries.
  -->
  <div
    strip
    class="flex-nowrap! border-b border-gray-200 dark:border-gray-700"
  >
    <div class="flex shrink-0 gap-1.5 items-center">
      <div class="i-fa6-solid:filter text-gray-500 my-auto" />
      <div strip-label>
        Selectors
      </div>
    </div>
    <div
      class="flex flex-1 basis-0 min-w-0 items-center gap-1.5 overflow-x-auto overflow-y-hidden py-0.5"
      data-testid="selectors-chips"
    >
      <template v-if="selectors.length === 0">
        <div class="strip-meta px-1 shrink-0">
          No filters
        </div>
      </template>
      <template
        v-for="(selector, i) in selectors"
        :key="selector.uuid"
      >
        <span
          v-if="i !== 0"
          class="strip-meta text-gray-400 shrink-0"
          title="AND"
          aria-hidden="true"
        >∩</span>
        <VSelector
          :selector="selector"
          class="shrink-0"
          @remove-selector="removeSelector(selector.uuid)"
        />
      </template>
    </div>
    <div class="flex shrink-0 gap-1 items-center">
      <TheWidgetSearch class="shrink-0" />
      <TheDialogQuery />
      <TheDialogSearchHelp />
    </div>
  </div>
</template>
