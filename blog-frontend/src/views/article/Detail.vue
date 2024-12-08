<template>
  <div v-if="post">
    <div class="article-header">
      <h2>{{ post.title }}</h2>
      <ArticleMeta
        :author="post.author"
        :createdAt="post.created_at"
        :commentsCount="post.comments?.length ?? 0"
        :views="post.views"
      />
    </div>
    <div class="article-content">
      <MdPreview v-model="post.content" />
    </div>
    <div class="article-actions">
      <button @click="handleEdit">修改文章</button>
      <button @click="handleDelete">删除文章</button>
    </div>
    <CommentList :postId="Number(route.params.id)" />
  </div>
  <p v-else-if="loading">加载中...</p>
  <p v-else-if="error">{{ error }}</p>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { articleService } from "@/services/modules/articleService"
import type { Post } from "@/services/types/article"
import ArticleMeta from "@/components/article/ArticleMeta.vue"
import { MdPreview } from "md-editor-v3"
import "md-editor-v3/lib/style.css"
import "highlight.js/styles/github.css"
import CommentList from '@/components/comment/CommentList.vue'

const route = useRoute()
const router = useRouter()
const post = ref<Post | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const fetchPost = async (id: number) => {
  loading.value = true
  try {
    post.value = await articleService.getArticleById(id)
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const handleDelete = async () => {
  if (!post.value || !confirm("确定要删除这篇文章吗？")) return
  
  try {
    await articleService.deleteArticle(post.value.id)
    await router.push("/")
  } catch (err: any) {
    error.value = err.message
  }
}

const handleEdit = () => {
  if (!post.value) return
  router.push({
    name: "EditArticle",
    params: { id: post.value.id },
    query: { edit: "true" }
  })
}

onMounted(() => {
  const postId = Number(route.params.id)
  fetchPost(postId)
})
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
