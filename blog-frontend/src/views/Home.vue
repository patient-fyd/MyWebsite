<template>
  <div class="home">
    <div class="content">
      <!-- 左侧文字区域 -->
      <div class="text-section">
        <h1>轻松编程，无惧信息差</h1>
        <p>
          💻这是一个专注于编程技术分享的个人网站，旨在帮助初学者从零开始轻松入门编程。
          通过打破信息壁垒，提供细致的学习步骤和教程，网站不仅让编程变得更加简单和易于理解，
          还通过深入浅出的方式覆盖编程的每个关键环节，帮助用户掌握从基础到进阶的知识。
        </p>
      </div>

      <!-- 右侧图片区域 -->
      <div class="image-section">
        <img src="@/assets/homeIMG.jpg" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 这个组件无需额外的逻辑，只需简单布局即可。
</script>

<style scoped>
.home {
  //background-color: #c6e2f3; /* 蓝色背景，类似图片中的色调 */
  padding: 50px;
}

.content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px; /* 为内容和图片之间添加间距 */
}

.text-section {
  flex: 1;
  color: #000; /* 黑色文字 */
  font-family: 'Arial', sans-serif;
  max-width: 600px; /* 控制文本的最大宽度 */
}

.text-section h1 {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.text-section p {
  font-size: 1.2rem;
  line-height: 1.6;
}

.image-section {
  flex: 1;
  text-align: right;
}

.image-section img {
  width: 80%; /* 调整图片的宽度为 80% */
  max-width: 400px; /* 设置图片的最大宽度为 400px */
  height: auto; /* 保持图片的宽高比 */
  border-radius: 10px; /* 圆角效果 */
}
</style>