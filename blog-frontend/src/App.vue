<template>
  <div id="app">
    <!-- 导航栏 -->
    <AppNavbar />

    <div class="main-layout">
      <!-- 主内容区域 -->
      <div class="main-content">
        <router-view />  <!-- 动态加载页面，比如Home.vue，会通过路由加载到这里 -->
      </div>

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
/* 设置全局布局 */
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
  justify-content: space-between;
  padding: 20px;
}

/* 主内容区域样式 */
.main-content {
  flex: 3;
  padding-right: 20px;
}

/* 侧边栏样式 */
.sidebar {
  flex: 1;
  max-width: 300px;
  padding-left: 20px;
  border-left: 1px solid #eaeaea;
}

/* 页脚与导航栏间距样式 */
footer {
  margin-top: 20px;
}
</style>