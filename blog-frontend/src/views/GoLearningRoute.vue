<template>
  <div class="markdown-container">
    <!-- 使用 v-html 渲染解析后的 Markdown 内容 -->
    <div v-html="markdownContent"></div>
  </div>
</template>

<script setup lang="ts">
import { marked } from "marked";
import { ref, onMounted } from "vue";
import highlight from "highlight.js";
import "highlight.js/styles/github.css";
import markdownContentRaw from "@/assets/LearningRouteMD/GoLearningRoute.md?raw";

const markdownContent = marked(markdownContentRaw);

const htmlContent = ref("");

// 初始化 highlight.js 并渲染 Markdown
onMounted(() => {
  htmlContent.value = markdownContent; // 设置 Markdown 内容
  setTimeout(() => {
    document.querySelectorAll("pre code").forEach((block) => {
      highlight.highlightElement(block as HTMLElement); // 高亮代码块
    });
  }, 0); // 确保 DOM 更新后进行代码高亮
});
</script>

<style scoped>
.markdown-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  line-height: 1.6;
}

.markdown-container h1,
h2,
h3 {
  margin-top: 20px;
  color: #333;
}

.markdown-container pre {
  background-color: #f0f0f0;
  padding: 15px;
  border-radius: 5px;
  overflow-x: auto;
}

.markdown-container code {
  background-color: #f4f4f4;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 90%;
}

.markdown-container a {
  color: #42b983;
  text-decoration: none;
}

.markdown-container a:hover {
  text-decoration: underline;
}
</style>
