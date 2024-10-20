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
  padding: 0;
  margin: 0;
  background-color: #8dc9e8;
}

.main-layout {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  max-width: 1200px; /* 添加最大宽度 */
  margin: 0 auto;    /* 居中布局 */
}

/* 针对移动设备的布局调整 */
@media (max-width: 768px) {
  .main-layout {
    flex-direction: column;  /* 竖向堆叠 */
  }

  .main-content {
    padding-right: 0;
  }
}

/* 主内容区域样式 */
.main-content {
  flex: 3;
  padding-right: 20px;
}

</style>