<template>
  <el-select v-model="selectedCategory" placeholder="选择分类" @change="onCategoryChange">
    <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.name"></el-option>
  </el-select>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// 接收父组件传递的 props
const props = defineProps({
  categories: {
    type: Array,
    required: true
  },
  defaultCategory: {
    type: String,
    default: ''
  }
});

// 选中的分类
const selectedCategory = ref(props.defaultCategory);

// 向父组件发出事件
const emit = defineEmits(['category-change']);

const onCategoryChange = () => {
  emit('category-change', selectedCategory.value); // 通知父组件分类变化
};
</script>

<style scoped>
/* 自定义筛选组件样式 */
</style>