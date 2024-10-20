<template>
  <div class="home">
    <div class="content">
      <!-- 左侧文字区域 -->
      <div class="text-section">
        <h1>Join the fight against global warming</h1>
        <p>
          Climate science states we must reduce our emissions as much as possible
          and actively remove the rest with carbon dioxide removal.
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
  max-width: 100%;
  height: auto;
  border-radius: 10px; /* 可选的圆角效果 */
}
</style>