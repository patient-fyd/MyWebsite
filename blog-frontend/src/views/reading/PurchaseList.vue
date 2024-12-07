<template>
  <div>
    <h1>购书清单</h1>
    <input v-model="newBook" placeholder="输入书名..." />
    <button @click="addBook">添加到清单</button>

    <ul>
      <li v-for="book in purchaseList" :key="book.id">
        {{ book.title }} <button @click="removeBook(book.id)">删除</button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const purchaseList = ref([
  { id: 1, title: "元宇宙的未来" },
  { id: 2, title: "人工智能时代的机遇与挑战" },
]);

const newBook = ref("");

function addBook() {
  if (newBook.value.trim()) {
    purchaseList.value.push({
      id: purchaseList.value.length + 1,
      title: newBook.value.trim(),
    });
    newBook.value = "";
  }
}

function removeBook(id) {
  purchaseList.value = purchaseList.value.filter((book) => book.id !== id);
}
</script>
