<script lang="ts">
import { defineComponent, inject } from 'vue'
import VObjectValue from './VObjectValue.vue'

const isSimpleType = (object: unknown): boolean => (
  typeof object !== 'object'
    || object === null
    || object instanceof Date
    || object instanceof RegExp
)

export default defineComponent({
  name: 'VObjectPreview',
  components: { VObjectValue },
  props: {
    data: {
      // Any type.
      type: null,
      required: true,
    },
  },
  setup() {
    // `provide` from top component `object-inspector`
    const objectMaxProperties: number = inject('objectMaxProperties', 5)
    const arrayMaxProperties: number = inject('arrayMaxProperties', 10)
    return {
      objectMaxProperties,
      arrayMaxProperties,
    }
  },
  computed: {
    object(): unknown {
      return this.data
    },
    isSimple(): boolean {
      return isSimpleType(this.object)
    },
    /** The name of object constructor. */
    className(): string {
      const { object } = this
      if (typeof object !== 'object' || object === null) return ''
      const { constructor } = object
      const constructorName = constructor ? constructor.name : 'Object'
      return constructorName === 'Object' ? '' : `${constructorName} `
    },
    /**
     * A slice of the object (which is an array) for preview.
     * If the object is not array, returns empty array.
     */
    previewArray(): unknown[] {
      const { object } = this
      if (!Array.isArray(object)) return []
      const arrayMaxProperties = this.arrayMaxProperties as number
      return object.slice(0, arrayMaxProperties)
    },
    /**
     * A slice of the object (which is an object) for preview.
     * If the object is not object, returns empty object.
     */
    previewObjectItems(): Record<string, unknown>[] {
      const { object } = this
      if (typeof object !== 'object' || object === null) return []
      const objectMaxProperties = this.objectMaxProperties as number
      let keys = Object.keys(object)
      if (keys.length > objectMaxProperties) {
        keys = keys.slice(0, objectMaxProperties)
      }
      return keys.map((k) => ({
        key: k,
        val: (object as Record<string, unknown>)[k],
      }))
    },
  },
})
</script>

<template>
  <span>
    <VObjectValue
      v-if="isSimple"
      :object="object"
    />
    <span v-else-if="Array.isArray(object)">
      <span
        class="object-preview-desc"
      >{{ object.length === 0 ? '' : `(${object.length})\xa0` }}</span>
      <span class="object-preview">
        <span>[</span>
        <span
          v-for="(item, index) of previewArray"
          :key="index"
        >
          <span v-if="index !== 0">, </span>
          <VObjectValue :object="item" />
          <span v-if="index === arrayMaxProperties - 1">, </span>
          <span v-if="index === arrayMaxProperties - 1">…</span>
        </span>
        <span>]</span>
      </span>
    </span>
    <span v-else>
      <span class="object-preview-desc">{{ className }}</span>
      <span class="object-preview">
        <span>{</span>
        <span
          v-for="(item, index) of previewObjectItems"
          :key="index"
        >
          <span v-if="index !== 0">, </span>
          <span class="object-name-preview">{{ item.key || '""' }}</span>:
          <VObjectValue :object="item.val" />
          <span v-if="index === objectMaxProperties - 1">…</span>
        </span>
        <span>}</span>
      </span>
    </span>
  </span>
</template>
