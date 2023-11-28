<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { VObjectInspector } from 'v-object-inspector'
import 'v-object-inspector/dist/style.css'
import type { Visualization } from '~/plugins/visualization'
import { useStore } from '~/stores/message'
import { isDark } from '~/composables/dark'

const props = defineProps({
  /** Render the given part of the visualization metadata. */
  datum: {
    type: Object as PropType<Partial<Visualization>>,
    required: true,
  },
  index: {
    type: Number as PropType<number | null>,
    default: null,
  },
})

const { datum } = toRefs(props)
const showMetadata = ref(false)
const { addSuccessMessage } = useStore()
const { copy } = useClipboard()

const onClickCopy = () => {
  copy(JSON.stringify(datum.value))
  addSuccessMessage('Metadata Copied.')
}
const isHttps = (url: string | null | undefined): boolean => {
  if (url === null || url === undefined) {
    return false
  }
  return new URL(url).protocol === 'https:'
}
</script>

<template>
  <div
    class="p-1 text-sm"
    bg="slate-100 dark:slate-900"
    border="~ gray-200 rounded"
  >
    <div class="flex">
      <div v-if="index !== null" class="text-gray">
        {{ index }}. &nbsp;
      </div>
      <b>{{ datum.displayName }}</b>
    </div>
    <div
      class="pt-1 gap-1"
      flex="~ col sm:row"
    >
      <div class="basis-4/10">
        <img
          v-if="isHttps(datum.downloadUrl)"
          :src="datum.downloadUrl ?? ''"
        >
        <span v-else>
          The image resource is not served with HTTPS.
          Please click the URL button to view it.
        </span>
      </div>
      <div
        class="basis-6/10"
        flex="~ col"
      >
        <div>
          <b>author</b>: {{ datum.authors?.join(' / ') ?? 'unknown' }}
        </div>
        <div>
          <b>year</b>: {{ datum.publishDate ?? 'unknown' }}
        </div>
        <div>
          <b>source</b>: {{ datum.source?.name ?? 'unknown' }}
        </div>
        <div>
          <b>language</b>: {{ datum.languages?.join(', ') ?? 'unknown' }}
        </div>
        <div v-if="datum.tags !== undefined && datum.tags.length !== 0">
          <b>tags</b>: {{ datum.tags?.join(', ') }}
        </div>
        <div v-if="datum.abstract !== undefined && datum.abstract !== null">
          <b>abstract</b>: {{ datum.abstract }}
        </div>
        <div class="flex gap-1">
          <button
            class="icon-btn flex gap-1"
            title="View raw metadata of this entry"
            @click="showMetadata = !showMetadata"
          >
            <div class="i-fa6-solid:database my-auto" />
            <div class="my-auto">
              view metadata
            </div>
          </button>
          <button
            class="icon-btn flex gap-1"
            title="Copy raw metadata of this entry"
            @click="onClickCopy"
          >
            <div class="i-fa6-solid:copy my-auto" />
            <div class="my-auto">
              copy metadata
            </div>
          </button>
          <a
            title="Open original URL in a new tab"
            target="_blank"
            :href="datum.viewUrl ?? ''"
          >
            <button class="icon-btn flex gap-1">
              <div class="i-fa6-solid:globe my-auto" />
              <div class="my-auto">url</div>
            </button>
          </a>
          <a
            title="Search title in Google"
            target="_blank"
            :href="`https://www.google.com/search?q=${datum.displayName}`"
          >
            <button class="icon-btn flex gap-1">
              <div class="i-fa6-brands:google my-auto" />
              <div class="my-auto">google</div>
            </button>
          </a>
        </div>
        <div
          v-if="showMetadata"
          class="border"
        >
          <VObjectInspector
            :data="datum"
            :expand-level="5"
            :dark-theme="isDark"
          />
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>
