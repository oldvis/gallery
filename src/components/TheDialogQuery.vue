<script setup lang="ts">
import type { QueryDraftRow, QueryDraftType } from '~/plugins/queryDraft'
import VMenuSelect from '~/components/VMenuSelect.vue'
import {
  applyQueryDrafts,
  createEmptyFieldRow,
  validateQueryDrafts,
} from '~/plugins/queryDraft'
import { QUERY_FIELDS } from '~/plugins/queryFields'
import { useStore } from '~/stores/selector'

const dialog = ref(false)
const error = ref<string | null>(null)
const rows = ref<QueryDraftRow[]>([createEmptyFieldRow()])
const store = useStore()

const typeOptions = [
  { value: 'field', label: 'Field match' },
  { value: 'search', label: 'Keyword search' },
  { value: 'image', label: 'Image search' },
  { value: 'year', label: 'Year range' },
] as const

const fieldOptions = QUERY_FIELDS.map((field) => ({ value: field, label: field }))

const resetDraft = (): void => {
  rows.value = [createEmptyFieldRow()]
  error.value = null
}

const open = (): void => {
  resetDraft()
  dialog.value = true
}

const close = (): void => {
  dialog.value = false
  resetDraft()
}

const addRow = (): void => {
  rows.value.push(createEmptyFieldRow())
}

const removeRow = (id: string): void => {
  if (rows.value.length === 1) {
    rows.value = [createEmptyFieldRow()]
    return
  }
  rows.value = rows.value.filter((r) => r.id !== id)
}

const setRowType = (id: string, type: QueryDraftType): void => {
  const idx = rows.value.findIndex((r) => r.id === id)
  if (idx < 0) return
  if (type === 'field') {
    rows.value[idx] = { id, type: 'field', field: QUERY_FIELDS[0], value: '' }
  }
  else if (type === 'search') {
    rows.value[idx] = { id, type: 'search', pattern: '' }
  }
  else if (type === 'image') {
    rows.value[idx] = { id, type: 'image', description: '', topK: '50' }
  }
  else {
    rows.value[idx] = { id, type: 'year', from: '', to: '' }
  }
}

const onApply = (): void => {
  const result = validateQueryDrafts(rows.value)
  if (!result.ok) {
    error.value = result.error
    return
  }
  applyQueryDrafts(store, result.actions)
  close()
}
</script>

<template>
  <VDialog :dialog="dialog">
    <template #activator>
      <button
        type="button"
        btn-secondary
        data-testid="query-open"
        title="Build advanced filters — separate from Search…"
        @click="open"
      >
        Advanced
      </button>
    </template>
    <template #default>
      <div
        dialog-panel
        class="w-[32rem] max-w-[calc(100vw-2rem)] max-h-[80vh] flex flex-col overflow-visible!"
        role="dialog"
        aria-labelledby="query-title"
      >
        <div class="strip border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div
            id="query-title"
            strip-label
          >
            Advanced filters
          </div>
          <button
            type="button"
            icon-btn
            class="ml-auto"
            title="Close"
            @click="close"
          >
            <div class="i-fa6-solid:xmark" />
          </button>
        </div>

        <div
          dialog-body
          class="flex-1 overflow-y-auto overflow-x-visible gap-2"
        >
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Add filters below, then Apply. If you add several, the gallery shows only
            images that match all of them. For plain text, close this and type in
            <span class="font-medium text-gray-600 dark:text-gray-300">Search…</span>
            instead.
          </p>

          <div
            v-for="row in rows"
            :key="row.id"
            class="flex flex-col gap-1"
          >
            <div class="flex flex-wrap gap-1.5 items-center">
              <VMenuSelect
                :model-value="row.type"
                :options="typeOptions"
                test-id="query-row-type"
                @update:model-value="setRowType(row.id, $event)"
              />

              <template v-if="row.type === 'field'">
                <VMenuSelect
                  :model-value="row.field"
                  :options="fieldOptions"
                  test-id="query-row-field"
                  @update:model-value="row.field = $event"
                />
                <input
                  v-model="row.value"
                  data-testid="query-row-value"
                  strip-input
                  class="min-w-0 flex-1"
                  type="text"
                  placeholder="Exact value"
                >
              </template>

              <template v-else-if="row.type === 'search'">
                <input
                  v-model="row.pattern"
                  strip-input
                  class="min-w-0 flex-1"
                  type="text"
                  placeholder="Keywords across metadata"
                >
              </template>

              <template v-else-if="row.type === 'image'">
                <input
                  v-model="row.description"
                  strip-input
                  class="min-w-0 flex-1"
                  type="text"
                  placeholder="Describe the image"
                >
                <label class="flex items-center gap-1 shrink-0 text-xs text-gray-500 dark:text-gray-400">
                  <span class="whitespace-nowrap">Top-K</span>
                  <input
                    v-model="row.topK"
                    strip-input
                    class="w-14"
                    type="text"
                    inputmode="numeric"
                    title="How many closest image matches to keep"
                    placeholder="50"
                  >
                </label>
              </template>

              <template v-else>
                <label class="flex items-center gap-1 shrink-0 text-xs text-gray-500 dark:text-gray-400">
                  <span>After</span>
                  <input
                    v-model="row.from"
                    strip-input
                    class="w-20"
                    type="text"
                    inputmode="numeric"
                    placeholder="e.g. 1800"
                    title="Exclusive lower year bound"
                  >
                </label>
                <label class="flex items-center gap-1 shrink-0 text-xs text-gray-500 dark:text-gray-400">
                  <span>through</span>
                  <input
                    v-model="row.to"
                    strip-input
                    class="w-20"
                    type="text"
                    inputmode="numeric"
                    placeholder="e.g. 1850"
                    title="Inclusive upper year bound"
                  >
                </label>
              </template>

              <button
                type="button"
                icon-btn
                title="Remove filter"
                @click="removeRow(row.id)"
              >
                <div class="i-fa6-solid:xmark" />
              </button>
            </div>
            <p
              v-if="row.type === 'image'"
              class="text-xs text-gray-400 pl-0.5 dark:text-gray-500"
            >
              Top-K is how many closest semantic matches to keep (default 50).
            </p>
            <p
              v-else-if="row.type === 'year'"
              class="text-xs text-gray-400 pl-0.5 dark:text-gray-500"
            >
              Years strictly after “After”, up to and including “through” — same as Temporal bars.
            </p>
          </div>

          <button
            type="button"
            btn-secondary
            class="self-start"
            @click="addRow"
          >
            Add filter
          </button>

          <p
            v-if="error !== null"
            class="text-sm text-red-600 dark:text-red-400"
            data-testid="query-error"
          >
            {{ error }}
          </p>
        </div>

        <div class="strip border-t border-gray-200 dark:border-gray-700 justify-end gap-1.5 shrink-0">
          <button
            type="button"
            btn-secondary
            data-testid="query-cancel"
            @click="close"
          >
            Cancel
          </button>
          <button
            type="button"
            btn
            data-testid="query-apply"
            @click="onApply"
          >
            Apply
          </button>
        </div>
      </div>
    </template>
  </VDialog>
</template>
