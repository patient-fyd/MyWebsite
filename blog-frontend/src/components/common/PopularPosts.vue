<template>
  <div class="popular-posts">
    <div class="title">
      <h3>全站热门</h3>
    </div>
    <div class="hot-posts">
      <!-- 热门文章列表 -->
      <ul class="post-list">
        <li v-for="(post, index) in posts" :key="index" class="post-item">
          <a href="#" class="post-link">{{ post }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
// 假设从服务端获取的热门文章数据
const posts = [
  '程序员技术练级攻略',
  '“火柴根式”程序员面试题',
  '简明 Vim 练级攻略',
  '“作坏保的程序员，从不用百度开始”',
  'TCP 的那些事儿（上）',
  '做个环保主义的程序员',
  '编程能力与编程年龄',
  'AWK 简明教程',
  '二维码的生成细节和原理',
  'sed 简明教程',
  '如何学好C语言',
  '如何超越大多数人',
  '疫苗：Java HashMap的死循环'
];
</script>

<style scoped>
/* 外层容器 */
.popular-posts {
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 标题样式 */
.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  border-left: 3px solid #3c74b3;
  padding-left: 8px;
}

/* 列表样式 */
.post-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* 每个文章条目 */
.post-item {
  margin-bottom: 10px;
}

/* 链接样式 */
.post-link {
  text-decoration: none;
  color: #333;
  font-size: 14px;
}

.post-link:hover {
  text-decoration: underline;
  color: #3c74b3;
}
</style>