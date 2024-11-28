<template>
  <div>
    <h1>书籍列表</h1>
    <input v-model="search" placeholder="搜索书籍..." />
    <ul>
      <li v-for="book in filteredBooks" :key="book.id">
        {{ book.title }} by {{ book.author }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";

const search = ref("");
const books = ref([
  { id: 1, title: "时间的秩序", author: "卡洛·罗韦利" },
  { id: 2, title: "如何有效阅读一本书", author: "奥野宣之" },
]);

const filteredBooks = computed(() =>
  books.value.filter(
    (book) =>
      book.title.toLowerCase().includes(search.value.toLowerCase()) ||
      book.author.toLowerCase().includes(search.value.toLowerCase()),
  ),
);
</script>
