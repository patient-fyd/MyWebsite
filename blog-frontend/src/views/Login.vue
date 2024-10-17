<template>
  <div class="login">
    <el-form :model="loginForm" @submit.native.prevent="onSubmit">
      <el-form-item label="用户名">
        <el-input v-model="loginForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="loginForm.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from '@/utils/request'

export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
      },
    }
  },
  methods: {
    async onSubmit() {
      try {
        const response = await axios.post('/api/login', this.loginForm)
        const token = response.data.token
        localStorage.setItem('token', token)
        this.$router.push('/')
      } catch (error) {
        this.$message.error('登录失败')
      }
    },
  },
}
</script>