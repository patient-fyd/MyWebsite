import { ref, watch } from "vue"
import debounce from "lodash-es/debounce"

export function useArticleEditor() {
  const title = ref("")
  const markdownContent = ref("### 在这里开始你的 Markdown 编辑")
  const content = ref("")
  const isUsingQuill = ref(false)
  const savingStatus = ref("文章将自动保存！")
  const togglePrompt = ref(false)

  const editorOptions = {
    theme: "snow",
    modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline"],
        ["image", "code-block"]
      ]
    }
  }

  const saveContentToLocal = async () => {
    savingStatus.value = "保存中..."
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      localStorage.setItem("articleTitle", title.value)
      localStorage.setItem("markdownContent", markdownContent.value)
      localStorage.setItem("quillContent", content.value)
      savingStatus.value = "保存成功！"
      setTimeout(() => savingStatus.value = "文章将自动保存！", 3000)
    } catch (error) {
      savingStatus.value = "保存失败请注意！"
    }
  }

  const debouncedSave = debounce(saveContentToLocal, 1000)

  watch([title, markdownContent, content], () => {
    debouncedSave()
  })

  return {
    title,
    markdownContent,
    content,
    isUsingQuill,
    savingStatus,
    togglePrompt,
    editorOptions,
    debouncedSave
  }
}