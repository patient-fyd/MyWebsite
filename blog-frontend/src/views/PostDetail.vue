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
      <!-- 使用 MdPreview 渲染 Markdown 内容 -->
      <MdPreview v-model="post.content" />
    </div>
    <!-- 在文章内容底部添加按钮 -->
    <div class="article-actions">
      <button @click="editPost">修改文章</button>
      <button @click="deletePost">删除文章</button>
    </div>
  </div>
  <p v-else-if="loading">加载中...</p>
  <p v-else-if="error">{{ error }}</p>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useArticleStore } from "@/stores/articleStore";
import ArticleMeta from "@/components/common/ArticleMeta.vue";

// 导入 MdPreview 组件和样式
import { MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import "highlight.js/styles/github.css";

const route = useRoute();
const router = useRouter();
const postStore = useArticleStore();

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

// 删除文章
const deletePost = async () => {
  if (confirm("确定要删除这篇文章吗？")) {
    await postStore.deletePostById(post.value!.id);
    // 删除成功后跳转到主页
    await router.push("/");
  }
};

// 修改文章
const editPost = () => {
  router.push({
    name: "EditArticle",
    params: { id: post.value!.id },
    query: { edit: "true" },
  });
};
</script>

<style scoped>
.article-header {
  margin-top: 20px;
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

.article-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.article-actions button {
  padding: 8px 16px;
  font-size: 16px;
}
</style>
