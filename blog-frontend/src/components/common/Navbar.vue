<template>
  <header>
    <div class="navbar">
      <!-- 网站Logo -->
      <div class="logo">
        <img src="@/assets/logo-no-background.png" alt="网站Logo" />
      </div>

      <!-- 导航链接 -->
      <nav class="nav-links">
        <ul>
          <li><a href="/">首页</a></li>
          <li><a href="/about">关于我们</a></li>
          <li><a href="/archive">归档</a></li>
        </ul>
      </nav>

      <!-- 用户菜单 -->
      <div v-if="isAuthenticated" class="user-menu">
        <div class="user-name">
          {{ user.name }} <span class="arrow-down">&#x25BC;</span> <!-- Unicode for down arrow -->
        </div>
        <ul class="dropdown-menu">
          <li @click="logout">登出</li>
        </ul>
      </div>

      <!-- 登录/注册按钮 -->
      <div class="button-container">
        <a class="button act-now" @click="login">登录</a>
        <a href="#" class="button menu-icon">&#9776;</a> <!-- Unicode for hamburger icon -->
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';

// 定义用户信息的类型
interface User {
  name: string;
}

// 假设用户状态来自 Store 或全局状态
const isAuthenticated = ref<boolean>(false); // 是否认证的状态
const user = ref<User>({ name: 'John Doe' }); // 用户信息

// 模拟登录和注册操作
const login = (): void => {
  router.push('/login');
};

const logout = (): void => {
  isAuthenticated.value = false;
  router.push('/');
};

// 定义一个状态来跟踪导航栏是否应固定
const isSticky = ref(false);

// 滚动事件处理函数
const handleScroll = (): void => {
  isSticky.value = window.scrollY > 100; // 当页面滚动超过100像素时，将导航栏设为固定
};

// 挂载和卸载滚动事件监听器
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* 常规的导航栏样式 */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  transition: all 0.3s ease;
}

.sticky .navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: #ffffff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.logo img {
  max-width: 150px;
  height: auto;
  margin-top: 10px;
  margin-left: 25px;
}

/* 导航链接的容器样式 */
.nav-links ul {
  list-style-type: none;
  display: flex;
  gap: 20px;
}

.nav-links a {
  text-decoration: none;
  font-size: 18px;
  color: #333;
}

.nav-links a:hover {
  font-weight: bold;
}

/* 用户菜单容器样式 */
.user-menu {
  margin-left: 20px;
  position: relative;
}

.user-menu .user-name {
  cursor: pointer;
}

.user-menu .dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.user-menu:hover .dropdown-menu {
  display: block;
}

.button-container {
  display: flex;
  gap: 10px;
}

.button {
  display: inline-block;
  padding: 4px 16px;
  font-size: 14px;
  color: #000000;
  text-decoration: none;
  border-radius: 22px;
  background-color: #fdeb8c;
  white-space: nowrap;
  text-align: center;
  line-height: 30px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.button:hover {
  background-color: #ffeb3b;
  transform: scale(1.05);
}

.menu-icon {
  font-size: 18px;
  padding: 4px 10px;
  background-color: #fdeb8c;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
</style>