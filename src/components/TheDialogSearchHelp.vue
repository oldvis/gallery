<script setup lang="ts">
import { QUERY_FIELDS } from '~/plugins/queryFields'

const dialog = ref(false)
const fieldList = QUERY_FIELDS.join(', ')
</script>

<template>
  <VDialog :dialog="dialog">
    <template #activator>
      <button
        type="button"
        icon-btn
        title="Search help"
        @click="dialog = !dialog"
      >
        <div class="i-fa6-solid:circle-question" />
      </button>
    </template>
    <template #default>
      <div
        dialog-panel
        class="w-[32rem] max-w-[calc(100vw-2rem)] max-h-[80vh] flex flex-col"
        role="dialog"
        aria-labelledby="search-help-title"
      >
        <div class="status-strip border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div
            id="search-help-title"
            strip-label
          >
            Search help
          </div>
          <button
            type="button"
            icon-btn
            class="ml-auto"
            title="Close"
            @click="dialog = false"
          >
            <div class="i-fa6-solid:xmark" />
          </button>
        </div>
        <div
          dialog-body
          class="flex-1 overflow-y-auto space-y-4 text-sm !block"
        >
          <div>
            <h3 class="font-semibold mb-2">
              Freeform search
            </h3>
            <p class="mb-2">
              Search across multiple metadata fields.
            </p>
            <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">
              Example:
            </div>
            <div class="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs font-mono">
              Neurath, Otto
            </div>
          </div>

          <hr class="m-0 border-gray-200 dark:border-gray-700">

          <div class="pt-3">
            <h3 class="font-semibold mb-2">
              Field-specific search
            </h3>
            <p class="mb-2">
              Search specific metadata fields using the format <code>{{ '<field>:(<value>)' }}</code>.
              Valid fields: <code>{{ fieldList }}</code>.
            </p>

            <div class="space-y-3">
              <div>
                <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Example: search by authors
                </div>
                <div class="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs font-mono">
                  authors:(Playfair, William)
                </div>
              </div>

              <div>
                <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Example: search by tags
                </div>
                <div class="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs font-mono">
                  tags:(interactive)
                </div>
              </div>

              <div>
                <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Example: search by languages
                </div>
                <div class="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs font-mono">
                  languages:(English)
                </div>
              </div>

              <div>
                <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Example: search by source name
                </div>
                <div class="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs font-mono">
                  source.name:(Internet Archive)
                </div>
              </div>
            </div>
          </div>

          <hr class="m-0 border-gray-200 dark:border-gray-700">

          <div class="pt-3">
            <h3 class="font-semibold mb-2">
              Image semantic search
            </h3>
            <p class="mb-2">
              Search for visualizations by describing image content using the format <code>{{ 'image:(<description>)' }}</code> or <code>{{ 'image:(<description>|topk:<N>)' }}</code>.
            </p>
            <div class="space-y-3">
              <div>
                <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Example: search by image content
                </div>
                <div class="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs font-mono">
                  image:(bar chart)
                </div>
              </div>

              <div>
                <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Example: search by image content with a custom number of results
                </div>
                <div class="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs font-mono">
                  image:(line chart|topk:20)
                </div>
                <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Returns the top 20 most similar visualizations (default is 50).
                </p>
              </div>
            </div>
          </div>

          <hr class="m-0 border-gray-200 dark:border-gray-700">

          <div class="pt-3">
            <h3 class="font-semibold mb-2">
              Multi-criteria queries
            </h3>
            <p class="mb-2">
              Combine multiple search criteria using <code>"&"</code>. Results must match all criteria (AND operation).
            </p>
            <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">
              Example:
            </div>
            <div class="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs font-mono">
              authors:(Playfair)&source.name:(Internet Archive)
            </div>
          </div>

          <hr class="m-0 border-gray-200 dark:border-gray-700">

          <div class="pt-3">
            <h3 class="font-semibold mb-2">
              Notes
            </h3>
            <ul class="list-disc list-inside space-y-1 text-xs text-gray-600 dark:text-gray-400">
              <li>Image semantic search uses the CLIP model.</li>
              <li>Field names are case-sensitive.</li>
            </ul>
          </div>
        </div>
        <div class="status-strip border-t border-gray-200 dark:border-gray-700 justify-end shrink-0">
          <button
            type="button"
            btn-secondary
            @click="dialog = false"
          >
            Close
          </button>
        </div>
      </div>
    </template>
  </VDialog>
</template>
