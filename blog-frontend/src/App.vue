<template>
  <div id="app">
    <!-- 导航栏 -->
    <AppNavbar />

    <div class="main-layout">
      <!-- 主内容区域（路由视图） -->
      <router-view />

      <!-- 热门文章侧边栏 -->
      <aside class="sidebar">
        <PopularPosts />
      </aside>
    </div>

    <!-- 页脚 -->
    <AppFooter />
  </div>
</template>

<script setup>
// 导入全局组件
import AppNavbar from './components/common/Navbar.vue';  // 导航栏组件
import AppFooter from './components/common/Footer.vue';  // 页脚组件
import PopularPosts from './components/home/PopularPosts.vue';  // 热门文章组件
</script>

<style scoped>
/* 全局布局样式 */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 0;
  margin: 0;
}

.main-layout {
  display: flex;
  padding: 20px;
  justify-content: space-between;
}

.sidebar {
  flex: 1;
  max-width: 300px;
  margin-left: 20px;
}

/* 你可以根据需要自定义更多的样式 */
</style>