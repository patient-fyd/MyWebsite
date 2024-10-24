<template>
  <div class="editor-container">
    <!-- 顶部控制区 -->
    <div class="editor-header">
      <div class="input-group">
        <input
          class="title-input"
          type="text"
          id="title"
          v-model="title"
          placeholder="请输入文章标题"
        />
        <span class="save-status" v-if="savingStatus">{{ savingStatus }}</span>
      </div>

      <div class="button-group">
        <!-- 发布按钮 -->
        <button @click="showPublishModal = true">发布</button>
        <!-- 切换富文本按钮 -->
        <button @click="promptToggleEditor" class="toggle-button">
          <i class="fas fa-exchange-alt"></i>
        </button>
        <router-link class="button-link" to="/">返回主页</router-link>
      </div>
    </div>

    <!-- 提示切换编辑器的模态框 -->
    <Modal
      v-model:isVisible="togglePrompt"
      title="确认切换编辑器"
      content="之前的内容将不会保存，是否确认切换？"
      @confirm="confirmToggleEditor"
      @cancel="() => (togglePrompt = false)"
    />

    <!-- 根据是否使用Quill显示不同的编辑器 -->
    <div v-if="isUsingQuill">
      <QuillEditor
        v-model="content"
        ref="myQuillEditor"
        :options="editorOptions"
        @blur="onEditorBlur"
        @focus="onEditorFocus"
        @ready="onEditorReady"
      />
    </div>
    <div v-else>
      <MdEditor
        class="custom-editor"
        v-model="markdownContent"
        :editorOptions="editorOptions"
        :onChange="debouncedSave"
      />
    </div>

    <!-- 发布文章的模态框 -->
    <SelectModal
      v-if="showPublishModal"
      @confirm="handleModalConfirm"
      @cancel="handleModalCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { debounce } from "lodash";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import "highlight.js/styles/github.css";
import SelectModal from "@/components/createArticle/SelectModal.vue";
import Modal from "@/components/createArticle/Modal.vue";
import { useArticleStore } from "@/stores/articleStore";
import { QuillEditor } from "@vueup/vue-quill";

const title = ref("");
const markdownContent = ref("### 在这里开始你的 Markdown 编辑");
const content = ref(""); // Quill 编辑器的内容
const isUsingQuill = ref(false); // 初始设置为使用MdEditor
const showPublishModal = ref(false);
const togglePrompt = ref(false); // 控制是否显示切换编辑器的提示
const savingStatus = ref("");
const categoryID = ref(1); // 假设初始类别 ID 为 1
const tags = ref<string[]>([]); // 标签
const summary = ref(""); // 文章摘要

const articleStore = useArticleStore();

// 从 localStorage 获取编辑器的状态和草稿内容
onMounted(() => {
  const savedEditorType = localStorage.getItem("isUsingQuill");
  const savedTitle = localStorage.getItem("articleTitle");
  const savedMarkdownContent = localStorage.getItem("markdownContent");
  const savedQuillContent = localStorage.getItem("quillContent");
  const savedCategoryID = localStorage.getItem("categoryID");
  const savedTags = localStorage.getItem("tags");
  const savedSummary = localStorage.getItem("summary");

  if (savedEditorType !== null) {
    isUsingQuill.value = savedEditorType === "true";
  }

  if (savedTitle) title.value = savedTitle;
  if (savedMarkdownContent) markdownContent.value = savedMarkdownContent;
  if (savedQuillContent) content.value = savedQuillContent;
  if (savedCategoryID) categoryID.value = Number(savedCategoryID);
  if (savedTags) tags.value = JSON.parse(savedTags);
  if (savedSummary) summary.value = savedSummary;
});

// Quill 编辑器选项
const editorOptions = ref({
  theme: "snow",
  modules: {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      ["image", "code-block"],
    ],
  },
});

// 自动保存到 localStorage 的函数
savingStatus.value = "文章将自动保存！";
const saveContentToLocal = async () => {
  savingStatus.value = "保存中...";
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    localStorage.setItem("articleTitle", title.value);
    localStorage.setItem("markdownContent", markdownContent.value);
    localStorage.setItem("quillContent", content.value);
    localStorage.setItem("categoryID", categoryID.value.toString());
    localStorage.setItem("tags", JSON.stringify(tags.value));
    localStorage.setItem("summary", summary.value);
    savingStatus.value = "保存成功！";
    setTimeout(() => (savingStatus.value = "文章将自动保存！"), 3000);
  } catch (error) {
    savingStatus.value = "保存失败";
    setTimeout(() => (savingStatus.value = "保存失败请注意！"), 3000);
  }
};

// 防抖函数，防止频繁保存
const debouncedSave = debounce(saveContentToLocal, 1000);

// 监听内容的变化并自动保存到 localStorage
watch([title, markdownContent, content, categoryID, tags, summary], () => {
  debouncedSave();
});

// 提示切换编辑器前确认
const promptToggleEditor = () => {
  togglePrompt.value = true; // 显示提示框
};

// 确认切换编辑器
const confirmToggleEditor = () => {
  isUsingQuill.value = !isUsingQuill.value;
  // 保存编辑器状态到 localStorage
  localStorage.setItem("isUsingQuill", String(isUsingQuill.value));
  togglePrompt.value = false; // 关闭提示框
};

// Quill 编辑器事件处理
const onEditorBlur = (event) => {
  console.log("Editor blurred!", event);
};

const onEditorFocus = (event) => {
  console.log("Editor focused!", event);
};

const onEditorReady = (event) => {
  console.log("Editor is ready!", event);
};
</script>

<style scoped>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

.editor-container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 高度设为视口高度 */
  width: 100vw; /* 宽度设为视口宽度 */
  box-sizing: border-box;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 10px;
}

.input-group {
  display: flex;
  align-items: center;
  margin-left: 15px;
  flex-grow: 1; /* 确保 input-group 可以填满除按钮组外的空间 */
}

.title-input {
  width: 80%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.save-status {
  margin-left: 15px; /* 保存状态信息与输入框的距离 */
  color: #a89f9f; /* 保存状态文字颜色 */
  font-size: 0.9em;
  white-space: nowrap; /* 防止文字换行 */
}

.button-group {
  display: flex;
  gap: 10px;
  margin-right: 5px;
}

.button-group button,
.button-link {
  padding: 10px 15px;
  background-color: #8dc9e8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none; /* 去掉 router-link 的下划线 */
  display: inline-flex; /* 保持和按钮一样的布局 */
  align-items: center;
  justify-content: center;
}

.button-link {
  margin-right: 10px;
}

.button-group button:hover,
.button-link:hover {
  background-color: #47abef;
}

i {
  color: #ffffff;
}

.custom-editor {
  flex-grow: 1; /* 让编辑器占满剩余空间 */
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 400px;
  overflow: auto;
}
</style>
