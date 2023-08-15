import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['base-btn', 'text-sm inline-block cursor-pointer disabled:pointer-events-none'],
    ['btn', 'base-btn px-2 py-1 rounded bg-teal-600 text-white hover:bg-teal-700 disabled:bg-gray-600 disabled:opacity-50 '],
    ['btn-warn', 'btn bg-red-600 hover:bg-red-700'],
    ['btn-neutral', 'btn bg-neutral-600 hover:bg-neutral-700'],
    ['icon-btn', 'base-btn select-none opacity-75 transition hover:opacity-100 hover:text-teal-600 !outline-none'],
    ['view-container', 'border border-gray-200 flex flex-col overflow-auto'],
    ['view-header', 'border-b border-gray-200 p-1 flex gap-1 text-sm'],
    ['input-area', 'px-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded'],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
  ],
})
