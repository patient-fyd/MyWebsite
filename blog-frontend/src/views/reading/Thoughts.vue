<template>
  <div>
    <h1>随想笔记</h1>
    <textarea v-model="newThought" placeholder="记录随想..." />
    <button @click="addThought">添加</button>

    <ul>
      <li v-for="thought in thoughts" :key="thought.id">
        {{ thought.date }} - {{ thought.content }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const thoughts = ref([
  { id: 1, date: "2024-11-28", content: "今天读到了一句很有趣的话。" },
  { id: 2, date: "2024-11-27", content: "思考了一下阅读和写作的关系。" },
]);

const newThought = ref("");

function addThought() {
  if (newThought.value.trim()) {
    thoughts.value.push({
      id: thoughts.value.length + 1,
      date: new Date().toISOString().split("T")[0],
      content: newThought.value.trim(),
    });
    newThought.value = "";
  }
}
</script>
