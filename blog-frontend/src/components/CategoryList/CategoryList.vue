<template>
  <div class="article-list">
    <h2>{{ currentCategoryName }}</h2>
    <div v-if="store.error">
      <p>{{ store.error }}</p>
    </div>
    <!-- 展示多个文章的列表 -->
    <div
      v-for="(article, index) in store.articles"
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
      v-if="totalArticles > pageSize"
      :totalItems="totalArticles"
      :pageSize="pageSize"
      :currentPage="currentPage"
      @update:currentPage="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { useCategoryTagStore } from "@/stores/categoryTagStore";
import { useRouter } from "vue-router";
import { onMounted, watch, computed, ref } from "vue";
import ArticleMeta from "@/components/common/ArticleMeta.vue";
import Pagination from "@/components/home/Pagination.vue"; // 确保正确导入

const store = useCategoryTagStore();
const router = useRouter();

// 获取路由参数中的 categoryId
const categoryId = router.params.categoryId;

// 分页参数
const currentPage = ref(1);
const pageSize = ref(6);

// 获取类别名称
const currentCategoryName = computed(() => {
  const category = store.categories.find(
    (cat) => String(cat.id) === String(categoryId),
  );
  return category ? category.name : "未知类别";
});

// 总文章数
const totalArticles = computed(() => store.totalArticles);

// 当组件挂载时，根据 categoryId 获取文章列表
onMounted(async () => {
  if (store.categories.length === 0) {
    await store.fetchCategories();
  }
  await store.fetchArticlesByCategory(
    categoryId,
    currentPage.value,
    pageSize.value,
  );
});

// 监听路由参数的变化
watch(
  () => router.params.categoryId,
  async (newCategoryId) => {
    if (store.categories.length === 0) {
      await store.fetchCategories();
    }
    currentPage.value = 1; // 当类别变化时，重置当前页码
    await store.fetchArticlesByCategory(
      newCategoryId,
      currentPage.value,
      pageSize.value,
    );
  },
);

// 监听当前页码的变化
const handlePageChange = (page: number) => {
  currentPage.value = page;
  store.fetchArticlesByCategory(categoryId, currentPage.value, pageSize.value);
};

// 阅读更多的功能
const readMore = (id: number) => {
  router.push({ name: "PostDetail", params: { id } });
};
</script>

<style scoped>
h2 {
  text-align: center;
  margin: 0;
}
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
