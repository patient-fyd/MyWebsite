<template>
  <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="onPageChange"
  />
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// 接收父组件传递的 props
const props = defineProps({
  total: {
    type: Number,
    required: true
  },
  pageSize: {
    type: Number,
    default: 10
  },
  currentPage: {
    type: Number,
    default: 1
  }
});

// 向父组件发出事件
const emit = defineEmits(['page-change']);

const onPageChange = (page) => {
  emit('page-change', page); // 通知父组件页码变化
};
</script>

<style scoped>
/* 你可以根据需求自定义分页样式 */
</style>