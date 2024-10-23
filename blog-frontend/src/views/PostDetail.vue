<template>
  <div v-if="post">
    <div class="article-header">
      <h2>{{ post.title }}</h2>
      <ArticleMeta
        :author="post.author"
        :createdAt="post.created_at"
        :commentsCount="post.comments ? post.comments.length : 0"
        :views="post.views"
      />
    </div>
    <div class="article-content">
      <p>{{ post.content }}</p>
    </div>
  </div>
  <p v-if="loading">加载中...</p>
  <p v-if="error">{{ error }}</p>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { useArticleStore } from "@/stores";
import ArticleMeta from "@/components/common/ArticleMeta.vue";

const route = useRoute();
const postStore = useArticleStore();

// 使用 computed 确保 articleDetail 是响应式的
const post = computed(() => postStore.articleDetail);
const loading = computed(() => postStore.loading);
const error = computed(() => postStore.error);

// 获取文章详情的方法
const fetchPost = async (id: number) => {
  await postStore.fetchPostById(id);
};

// 在组件挂载时加载文章详情
onMounted(() => {
  const postId = Number(route.params.id);
  fetchPost(postId);
});

// 监听路由参数变化，当文章 ID 改变时重新获取文章详情
watch(
  () => route.params.id,
  (newId) => {
    fetchPost(Number(newId));
  },
);
</script>

<style scoped>
.article-item {
  margin-top: 20px;
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

.article-content {
  margin-top: 20px;
  line-height: 1.6;
}
</style>
