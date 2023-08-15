<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import { hasChildNodes } from '../utils/path'
import type { ObjectIterator } from '../utils/data'
import VTreeNode from './VTreeNode.vue'

export default defineComponent({
  name: 'VConnectedTreeNode',
  components: { VTreeNode },
  props: {
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
    /** A factory of object property iterators. */
    dataIterator: {
      type: Function as PropType<ObjectIterator>,
      required: true,
    },
    /**
     * The path of the variable.
     * (Root variable has path DEFAULT_ROOT_PATH)
     */
    path: {
      type: String as PropType<string>,
      required: true,
    },
    /**
     * The depth of the variable.
     * (Root variable has depth 0)
     */
    depth: {
      type: Number as PropType<number>,
      required: true,
    },
    /** Whether the variable is non-enumerable. */
    isNonEnumerable: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
    /** The list of paths currently expanded. */
    expandedPaths: {
      type: Object as PropType<Record<string, boolean>>,
      required: true,
    },
  },
  emits: {
    'update:expanded-paths': null,
  },
  computed: {
    /** Whether the variable has child nodes. */
    nodeHasChildNodes(): boolean {
      return hasChildNodes(this.data, this.dataIterator)
    },
    /** Whether the variable should be expanded. */
    expanded(): boolean {
      return !!this.expandedPaths[this.path]
    },
    /** The variable's child nodes. */
    children(): {
      name: unknown
      data: unknown
      isNonEnumerable: boolean
    }[] {
      return [...this.dataIterator(this.data)]
    },
  },
  methods: {
    onToggleExpand(): void {
      if (!this.nodeHasChildNodes) return
      this.$emit('update:expanded-paths', {
        path: this.path,
        val: !this.expanded,
      })
    },
  },
})
</script>

<template>
  <VTreeNode
    :name="name"
    :data="data"
    :depth="depth"
    :is-non-enumerable="isNonEnumerable"
    :expanded="expanded"
    :show-arrow="nodeHasChildNodes"
    :show-placeholder="depth > 0"
    @update:expand="onToggleExpand"
  >
    <span v-if="expanded">
      <VConnectedTreeNode
        v-for="(child, i) of children"
        :key="i"
        :data="child.data"
        :name="`${child.name}`"
        :data-iterator="dataIterator"
        :path="`${path}.${child.name}`"
        :depth="depth + 1"
        :is-non-enumerable="child.isNonEnumerable"
        :expanded-paths="expandedPaths"
        @update:expanded-paths="$emit('update:expanded-paths', $event)"
      />
    </span>
    <span v-else>null</span>
  </VTreeNode>
</template>
