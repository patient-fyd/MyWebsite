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
      v-model:isVisible="showPublishModal"
      :title="'确认发布文章？'"
      :content="'请确认发布文章，确认后无法修改。'"
      @confirm="publishArticle"
    />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { debounce } from "lodash";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import "highlight.js/styles/github.css";
import SelectModal from "@/components/createArticle/SelectModal.vue";
import Modal from "@/components/createArticle/Modal.vue";
import { useArticleStore } from "@/stores/articleStore";
import { QuillEditor } from "@vueup/vue-quill";

const title = ref("");
const markdownContent = ref("# 在这里开始你的 Markdown 编辑");
const content = ref(""); // Quill 编辑器的内容
const isUsingQuill = ref(false); // 初始设置为使用 MdEditor
const showPublishModal = ref(false);
const togglePrompt = ref(false); // 控制是否显示切换编辑器的提示
const savingStatus = ref("");

const articleStore = useArticleStore();

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

// 自动保存的函数
const saveContent = async () => {
  savingStatus.value = "保存中...";
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    savingStatus.value = "保存成功！";
    setTimeout(() => (savingStatus.value = ""), 3000);
  } catch (error) {
    savingStatus.value = "保存失败";
    setTimeout(() => (savingStatus.value = ""), 3000);
  }
};

const debouncedSave = debounce(saveContent, 500);

watch(markdownContent, (newValue) => {
  debouncedSave(newValue);
});

const publishArticle = async () => {
  try {
    await articleStore.createArticle(title.value, markdownContent.value);
    alert("文章发布成功！");
    title.value = "";
    markdownContent.value = "# 在这里开始你的 Markdown 编辑";
    showPublishModal.value = false;
  } catch (error) {
    console.error("发布文章失败", error);
    alert("发布文章失败，请重试。");
  }
};

// 提示切换编辑器前确认
const promptToggleEditor = () => {
  togglePrompt.value = true; // 显示提示框
};

// 确认切换编辑器
const confirmToggleEditor = () => {
  isUsingQuill.value = !isUsingQuill.value;
  if (isUsingQuill.value) {
    content.value = markdownContent.value; // 将 Markdown 内容转换为 Quill 内容
  } else {
    markdownContent.value = content.value; // 将 Quill 内容转换回 Markdown 内容
  }
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
  padding: 20px;
  box-sizing: border-box;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.input-group {
  display: flex;
  align-items: center;
  flex-grow: 1; /* 确保 input-group 可以填满除按钮组外的空间 */
}

.title-input {
  width: 80%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.save-status {
  margin-left: 10px; /* 保存状态信息与输入框的距离 */
  color: #555; /* 保存状态文字颜色 */
  font-size: 0.9em;
  white-space: nowrap; /* 防止文字换行 */
}

.button-group {
  display: flex;
  gap: 10px;
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
