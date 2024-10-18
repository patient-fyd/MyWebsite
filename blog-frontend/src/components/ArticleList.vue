<template>
  <div>
    <!-- 搜索框 -->
    <el-input
        v-model="searchQuery"
        placeholder="搜索文章"
        class="search-box"
        @input="onSearch"
    />

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
    <el-card
        v-for="article in paginatedArticles"
        :key="article.id"
        class="article-card"
    >
      <h3>{{ article.title }}</h3>
      <p>{{ article.summary }}</p>
      <el-button type="primary" @click="goToArticle(article.id)">阅读更多</el-button>
    </el-card>

    <!-- 分页 -->
    <Pagination
        :total="filteredArticles.length"
        :pageSize="pageSize"
        :currentPage="currentPage"
        @page-change="handlePageChange"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAxios } from '@/composables/useAxios'; // 自定义 composable 获取 Axios 实例
import { ElMessage } from 'element-plus';

// 数据和状态
const articles = ref([]);
const filteredArticles = ref([]);
const paginatedArticles = ref([]);
const categories = ref([]);
const tags = ref([]);
const searchQuery = ref('');
const selectedCategory = ref('');
const selectedTag = ref('');
const currentPage = ref(1);
const pageSize = ref(10); // 每页显示的文章数量

// 获取文章数据
const { axios } = useAxios();
axios.get('/api/articles').then(response => {
  articles.value = response.data;
  filteredArticles.value = articles.value;
}).catch(error => {
  ElMessage.error('获取文章数据失败');
});

// 获取分类和标签数据
axios.get('/api/categories').then(response => {
  categories.value = response.data;
});
axios.get('/api/tags').then(response => {
  tags.value = response.data;
});

// 分页逻辑
const handlePageChange = (page) => {
  currentPage.value = page;
  updatePaginatedArticles();
};

const updatePaginatedArticles = () => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  paginatedArticles.value = filteredArticles.value.slice(start, end);
};

// 根据分类、标签和搜索查询过滤文章
const filterArticles = () => {
  filteredArticles.value = articles.value.filter(article => {
    const matchesCategory = selectedCategory.value ? article.category === selectedCategory.value : true;
    const matchesTag = selectedTag.value ? article.tags.includes(selectedTag.value) : true;
    const matchesSearch = article.title.includes(searchQuery.value) || article.content.includes(searchQuery.value);
    return matchesCategory && matchesTag && matchesSearch;
  });
  updatePaginatedArticles();
};

// 处理搜索
const onSearch = () => {
  filterArticles();
};

// 页面跳转
const goToArticle = (id) => {
  // 跳转到文章详情页面
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
}
</style>