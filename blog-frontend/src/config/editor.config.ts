export const editorConfig = {
  quill: {
    theme: "snow",
    modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline"],
        ["image", "code-block"]
      ]
    }
  },
  markdown: {
    // markdown编辑器特定配置
  }
} as const 