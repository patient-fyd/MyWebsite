<template>
  <div>
    <h1>{{ isEditMode ? "编辑笔记" : "添加笔记" }}</h1>

    <form @submit.prevent="saveNote">
      <div>
        <label for="title">标题：</label>
        <input
          id="title"
          v-model="note.title"
          type="text"
          placeholder="输入笔记标题"
          required
        />
      </div>

      <div>
        <label for="content">内容：</label>
        <textarea
          id="content"
          v-model="note.content"
          placeholder="输入笔记内容..."
          rows="10"
        ></textarea>
      </div>

      <div>
        <button type="button" @click="insertSymbol('⭕️')">插入 ⭕️</button>
        <button type="button" @click="insertSymbol('⭐️')">插入 ⭐️</button>
      </div>

      <div>
        <button type="submit">
          {{ isEditMode ? "保存修改" : "添加笔记" }}
        </button>
        <button type="button" @click="cancel">取消</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const isEditMode = ref(false);
const noteId = route.query.id || null;

// 初始化笔记数据
const note = reactive({
  title: "",
  content: "",
});

// 模拟笔记数据存储（实际项目中应替换为 API 调用）
const notes = ref([
  { id: 1, title: "示例笔记 1", content: "这是第一篇笔记内容" },
  { id: 2, title: "示例笔记 2", content: "这是第二篇笔记内容" },
]);

// 如果是编辑模式，加载笔记数据
onMounted(() => {
  if (noteId) {
    const existingNote = notes.value.find(
      (n) => n.id === parseInt(noteId as string),
    );
    if (existingNote) {
      note.title = existingNote.title;
      note.content = existingNote.content;
      isEditMode.value = true;
    }
  }
});

// 插入特殊符号
function insertSymbol(symbol: string) {
  note.content += symbol;
}

// 保存笔记
function saveNote() {
  if (isEditMode.value) {
    // 更新已有笔记
    const existingNote = notes.value.find(
      (n) => n.id === parseInt(noteId as string),
    );
    if (existingNote) {
      existingNote.title = note.title;
      existingNote.content = note.content;
    }
  } else {
    // 添加新笔记
    notes.value.push({
      id: notes.value.length + 1,
      title: note.title,
      content: note.content,
    });
  }
  router.push("/readingNotes/books");
}

// 取消操作
function cancel() {
  router.push("/readingNotes/books");
}
</script>

<style scoped>
form {
  max-width: 600px;
  margin: 0 auto;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input,
textarea {
  width: 100%;
  margin-bottom: 15px;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  margin-right: 10px;
  padding: 8px 12px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

button[type="button"] {
  background-color: #6c757d;
}

button[type="button"]:hover {
  background-color: #5a6268;
}
</style>
