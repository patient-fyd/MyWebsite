<template>
  <div class="editor-container">
    <!-- 顶部控制区 -->
    <div class="editor-header">
      <div class="input-group">
        <input
          class="title-input"
          type="text"
          v-model="title"
          placeholder="请输入文章标题"
        />
        <span class="save-status" v-if="savingStatus">{{ savingStatus }}</span>
      </div>

      <div class="button-group">
        <!-- 保存修改按钮 -->
        <button @click="updatePost">保存修改</button>
        <!-- 切换编辑器按钮 -->
        <button @click="promptToggleEditor" class="toggle-button">
          <i class="fas fa-exchange-alt"></i>
        </button>
        <router-link class="button-link" to="/">返回主页</router-link>
      </div>
    </div>

    <!-- 提示切换编辑器的模态框 -->
    <Modal
      v-if="togglePrompt"
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
        @onChange="debouncedSave"
      />
    </div>

    <!-- 发布文章的模态框 -->
    <SelectModal
      v-model:isVisible="showPublishModal"
      :categories="categories"
      :tags="availableTags"
      :initialCategoryID="selectedCategoryID ?? undefined"
      :initialTags="selectedTags"
      :initialSummary="summary"
      @confirm="handleModalConfirm"
      @cancel="handleModalCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { ref, watch, onMounted, computed } from "vue";
import debounce from "lodash-es/debounce";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import "highlight.js/styles/github.css";
import SelectModal from "@/components/createArticle/SelectModal.vue";
import Modal from "@/components/createArticle/Modal.vue";
import { useArticleStore } from "@/stores/articleStore";
import { useCategoryTagStore } from "@/stores/categoryTagStore";
import { QuillEditor } from "@vueup/vue-quill";

const router = useRouter();
const route = useRoute();
const title = ref("");
const markdownContent = ref("### 在这里开始你的 Markdown 编辑");
const content = ref(""); // Content for Quill editor
const isUsingQuill = ref(false); // Default to using MdEditor
const showPublishModal = ref(false);
const togglePrompt = ref(false); // Controls the editor switch prompt
const savingStatus = ref("");
const articleStore = useArticleStore();
const categoryTagStore = useCategoryTagStore();

const postId = Number(route.params.id);

// 获取摘要等变量
const summary = ref("");
const selectedCategoryID = ref<number | null>(null);
const selectedTags = ref<string[]>([]);

// Fetch categories, tags, and post details when component mounts
onMounted(async () => {
  await categoryTagStore.fetchCategories();
  await categoryTagStore.fetchTags();
  await articleStore.fetchPostById(postId); // 传入 postId
  const post = articleStore.articleDetail;
  if (post) {
    title.value = post.title;
    if (isUsingQuill.value) {
      content.value = post.content;
    } else {
      markdownContent.value = post.content;
    }
    summary.value = post.summary || "";
    selectedCategoryID.value = post.category.id;
    selectedTags.value = post.tags || [];
  }
});

const categories = computed(() => categoryTagStore.categories);
const availableTags = computed(() => categoryTagStore.tags);

// Quill editor options
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

// Auto-save content to localStorage
savingStatus.value = "文章将自动保存！";
const saveContentToLocal = async () => {
  savingStatus.value = "保存中...";
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    localStorage.setItem("articleTitle", title.value);
    localStorage.setItem("markdownContent", markdownContent.value);
    localStorage.setItem("quillContent", content.value);
    savingStatus.value = "保存成功！";
    setTimeout(() => (savingStatus.value = "文章将自动保存！"), 3000);
  } catch (error) {
    savingStatus.value = "保存失败";
    setTimeout(() => (savingStatus.value = "保存失败请注意！"), 3000);
  }
};

// Debounced save to prevent excessive saves
const debouncedSave = debounce(saveContentToLocal, 1000);

// Watch for changes and auto-save
watch([title, markdownContent, content], () => {
  debouncedSave();
});

// Handle editor switch prompt
const promptToggleEditor = () => {
  togglePrompt.value = true; // Show prompt modal
};

// Confirm editor switch
const confirmToggleEditor = () => {
  isUsingQuill.value = !isUsingQuill.value;
  // Save editor state to localStorage
  localStorage.setItem("isUsingQuill", String(isUsingQuill.value));
  togglePrompt.value = false; // Close prompt modal
};

// Quill editor event handlers
const onEditorBlur = (event: FocusEvent) => {
  console.log("Editor blurred!", event);
};

const onEditorFocus = (event: FocusEvent) => {
  console.log("Editor focused!", event);
};

const onEditorReady = (event: CustomEvent) => {
  console.log("Editor is ready!", event);
};

// Handle confirm event from SelectModal
const handleModalConfirm = ({
  categoryID: newCategoryID,
  tags: newTags,
  summary: newSummary,
}: {
  categoryID: number;
  tags: string[];
  summary: string;
}) => {
  selectedCategoryID.value = newCategoryID;
  selectedTags.value = newTags;
  summary.value = newSummary;
  confirmUpdatePost();
};

// Handle cancel event from SelectModal
const handleModalCancel = () => {
  showPublishModal.value = false;
};

// 更新文章函数
const confirmUpdatePost = async () => {
  try {
    await articleStore.updatePostById(
      postId,
      title.value,
      isUsingQuill.value ? content.value : markdownContent.value,
      summary.value,
      selectedCategoryID.value!,
      selectedTags.value,
    );

    // 检查是否有错误
    if (articleStore.error) {
      // 显示错误信息
      alert(`更新文章失败：${articleStore.error}`);
    } else {
      // 成功更新文章后执行重定向
      await router.push({ name: "PostDetail", params: { id: postId } });

      // 重置表单和状态
      title.value = "";
      markdownContent.value = "### 在这里开始你的 Markdown 编辑";
      content.value = "";
      selectedCategoryID.value = null;
      selectedTags.value = [];
      summary.value = "";
      showPublishModal.value = false;

      // 清空 localStorage 中的草稿内容
      localStorage.removeItem("articleTitle");
      localStorage.removeItem("markdownContent");
      localStorage.removeItem("quillContent");
      localStorage.removeItem("categoryID");
      localStorage.removeItem("tags");
      localStorage.removeItem("summary");
    }
  } catch (error) {
    console.error("更新文章失败", error);
    alert("更新文章失败，请重试。");
  }
};

// 保存修改按钮点击事件
const updatePost = () => {
  showPublishModal.value = true;
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
