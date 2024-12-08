<template>
  <div class="login-container">
    <h1>登录</h1>
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    <form @submit.prevent="onSubmit">
      <div class="form-group">
        <label for="username">用户名:</label>
        <input
          v-model="form.username"
          type="text"
          id="username"
          placeholder="请输入你的用户名"
        />
      </div>
      <div class="form-group">
        <label for="password">密码：</label>
        <input
          v-model="form.password"
          type="password"
          id="password"
          placeholder="请输入你的密码"
        />
      </div>
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? '登录中...' : '登录' }}
      </button>
    </form>

    <p class="register-link">
      还没有账号吗？
      <router-link to="/register">注册</router-link>
    </p>
    <p class="resetPassword-link">
      忘记密码了吗？
      <router-link to="/reset-password">重置密码</router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore.ts";

const userStore = useUserStore();
const router = useRouter();
const isLoading = ref(false);
const errorMessage = ref("");

const form = reactive({
  username: "",
  password: "",
});

const onSubmit = async () => {
  try {
    const success = await userStore.login(form.username, form.password);
    if (success) {
      router.push('/'); // 登录成功后跳转
    } else {
      // 显示错误信息
      errorMessage.value = userStore.error || '登录失败';
    }
  } catch (err: any) {
    errorMessage.value = err.message;
  }
};
</script>

<style scoped>
.login-container {
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

input {
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

.resetPassword-link {
  margin-top: 10px;
}
.register-link {
  margin-top: 10px;
}

.resetPassword-link a {
  color: #8dc9e8;
  text-decoration: none;
}
.register-link a {
  color: #8dc9e8;
  text-decoration: none;
}

.resetPassword-link a:hover {
  text-decoration: underline;
}
.register-link a:hover {
  text-decoration: underline;
}

.error-message {
  color: #ff4444;
  margin-bottom: 15px;
  padding: 10px;
  background-color: #ffe6e6;
  border-radius: 4px;
  font-size: 14px;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
