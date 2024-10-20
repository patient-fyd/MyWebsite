<script setup lang="ts">
//无
import SearchBar from "@/components/common/SearchBar.vue";
import PopularPosts from "@/components/common/PopularPosts.vue";
import CategoryFilter from "@/components/common/CategoryFilter.vue";
import TagFilter from "@/components/common/TagFilter.vue";
</script>

<template>
  <div class="right-column">
    <div class="searchBlock">
      <SearchBar />
    </div>
    <div class="popularBlock">
      <PopularPosts />
    </div>
    <div class="categoryBlock">
      <CategoryFilter categories="" />
    </div>
    <div class="tagBlock">
      <TagFilter tags="" default-tag="" />
    </div>
    <div class="">

    </div>
  </div>
</template>

<style scoped>

</style>