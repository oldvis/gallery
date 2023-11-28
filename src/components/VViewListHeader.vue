<script setup lang="ts">
defineProps<{
  title: string
  field: string
  count: number
}>()
</script>

<template>
  <div view-header>
    <div class="i-fa6-solid:info" />
    <div class="font-bold">
      {{ title }}
    </div>
    <div class="flex ml-auto">
      #{{ field }}:&nbsp;
      <div class="font-bold">
        {{ count }}
      </div>
    </div>
  </div>
</template>
