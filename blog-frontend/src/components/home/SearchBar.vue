<template>
  <el-input
      v-model="searchQuery"
      placeholder="输入关键字搜索"
      class="search-bar"
      @input="onSearch"
  >
    <template #prepend>
      <el-icon><Search /></el-icon>
    </template>
  </el-input>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { defineEmits } from 'vue';
import { Search } from '@element-plus/icons-vue';

// 发送搜索关键字变化
const emit = defineEmits(['search']);

// 搜索关键字
const searchQuery = ref('');

// 处理搜索输入
const onSearch = () => {
  emit('search', searchQuery.value); // 发出 search 事件
};
</script>

<style scoped>
.search-bar {
  width: 100%;
}
</style>