<template>
  <TheViewSelectors m="x-1 t-1" />
  <div class="m-1 gap-1 overflow-auto flex">
    <div
      class="gap-1 flex-1"
      display="none sm:flex"
      flex="col"
    >
      <TheViewTime class="basis-1/4" />
      <div
        class="col-span-2 overflow-auto basis-3/4 gap-1"
        grid="~ cols-2"
      >
        <TheViewListTags />
        <TheViewListAuthors />
        <TheViewListLanguages />
        <TheViewListSources />
      </div>
    </div>
    <TheViewEntries class="flex-1" />
  </div>
</template>
