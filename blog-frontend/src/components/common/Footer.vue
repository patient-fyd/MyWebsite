<template>
  <el-footer class="footer">
    <div class="footer-content">
      <!-- 左侧：版权信息 -->
      <div class="copyright">
        &copy; 2024 YourWebsite. All rights reserved.
      </div>

      <!-- 中间：备案号 -->
      <div class="record-number">
        <a href="https://beian.miit.gov.cn/" target="_blank">赣ICP备2024046184号-1</a>
      </div>

      <!-- 右侧：社交媒体链接 -->
      <div class="social-links">
        <el-icon @click="openLink('https://facebook.com')">
          <i class="fab fa-facebook"></i>
        </el-icon>
        <el-icon @click="openLink('https://twitter.com')">
          <i class="fab fa-twitter"></i>
        </el-icon>
        <el-icon @click="openLink('https://linkedin.com')">
          <i class="fab fa-linkedin"></i>
        </el-icon>
      </div>
    </div>
  </el-footer>
</template>

<script setup>
const openLink = (url) => {
  window.open(url, '_blank');
};
</script>

<style scoped>
.footer {
  padding: 20px;
  background-color: #f8f9fa;
  text-align: center;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.record-number {
  flex: 1;
  text-align: center;
  font-size: 14px;
}

.social-links {
  display: flex;
  gap: 10px;
}

.social-links i {
  font-size: 24px;
  cursor: pointer;
}
</style>

<!-- 在index.html中引入Font Awesome -->
