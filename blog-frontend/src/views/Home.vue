<template>
  <div class="home">
    <!-- 搜索栏 -->
    <SearchBar @search="handleSearch" />

    <div class="content-container">
      <!-- 文章列表和筛选 -->
      <div class="main-content">
        <!-- 分类和标签筛选 -->
        <div class="filters">
          <CategoryFilter :categories="categories" @category-change="handleCategoryChange" />
          <TagFilter :tags="tags" @tag-change="handleTagChange" />
        </div>

        <!-- 文章列表 -->
        <ArticleList
            :articles="filteredArticles"
            :currentPage="currentPage"
            :pageSize="pageSize"
        />

        <!-- 分页组件 -->
        <Pagination
            :total="filteredArticles.length"
            :pageSize="pageSize"
            :currentPage="currentPage"
            @page-change="handlePageChange"
        />
      </div>

      <!-- 热门文章侧边栏 -->
      <div class="sidebar">
        <PopularPosts />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from '@/store'; // 使用 Pinia store

// 引入组件
import SearchBar from '@/components/SearchBar.vue';
import CategoryFilter from '@/components/CategoryFilter.vue';
import TagFilter from '@/components/TagFilter.vue';
import ArticleList from '@/components/ArticleList.vue';
import Pagination from '@/components/Pagination.vue';
import PopularPosts from '@/components/PopularPosts.vue';

// Store 引用
const store = useStore();

// 页面状态
const currentPage = ref(1);
const pageSize = ref(10);
const searchQuery = ref('');
const selectedCategory = ref('');
const selectedTags = ref([]);

// 文章过滤
const filteredArticles = computed(() => {
  return store.articles.filter((article) => {
    const matchesCategory = selectedCategory.value ? article.category === selectedCategory.value : true;
    const matchesTags = selectedTags.value.length ? selectedTags.value.every(tag => article.tags.includes(tag)) : true;
    const matchesSearch = article.title.includes(searchQuery.value);
    return matchesCategory && matchesTags && matchesSearch;
  });
});

// 获取数据
onMounted(() => {
  store.fetchArticles();
  store.fetchCategories();
  store.fetchTags();
});

// 处理事件
const handleSearch = (query) => {
  searchQuery.value = query;
};

const handleCategoryChange = (category) => {
  selectedCategory.value = category;
};

const handleTagChange = (tags) => {
  selectedTags.value = tags;
};

const handlePageChange = (page) => {
  currentPage.value = page;
};
</script>

<style scoped>
.content-container {
  display: flex;
}

.main-content {
  flex: 3;
}

.sidebar {
  flex: 1;
  margin-left: 20px;
}

.filters {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}
</style>