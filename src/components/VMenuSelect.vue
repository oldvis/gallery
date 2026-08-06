<script setup lang="ts" generic="T extends string">
import { onClickOutside, useEventListener } from '@vueuse/core'

export interface MenuSelectOption<T extends string = string> {
  value: T
  label: string
}

const props = defineProps<{
  modelValue: T
  options: readonly MenuSelectOption<T>[]
  /** Optional test id on the trigger button. */
  testId?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: T]
}>()

const show = ref(false)
const root = ref<HTMLDivElement>()
const panel = ref<HTMLDivElement>()
const panelStyle = ref<Record<string, string>>({})

const selectedLabel = computed(() => (
  props.options.find((o) => o.value === props.modelValue)?.label ?? props.modelValue
))

const updatePanelPosition = (): void => {
  const trigger = root.value?.querySelector('button')
  if (!trigger) return
  const rect = trigger.getBoundingClientRect()
  const gap = 4
  panelStyle.value = {
    position: 'fixed',
    top: `${rect.bottom + gap}px`,
    left: `${rect.left}px`,
    minWidth: `${Math.max(rect.width, 8 * 16)}px`,
    maxHeight: `${Math.min(192, Math.max(80, window.innerHeight - rect.bottom - gap - 8))}px`,
    zIndex: '60',
  }
}

const toggle = (): void => {
  show.value = !show.value
  if (show.value) {
    nextTick(updatePanelPosition)
  }
}

const onPick = (value: T): void => {
  emit('update:modelValue', value)
  show.value = false
}

onClickOutside(root, (event) => {
  if (panel.value?.contains(event.target as Node)) return
  show.value = false
}, { ignore: [panel] })

useEventListener(window, 'resize', () => {
  if (show.value) updatePanelPosition()
})
useEventListener(window, 'scroll', () => {
  if (show.value) updatePanelPosition()
}, true)
</script>

<template>
  <div
    ref="root"
    class="relative inline-flex max-w-full shrink-0"
  >
    <button
      type="button"
      menu-trigger
      :data-testid="testId"
      :aria-expanded="show ? 'true' : 'false'"
      aria-haspopup="listbox"
      @click="toggle"
    >
      <span class="min-w-0 truncate">{{ selectedLabel }}</span>
      <div
        class="i-fa6-solid:caret-down text-xs opacity-70 shrink-0"
        aria-hidden="true"
      />
    </button>
    <Teleport to="body">
      <div
        v-show="show"
        ref="panel"
        role="listbox"
        menu-panel
        class="top-auto left-auto mt-0!"
        :style="panelStyle"
      >
        <button
          v-for="option in options"
          :key="option.value"
          type="button"
          role="option"
          :class="option.value === modelValue ? 'menu-item-on' : 'menu-item'"
          :aria-selected="option.value === modelValue ? 'true' : 'false'"
          :data-testid="testId ? `${testId}-option-${option.value}` : undefined"
          @click="onPick(option.value)"
        >
          <div
            class="i-fa6-solid:check text-xs shrink-0 w-3"
            :class="option.value === modelValue ? 'opacity-80' : 'opacity-0'"
            aria-hidden="true"
          />
          <span class="truncate">{{ option.label }}</span>
        </button>
      </div>
    </Teleport>
  </div>
</template>
