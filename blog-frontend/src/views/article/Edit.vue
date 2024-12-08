<template>
  <ArticleEditor
    v-if="article"
    action-text="保存修改"
    :initial-data="article"
    :categories="categories"
    :available-tags="availableTags"
    @submit="handleSubmit"
  />
  <div v-else>加载中...</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { articleService } from "@/services/modules/articleService"
import { useCategoryTagStore } from "@/stores/categoryTagStore"
import ArticleEditor from "@/components/article/ArticleEditor.vue"
import type { Article } from "@/services/types/article"

const route = useRoute()
const router = useRouter()
const postId = Number(route.params.id)
const article = ref<Article | null>(null)

const categoryTagStore = useCategoryTagStore()
const categories = computed(() => categoryTagStore.categories)
const availableTags = computed(() => categoryTagStore.tags.map(tag => tag.name))

const handleSubmit = async (data: {
  title: string
  content: string
  categoryID: number
  tags: string[]
  summary: string
}) => {
  try {
    await articleService.updateArticle(postId, {
      title: data.title,
      content: data.content,
      category_id: data.categoryID,
      tags: data.tags,
      summary: data.summary
    })
    await router.push({ name: "PostDetail", params: { id: postId } })
  } catch (err: any) {
    alert(err.message)
  }
}

onMounted(async () => {
  await categoryTagStore.fetchCategories()
  await categoryTagStore.fetchTags()
  article.value = await articleService.getArticleById(postId)
})
</script>
