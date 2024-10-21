<template>
  <div class="other-actions">
    <!-- 标题 -->
    <div class="title">
      <h3>其他操作</h3>
    </div>

    <!-- 操作列表 -->
    <ul class="action-list">
      <li class="action-item">
        <a href="#" class="action-link">注册</a>
      </li>
      <li class="action-item">
        <a href="#" class="action-link">登录</a>
      </li>
    </ul>
  </div>
</template>

<script setup>
// 该组件不需要额外的逻辑
</script>

<style scoped>
/* 外层容器 */
.other-actions {
  padding: 20px;
  margin-top: 20px;
  font-family: Arial, sans-serif;
  background-color: #ffffff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);

}

/* 标题样式 */
.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  border-left: 3px solid #3c74b3;
  padding-left: 8px;
}

/* 操作列表 */
.action-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* 每个操作项的样式 */
.action-item {
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
}

/* 链接样式 */
.action-link {
  text-decoration: none;
  color: #555;
  font-size: 14px;
}

.action-link:hover {
  color: #47abef;
}
</style>