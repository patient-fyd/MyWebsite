<template>
  <el-select v-model="selectedTag" placeholder="选择标签" @change="onTagChange" multiple>
    <el-option v-for="tag in tags" :key="tag.id" :label="tag.name" :value="tag.name"></el-option>
  </el-select>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';

// 接收父组件传递的 props
const props = defineProps({
  tags: {
    type: Array,
    required: true
  },
  defaultTag: {
    type: Array,
    default: () => []
  }
});

// 选中的标签（支持多选）
const selectedTag = ref(props.defaultTag);

// 向父组件发出事件
const emit = defineEmits(['tag-change']);

const onTagChange = () => {
  emit('tag-change', selectedTag.value); // 通知父组件标签变化
};
</script>

<style scoped>
/* 自定义筛选组件样式 */
</style>