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
      <div v-else class="auth-buttons">
        <el-button type="primary" @click="login">登录</el-button>
        <el-button type="success" @click="register">注册</el-button>
      </div>
    </div>
  </el-header>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Search, ArrowDown } from '@element-plus/icons-vue';

// 假设用户状态来自 Store 或全局状态
const isAuthenticated = ref(false); // 你可以从 store 或 API 获取用户认证状态
const user = ref({ name: 'John Doe' });

// 搜索功能
const searchQuery = ref('');
const router = useRouter();
const onSearch = () => {
  if (searchQuery.value) {
    router.push({ path: `/search`, query: { q: searchQuery.value } });
  }
};

// 模拟登录和注册操作
const login = () => {
  router.push('/login');
};

const register = () => {
  router.push('/register');
};

const logout = () => {
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
</style>