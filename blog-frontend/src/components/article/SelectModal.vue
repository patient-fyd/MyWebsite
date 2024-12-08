<template>
  <div v-if="isVisible" class="modal">
    <h2>发布文章</h2>

    <!-- 类别选择 -->
    <label for="category-select">类别：</label>
    <select id="category-select" v-model="selectedCategoryID">
      <option disabled value="">请选择类别</option>
      <!-- 可选：添加类别的占位符 -->
      <option
        v-for="category in categories"
        :key="category.id"
        :value="category.id"
      >
        {{ category.name }}
      </option>
    </select>

    <!-- 标签选择（最多选择两个） -->
    <label for="tag-select">标签：</label>
    <select id="tag-select" v-model="selectedTag">
      <option disabled value="">请选择标签</option>
      <!-- 添加占位符选项 -->
      <option v-for="tag in tags" :key="tag" :value="tag">
        {{ tag }}
      </option>
    </select>
    <div class="tags">
      <span v-for="tag in selectedTags" :key="tag" class="tag">
        {{ tag }}
        <button @click="removeTag(tag)" class="remove-tag">×</button>
      </span>
    </div>
    <p v-if="selectedTags.length === 2" class="tag-limit-warning">
      最多选择两个标签
    </p>

    <!-- 文章摘要 -->
    <label for="summary">文章摘要：</label>
    <textarea
      id="summary"
      v-model="summary"
      placeholder="请输入文章摘要"
    ></textarea>

    <!-- 确认和取消按钮 -->
    <div class="button-group">
      <button @click="confirm">确认发布</button>
      <button @click="cancel">取消</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

// 定义从父组件传递的 props
const props = defineProps<{
  categories: { id: number; name: string }[]
  tags: string[]
  isVisible: boolean
  initialCategoryID: number | null
  initialTags: string[]
  initialSummary: string
}>();

const emit = defineEmits(["confirm", "cancel", "update:isVisible"]);

const selectedCategoryID = ref<number | null>(props.initialCategoryID); // 初始值设为 null
const selectedTag = ref("");
const selectedTags = ref<string[]>(props.initialTags); // 最多选择两个标签
const summary = ref(props.initialSummary);

// 监听 categories 的变化，初始化 selectedCategoryID
watch(
  () => props.categories,
  (newCategories) => {
    if (newCategories && newCategories.length > 0) {
      selectedCategoryID.value = newCategories[0].id;
    }
  },
  { immediate: true },
);

// 监听标签的变化并添加标签
watch(selectedTag, (newValue) => {
  console.log("Selected tag changed:", newValue); // 调试输出
  if (newValue) {
    addTag();
  }
});

// 添加标签，最多选择两个
const addTag = () => {
  if (
    selectedTag.value &&
    !selectedTags.value.includes(selectedTag.value) &&
    selectedTags.value.length < 2
  ) {
    selectedTags.value.push(selectedTag.value);
    selectedTag.value = ""; // 清空选择的标签
  }
};

// 移除标签
const removeTag = (tag: string) => {
  selectedTags.value = selectedTags.value.filter((t) => t !== tag);
};

// 确认选择并将数据传递给父组件
const confirm = () => {
  emit("confirm", {
    categoryID: selectedCategoryID.value,
    tags: selectedTags.value,
    summary: summary.value,
  });
  emit("update:isVisible", false); // 关闭模态框
};

// 取消发布
const cancel = () => {
  emit("update:isVisible", false); // 关闭模态框
  emit("cancel");
};
</script>

<style scoped>
.modal {
  padding: 20px;
  border: 1px solid #ccc;
  background-color: #fff;
  position: fixed;
  top: 50%;
  left: 50%;
  width: 450px;
  max-width: 90%;
  transform: translate(-50%, -50%);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  z-index: 1000;
  font-family: Arial, sans-serif;
}

.modal h2 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.modal label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.modal select,
.modal textarea,
.modal input {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal textarea {
  height: 150px;
  resize: vertical;
}

.modal .tags {
  margin-bottom: 15px;
}

.modal .tag {
  display: inline-block;
  background-color: #e0e0e0;
  color: #333;
  padding: 5px 10px;
  margin-right: 5px;
  margin-bottom: 5px;
  border-radius: 4px;
  position: relative;
}

.modal .remove-tag {
  background: none;
  border: none;
  font-size: 14px;
  margin-left: 8px;
  cursor: pointer;
  color: #777;
}

.modal .button-group {
  text-align: right;
}

.modal button {
  padding: 10px 20px;
  margin-left: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal button:first-of-type {
  background-color: #007bff;
  color: #fff;
}

.modal button:last-of-type {
  background-color: #6c757d;
  color: #fff;
}

.tag-limit-warning {
  color: red;
  font-size: 12px;
  margin-top: -10px;
  margin-bottom: 15px;
}
</style>
