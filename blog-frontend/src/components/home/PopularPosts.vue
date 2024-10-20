<template>
  <div class="popular-posts">
    <h3>热门文章</h3>
    <ul class="post-list">
      <li v-for="post in popularPosts" :key="post.id">
        <a @click="goToPost(post.id)">{{ post.title }}</a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useAxios } from '@/composables/useAxios.ts'; // 自定义 Axios 组合式 API

// 定义热门文章的数据类型
interface Post {
  id: number;
  title: string;
}

// 热门文章数据
const popularPosts = ref<Post[]>([]);

// 获取热门文章数据
const { axios } = useAxios();
onMounted(() => {
  axios.get<Post[]>('/api/popular-posts').then(response => {
    popularPosts.value = response.data;
  });
});

// 跳转到热门文章详情
const goToPost = (id: number): void => {
  window.location.href = `/article/${id}`; // 通过路由跳转到对应文章页面
};
</script>

<style scoped>
.popular-posts {
  padding: 10px;
  background-color: #f9f9f9;
}
.popular-posts h3 {
  margin-bottom: 10px;
}
.post-list {
  list-style-type: none;
  padding: 0;
}

.post-list li {
  margin-bottom: 8px;
}

.post-list a {
  color: #007bff;
  text-decoration: none;
}

.post-list a:hover {
  text-decoration: underline;
}
</style>