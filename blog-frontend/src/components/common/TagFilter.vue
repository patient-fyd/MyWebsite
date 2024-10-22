<template>
  <div class="tag-filter">
    <!-- 标题 -->
    <div class="title">
      <h3>标签</h3>
    </div>

    <!-- 标签云 -->
    <div class="tag-cloud">
      <a
        v-for="(tag, index) in tags"
        :key="index"
        :href="`/tags/${tag.name}`"
        class="tag"
        :style="{ fontSize: `${tag.size * 0.6}rem` }"
        @click.prevent="filterByTag(tag.name)"
      >
        {{ tag.name }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
// 模拟的标签数据，每个标签有名称和大小
const tags = [
  { name: "agile", size: 1 },
  { name: "AJAX", size: 1.2 },
  { name: "Algorithm", size: 1.5 },
  { name: "Android", size: 1 },
  { name: "C++", size: 2 },
  { name: "Coding", size: 1.5 },
  { name: "CSS", size: 1.3 },
  { name: "Design", size: 1.7 },
  { name: "Google", size: 1.8 },
  { name: "HTML", size: 1.5 },
  { name: "Java", size: 2 },
  { name: "Javascript", size: 2.2 },
  { name: "Linux", size: 1.9 },
  { name: "Programmer", size: 2.5 },
  { name: "Python", size: 1.7 },
  { name: "Unix", size: 1.6 },
  { name: "Web", size: 1.3 },
  { name: "安全", size: 2 },
  { name: "程序员", size: 2.5 },
  { name: "算法", size: 1.4 },
  { name: "面试", size: 1.2 },
];

// 点击标签时执行的逻辑
const filterByTag = (tag: string) => {
  console.log("选择标签:", tag);
  // 此处可以处理标签筛选逻辑，比如发请求或导航到对应的标签页面
};
</script>

<style scoped>
/* 外层容器 */
.tag-filter {
  padding: 20px;
  margin-top: 20px;
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

/* 标签云容器 */
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

/* 标签样式 */
.tag {
  text-decoration: none;
  color: #555;
  transition: color 0.3s ease;
  cursor: pointer;
  display: inline-block;
}

.tag:hover {
  color: #3c74b3;
}
</style>
