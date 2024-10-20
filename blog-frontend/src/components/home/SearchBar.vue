<template>
  <div class="search-bar">
    <span class="icon">
      <!-- 这里使用简单的 Unicode 搜索图标，或者可以使用 SVG 图标 -->
      🔍
    </span>
    <input
        type="text"
        v-model="searchQuery"
        placeholder="输入关键字搜索"
        @input="onSearch"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// 发送搜索关键字变化
const emit = defineEmits<{
  (event: 'search', query: string): void;
}>();

// 搜索关键字
const searchQuery = ref<string>('');

// 处理搜索输入
const onSearch = (): void => {
  emit('search', searchQuery.value); // 发出 search 事件
};
</script>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
}

.search-bar .icon {
  margin-right: 8px;
}

.search-bar input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
}
</style>