<script setup lang="ts">
import { promiseTimeout } from '@vueuse/core'
import { MessageType } from '~/stores/message'
import type { Message } from '~/stores/message'

const props = defineProps({
  message: {
    type: Object as PropType<Message>,
    required: true,
  },
})
const emit = defineEmits<{
  (e: 'close'): void
}>()

const { message } = toRefs(props)
const show = ref(true)

onMounted(async () => {
  if (message.value.timeout === Number.POSITIVE_INFINITY) return
  await promiseTimeout(message.value.timeout)
  show.value = false
})
watch(show, (d) => {
  if (d === false) emit('close')
})
</script>

<template>
  <div
    class="flex gap-2 items-center w-full max-w-xs p-2 rounded shadow"
    bg="white dark:gray-800"
    text="gray-500 dark:gray-400"
  >
    <div
      v-if="message.type === MessageType.Success"
      class="inline-flex items-center justify-center w-8 h-8 rounded"
      bg="green-100 dark:green-800"
      text="green-500 dark:green-200"
    >
      <div class="i-fa6-solid:check" />
    </div>
    <div
      v-if="message.type === MessageType.Error"
      class="inline-flex items-center justify-center w-8 h-8 rounded"
      bg="orange-100 dark:orange-700"
      text="orange-500 dark:orange-200"
    >
      <div class="i-fa6-solid:triangle-exclamation" />
    </div>
    <div class="text-sm">
      {{ message.content }}
    </div>
    <button
      icon-btn
      class="ml-auto"
      title="Close"
      @click="show = false"
    >
      <div class="i-fa6-solid:xmark" />
    </button>
  </div>
</template>
