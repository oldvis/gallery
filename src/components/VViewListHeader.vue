<script setup lang="ts">
defineProps<{
  title: string
  field: string
  count: number
}>()
</script>

<template>
  <div view-header>
    <div class="i-fa6-solid:info text-gray-500" />
    <div strip-label>
      {{ title }}
    </div>
    <div class="strip-meta flex ml-auto items-center gap-1">
      <span>{{ field }}</span>
      <span strip-strong>{{ count }}</span>
    </div>
  </div>
</template>
