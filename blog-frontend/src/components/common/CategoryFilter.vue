<template>
  <div class="category-filter">
    <!-- 标题 -->
    <div class="title">
      <h3>分类</h3>
    </div>

    <!-- 分类列表 -->
    <div class="category-header">
      <ul class="category-list">
        <li v-for="(category, index) in categories" :key="index" class="category-item">
          <a href="#" class="category-link">{{ category.name }} ({{ category.count }})</a>

          <!-- 如果有子分类，显示子分类 -->
          <ul v-if="category.subcategories" class="subcategory-list">
            <li v-for="(subcategory, subindex) in category.subcategories" :key="subindex" class="subcategory-item">
              <a href="#" class="subcategory-link">{{ subcategory.name }} ({{ subcategory.count }})</a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
// 假设从服务端获取的分类数据
const categories = [
  { name: '业界新闻', count: 33 },
  { name: '企业应用', count: 2 },
  { name: '技术新闻', count: 38 },
  { name: '技术管理', count: 19 },
  { name: '技术译物', count: 125 },
  { name: '操作系统', count: 97, subcategories: [
      { name: 'Unix/Linux', count: 81 },
      { name: 'Windows', count: 12 }
    ]
  },
  { name: '数据库', count: 11 },
  { name: '杂项资源', count: 295 },
  { name: '流程方法', count: 48 },
  { name: '程序设计', count: 110 },
  { name: '系统架构', count: 15 },
  { name: '编程工具', count: 67 },
  { name: '编程语言', count: 326, subcategories: [
      { name: '.NET编程', count: 3 },
      { name: 'Ajax开发', count: 9 },
      { name: 'C/C++语言', count: 74 },
      { name: 'Erlang', count: 1 },
      { name: 'Go 语言', count: 15 }
    ]
  }
];
</script>

<style scoped>
/* 外层容器 */
.category-filter {
  padding: 20px;
  font-family: Arial, sans-serif;
  margin-top: 20px;
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

/* 分类列表样式 */
.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* 分类项样式 */
.category-item {
  margin-bottom: 10px;
}

/* 分类链接样式 */
.category-link {
  text-decoration: none;
  color: #333;
  font-size: 14px;
}

.category-link:hover {
  text-decoration: underline;
  color: #3c74b3;
}

/* 子分类列表样式 */
.subcategory-list {
  list-style: none;
  padding: 5px 0 5px 20px;
  margin: 0;
}

/* 子分类项样式 */
.subcategory-item {
  margin-bottom: 5px;
}

/* 子分类链接样式 */
.subcategory-link {
  text-decoration: none;
  color: #666;
  font-size: 13px;
}

.subcategory-link:hover {
  text-decoration: underline;
  color: #3c74b3;
}
</style>