<template>
  <div class="article-list">
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
          <span v-for="(tag, tagIndex) in article.tags" :key="tagIndex"
            >{{ tag.name
            }}{{ tagIndex < article.tags.length - 1 ? ", " : "" }}</span
          >
        </p>
        <button @click="readMore(article.id)">阅读更多</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "@/store/index.ts";
import { onMounted } from "vue";
import ArticleMeta from "@/components/common/ArticleMeta.vue";

const store = useStore();

// 在组件挂载时调用 fetchArticles 方法
onMounted(() => {
  store.fetchArticles(); // 调用 store 中的方法获取文章列表
});

// 阅读更多的功能，可以自定义跳转或展示逻辑
const readMore = (id: number) => {
  console.log("阅读更多文章，ID:", id);
  // TODO 实现跳转到文章详情页的逻辑
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
