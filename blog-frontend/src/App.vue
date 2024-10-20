<template>
  <div id="app">
    <AppNavbar />

    <div class="main-layout">
      <!-- 主内容区域 -->
      <div class="main-content">
        <router-view />
      </div>

    </div>

    <!-- 页脚 -->
    <AppFooter />
  </div>
</template>

<script lang="ts" setup>
// 导入全局组件
import AppNavbar from './components/common/Navbar.vue';  // 导航栏组件
import AppFooter from './components/common/Footer.vue';  // 页脚组件
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
  background-color: #9ac7e5;
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

</style>