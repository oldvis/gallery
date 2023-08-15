<script setup lang="ts">
const dialog = ref(false)
</script>

<template>
  <VDialog :dialog="dialog">
    <template #activator>
      <button
        icon-btn
        @click="dialog = !dialog"
      >
        About
      </button>
    </template>
    <template #default>
      <div
        class="rounded shadow max-w-md p-4"
        bg="white dark:gray-700"
      >
        <div class="flex">
          <div class="text-xl font-bold">
            About This Website
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
        <div class="pt-2">
          This website is a gallery of old visualizations.
          The old visualizations are collected from multiple data sources.
          The copyright of the images belongs to their corresponding owners as shown in the metadata.
        </div>
      </div>
    </template>
  </VDialog>
</template>
