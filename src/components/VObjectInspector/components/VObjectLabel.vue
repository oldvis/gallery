<script setup lang="ts">
import VObjectPreview from './VObjectPreview.vue'
import VObjectValue from './VObjectValue.vue'

const { data, name, isNonEnumerable } = defineProps({
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
  /** Whether the variable is non-enumerable. */
  isNonEnumerable: {
    type: Boolean as PropType<boolean>,
    required: true,
  },
})
</script>

<template>
  <span :title="name">
    <span
      v-if="typeof name === 'string'"
      class="object-name" :class="[isNonEnumerable ? 'object-name-dimmed' : '']"
    >{{ name }}</span>
    <VObjectPreview
      v-else
      :data="name"
    />
    <span>: </span>
    <VObjectValue :object="data" />
  </span>
</template>
