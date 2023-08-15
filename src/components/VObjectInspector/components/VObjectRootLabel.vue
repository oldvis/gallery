<script setup lang="ts">
import VObjectPreview from './VObjectPreview.vue'

const { data, name } = defineProps({
  /** The JavaScript variable to inspect. */
  data: {
    // Any type.
    type: null,
    required: true,
  },
  /** The variable name. */
  name: {
    type: String as PropType<string>,
    default: null,
  },
})
</script>

<template>
  <span>
    <span v-if="typeof name === 'string'">
      <span class="object-name">{{ name }}</span>
      <span>: </span>
      <VObjectPreview :data="data" />
    </span>
    <VObjectPreview
      v-else
      :data="data"
    />
  </span>
</template>
