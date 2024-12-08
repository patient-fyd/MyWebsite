<template>
  <div class="editor-container">
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
        <button @click="handleAction">{{ actionText }}</button>
        <button @click="promptToggleEditor" class="toggle-button">
          <i class="fas fa-exchange-alt"></i>
        </button>
        <router-link class="button-link" to="/">返回主页</router-link>
      </div>
    </div>

    <Modal
      v-if="togglePrompt"
      v-model:isVisible="togglePrompt"
      title="确认切换编辑器"
      content="之前的内容将不会保存，是否确认切换？"
      @confirm="toggleEditor"
      @cancel="() => (togglePrompt = false)"
    />

    <div v-if="isUsingQuill">
      <QuillEditor
        v-model="content"
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

    <SelectModal
      v-model:isVisible="showPublishModal"
      :categories="categories"
      :tags="availableTags"
      :initialCategoryID="initialCategoryID"
      :initialTags="initialTags"
      :initialSummary="initialSummary"
      @confirm="handleModalConfirm"
      @cancel="handleModalCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { MdEditor } from "md-editor-v3"
import { QuillEditor } from "@vueup/vue-quill"
import { useArticleEditor } from "@/composables/useArticleEditor"
import SelectModal from "./SelectModal.vue"
import Modal from "./Modal.vue"
import type { Article } from "@/services/types/article"
import "md-editor-v3/lib/style.css"
import "@vueup/vue-quill/dist/vue-quill.snow.css"

const props = defineProps<{
  actionText: string
  initialData?: Article
  categories: { id: number; name: string }[]
  availableTags: string[]
}>()

const emit = defineEmits<{
  (e: 'submit', data: {
    title: string
    content: string
    categoryID: number
    tags: string[]
    summary: string
  }): void
}>()

const {
  title,
  markdownContent,
  content,
  isUsingQuill,
  savingStatus,
  togglePrompt,
  editorOptions,
  debouncedSave,
  toggleEditor,
  clearSavedContent
} = useArticleEditor()

const showPublishModal = ref(false)
const initialCategoryID = computed(() => props.initialData?.category.id ?? null)
const initialTags = computed(() => props.initialData?.tags.map(tag => tag.name) ?? [])
const initialSummary = computed(() => props.initialData?.summary ?? '')

const promptToggleEditor = () => {
  togglePrompt.value = true
}

const handleAction = () => {
  showPublishModal.value = true
}

const handleModalConfirm = (data: {
  categoryID: number
  tags: string[]
  summary: string
}) => {
  emit('submit', {
    title: title.value,
    content: isUsingQuill.value ? content.value : markdownContent.value,
    ...data
  })
  clearSavedContent()
  showPublishModal.value = false
}

const handleModalCancel = () => {
  showPublishModal.value = false
}

// Quill editor event handlers
const onEditorBlur = () => {}
const onEditorFocus = () => {}
const onEditorReady = () => {}

// 初始化编辑器内容
onMounted(() => {
  if (props.initialData) {
    title.value = props.initialData.title
    if (isUsingQuill.value) {
      content.value = props.initialData.content
    } else {
      markdownContent.value = props.initialData.content
    }
  }
})
</script>

<style scoped>
.editor-container {
  width: 100%;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title-input {
  width: 100%;
  padding: 8px;
  font-size: 18px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.button-group {
  display: flex;
  gap: 10px;
}

.button-group button {
  padding: 8px 16px;
  background-color: #8dc9e8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button-group button:hover {
  background-color: #47abef;
}

.save-status {
  margin-left: 10px;
  color: #666;
}

/* 编辑器样式 */
:deep(.ql-editor),
:deep(.md-editor) {
  min-height: 500px;
}
</style> 