<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useStore } from '~/stores/json'

const { text, validJson } = storeToRefs(useStore())
const onClickFormat = () => {
  if (!validJson.value) return
  text.value = JSON.stringify(JSON.parse(text.value), null, 4)
}
</script>

<template>
  <div view-container>
    <div view-header>
      <div class="i-fa6-solid:code my-auto" />
      <div class="font-bold">
        JSON Input
      </div>
      <button
        btn
        class="ml-auto py-0"
        title="Format the JSON"
        :disabled="!validJson"
        :class="{ 'pointer-events-none': !validJson }"
        @click="onClickFormat"
      >
        format
      </button>
      <button
        btn
        class="py-0"
        title="Submit to server"
        :disabled="!validJson"
        :class="{ 'pointer-events-none': !validJson }"
      >
        <a
          rel="noreferrer"
          href="https://github.com/oldvis/dataset/issues"
          target="_blank"
        >
          submit
        </a>
      </button>
    </div>
    <textarea
      v-model="text"
      input-area
      class="flex-1 m-1 py-1 text-sm resize-none"
      placeholder="Your JSON..."
    />
  </div>
</template>
