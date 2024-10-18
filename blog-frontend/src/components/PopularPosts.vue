<template>
  <div class="popular-posts">
    <h3>热门文章</h3>
    <el-list>
      <el-list-item v-for="post in popularPosts" :key="post.id">
        <a @click="goToPost(post.id)">{{ post.title }}</a>
      </el-list-item>
    </el-list>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAxios } from '@/composables/useAxios'; // 自定义 Axios 组合式 API

// 热门文章数据
const popularPosts = ref([]);

// 获取热门文章数据
const { axios } = useAxios();
onMounted(() => {
  axios.get('/api/popular-posts').then(response => {
    popularPosts.value = response.data;
  });
});

// 跳转到热门文章详情
const goToPost = (id) => {
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
</style>