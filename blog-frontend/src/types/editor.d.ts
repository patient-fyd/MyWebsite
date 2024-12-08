export interface EditorState {
  title: string
  markdownContent: string
  content: string
  isUsingQuill: boolean
  savingStatus: string
  togglePrompt: boolean
}

export interface LocalStorageKeys {
  title: string
  markdown: string
  quill: string
  editorType: string
}

export interface SaveStatus {
  saving: string
  success: string
  error: string
  default: string
} 