<script setup lang="ts">
const { dialog } = defineProps<{ dialog: boolean }>()
</script>

<template>
  <slot name="activator" />
  <Teleport to="body">
    <div
      v-if="dialog"
      dialog-backdrop
    >
      <slot />
    </div>
  </Teleport>
</template>
