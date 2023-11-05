<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { VObjectInspector } from 'v-object-inspector'
import 'v-object-inspector/dist/style.css'
import { useStore } from '~/stores/json'
import { isDark } from '~/composables/dark'

const { parsed, validJson } = storeToRefs(useStore())
</script>

<template>
  <div view-container>
    <div view-header>
      <div class="i-fa6-solid:code my-auto" />
      <div class="font-bold">
        JSON Parsed
      </div>
    </div>
    <div class="overflow-auto p-1 flex-1 flex">
      <VObjectInspector
        v-if="validJson"
        :data="parsed"
        :expand-level="5"
        :dark-theme="isDark"
      />
      <div
        v-else
        class="text-red m-auto"
      >
        Invalid JSON
      </div>
    </div>
  </div>
</template>
