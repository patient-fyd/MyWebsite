<template>
  <div class="not-found">
    <h1>404</h1>
    <p>抱歉，您访问的页面不存在。</p>
    <router-link to="/" class="home-link"> 返回主页 </router-link>
  </div>
</template>

<script lang="ts" setup>
// 这里不需要特别的逻辑，简单展示错误信息
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}

.not-found h1 {
  font-size: 6rem;
  margin: 0;
  color: #ff6f61;
}

.not-found p {
  font-size: 1.5rem;
  margin: 1rem 0;
  color: #333;
}

.home-link {
  margin-top: 2rem;
  padding: 10px 20px;
  background-color: #8dc9e8;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 1.2rem;
}

.home-link:hover {
  background-color: #47abef;
}
</style>
