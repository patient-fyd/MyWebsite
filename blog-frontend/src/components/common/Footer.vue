<template>
  <footer class="footer">
    <div class="footer-content">
      <!-- 版权信息 -->
      <p>Copyright © 2024 GFY . All rights reserved.</p>

      <!-- 备案号 -->
      <p>
        备案号：
        <a
          href="http://beian.miit.gov.cn/"
          target="_blank"
          rel="noopener noreferrer"
        >
          赣ICP备2024046184号
        </a>
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
// 不需要额外的逻辑，仅渲染模板
</script>

<style scoped>
.footer {
  background-color: #8dc9e8; /* 背景颜色 */
  color: #ffffff; /* 文字颜色 */
  padding: 20px;
  text-align: center; /* 文本居中 */
  font-size: 16px;
  position: relative;
  bottom: 0;
  box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
}

.footer-content p {
  margin: 5px 0;
}

a {
  color: #ffffff;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #47abef;
  }
}

@media (max-width: 768px) {
  .footer {
    padding: 15px;
    font-size: 12px;
  }
}
</style>
