<script setup lang="ts">
import { storeToRefs } from 'pinia'
import VMessage from './VMessage.vue'
import { useStore } from '~/stores/message'

const messageStore = useStore()
const { messages } = storeToRefs(messageStore)
const onClose = (uuid: string): void => {
  messageStore.removeMessage(uuid)
}
</script>

<template>
  <div
    class="fixed w-screen h-screen items-end justify-end pointer-events-none z-2"
    flex="~ col"
  >
    <VMessage
      v-for="message in messages"
      :key="`${message.uuid}`"
      class="mx-2 mb-2 pointer-events-auto"
      :message="message"
      @close="onClose(message.uuid)"
    />
  </div>
</template>
