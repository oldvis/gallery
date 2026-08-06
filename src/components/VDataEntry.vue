<script setup lang="ts">
import type { Visualization } from '~/plugins/visualization'
import { useClipboard } from '@vueuse/core'
import { VObjectInspector } from 'v-object-inspector'
import { isDark } from '~/composables/dark'
import { useStore } from '~/stores/message'
import 'v-object-inspector/dist/style.css'

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
const imageFailed = ref(false)
const imageLoading = ref(false)
const { addSuccessMessage } = useStore()
const { copy } = useClipboard()

const onClickCopy = () => {
  copy(JSON.stringify(datum.value))
  addSuccessMessage('Metadata Copied.')
}

/** Parse only http(s) URLs; malformed or other schemes return null. */
const safeHttpUrl = (url: string | null | undefined): string | null => {
  if (url === null || url === undefined || url === '') return null
  try {
    const parsed = new URL(url)
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return url
    }
    return null
  }
  catch {
    return null
  }
}

const downloadUrlKind = computed((): 'https' | 'http' | 'unavailable' => {
  const safe = safeHttpUrl(datum.value.downloadUrl)
  if (safe === null) return 'unavailable'
  return new URL(safe).protocol === 'https:' ? 'https' : 'http'
})

const resetImageState = (): void => {
  imageFailed.value = false
  imageLoading.value = downloadUrlKind.value === 'https'
}

watch(() => datum.value.downloadUrl, resetImageState, { immediate: true })

const onImageLoad = (): void => {
  imageLoading.value = false
}

const onImageError = (): void => {
  imageLoading.value = false
  imageFailed.value = true
}

/** Cached images may finish before @load binds — sync from the element. */
const onImageRef = (el: unknown): void => {
  const img = el as HTMLImageElement | null
  if (img !== null && img.complete) {
    if (img.naturalWidth > 0) onImageLoad()
    else onImageError()
  }
}

const viewHref = computed(() => safeHttpUrl(datum.value.viewUrl))
const urlActionHref = computed(() => (
  viewHref.value ?? safeHttpUrl(datum.value.downloadUrl)
))
const imageErrorLead = computed((): string | null => {
  if (downloadUrlKind.value === 'https' && !imageFailed.value) return null
  if (imageFailed.value) return 'Image failed to load.'
  if (downloadUrlKind.value === 'http') return 'The image is served over HTTP (not HTTPS).'
  return 'The image URL is missing or invalid.'
})
</script>

<template>
  <div class="p-2 text-sm bg-white dark:bg-gray-900">
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
      <div class="basis-4/10 min-w-0">
        <div
          class="relative flex min-h-40 items-center justify-center overflow-hidden border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-950"
        >
          <div
            v-if="downloadUrlKind === 'https' && imageLoading && !imageFailed"
            class="absolute inset-0 z-1 flex items-center justify-center gap-2 text-sm text-gray-500 pointer-events-none"
          >
            <div
              class="i-fa6-solid:spinner"
              animate-spin
            />
            Loading image
          </div>
          <img
            v-if="downloadUrlKind === 'https' && !imageFailed"
            :ref="onImageRef"
            class="max-h-full max-w-full object-contain"
            :src="datum.downloadUrl ?? ''"
            decoding="async"
            @load="onImageLoad"
            @error="onImageError"
          >
          <span
            v-else-if="imageErrorLead !== null"
            class="p-3 text-center text-gray-600 dark:text-gray-300"
          >
            {{ imageErrorLead }}
            Please use
            <a
              v-if="urlActionHref !== null"
              class="text-teal-700 underline underline-offset-2 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-200"
              :href="urlActionHref"
              target="_blank"
              rel="noopener noreferrer"
            >URL</a>
            <template v-else>
              URL
            </template>
            to view it.
          </span>
        </div>
      </div>
      <div
        class="basis-6/10"
        flex="~ col"
      >
        <div>
          <b>Author</b>: {{ datum.authors?.join(' / ') ?? 'unknown' }}
        </div>
        <div>
          <b>Year</b>: {{ datum.publishDate ?? 'unknown' }}
        </div>
        <div>
          <b>Source</b>: {{ datum.source?.name ?? 'unknown' }}
        </div>
        <div>
          <b>Language</b>: {{ datum.languages?.join(', ') ?? 'unknown' }}
        </div>
        <div v-if="datum.tags !== undefined && datum.tags.length !== 0">
          <b>Tags</b>: {{ datum.tags?.join(', ') }}
        </div>
        <div v-if="datum.abstract !== undefined && datum.abstract !== null">
          <b>Abstract</b>: {{ datum.abstract }}
        </div>
        <div class="flex gap-1">
          <button
            class="icon-btn flex gap-1"
            title="View raw metadata of this entry"
            @click="showMetadata = !showMetadata"
          >
            <div class="i-fa6-solid:database my-auto" />
            <div class="my-auto">
              View metadata
            </div>
          </button>
          <button
            class="icon-btn flex gap-1"
            title="Copy raw metadata of this entry"
            @click="onClickCopy"
          >
            <div class="i-fa6-solid:copy my-auto" />
            <div class="my-auto">
              Copy metadata
            </div>
          </button>
          <a
            title="Open original URL in a new tab"
            target="_blank"
            :href="datum.viewUrl ?? ''"
          >
            <button class="icon-btn flex gap-1">
              <div class="i-fa6-solid:globe my-auto" />
              <div class="my-auto">URL</div>
            </button>
          </a>
          <a
            title="Search title in Google"
            target="_blank"
            :href="`https://www.google.com/search?q=${datum.displayName}`"
          >
            <button class="icon-btn flex gap-1">
              <div class="i-fa6-brands:google my-auto" />
              <div class="my-auto">Google</div>
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
