<template>
  <div class="search-bar-container">
    <div class="search-bar">
      <!-- 搜索输入框 -->
      <input
        type="text"
        v-model="query"
        class="search-input"
        placeholder="Search ..."
      />

      <!-- 搜索按钮 -->
      <button class="search-button" @click="performSearch">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="white"
        >
          <path
            d="M10 2a8 8 0 105.293 14.293l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const query = ref("");

// 执行搜索的逻辑
const performSearch = () => {
  console.log("搜索关键字:", query.value);
  // 可以在这里执行搜索请求或调用父组件的回调
};
</script>

<style scoped>
.search-bar-container {
  background-color: #ffffff;
  padding: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
/* 搜索框容器 */
.search-bar {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
}

/* 输入框 */
.search-input {
  flex: 1;
  padding: 10px;
  border: none;
  outline: none;
  font-size: 14px;
}

/* 搜索按钮 */
.search-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #8dc9e8;
  border: none;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-button:hover {
  background-color: #47abef;
}

.search-button svg {
  fill: white;
}
</style>
