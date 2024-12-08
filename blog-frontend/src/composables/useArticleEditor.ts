import { ref, watch } from "vue"
import debounce from "lodash-es/debounce"
import { editorConfig } from "@/config/editor.config"
import type { Article } from "@/services/types/article"

const STORAGE_KEYS = {
  title: "articleTitle",
  markdown: "markdownContent",
  quill: "quillContent",
  editorType: "isUsingQuill"
} as const

const SAVE_STATUS = {
  saving: "保存中...",
  success: "保存成功！",
  error: "保存失败请注意！",
  default: "文章将自动保存！"
} as const

export function useArticleEditor(initialContent = "### 在这里开始你的 Markdown 编辑", initialData?: Article) {
  // 状态定义
  const title = ref(initialData?.title || "")
  const markdownContent = ref(initialData?.content || initialContent)
  const content = ref(initialData?.content || "")
  const isUsingQuill = ref(localStorage.getItem(STORAGE_KEYS.editorType) === "true")
  const savingStatus = ref<string>(SAVE_STATUS.default)
  const togglePrompt = ref(false)

  // 保存到本地存储
  const saveContentToLocal = async () => {
    savingStatus.value = SAVE_STATUS.saving
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 保存所有编辑器状态
      const contentToSave: Record<string, string> = {
        [STORAGE_KEYS.title]: title.value,
        [STORAGE_KEYS.markdown]: markdownContent.value,
        [STORAGE_KEYS.quill]: content.value
      }
      
      Object.entries(contentToSave).forEach(([key, value]) => {
        localStorage.setItem(key, value)
      })

      savingStatus.value = SAVE_STATUS.success
      setTimeout(() => {
        savingStatus.value = SAVE_STATUS.default
      }, 3000)
    } catch (error) {
      console.error("保存失败:", error)
      savingStatus.value = SAVE_STATUS.error
    }
  }

  // 防抖保存
  const debouncedSave = debounce(saveContentToLocal, 1000)

  // 监听内容变化
  watch(
    [title, markdownContent, content],
    () => {
      debouncedSave()
    },
    { deep: true }
  )

  // 加载已保存的内容
  const loadSavedContent = () => {
    title.value = localStorage.getItem(STORAGE_KEYS.title) || ""
    markdownContent.value = localStorage.getItem(STORAGE_KEYS.markdown) || initialContent
    content.value = localStorage.getItem(STORAGE_KEYS.quill) || ""
  }

  // 清除保存的内容
  const clearSavedContent = () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
    
    title.value = ""
    markdownContent.value = initialContent
    content.value = ""
  }

  // 切换编辑器类型
  const toggleEditor = () => {
    isUsingQuill.value = !isUsingQuill.value
    localStorage.setItem(STORAGE_KEYS.editorType, String(isUsingQuill.value))
    togglePrompt.value = false
  }

  return {
    // 状��
    title,
    markdownContent,
    content,
    isUsingQuill,
    savingStatus,
    togglePrompt,
    
    // 配置
    editorOptions: editorConfig.quill,
    
    // 方法
    debouncedSave,
    loadSavedContent,
    clearSavedContent,
    toggleEditor,
    
    // 常量
    SAVE_STATUS,
    STORAGE_KEYS
  }
} 