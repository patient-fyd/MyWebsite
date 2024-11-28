<template>
  <div class="reading-notes">
    <div class="main-layout">
      <!-- 左侧固定导航栏 -->
      <div class="sidebar">
        <ul>
          <li v-for="item in navItems" :key="item.path">
            <router-link
              :to="item.path"
              class="nav-link"
              active-class="active-link"
            >
              {{ item.label }}
            </router-link>
          </li>
        </ul>
      </div>
      <!-- 主内容区域 -->
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const navItems = [
  { label: "首页", path: "/readingNotes/home" },
  { label: "书籍列表", path: "/readingNotes/books" },
  { label: "随想笔记", path: "/readingNotes/thoughts" },
  { label: "购书清单", path: "/readingNotes/purchase-list" },
  { label: "阅读计划", path: "/readingNotes/reading-plan" },
  { label: "分享", path: "/readingNotes/share" },
];
</script>

<style scoped>
.reading-notes {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.main-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  position: fixed;
  top: 50%; /* 定位到视口高度的 50% */
  left: 0;
  width: 200px;
  height: auto; /* 根据内容调整高度 */
  background-color: #f9f9f9;
  border-right: 1px solid #ddd;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  transform: translateY(-50%); /* 垂直居中 */
  z-index: 1000;
}

.nav-link {
  display: block;
  padding: 10px 15px;
  color: #333;
  text-decoration: none;
  margin-bottom: 5px;
  border-radius: 4px;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

.nav-link:hover {
  background-color: #8dc9e8;
  color: #fff;
}

.active-link {
  background-color: #8dc9e8;
  color: #fff;
}

.content {
  margin-left: 200px; /* 留出左侧导航栏的宽度 */
  margin-top: 60px; /* 留出顶级导航栏的高度 */
  flex: 1;
  padding: 20px;
  overflow-y: auto; /* 内容区域可滚动 */
  background-color: #f9f9f9;
}
</style>
