<template>
  <div class="article-meta" v-if="author && createdAt">
    <span>
      <i class="fas fa-calendar-alt"></i>
      <!-- 日历图标 -->
      {{ formatDate(createdAt) }}
    </span>
    <span>
      <i class="fas fa-user"></i>
      <!-- 用户图标 -->
      {{ author?.username || "匿名" }}
    </span>
    <span>
      <i class="fas fa-comments"></i>
      <!-- 评论图标 -->
      {{ commentsCount || 0 }} 条评论
    </span>
    <span>
      <i class="fas fa-eye"></i>
      <!-- 观看图标 -->
      {{ views || 0 }} 人阅读
    </span>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

interface Author {
  id: number;
  username: string;
}

const { author, createdAt, commentsCount, views } = defineProps({
  author: {
    type: Object as () => Author,
    required: true,
  },
  createdAt: String,
  commentsCount: Number,
  views: Number,
});

const formatDate = (date: string) => {
  return dayjs(date).format("YYYY年MM月DD日");
};
</script>

<style scoped>
.article-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
}

.article-meta span {
  display: flex;
  align-items: center;
  margin-right: 10px;
}
</style>
