<template>
  <nav
    class="flex"
    border="b gray-200"
    p="x-3 y-1"
  >
    <img
      class="h-28px pr-1"
      src="/favicon.svg"
    >
    <span class="text-lg font-bold">
      OldVis Gallery
    </span>
    <div class="flex gap-6 text-sm items-center ml-auto">
      <TheDialogAbout />
      <button icon-btn @click="toggleDark()">
        <div i-fa6-regular:sun dark:i-fa6-regular:moon />
      </button>
      <a
        i-fa6-brands:github icon-btn
        rel="noreferrer"
        href="https://github.com/oldvis/gallery"
        target="_blank"
        title="GitHub"
      />
    </div>
  </nav>
</template>
