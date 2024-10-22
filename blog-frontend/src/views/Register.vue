<template>
  <div class="register-container">
    <h1>Register</h1>
    <form @submit.prevent="onSubmit">
      <div class="form-group">
        <label for="username">Username:</label>
        <input
          v-model="form.username"
          type="text"
          id="username"
          placeholder="Enter your username"
        />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input
          v-model="form.password"
          type="password"
          id="password"
          placeholder="Enter your password"
        />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input
          v-model="form.email"
          type="email"
          id="email"
          placeholder="Enter your email"
        />
      </div>
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const form = reactive({
  username: "",
  password: "",
  email: "",
});

const onSubmit = () => {
  if (!form.username || !form.password || !form.email) {
    alert("Please fill in all fields.");
    return;
  }
  alert(`Registering with Username: ${form.username}, Email: ${form.email}`);

  // 模拟注册成功后跳转到登录页面
  router.push("/login");
};
</script>

<style scoped>
.register-container {
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
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #369970;
}
</style>
