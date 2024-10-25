<template>
  <div class="popular-posts">
    <div class="title">
      <h3>全站热门</h3>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">加载中...</div>

    <!-- 错误状态 -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- 热门文章列表 -->
    <ul v-if="!loading && !error && posts && posts.length" class="post-list">
      <li v-for="(post, index) in posts" :key="post.id" class="post-item">
        <a :href="`/posts/${post.id}`" class="post-link">
          {{ post.title }}
        </a>
        <i class="fas fa-eye"></i>
        <span>{{ post.views }}</span>
      </li>
    </ul>

    <!-- 如果没有文章 -->
    <div v-if="!loading && !error && posts.length === 0" class="no-posts">
      暂无热门文章
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from "vue";
import { useArticleStore } from "@/stores/articleStore";

const articleStore = useArticleStore();

const posts = computed(() => articleStore.popularPosts);
const loading = computed(() => articleStore.loading);
const error = computed(() => articleStore.error);
let intervalId: number | undefined = undefined;

onMounted(() => {
  articleStore.fetchPopularPosts();

  // 每隔 1 小时刷新一次热门文章列表
  intervalId = setInterval(() => {
    articleStore.fetchPopularPosts(); // 修正了 postStore 为 articleStore
  }, 3600000);
});

// 清理定时器
onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<style scoped>
/* 外层容器 */
.popular-posts {
  padding: 20px;
  font-family: Arial, sans-serif;
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

/* 列表样式 */
.post-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* 每个文章条目 */
.post-item {
  margin-bottom: 10px;
}

/* 链接样式 */
.post-link {
  text-decoration: none;
  color: #333;
  font-size: 14px;
}

.post-link:hover {
  text-decoration: underline;
  color: #3c74b3;
}
</style>
