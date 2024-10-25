<template>
  <div id="study-task">
    <!-- 任务区域 -->
    <TaskArea />
    <!-- 日历热图 -->
    <CalendarHeatmap />
  </div>
</template>

<script setup lang="ts">
import TaskArea from "@/components/StudyTask/TaskArea.vue";
import CalendarHeatmap from "@/components/StudyTask/CalendarHeatmap.vue";
</script>

<style scoped>
#study-task {
  display: flex;
  flex-direction: column;
  /*布满整个屏幕*/
  height: 100vh;
  width: 100vw;
}
</style>
