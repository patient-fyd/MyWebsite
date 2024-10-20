<template>
  <el-header>
    <div class="navbar">
      <!-- 网站Logo -->
      <div class="logo">
        <img src="@/assets/vue.svg" alt="网站Logo" />
      </div>

      <!-- 导航链接 -->
      <el-menu class="nav-links" mode="horizontal" :router="true">
        <el-menu-item index="/">首页</el-menu-item>
        <el-menu-item index="/about">关于我们</el-menu-item>
        <el-menu-item index="/archive">归档</el-menu-item>
      </el-menu>

      <!-- 搜索框 -->
      <el-input
          placeholder="搜索文章"
          v-model="searchQuery"
          @keyup.enter="onSearch"
          class="search-bar"
      >
        <template #prepend>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <!-- 用户菜单 -->
      <el-dropdown v-if="isAuthenticated" class="user-menu">
        <span class="el-dropdown-link">
          {{ user.name }} <el-icon><ArrowDown /></el-icon>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click="logout">登出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <!-- 登录/注册按钮 -->
      <div class="button-container">
        <!-- 按钮 1 -->
        <a class="button act-now" @click="login">登录</a>

        <!-- 按钮 2 -->
        <a href="#" class="button menu-icon">&#9776;</a> <!-- Unicode for hamburger icon -->
      </div>
    </div>
  </el-header>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Search, ArrowDown } from '@element-plus/icons-vue';

// 定义用户信息的类型
interface User {
  name: string;
}

// 假设用户状态来自 Store 或全局状态
const isAuthenticated = ref<boolean>(false); // 是否认证的状态
const user = ref<User>({ name: 'John Doe' }); // 用户信息

// 搜索功能
const searchQuery = ref<string>(''); // 搜索框输入内容
const router = useRouter();

const onSearch = (): void => {
  if (searchQuery.value) {
    router.push({ path: `/search`, query: { q: searchQuery.value } });
  }
};

// 模拟登录和注册操作
const login = (): void => {
  router.push('/login');
};

const register = (): void => {
  router.push('/register');
};

const logout = (): void => {
  isAuthenticated.value = false;
  router.push('/');
};
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo img {
  height: 40px;
}

.nav-links {
  flex: 1;
  margin-left: 20px;
  background-color: transparent;
}

.nav-links .el-menu-item {
  border-radius: 10px;
}

.search-bar {
  width: 300px;
}

.auth-buttons {
  display: flex;
  gap: 10px;
}

.user-menu {
  margin-left: 20px;
}

.search-bar + .auth-buttons {
  margin-left: 20px;
}

/* 按钮样式 */
.button-container {
  display: flex;
  gap: 10px;
}

.button {
  display: inline-block;
  padding: 4px 16px;
  font-size: 14px;
  font-family: "WebCentraNo1", ui-sans-serif, system-ui, sans-serif;
  color: #000000;
  text-decoration: none;
  border-radius: 22px;
  background-color: #fdeb8c;
  white-space: nowrap;
  text-align: center;
  line-height: 30px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

/* 按钮悬停时的效果 */
.button:hover {
  background-color: #ffeb3b; /* 悬停时更亮的背景颜色 */
  transform: scale(1.05); /* 轻微放大 */
}

/* 特定的菜单图标按钮样式 */
.menu-icon {
  font-size: 18px;
  padding: 4px 10px;
  background-color: #fdeb8c;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%; /* 圆形按钮 */
}
</style>