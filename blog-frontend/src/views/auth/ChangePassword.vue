<template>
  <div class="change-password-container">
    <div class="change-password-form">
      <h1>修改密码</h1>
      <form @submit.prevent="onSubmit">
        <!-- 旧密码输入 -->
        <div class="form-group">
          <label for="oldPassword">旧密码</label>
          <input
            type="password"
            v-model="form.oldPassword"
            id="oldPassword"
            placeholder="请输入旧密码"
            required
          />
        </div>

        <!-- 新密码输入 -->
        <div class="form-group">
          <label for="newPassword">新密码</label>
          <input
            type="password"
            v-model="form.newPassword"
            id="newPassword"
            placeholder="请输入新密码"
            required
          />
        </div>

        <!-- 提交按钮 -->
        <button type="submit">修改密码</button>
      </form>

      <!-- 成功或错误提示 -->
      <div v-if="userStore.successMessage" class="message">
        {{ userStore.successMessage }}
      </div>
      <div v-if="userStore.error" class="error">{{ userStore.error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores"; // 使用 userStore

const userStore = useUserStore();
const router = useRouter();

const form = reactive({
  oldPassword: "",
  newPassword: "",
});

// 在组件挂载时重置成功和错误信息
onMounted(() => {
  userStore.successMessage = null;
  userStore.error = null;
});

// 提交表单
const onSubmit = async () => {
  if (!form.oldPassword || !form.newPassword) {
    userStore.error = "请填写所有字段";
    return;
  }

  // 调用 store 中的 changePassword 方法
  await userStore.changePassword(form.oldPassword, form.newPassword);

  if (!userStore.error) {
    // 如果成功，显示提示并跳转
    userStore.successMessage = "密码修改成功";
    setTimeout(() => {
      router.push("/");
    }, 2000);
  }
};
</script>

<style scoped>
/* 全屏样式 */
.change-password-container {
  width: 300px;
  padding: 20px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="password"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #8dc9e8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #47abef;
}

.message {
  margin-top: 20px;
  color: green;
}

.error {
  margin-top: 20px;
  color: red;
}
</style>
