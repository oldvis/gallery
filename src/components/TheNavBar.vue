<template>
  <nav
    class="strip bg-white dark:bg-hex-121212 border-b border-gray-200 dark:border-gray-700"
  >
    <div class="flex shrink-0 gap-1 items-center">
      <img
        class="h-5 w-5"
        src="/favicon.svg"
        alt=""
      >
      <span class="text-sm font-semibold">
        OldVis<span class="text-gray-500 font-normal dark:text-gray-400"> · Gallery</span>
      </span>
    </div>
    <div class="grow" />
    <div class="flex gap-1 items-center shrink-0">
      <TheDialogAbout />
      <button
        type="button"
        icon-btn
        title="Toggle theme"
        @click="toggleDark()"
      >
        <div i-fa6-regular:sun dark:i-fa6-regular:moon />
      </button>
      <a
        i-fa6-brands:github
        icon-btn
        rel="noreferrer"
        href="https://github.com/oldvis/gallery"
        target="_blank"
        title="GitHub"
      />
    </div>
  </nav>
</template>
