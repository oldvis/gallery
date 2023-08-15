<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useStore } from '~/stores/json'

const { parsed } = storeToRefs(useStore())
</script>

<template>
  <div view-container>
    <div view-header>
      <div class="i-fa6-solid:code my-auto" />
      <div class="font-bold">
        Data Entry Parsed
      </div>
    </div>
    <div class="overflow-auto p-1 flex-1 flex">
      <VDataEntry
        v-if="parsed !== null"
        :datum="parsed"
      />
      <div
        v-else
        class="text-red m-auto"
      >
        Invalid Data Entry
      </div>
    </div>
  </div>
</template>
