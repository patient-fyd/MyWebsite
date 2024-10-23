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
        <div class="post-meta">
          作者: {{ post.author.Username }} | 浏览: {{ post.views }} 次 | 类别:
          {{ post.category.name }}
        </div>
      </li>
    </ul>

    <!-- 如果没有文章 -->
    <div v-if="!loading && !error && posts.length === 0" class="no-posts">
      暂无热门文章
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { usePostStore } from "@/stores/postStore";

const postStore = usePostStore();
const { fetchPopularPosts, popularPosts, loading, error } = postStore;

onMounted(() => {
  fetchPopularPosts(); // 获取热门文章
});

// 绑定 store 中的数据
const posts = popularPosts;
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
