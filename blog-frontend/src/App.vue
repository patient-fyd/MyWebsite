<template>
  <div id="app">
    <!-- 如果不是全屏页面，显示导航栏和目标视图 -->
    <div v-if="!isFullScreenPage" class="header">
      <AppNavbar />
      <GoalView />
    </div>

    <!-- 主容器部分 -->
    <div
      :class="{
        'fullscreen-layout': isFullScreenPage,
        container: !isFullScreenPage,
      }"
    >
      <div class="content">
        <!-- 如果是全屏页面，不显示 section 和 sidebar -->
        <div :class="{ section: !isFullScreenPage }">
          <router-view />
        </div>
        <div v-if="!isFullScreenPage" class="sidebar">
          <Common />
        </div>
      </div>
    </div>

    <!-- 如果不是全屏页面，显示页脚 -->
    <div v-if="!isFullScreenPage" class="footer">
      <AppFooter />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import AppNavbar from "./components/common/Navbar.vue";
import AppFooter from "./components/common/Footer.vue";
import GoalView from "@/components/common/GoalView.vue";
import Common from "@/views/Common.vue";

// 使用 Vue Router 获取当前路由
const route = useRoute();
const isFullScreenPage = ref(false);

watch(
  () => route.path,
  (newPath) => {
    isFullScreenPage.value = newPath === "/login" || newPath === "/register";
  },
  { immediate: true }, // 确保初次加载时也能立即判断路由
);
</script>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}

#app {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}

.header {
  width: 100%;
}

/* Content 区域 */
.content {
  display: flex;
  flex: 1; /* 让 content 区域占据剩余的可用空间 */
  width: 100%;
  padding: 20px;
  box-sizing: border-box; /* 确保 padding 不影响整体宽度 */
  justify-content: center;
}

/* Section 占 70% */
.section {
  width: 70%; /* 左边占 70% */
  padding: 10px;
  box-sizing: border-box;
}

/* Sidebar 占 25% */
.sidebar {
  width: 25%; /* 右边占 25% */
  padding: 10px;
  box-sizing: border-box;
}

.fullscreen-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 全屏高度 */
  width: 100vw; /* 全屏宽度 */
  background-color: #ffffff;
}
</style>
