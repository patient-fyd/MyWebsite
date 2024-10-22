<template>
  <div id="app">
    <div class="header">
      <AppNavbar />
      <GoalView />
    </div>
    <div class="container">
      <div class="content">
        <div class="section">
          <router-view />
        </div>
        <div class="sidebar">
          <Common />
        </div>
      </div>
    </div>
    <div class="footer">
      <AppFooter />
    </div>
  </div>
</template>

<script lang="ts" setup>
import AppNavbar from "./components/common/Navbar.vue";
import AppFooter from "./components/common/Footer.vue";
import GoalView from "@/components/common/GoalView.vue";
import Common from "@/views/Common.vue";
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
</style>
