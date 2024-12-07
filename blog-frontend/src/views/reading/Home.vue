<template>
  <div>
    <h1>首页</h1>
    <p>欢迎来到读书笔记系统，这里可以查看您的阅读动态和概览。</p>

    <h2>最近动态</h2>
    <ul>
      <li v-for="activity in activities" :key="activity.id">
        {{ activity.time }} - {{ activity.content }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
const activities = [
  {
    id: 1,
    time: "2024-11-28 10:00",
    content: "添加了笔记《如何有效阅读一本书》",
  },
  { id: 2, time: "2024-11-27 15:00", content: "完成了阅读计划《时间的秩序》" },
];
</script>
