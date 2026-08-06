<script setup lang="ts">
const dialog = ref(false)
</script>

<template>
  <VDialog :dialog="dialog">
    <template #activator>
      <button
        type="button"
        btn-secondary
        @click="dialog = !dialog"
      >
        About
      </button>
    </template>
    <template #default>
      <div
        dialog-panel
        class="w-96 max-w-[calc(100vw-2rem)]"
        role="dialog"
        aria-labelledby="about-title"
      >
        <div class="status-strip border-b border-gray-200 dark:border-gray-700">
          <div
            id="about-title"
            strip-label
          >
            About
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
        <div dialog-body class="text-sm text-gray-700 dark:text-gray-200 space-y-3">
          <p>
            This website is a gallery of old visualizations.
            The old visualizations are collected from multiple data sources.
            The copyright of the images belongs to their corresponding owners as shown in the metadata.
            You are welcome to contribute to this gallery in the
            <a
              class="text-teal-700 hover:underline dark:text-teal-300"
              target="_blank"
              href="https://github.com/oldvis/gallery"
            >GitHub repository</a>.
          </p>
          <p>
            Temporal, tags, authors, and languages metadata may be incomplete, noisy, or inferred.
            Treat these fields as approximate guides for browsing, not as authoritative catalog records.
          </p>
        </div>
        <div class="status-strip border-t border-gray-200 dark:border-gray-700 justify-end">
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
