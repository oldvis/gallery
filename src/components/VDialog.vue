<script setup lang="ts">
const { dialog } = defineProps<{ dialog: boolean }>()
</script>

<template>
  <slot name="activator" />
  <Teleport to="body">
    <div
      v-if="dialog"
      class="fixed inset-0 w-full h-full flex z-1"
      bg="gray opacity-50"
    >
      <div class="m-auto">
        <slot>
          <div
            class="rounded shadow"
            bg="white dark:gray-700"
          />
        </slot>
      </div>
    </div>
  </Teleport>
</template>
