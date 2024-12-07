<script setup lang="ts">
import SearchBar from "@/components/common/SearchBar.vue";
import PopularPosts from "@/components/common/PopularPosts.vue";
import CategoryFilter from "@/components/category/CategoryFilter.vue";
import TagFilter from "@/components/common/TagFilter.vue";
import OtherActions from "@/components/common/OtherActions.vue";
// 确保组件加载
console.log("Common.vue loaded");
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
    <div class="otherBlock">
      <OtherActions />
    </div>
  </div>
</template>

<style scoped></style>
