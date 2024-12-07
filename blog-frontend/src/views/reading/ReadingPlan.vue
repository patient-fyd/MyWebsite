<template>
  <div>
    <h1>阅读计划</h1>
    <input v-model="newPlan" placeholder="输入计划内容..." />
    <button @click="addPlan">添加计划</button>

    <ul>
      <li v-for="plan in readingPlans" :key="plan.id">
        {{ plan.content }} - {{ plan.status }}
        <button @click="markComplete(plan.id)">标记为完成</button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const readingPlans = ref([
  { id: 1, content: "读完《时间的秩序》", status: "未完成" },
  { id: 2, content: "写一篇读书笔记", status: "未完成" },
]);

const newPlan = ref("");

function addPlan() {
  if (newPlan.value.trim()) {
    readingPlans.value.push({
      id: readingPlans.value.length + 1,
      content: newPlan.value.trim(),
      status: "未完成",
    });
    newPlan.value = "";
  }
}

function markComplete(id: number) {
  const plan = readingPlans.value.find((p) => p.id === id);
  if (plan) {
    plan.status = "已完成";
  }
}
</script>
