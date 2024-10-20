<template>
    <div class="navbar">
      <!-- 网站Logo -->
      <div class="logo">
        <img src="@/assets/logo-no-background.png" alt="网站Logo" />
      </div>

      <!-- 导航链接 -->
      <div class="nav-container">
        <ul class="nav-links">
          <li class="nav-item">
            <router-link to="/" exact-active-class="active">首页</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/recommended" exact-active-class="active">学习路线</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/plugin" exact-active-class="active">编程教程</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/guestbook" exact-active-class="active">留言小本</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/about" exact-active-class="active">关于更多</router-link>
          </li>
        </ul>
      </div>
    </div>
</template>

<script lang="ts" setup>

</script>

<style scoped>
/* 常规的导航栏样式 */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 25px;
  transition: all 0.3s ease;
  background-color: #ffffff;
  position: relative;
}



/* 设置 Logo 图片样式 */
.logo img {
  max-width: 150px;
  height: auto;
  margin-left: 20px;
}

.nav-container {
  position: relative;
  padding: 10px;
  margin-right: 80px;
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

.nav-item a {
  text-decoration: none;
  font-size: 18px;
  padding: 10px 20px;
  color: #333;
  transition: color 0.3s ease, border-bottom 0.3s ease;
  border-bottom: 2px solid #e0e0e0; /* 默认的底部线条颜色 */
  padding-bottom: 10px;
}

.nav-item a.active {
  color: #3c74b3; /* 选中时的颜色 */
  border-bottom: 2px solid #3c74b3; /* 选中时的底部线条颜色 */
}

.nav-item a:hover {
  font-weight: bold;
  color: #3c74b3;
}
</style>