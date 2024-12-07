<template>
  <div v-if="isVisible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <header class="modal-header">
        <h3>{{ title }}</h3>
      </header>
      <div class="modal-body">
        <p>{{ content }}</p>
      </div>
      <footer class="modal-footer">
        <button @click="cancel">取消</button>
        <button @click="confirm">确认</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  content: String,
  isVisible: Boolean,
});

const emits = defineEmits(["update:isVisible", "confirm", "cancel"]);

const handleOverlayClick = () => {
  emits("update:isVisible", false);
  emits("cancel");
};

const confirm = () => {
  emits("confirm");
  emits("update:isVisible", false);
};

const cancel = () => {
  emits("cancel");
  emits("update:isVisible", false);
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header h3 {
  margin-top: 0;
}

.modal-body {
  margin: 20px 0;
}

.modal-footer {
  text-align: right;
}

.modal-footer button {
  margin-left: 10px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.modal-footer button:hover {
  background-color: #0056b3;
}
</style>
