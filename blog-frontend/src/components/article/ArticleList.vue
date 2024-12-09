<template>
  <div class="article-list">
    <div v-if="loading">加载中...</div>
    <div v-else-if="error">{{ error }}</div>
    <!-- 展示多个文章的列表 -->
    <div v-else v-for="article in articles" :key="article.id" class="article-item">
      <!-- 顶部部分，文章的头部信息，如标题、作者信息等 -->
      <div class="article-header">
        <h2>{{ article.title }}</h2>
        <ArticleMeta
          :author="article.author"
          :createdAt="article.created_at"
          :commentsCount="article.comment_count"
          :views="article.views"
        />
      </div>

      <!-- 文章内容展示 -->
      <div class="article-content">
        <p>{{ article.summary || article.content }}</p>
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
      v-if="totalArticles > pageSize"
      :totalItems="totalArticles"
      :pageSize="pageSize"
      :currentPage="currentPage"
      @update:currentPage="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { useArticleStore } from "@/stores/articleStore";
import { useRouter } from "vue-router";
import { onMounted, computed, ref } from "vue";
import ArticleMeta from "@/components/article/ArticleMeta.vue";
import Pagination from "@/components/common/Pagination.vue";

const store = useArticleStore();
const router = useRouter();

// 分页参数
const currentPage = ref(1);
const pageSize = ref(6);

// 获取文章列表
const articles = computed(() => store.articles);
const totalArticles = computed(() => store.totalArticles);
const loading = computed(() => store.loading);
const error = computed(() => store.error);

// 当组件挂载时，获取文章列表
onMounted(async () => {
  try {
    await store.fetchArticles({
      page: currentPage.value,
      page_size: pageSize.value
    });
  } catch (error) {
    console.error('获取文章列表失败:', error);
  }
});

// 监听当前页码的变化
const handlePageChange = async (page: number) => {
  currentPage.value = page;
  try {
    await store.fetchArticles({
      page: currentPage.value,
      page_size: pageSize.value,
    });
  } catch (error) {
    console.error('获取文章列表失败:', error);
  }
};

// 阅读更多的功能
const readMore = (id: number) => {
  router.push({ name: "PostDetail", params: { id } });
};
</script>

<style scoped>
.article-list {
  padding-bottom: 20px;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px; /* 每个文章之间的间距 */
}

.article-item {
  padding: 20px;
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
