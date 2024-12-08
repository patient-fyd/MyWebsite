<template>
  <div>
    <h1>分享笔记</h1>
    <p>选择要分享的笔记：</p>
    <select v-model="selectedNote">
      <option v-for="note in notes" :key="note.id" :value="note.id">
        {{ note.title }}
      </option>
    </select>
    <button @click="shareNote">生成分享链接</button>

    <p v-if="shareLink">
      分享链接：<a :href="shareLink">{{ shareLink }}</a>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const notes = ref([
  { id: 1, title: "如何有效阅读一本书" },
  { id: 2, title: "时间的秩序" },
]);

const selectedNote = ref(null);
const shareLink = ref("");

function shareNote() {
  if (selectedNote.value) {
    shareLink.value = `https://example.com/note/${selectedNote.value}`;
  }
}
</script>
