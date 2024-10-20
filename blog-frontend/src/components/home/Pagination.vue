<template>
  <div class="pagination">
    <button
        :disabled="currentPage === 1"
        @click="onPrevPage"
    >
      上一页
    </button>

    <span v-for="page in totalPages" :key="page" class="page-number">
      <button
          :class="{ active: page === currentPage }"
          @click="onPageChange(page)"
      >
        {{ page }}
      </button>
    </span>

    <button
        :disabled="currentPage === totalPages"
        @click="onNextPage"
    >
      下一页
    </button>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

// 定义 Props 的类型
interface PaginationProps {
  total: number;
  pageSize: number;
  currentPage: number;
}

// 接收父组件传递的 props，并明确类型
const props = defineProps<PaginationProps>();

// 向父组件发出事件
const emit = defineEmits<{
  (event: 'page-change', page: number): void;
}>();

// 计算总页数
const totalPages = computed(() => Math.ceil(props.total / props.pageSize));

// 页码变化处理
const onPageChange = (page: number): void => {
  emit('page-change', page);
};

// 上一页处理
const onPrevPage = (): void => {
  if (props.currentPage > 1) {
    onPageChange(props.currentPage - 1);
  }
};

// 下一页处理
const onNextPage = (): void => {
  if (props.currentPage < totalPages.value) {
    onPageChange(props.currentPage + 1);
  }
};
</script>

<style scoped>
.pagination {
  display: flex;
  gap: 8px;
  align-items: center;
}

button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background-color: #f1f1f1;
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.page-number button {
  padding: 8px 12px;
  margin: 0 4px;
}

button.active {
  font-weight: bold;
  background-color: #2196f3;
  color: white;
}
</style>