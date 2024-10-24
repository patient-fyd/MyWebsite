<template>
  <div v-if="isVisible" class="modal">
    <h2>确认发布文章</h2>

    <!-- 类别选择 -->
    <label>类别：</label>
    <select v-model="selectedCategoryID">
      <option
        v-for="category in categories"
        :key="category.id"
        :value="category.id"
      >
        {{ category.name }}
      </option>
    </select>

    <!-- 标签选择，最多选择两个 -->
    <label>标签：</label>
    <select v-model="selectedTag" @change="addTag">
      <option v-for="tag in availableTags" :key="tag" :value="tag">
        {{ tag }}
      </option>
    </select>
    <div class="tags">
      <span v-for="tag in tags" :key="tag">{{ tag }}</span>
    </div>
    <p v-if="tags.length === 2" class="tag-limit-warning">最多选择两个标签</p>

    <!-- 文章摘要 -->
    <label>文章摘要：</label>
    <textarea v-model="summary" placeholder="请输入文章摘要"></textarea>

    <!-- 确认和取消按钮 -->
    <button @click="confirm">确认发布</button>
    <button @click="$emit('cancel')">取消</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const isVisible = ref(true);
const categories = ref([
  { id: 1, name: "科技" },
  { id: 2, name: "生活" },
  { id: 3, name: "教育" },
]);
const availableTags = ref(["技术", "健康", "学习", "娱乐", "艺术"]);
const selectedCategoryID = ref(1);
const selectedTag = ref("");
const tags = ref<string[]>([]);
const summary = ref("");

// 添加标签，最多选择两个
const addTag = () => {
  if (
    selectedTag.value &&
    !tags.value.includes(selectedTag.value) &&
    tags.value.length < 2
  ) {
    tags.value.push(selectedTag.value);
  }
  selectedTag.value = "";
};

// 确认选择，传递数据给父组件
const confirm = () => {
  $emit("confirm", {
    categoryID: selectedCategoryID.value,
    tags: tags.value,
    summary: summary.value,
  });
};
</script>

<style scoped>
.modal {
  padding: 20px;
  border: 1px solid #ccc;
  background-color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}

.tags {
  margin-top: 10px;
}

.tag-limit-warning {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}
</style>
