<template>
  <div class="home">
    <CategoryPosts />
    <Pagination />
  </div>
</template>

<script lang="ts" setup>
import Pagination from "@/components/home/Pagination.vue";
import CategoryPosts from "@/components/CategoryList/CategoryList.vue";
</script>

<style scoped></style>
