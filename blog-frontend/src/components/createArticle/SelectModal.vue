<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-content">
      <h3>{{ title }}</h3>
      <p>{{ content }}</p>
      <div class="modal-actions">
        <button @click="confirm">确认发布</button>
        <button @click="cancel">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 组件的 props
const props = defineProps({
  title: {
    type: String,
    default: "确认操作",
  },
  content: {
    type: String,
    default: "请确认操作。",
  },
  isVisible: {
    type: Boolean,
    default: false,
  },
});

// 发出事件的 emit
const emit = defineEmits(["confirm", "cancel"]);

// 触发确认操作
const confirm = () => {
  emit("confirm");
};

// 触发取消操作
const cancel = () => {
  emit("cancel");
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.modal-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.modal-actions button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-actions button:hover {
  background-color: #0056b3;
}

.modal-actions button:last-child {
  background-color: #ccc;
  color: black;
}

.modal-actions button:last-child:hover {
  background-color: #999;
}
</style>
