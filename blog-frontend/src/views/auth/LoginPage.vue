<template>
  <div class="login-container">
    <h1>登录</h1>
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
      <button type="submit">Login</button>
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
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore.ts"; // 引入用户 store

const userStore = useUserStore(); // 使用 userStore
const router = useRouter();

const form = reactive({
  username: "",
  password: "",
  email: "",
});

// 提交登录表单
const onSubmit = async () => {
  if (!form.username || !form.password) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    // 调用 store 中的 login 方法
    await userStore.login(form.username, form.password);

    if (!userStore.error) {
      alert("Login successful!");
      router.push("/"); // 登录成功后跳转到主页
    } else {
      alert(userStore.error); // 显示登录失败原因
    }
  } catch (error) {
    console.error("Error during login:", error);
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
</style>
