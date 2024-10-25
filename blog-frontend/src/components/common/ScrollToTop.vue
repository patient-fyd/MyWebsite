<template>
  <button v-if="showScrollButton" class="scroll-to-top" @click="scrollToTop">
    回到顶部
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const showScrollButton = ref(false);

// 滚动到顶部的函数
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// 监听页面滚动事件，显示或隐藏按钮
const handleScroll = () => {
  showScrollButton.value = window.scrollY > 200; // 当滚动超过200像素时显示按钮
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll); // 添加滚动事件监听
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll); // 移除滚动事件监听
});
</script>

<style scoped>
.scroll-to-top {
  position: fixed;
  bottom: 150px;
  right: 20px;
  background-color: #8dc9e8;
  color: white;
  border: none;
  width: 40px;
  height: 100px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s;
}

.scroll-to-top:hover {
  background-color: #47abef;
}
</style>
