<template>
  <div class="pagination-container">
    <!-- 显示当前页/总页数 -->
    <div class="pagination-info">第 {{ currentPage }} / {{ totalPages }} 页</div>

    <!-- 页码列表 -->
    <ul class="pagination">
      <!-- 首页 -->
      <li @click="goToPage(1)" class="page-item" :class="{ disabled: currentPage === 1 }">
        «
      </li>

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

      <!-- 省略号 -->
      <li v-if="showEllipsisBefore">...</li>
      <li v-if="showEllipsisAfter">...</li>

      <!-- 末页 -->
      <li @click="goToPage(totalPages)" class="page-item" :class="{ disabled: currentPage === totalPages }">
        »
      </li>
      <li @click="goToPage(totalPages)" class="page-item" :class="{ disabled: currentPage === totalPages }">
        末页
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

// 页码相关数据
const currentPage = ref(1);
const totalPages = ref(74);

// 根据当前页计算要显示的页码
const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 10;
  const half = Math.floor(maxVisible / 2);

  let start = Math.max(1, currentPage.value - half);
  let end = Math.min(totalPages.value, currentPage.value + half);

  if (start === 1) {
    end = Math.min(totalPages.value, maxVisible);
  }
  if (end === totalPages.value) {
    start = Math.max(1, totalPages.value - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

// 是否显示省略号
const showEllipsisBefore = computed(() => visiblePages.value[0] > 1);
const showEllipsisAfter = computed(() => visiblePages.value[visiblePages.value.length - 1] < totalPages.value);

// 跳转页面
const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return;
  currentPage.value = page;
};
</script>

<style scoped>
.pagination-container {
  text-align: center;
  margin-bottom: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
  font-size: 14px;
  color: #4a6a7b;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pagination-info {
  margin-bottom: 10px;
}

.pagination {
  display: inline-flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.page-item {
  padding: 0 10px;
  cursor: pointer;
  color: #4a6a7b;
  border-radius: 5px;
}

.page-item:hover {
  background-color: #e0e0e0;
}

.page-item.active {
  font-weight: bold;
  color: #000;
}

.page-item.disabled {
  cursor: not-allowed;
  color: #ccc;
}
</style>