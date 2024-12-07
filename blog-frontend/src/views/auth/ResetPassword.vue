<template>
  <div class="reset-password-container">
    <div class="reset-password-form">
      <h1>重置密码</h1>
      <form @submit.prevent="onSubmit">
        <!-- 邮箱输入 -->
        <div class="form-group">
          <label for="email">邮箱</label>
          <input
            type="email"
            v-model="form.email"
            id="email"
            placeholder="请输入注册邮箱"
            required
          />
        </div>

        <!-- 验证码输入 -->
        <div class="form-group">
          <label for="verificationCode">验证码</label>
          <div class="input-with-button">
            <input
              type="text"
              v-model="form.verificationCode"
              id="verificationCode"
              placeholder="请输入验证码"
              required
            />
            <span class="send-code" @click="sendVerificationCode"
              >发送验证码</span
            >
          </div>
        </div>

        <!-- 新密码输入 -->
        <div class="form-group">
          <label for="newPassword">新密码</label>
          <input
            type="password"
            v-model="form.newPassword"
            id="newPassword"
            :disabled="!form.verificationCode"
            placeholder="请输入新密码"
            required
          />
        </div>

        <!-- 提交按钮 -->
        <button type="submit">重置密码</button>
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
import { useUserStore } from "@/stores/userStore.ts"; // 确保引入正确

const userStore = useUserStore();
const router = useRouter();

const form = reactive({
  email: "",
  verificationCode: "",
  newPassword: "",
});

// 初始化组件时清除状态消息
onMounted(() => {
  userStore.successMessage = null;
  userStore.error = null;
});

// 发送验证码
const sendVerificationCode = async () => {
  if (!form.email) {
    userStore.error = "请填写邮箱地址";
    return;
  }
  await userStore.requestPasswordReset(form.email);
};

// 提交表单：重置密码
const onSubmit = async () => {
  if (!form.verificationCode || !form.newPassword) {
    userStore.error = "请填写验证码和新密码";
    return;
  }

  await userStore.resetPassword(form.verificationCode, form.newPassword);

  if (!userStore.error) {
    userStore.successMessage = "密码重置成功，2秒后跳转登录页面";
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  }
};
</script>

<style scoped>
.reset-password-container {
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

.input-with-button {
  position: relative;
}

input[type="email"],
input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.send-code {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  color: #007bff;
  cursor: pointer;
}

.send-code:hover {
  color: #0056b3;
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
