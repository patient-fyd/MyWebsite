<template>
  <div class="container">
    <div class="header">
      <div class="logo-title">
        <h1>轻松学编程，无惧信息差</h1>
      </div>
      <div class="subtitle">
        <p>这是一个专注于编程技术分享的个人网站，旨在帮助初学者从零开始轻松入门编程。
          通过打破信息壁垒，提供细致的学习步骤和教程</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 不需要特殊的逻辑代码，仅需要模板和样式
</script>

<style scoped>
/* 容器设置 */
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #8dc9e8; /* 背景颜色 */
  padding: 20px;
  height: 180px; /* 整个容器的高度 */
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 60%;
}

.logo-title h1 {
  font-size: 48px;
  color: #ffffff;
  margin: 0;
}

.subtitle p {
  font-size: 20px;
  color: #ffffff;
  margin: 0;
  border-top: 1px solid #ffffff; /* 上面的白线 */
  padding-top: 10px;
  /*文字居中*/
  text-align: center;
}

/* 响应式设计：在小屏幕下对齐方式修改 */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>