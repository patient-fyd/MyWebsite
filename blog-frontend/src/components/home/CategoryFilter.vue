<template>
  <div>
    <!-- 分类选择框 -->
    <select v-model="selectedCategory" @change="onCategoryChange">
      <option value="" disabled>选择分类</option>
      <option v-for="category in categories" :key="category.id" :value="category.name">
        {{ category.name }}
      </option>
    </select>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// 定义 Category 类型
interface Category {
  id: number;
  name: string;
}

// 接收父组件传递的 props，并明确类型
const props = defineProps<{
  categories: Category[];
  defaultCategory?: string;
}>();

// 选中的分类
const selectedCategory = ref<string>(props.defaultCategory || '');

// 向父组件发出事件
const emit = defineEmits<{
  (event: 'category-change', category: string): void;
}>();

// 当选择分类变化时触发
const onCategoryChange = () => {
  emit('category-change', selectedCategory.value); // 通知父组件分类变化
};
</script>

<style scoped>
/* 自定义筛选组件样式 */
select {
  padding: 8px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  outline: none;
}

option {
  font-size: 16px;
}
</style>