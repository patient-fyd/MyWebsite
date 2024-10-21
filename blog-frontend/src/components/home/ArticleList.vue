<template>
  <div class="article-list">
    <!-- 展示多个文章的列表 -->
    <div v-for="(article, index) in articles" :key="index" class="article-item">
      <!-- 顶部部分，可能是文章的头部信息，如标题、作者信息等 -->
      <div class="article-header">
        <h2>{{ article.title }}</h2>
        <p>{{ article.author }}</p>
      </div>

      <!-- 文章内容展示 -->
      <div class="article-content">
        <p>{{ article.summary }}</p>
      </div>

      <!-- 底部的按钮，可能是阅读更多或分享按钮 -->
      <div class="article-footer">
        <button @click="readMore(article.id)">阅读更多</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 假设从服务器获取的文章数据
const articles = ref([
  { id: 1, title: '文章标题1', author: '作者1', summary: '文章摘要1...' },
  { id: 2, title: '文章标题2', author: '作者2', summary: '文章摘要2...' },
  { id: 3, title: '文章标题3', author: '作者3', summary: '文章摘要3...' },
  { id: 4, title: '文章标题4', author: '作者4', summary: '文章摘要4...'},
  { id: 5, title: '文章标题5', author: '作者5', summary: '文章摘要5...'},
  { id: 6, title: '文章标题6', author: '作者6', summary: '文章摘要6...'},
  // 继续添加更多文章
]);

// 阅读更多的功能，可以自定义跳转或展示逻辑
const readMore = (id: number) => {
  console.log('阅读更多文章，ID:', id);
  // 这里可以实现跳转到文章详情页的逻辑
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
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.article-header {
  margin-bottom: 15px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.article-header h2 {
  margin: 0;
  font-size: 24px;
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
  background-color: #47abef;
}
</style>