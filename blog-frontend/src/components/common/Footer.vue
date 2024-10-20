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
    </div>
  </el-footer>
</template>

<script lang="ts" setup>
/* */
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
