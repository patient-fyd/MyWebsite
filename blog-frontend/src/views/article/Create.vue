<template>
  <ArticleEditor
    action-text="发布"
    :categories="categories"
    :available-tags="availableTags"
    @submit="handleSubmit"
  />
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { articleService } from "@/services/modules/articleService"
import { useCategoryTagStore } from "@/stores/categoryTagStore"
import ArticleEditor from "@/components/article/ArticleEditor.vue"

const router = useRouter()
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
    await articleService.createArticle({
      title: data.title,
      content: data.content,
      category_id: data.categoryID,
      tags: data.tags,
      summary: data.summary
    })
    await router.push("/")
  } catch (err: any) {
    alert(err.message)
  }
}

onMounted(async () => {
  await categoryTagStore.fetchCategories()
  await categoryTagStore.fetchTags()
})
</script>
