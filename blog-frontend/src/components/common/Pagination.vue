<template>
  <div class="pagination-container">
    <!-- 显示当前页/总页数 -->
    <div class="pagination-info">
      第 {{ currentPage }} / {{ totalPages }} 页
    </div>

    <!-- 页码列表 -->
    <ul class="pagination">
      <!-- 首页 -->
      <li
        @click="goToPage(1)"
        class="page-item"
        :class="{ disabled: currentPage === 1 }"
      >
        «
      </li>

      <!-- 省略号（前） -->
      <li v-if="showEllipsisBefore" class="page-item">...</li>

      <!-- 数字页码显示 -->
      <li
        v-for="page in visiblePages"
        :key="page"
        @click="goToPage(page)"
        class="page-item"
        :class="{ active: currentPage === page }"
      >
        {{ page }}
      </li>

      <!-- 省略号（后） -->
      <li v-if="showEllipsisAfter" class="page-item">...</li>

      <!-- 尾页 -->
      <li
        @click="goToPage(totalPages)"
        class="page-item"
        :class="{ disabled: currentPage === totalPages }"
      >
        »
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  totalItems: {
    type: Number,
    required: true,
  },
  pageSize: {
    type: Number,
    default: 6,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
});

const emits = defineEmits(["update:currentPage"]);

// 计算总页数
const totalPages = computed(() => Math.ceil(props.totalItems / props.pageSize));

// 根据当前页计算要显示的页码
const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 7; // 最多显示的页码数
  const half = Math.floor(maxVisible / 2);

  let start = Math.max(1, props.currentPage - half);
  let end = Math.min(totalPages.value, props.currentPage + half);

  if (end - start < maxVisible - 1) {
    if (start === 1) {
      end = Math.min(totalPages.value, start + maxVisible - 1);
    } else if (end === totalPages.value) {
      start = Math.max(1, end - maxVisible + 1);
    }
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

// 是否显示省略号
const showEllipsisBefore = computed(() => visiblePages.value[0] > 2);
const showEllipsisAfter = computed(
  () =>
    visiblePages.value[visiblePages.value.length - 1] < totalPages.value - 1,
);

// 跳转页面
const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value || page === props.currentPage) return;
  emits("update:currentPage", page);
};
</script>

<style scoped>
.pagination-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.pagination-info {
  font-size: 15px;
}

.pagination {
  list-style: none;
  display: flex;
  padding: 0;
}

.page-item {
  padding: 5px 10px;
  margin: 0 2px;
  cursor: pointer;
  border: 1px solid #ddd;
}

.page-item.active {
  background-color: #8dc9e8;
  color: #fff;
}

.page-item.disabled {
  cursor: not-allowed;
  color: #ccc;
}
</style>
