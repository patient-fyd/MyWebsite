<template>
  <div id="app">
    <!-- 导航栏始终显示 -->
    <div class="header">
      <AppNavbar />
    </div>

    <!-- 主容器部分 -->
    <div
      :class="{
        'fullscreen-layout': isFullScreenPage,
        'container': !isFullScreenPage,
      }"
    >
      <!-- 如果不是全屏页面，显示目标视图 -->
      <div v-if="!isFullScreenPage" class="goal-view">
        <GoalView />
      </div>

      <div class="content">
        <!-- 如果是全屏页面，不显示 section 和 sidebar -->
        <div :class="{ 'section': !isFullScreenPage, 'full-width': isFullScreenPage }">
          <router-view />
        </div>
        <div v-if="!isFullScreenPage" class="sidebar">
          <Common />
        </div>
      </div>
    </div>

    <ScrollToTop />

    <!-- 如果不是全屏页面，显示页脚 -->
    <div v-if="!isFullScreenPage" class="footer">
      <AppFooter />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import AppNavbar from "./components/common/Navbar.vue";
import AppFooter from "./components/common/Footer.vue";
import GoalView from "@/components/common/GoalView.vue";
import Common from "@/views/Common.vue";
import ScrollToTop from "@/components/common/ScrollToTop.vue";
import { useUserStore } from '@/stores/userStore'

// 使用 Vue Router 获取当前路由
const route = useRoute();
const isFullScreenPage = ref(false);
const userStore = useUserStore()

// 监听路径和查询参数变化
watch(
  () => ({ name: route.name, path: route.path, editMode: route.query.edit }),
  (newRoute) => {
    console.log('Current route:', newRoute);
    isFullScreenPage.value = [
      'NotFound',
      'CreateArticle',
      'EditArticle',
      'Login',
      'Register',
      'ChangePassword',
      'ResetPassword',
      'StudyTask'
    ].includes(newRoute.name as string) || 
    newRoute.path.startsWith('/readingNotes') ||
    newRoute.path === '/posts' ||
    newRoute.editMode === 'true';
  },
  { immediate: true }
);

onMounted(async () => {
  if (userStore.token) {
    await userStore.getUserInfo()
  }
})
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
  overflow: hidden;
}

.header {
  width: 100%;
}

.goal-view {
  width: 100%;
  padding: 10px 0;
  background-color: #f9f9f9;
  border-bottom: 1px solid #ddd;
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

.full-width {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.fullscreen-layout {
  flex: 1;
  width: 100%;
  background-color: #ffffff;
  min-height: calc(100vh - 60px); /* 减去导航栏的高度 */
}

.fullscreen-layout .content {
  padding: 0;
}
</style>
