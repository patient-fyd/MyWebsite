<template>
  <div class="tag-select">
    <select v-model="selectedTag" @change="onTagChange" multiple>
      <option v-for="tag in tags" :key="tag.id" :value="tag.name">
        {{ tag.name }}
      </option>
    </select>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref } from 'vue';

// 定义 Tag 接口
interface Tag {
  id: number;
  name: string;
}

// 接收父组件传递的 props，并明确类型
const props = defineProps<{
  tags: Tag[];
  defaultTag: string[];
}>();

// 选中的标签（支持多选）
const selectedTag = ref<string[]>(props.defaultTag);

// 向父组件发出事件，类型明确为多选标签的变化
const emit = defineEmits<{
  (event: 'tag-change', tags: string[]): void;
}>();

// 处理标签变化
const onTagChange = (): void => {
  emit('tag-change', selectedTag.value); // 通知父组件标签变化
};
</script>

<style scoped>
.tag-select select {
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  height: auto;
}

.tag-select option {
  padding: 4px;
  font-size: 16px;
}
</style>