<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { View, Hide, Lock, User, Shop } from '@element-plus/icons-vue'
import { login } from '@/api/user.js'
import router from '@/router'
// 角色选择 - 0:用户 1:商家
const role = ref(0)
// 监听角色变化，同步到表单
watch(role, (newVal) => {
  form.role = newVal;
  console.log('角色变化了', newVal);
})
// 定义一个布尔值，用于控制按钮的显示和隐藏
const pwd = ref(false)
const LoginFrm = reactive({
  id: '',
  username: '',
  password: '',
  email: '',
  code: '',
  passwordConfirm: '',
  phone: '',
  role: 0,
  status: 0
})
const form = reactive({
  id: '',
  username: '',
  password: '',
  email: '',
  code: '',
  passwordConfirm: '',
  role: 0,
  status: 0
})
const loginFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { max: 15, message: '用户名长度 15 位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 15, message: '密码长度 6-15 位', trigger: 'blur' }
  ]
})

const onSubmit = async () => {
  await loginFormRef.value?.validate(async (valid) => {
    if (!valid) {
      ElMessage.error('填写信息有误')
      return Promise.reject() // 返回Promise类型
    }
    try {
      console.log(form);
      let result = await login(form);
      console.log("result", result);
      console.log(result.data);

      if (result.data.code === 200) {
        if (form.role == 0) router.push("/first");// 用户端首页
        // if (form.role == 0) router.push("/account");// 用户端首页
        else router.push("/merchant/dashboard");// 商家端首页
        ElMessage.success('登录成功')
        // 存储token和角色信息
        const { id, username, nickname, avatar, role, accessToken, refreshToken, email, status, phone } = result.data.data;
        console.log(id, username, nickname, avatar, role);

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userBase', JSON.stringify({ id, username, nickname, avatar, role, email, status, phone }));
      }
    } catch (error) {
      ElMessage.error('登录失败，请检查账号密码');
      console.log(error)
    }
  })
}
</script>

<template>
  <div class="login">
    <!-- 根据这个先判定是否为空rules  prop="username" prop="password" -->
    <el-form ref="loginFormRef" :model="form" :rules="rules" label-width="auto" style="max-width: 600px"
      label-position="top" size="large">
      <div class="title">登录</div>

      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名" :prefix-icon="User" clearable></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" placeholder="请输入密码" :prefix-icon="Lock" :type="pwd ? 'text' : 'password'">
          <template #suffix>
            <el-icon style="cursor: pointer" @click="pwd = !pwd">
              <View v-if="!pwd" /><!-- 显示(根据pwd的值来显示) -->
              <Hide v-else /> <!-- 隐藏 -->
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <!-- 角色选择 -->
      <el-radio-group v-model="role" size="large">
        <el-radio :label="0">用户</el-radio>
        <el-radio :label="1">商家</el-radio>
      </el-radio-group>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">登录</el-button>
      </el-form-item>
      <el-form-item>
        <div style="display: flex; justify-content: space-between; margin-top: 10px;">
          <router-link to="/forget" style="color: #667eea;">忘记密码?</router-link>
          <span>还没有账号? <router-link to="/register" style="color: #667eea;">立即注册</router-link></span>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.demo-pagination-block+.demo-pagination-block {
  margin-top: 10px;
}

.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}

.login {
  background-color: #eee;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  /* 渐变色颜色 */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  .el-form {
    font-weight: 400;
    width: 30%;
    background-color: #fff;
    padding: 40px;
    border-radius: 30px;

    .el-form-item {
      margin-top: 20px;
    }

    .el-button {
      width: 100%;
      margin: 20px 0;
    }

    .title {
      font-size: 28px;
      font-weight: 700;
      text-align: center;
      justify-content: center;
      color: black;
    }
  }
}
</style>