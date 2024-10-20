<template>
  <div>
    <!-- 搜索框 -->
    <SearchBar @search="onSearch" />

    <!-- 分类和标签筛选 -->
    <div class="filter-section">
      <CategoryFilter
          :categories="categories"
          @category-change="onCategoryChange"
      />

      <TagFilter
          :tags="tags"
          @tag-change="onTagChange"
      />
    </div>

    <!-- 文章列表 -->
    <div v-for="article in paginatedArticles" :key="article.id" class="article-card">
      <h3>{{ article.title }}</h3>
      <p>{{ article.summary }}</p>
      <button class="read-more-button" @click="goToArticle(article.id)">阅读更多</button>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <button @click="handlePageChange(currentPage - 1)" :disabled="currentPage === 1">上一页</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="handlePageChange(currentPage + 1)" :disabled="currentPage === totalPages">下一页</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useAxios } from '@/composables/useAxios.ts';

// 定义数据类型
interface Article {
  id: number;
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
}

interface Category {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

// 数据和状态
const articles = ref<Article[]>([]);
const filteredArticles = ref<Article[]>([]);
const paginatedArticles = ref<Article[]>([]);
const categories = ref<Category[]>([]);
const tags = ref<Tag[]>([]);
const searchQuery = ref<string>('');
const selectedCategory = ref<string>('');
const selectedTag = ref<string>('');
const currentPage = ref<number>(1);
const pageSize = ref<number>(10); // 每页显示的文章数量

// 获取文章数据
const { axios } = useAxios();
axios.get<Article[]>('/api/posts').then(response => {
  articles.value = response.data;
  filteredArticles.value = articles.value;
}).catch(error => {
  alert('获取文章数据失败');
});

// 获取分类和标签数据
axios.get<Category[]>('/api/categories').then(response => {
  categories.value = response.data;
});
axios.get<Tag[]>('/api/tags').then(response => {
  tags.value = response.data;
});

// 分页逻辑
const handlePageChange = (page: number): void => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    updatePaginatedArticles();
  }
};

const totalPages = computed<number>(() => {
  return Math.ceil(filteredArticles.value.length / pageSize.value);
});

const updatePaginatedArticles = (): void => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  paginatedArticles.value = filteredArticles.value.slice(start, end);
};

// 根据分类、标签和搜索查询过滤文章
const filterArticles = (): void => {
  filteredArticles.value = articles.value.filter(article => {
    const matchesCategory = selectedCategory.value ? article.category === selectedCategory.value : true;
    const matchesTag = selectedTag.value ? article.tags.includes(selectedTag.value) : true;
    const matchesSearch = article.title.includes(searchQuery.value) || article.content.includes(searchQuery.value);
    return matchesCategory && matchesTag && matchesSearch;
  });
  updatePaginatedArticles();
};

// 处理搜索
const onSearch = (): void => {
  filterArticles();
};

// 页面跳转
const goToArticle = (id: number): void => {
  window.location.href = `/article/${id}`;
};

// 初始化分页内容
updatePaginatedArticles();
</script>

<style scoped>
.search-box {
  margin-bottom: 20px;
}
.filter-section {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}
.article-card {
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}
.read-more-button {
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}
.read-more-button:hover {
  background-color: #1976d2;
}
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.pagination button {
  background-color: #f1f1f1;
  border: none;
  padding: 10px;
  cursor: pointer;
}
.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>