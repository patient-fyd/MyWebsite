<template>
  <div class="navbar">
    <!-- 网站Logo -->
    <div class="logo">
      <router-link to="/">
        <img src="@/assets/logo-no-background.png" alt="网站Logo" />
      </router-link>
    </div>

    <!-- 导航链接 -->
    <div class="nav-container">
      <ul class="nav-links">
        <li class="nav-item">
          <router-link to="/" exact-active-class="active">首页</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/learningRoute" exact-active-class="active"
            >学习路线</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/plugin" exact-active-class="active"
            >学习打卡</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/guestbook" exact-active-class="active"
            >留言本站</router-link
          >
        </li>

        <!-- 动态渲染的 "个人中心" 或 "关于更多" -->
        <li
          class="nav-item"
          @mouseenter="showDropdown"
          @mouseleave="hideDropdown"
        >
          <router-link
            v-if="isAuthenticated"
            to="/profile"
            exact-active-class="active"
            >个人中心</router-link
          >
          <router-link v-else to="/aboutme" exact-active-class="active"
            >关于更多</router-link
          >

          <!-- 二级导航菜单 -->
          <transition name="fade">
            <ul v-if="isDropdownVisible" class="dropdown-menu">
              <!-- 当用户已登录并且是管理员时，显示创建文章 -->
              <li v-if="isAuthenticated && isAdmin" class="dropdown-item">
                <router-link to="/posts">创建文章</router-link>
              </li>
              <li v-if="isAuthenticated" class="dropdown-item">
                <router-link to="/change-password">修改密码</router-link>
              </li>
              <li v-if="isAuthenticated" class="dropdown-item">
                <a href="javascript:void(0)" @click.prevent="logout"
                  >退出登录</a
                >
              </li>

              <!-- 当用户未登录时，显示登录和注册选项 -->
              <li v-if="!isAuthenticated" class="dropdown-item">
                <router-link to="/login">登录</router-link>
              </li>
              <li v-if="!isAuthenticated" class="dropdown-item">
                <router-link to="/register">注册</router-link>
              </li>
            </ul>
          </transition>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useUserStore } from "@/stores"; // 引入用户 store
import { useRouter } from "vue-router"; // 引入路由

// 获取用户 store 和登录状态
const userStore = useUserStore();

// 使用 computed 来确保 isAuthenticated 是响应式的
const isAuthenticated = computed(() => userStore.isAuthenticated);
const isAdmin = computed(() => userStore.isAdmin);

const router = useRouter();

// 控制二级导航的显示
const isDropdownVisible = ref(false);

// 显示和隐藏二级导航菜单
const showDropdown = () => {
  isDropdownVisible.value = true;
};
const hideDropdown = () => {
  isDropdownVisible.value = false;
};

// 处理退出登录
const logout = () => {
  userStore.logout();
  // 直接重定向到主页，不需要等待 DOM 更新
  router.push("/");
};
</script>
<style scoped>
/* 常规的导航栏样式 */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px;
  transition: all 0.3s ease;
  background-color: #ffffff;
  position: relative;
}

/* 设置 Logo 图片样式 */
.logo img {
  max-width: 150px;
  height: auto;
  margin-left: 30px;
}

.nav-container {
  position: relative;
  padding: 10px;
  margin-right: 30px;
}

.nav-links {
  display: flex;
  justify-content: space-around;
  position: relative;
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  position: relative;
  cursor: pointer;
}

/* 导航链接的样式 */
.nav-item a {
  text-decoration: none;
  font-size: 18px;
  padding: 10px;
  color: #333;
  transition:
    color 0.3s ease,
    border-bottom 0.3s ease;
  border-bottom: 2px solid #e0e0e0;
}

.nav-item a.active {
  color: #8dc9e8;
  border-bottom: 2px solid #8dc9e8;
}

.nav-item a:hover {
  font-weight: bold;
  color: #8dc9e8;
}

/* 二级导航菜单样式 */
.dropdown-menu {
  list-style: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #fff;
  padding: 10px;
  margin: 0;
  border: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
  margin-bottom: 10px;
}

.dropdown-item:last-child {
  margin-bottom: 0;
}

.dropdown-item a {
  text-decoration: none;
  color: #333;
  padding: 5px 10px;
}

.dropdown-item a:hover {
  background-color: #f5f5f5;
}

/* 过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
