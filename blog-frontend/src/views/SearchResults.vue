<template>
  <div class="article-list">
    <!-- 搜索结果标题 -->
    <h2>搜索结果：{{ keyword }}</h2>

    <!-- 加载状态 -->
    <div v-if="loading">加载中...</div>

    <!-- 错误信息 -->
    <div v-if="error">{{ error }}</div>

    <!-- 文章列表 -->
    <div v-if="!loading && !error && results.length > 0">
      <!-- 使用与文章列表相同的组件结构 -->
      <div
        v-for="(article, index) in results"
        :key="index"
        class="article-item"
      >
        <!-- 顶部部分，文章的头部信息，如标题、作者信息等 -->
        <div class="article-header">
          <h2>{{ article.title }}</h2>
          <ArticleMeta
            :author="article.author"
            :createdAt="article.created_at"
            :commentsCount="article.comments ? article.comments.length : 0"
            :views="article.views"
          />
        </div>

        <!-- 文章内容展示 -->
        <div class="article-content">
          <p>{{ article.summary || article.content }}</p>
          <!-- 如果 summary 为空，则显示 content -->
        </div>

        <!-- 底部的标签和阅读更多按钮 -->
        <div class="article-footer">
          <p>
            标签:
            <span v-for="(tag, tagIndex) in article.tags" :key="tagIndex">
              {{ tag.name }}{{ tagIndex < article.tags.length - 1 ? ", " : "" }}
            </span>
          </p>
          <button @click="readMore(article.id)">阅读更多</button>
        </div>
      </div>

      <!-- 分页组件 -->
      <Pagination
        v-if="totalResults > pageSize"
        :totalItems="totalResults"
        :pageSize="pageSize"
        :currentPage="currentPage"
        @update:currentPage="handlePageChange"
      />
    </div>

    <!-- 如果没有搜索结果 -->
    <div v-else-if="!loading && !error && results.length === 0">
      未找到与 "{{ keyword }}" 相关的文章。
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, watch, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useArticleStore } from "@/stores/articleStore";
import ArticleMeta from "@/components/common/ArticleMeta.vue";
import Pagination from "@/components/home/Pagination.vue";

const route = useRoute();
const router = useRouter();
const articleStore = useArticleStore();

const keyword = computed(() => (route.query.keyword as string) || "");
const results = computed(() => articleStore.searchResults);
const loading = computed(() => articleStore.searchLoading);
const error = computed(() => articleStore.searchError);
const totalResults = computed(() => articleStore.totalSearchResults);

const currentPage = ref(1);
const pageSize = ref(6);

const performSearch = () => {
  if (keyword.value) {
    articleStore.searchArticles(
      keyword.value,
      currentPage.value,
      pageSize.value,
    );
  }
};

onMounted(() => {
  performSearch();
});

const handlePageChange = (page: number) => {
  currentPage.value = page;
  performSearch();
};

watch(
  () => [keyword.value, currentPage.value],
  () => {
    performSearch();
  },
);

// 阅读更多的功能
const readMore = (id: number) => {
  router.push({ name: "PostDetail", params: { id } });
};
</script>

<style scoped>
/* 与您提供的文章列表样式相同 */
.article-list {
  padding-bottom: 20px;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px; /* 每个文章之间的间距 */
}

.article-item {
  padding: 20px;
  margin-top: 10px;
  margin-bottom: 20px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.article-header {
  margin-bottom: 15px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.article-header h2 {
  display: flex;
  justify-content: center;
  margin: 0;
  font-size: 28px;
}

.article-header p {
  margin: 5px 0 0;
  color: #777;
  font-size: 14px;
}

.article-content {
  height: 100px;
  margin: 20px 0;
}

.article-footer {
  text-align: center;
}

.article-footer button {
  padding: 10px 20px;
  background-color: #8dc9e8;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.article-footer button:hover {
  background-color: #8dc9e8;
}
</style>
