<template>
  <div class="create-post">
    <ArticleEditor
      actionText="发布文章"
      :categories="categories"
      :availableTags="tags"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ArticleEditor from '@/components/article/ArticleEditor.vue'
import { useCategoryTagStore } from '@/stores/categoryTagStore'
import { useArticleStore } from '@/stores/articleStore'

const router = useRouter()
const categoryTagStore = useCategoryTagStore()
const articleStore = useArticleStore()

const categories = ref<{ id: number; name: string }[]>([])
const tags = ref<string[]>([])

onMounted(async () => {
  // 获取分类和标签数据
  await categoryTagStore.fetchCategories()
  await categoryTagStore.fetchTags()
  categories.value = categoryTagStore.categories
  tags.value = categoryTagStore.tags.map(tag => tag.name)
})

const handleSubmit = async (data: {
  title: string;
  content: string;
  categoryID: number;
  tags: string[];
  summary: string;
}) => {
  try {
    const { title, content, categoryID, tags, summary } = data;
    await articleStore.createArticle({
      title,
      content,
      category_id: categoryID,
      tags,
      summary
    });
    router.push('/');
  } catch (error) {
    console.error('创建文章失败:', error);
  }
};
</script>

<style scoped>
.create-post {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>
