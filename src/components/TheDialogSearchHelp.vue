<script setup lang="ts">
const dialog = ref(false)
</script>

<template>
  <VDialog :dialog="dialog">
    <template #activator>
      <button
        icon-btn
        title="Search Help"
        @click="dialog = !dialog"
      >
        <div class="i-fa6-solid:circle-question" />
      </button>
    </template>
    <template #default>
      <div
        class="rounded shadow max-w-lg max-h-[80vh] flex flex-col"
        bg="white dark:gray-700"
      >
        <div class="flex p-4 pb-0">
          <div class="text-xl font-bold">
            Search Syntax Help
          </div>
          <button
            icon-btn
            class="ml-auto"
            title="Close"
            @click="dialog = false"
          >
            <div class="i-fa6-solid:xmark" />
          </button>
        </div>
        <div class="flex-1 overflow-y-auto p-4 pt-4 space-y-4 text-sm">
          <div>
            <h3 class="text-lg font-semibold mb-2">
              Freeform Search
            </h3>
            <p class="mb-2">
              Search across multiple metadata fields.
            </p>
            <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">
              Example:
            </div>
            <div class="bg-gray-100 dark:bg-gray-600 p-2 rounded font-mono text-xs">
              Neurath, Otto
            </div>
          </div>

          <hr class="border-gray-300 dark:border-gray-600">

          <div>
            <h3 class="text-lg font-semibold mb-2">
              Field-Specific Search
            </h3>
            <p class="mb-2">
              Search specific metadata fields using the format <code>{{ '<field>:(<value>)' }}</code>.
              Valid fields: <code>uuid</code>, <code>authors</code>, <code>displayName</code>, <code>viewUrl</code>, <code>downloadUrl</code>, <code>md5</code>, <code>phash</code>, <code>languages</code>, <code>tags</code>, <code>abstract</code>, <code>rights</code>, <code>source.name</code>, <code>source.url</code>, <code>source.accessDate</code>.
            </p>

            <div class="space-y-3">
              <div>
                <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Example: search by authors
                </div>
                <div class="bg-gray-100 dark:bg-gray-600 p-2 rounded font-mono text-xs">
                  authors:(Playfair, William)
                </div>
              </div>

              <div>
                <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Example: search by tags
                </div>
                <div class="bg-gray-100 dark:bg-gray-600 p-2 rounded font-mono text-xs">
                  tags:(interactive)
                </div>
              </div>

              <div>
                <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Example: search by languages
                </div>
                <div class="bg-gray-100 dark:bg-gray-600 p-2 rounded font-mono text-xs">
                  languages:(English)
                </div>
              </div>

              <div>
                <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Example: search by source name
                </div>
                <div class="bg-gray-100 dark:bg-gray-600 p-2 rounded font-mono text-xs">
                  source.name:(Internet Archive)
                </div>
              </div>
            </div>
          </div>

          <hr class="border-gray-300 dark:border-gray-600">

          <div>
            <h3 class="text-lg font-semibold mb-2">
              Image Semantic Search
            </h3>
            <p class="mb-2">
              Search for visualizations by describing image content using the format <code>{{ 'image:(<description>)' }}</code> or <code>{{ 'image:(<description>|topk:<N>)' }}</code>.
            </p>
            <div class="space-y-3">
              <div>
                <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Example: search by image content
                </div>
                <div class="bg-gray-100 dark:bg-gray-600 p-2 rounded font-mono text-xs">
                  image:(bar chart)
                </div>
              </div>

              <div>
                <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Example: search by image content with a custom number of results
                </div>
                <div class="bg-gray-100 dark:bg-gray-600 p-2 rounded font-mono text-xs">
                  image:(line chart|topk:20)
                </div>
                <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Returns the top 20 most similar visualizations (default is 50).
                </p>
              </div>
            </div>
          </div>

          <hr class="border-gray-300 dark:border-gray-600">

          <div>
            <h3 class="text-lg font-semibold mb-2">
              Multi-Criteria Queries
            </h3>
            <p class="mb-2">
              Combine multiple search criteria using <code>"&"</code>. Results must match all criteria (AND operation).
            </p>
            <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">
              Example:
            </div>
            <div class="bg-gray-100 dark:bg-gray-600 p-2 rounded font-mono text-xs">
              authors:(Playfair)&source.name:(Internet Archive)
            </div>
          </div>

          <hr class="border-gray-300 dark:border-gray-600">

          <div>
            <h3 class="text-lg font-semibold mb-2">
              Notes
            </h3>
            <ul class="list-disc list-inside space-y-1 text-xs text-gray-600 dark:text-gray-400">
              <li>Image semantic search uses the CLIP model.</li>
              <li>Field names are case-sensitive.</li>
            </ul>
          </div>
        </div>
      </div>
    </template>
  </VDialog>
</template>
