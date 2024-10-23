<template>
  <div class="editor-container">
    <!-- 顶部控制区 -->
    <div class="editor-header">
      <div class="input-group">
        <label for="title">文章标题：</label>
        <input
          type="text"
          id="title"
          v-model="title"
          placeholder="请输入标题"
        />
      </div>

      <div class="button-group">
        <!-- 发布按钮 -->
        <button @click="showPublishModal = true">发布</button>

        <!-- 切换富文本按钮 -->
        <button @click="toggleEditor">切换到富文本编辑器</button>
      </div>
    </div>

    <!-- Markdown 编辑器区 -->
    <MdEditor v-model="markdownContent" :editorOptions="editorOptions" />

    <!-- 引入模态框组件 -->
    <Modal
      v-model:isVisible="showPublishModal"
      :title="'确认发布文章？'"
      :content="'请确认发布文章，确认后无法修改。'"
      @confirm="publishArticle"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
// 引入 highlight.js 以及所需的代码样式
import hljs from "highlight.js";
import "highlight.js/styles/github.css"; // 使用 Github 样式
import Modal from "@/components/createArticle/SelectModal.vue"; // 引入模态框组件
import { useArticleStore } from "@/stores/articleStore";

// 文章标题和内容
const title = ref("");
const markdownContent = ref("# 在这里开始你的 Markdown 编辑");
const showPublishModal = ref(false); // 控制模态框的显示和隐藏

// 用户输入的分类 ID 和标签
const categoryID = ref(1); // 假设默认分类 ID 是 1
const tags = ref(["编程", "Vue"]); // 默认标签

// 获取文章 store
const articleStore = useArticleStore();

// Markdown 编辑器选项
const editorOptions = {
  markedRenderer(renderer: any) {
    renderer.code = (code: string, lang: string) => {
      const highlighted = lang
        ? hljs.highlight(lang, code).value
        : hljs.highlightAuto(code).value;
      return `<pre><code class="hljs ${lang}">${highlighted}</code></pre>`;
    };
  },
};

// 发布文章
const publishArticle = async () => {
  try {
    await articleStore.createArticle(
      title.value,
      markdownContent.value,
      categoryID.value,
      tags.value,
    );
    alert("文章发布成功！");
    // 清空表单内容或跳转到文章列表页
    title.value = "";
    markdownContent.value = "# 在这里开始你的 Markdown 编辑";
    showPublishModal.value = false; // 关闭模态框
  } catch (error) {
    console.error("发布文章失败", error);
    alert("发布文章失败，请重试。");
  }
};

// 切换到富文本编辑器（示例）
const toggleEditor = () => {
  alert("切换到富文本编辑器暂未实现");
};
</script>

<style scoped>
/* 样式和布局可以根据需要调整 */
.editor-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.input-group {
  flex-grow: 1;
  margin-right: 20px;
}

input[type="text"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.button-group button {
  margin-left: 10px;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button-group button:hover {
  background-color: #0056b3;
}
</style>
