<template>
  <div class="category-filter">
    <!-- 标题 -->
    <div class="title">
      <h3>分类</h3>
    </div>

    <!-- 分类列表 -->
    <div class="category-header">
      <ul class="category-list">
        <li
          v-for="(category, index) in categories"
          :key="category.id"
          class="category-item"
        >
          <!-- 点击分类后跳转到对应类别的文章列表页面 -->
          <router-link
            :to="{ name: 'CategoryList', params: { categoryId: category.id } }"
            class="category-link"
          >
            {{ category.name }}
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useCategoryTagStore } from "@/stores/categoryTagStore";

// 引入 store 获取分类数据
const categoryTagStore = useCategoryTagStore();
const categories = ref([]); // 用来存储分类数据

// 获取分类数据并更新到前端
onMounted(async () => {
  await categoryTagStore.fetchCategories(); // 调用 fetchCategories 动作
  categories.value = categoryTagStore.categories;
});
</script>

<style scoped>
/* 外层容器 */
.category-filter {
  padding: 20px;
  font-family: Arial, sans-serif;
  margin-top: 20px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 标题样式 */
.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  border-left: 3px solid #3c74b3;
  padding-left: 8px;
}

/* 分类列表样式 */
.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* 分类项样式 */
.category-item {
  margin-bottom: 10px;
}

/* 分类链接样式 */
.category-link {
  text-decoration: none;
  color: #333;
  font-size: 14px;
}

.category-link:hover {
  text-decoration: underline;
  color: #3c74b3;
}

/* 子分类列表样式 */
.subcategory-list {
  list-style: none;
  padding: 5px 0 5px 20px;
  margin: 0;
}

/* 子分类项样式 */
.subcategory-item {
  margin-bottom: 5px;
}

/* 子分类链接样式 */
.subcategory-link {
  text-decoration: none;
  color: #666;
  font-size: 13px;
}

.subcategory-link:hover {
  text-decoration: underline;
  color: #3c74b3;
}
</style>
