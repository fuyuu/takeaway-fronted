<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage, FormInstance ,FormRules} from 'element-plus'
import { reactive } from 'vue'
import { View,Hide, Lock ,User, Loading } from '@element-plus/icons-vue'

// 定义一个布尔值，用于控制按钮的显示和隐藏
const pwd = ref(false)
const pwd2 = ref(false)
const form = reactive({
  username: '',
  password: '',
  email: '',
  code: '',
  passwordConfirm: ''
})
const codeBtn = reactive({
  loading: false,
  countdown: 0
})
const loginFormRef = ref<FormInstance>()
const rules=reactive<FormRules>({
  username:[
    {required: true, message:'请输入用户名' ,trigger: 'blur'},
    {max: 15, message: '用户名长度 ≤15 位',trigger: 'blur'}
  ],
  email:[
    {required: true, message:'请输入邮箱' ,trigger: 'blur'},
    {type:'email', message: '邮箱格式错误',trigger: 'blur'}
  ],
  code:[
    {required: true, message:'请输入验证码' ,trigger: 'blur'},
    {len:6, message: '6 位验证码',trigger: 'blur'}
  ],
  password:[
    {required: true, message:'请输入密码' ,trigger: 'blur'},
    {min: 6,max:15, message: '密码长度 6-15 位',trigger: 'blur'}
  ],
  passwordConfirm:[
    {required: true, message:'请输入确认密码' ,trigger: 'blur'},
    {
      validator: (rule, value, callback) => {
        if (value !== form.password) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },trigger: 'blur'
    }
  ]
})

import{login,register,sendCode,forget} from '@/api/user.js'
import { useRouter } from 'vue-router'
const router = useRouter()
const doRegister = async () => {
  await loginFormRef.value?.validate(async (valid)=>{
     if (!valid) {
      ElMessage.error('填写信息有误')
      return Promise.reject() // 返回Promise类型
    }
    try {
      let result = await register(form);
      console.log(result);
      console.log(result.data);
      
      if(result.data.code === 200){
        ElMessage.success('注册成功，即将跳转到登录页')
          router.push('/login')
      }else{  
        ElMessage.error('注册失败可能是验证码错误或者中途修改邮箱'+result.data.msg);

      }
    } catch (error) {
      ElMessage.error('注册失败');
      console.log(error)
    }
  })
}
const doSendCode = async () => {
  try {
    // 只校验用户名和邮箱，不再管验证码
    await loginFormRef.value?.validateField(['username', 'email'])
  } catch {
    ElMessage.error('请检查用户名和邮箱是否填写正确')
    return
  }

  const result = await sendCode(form)
  if (result?.data?.code === 200) {
    ElMessage.success('验证码已发送')
  } else {
    ElMessage.error('发送失败：' + (result?.data?.msg || '未知错误'))
  }
}
</script>

<template>
  <div class="login">
    <el-form ref="loginFormRef" :model="form" :rules="rules" label-width="auto" style="max-width: 600px" 
    label-position="top" size="large">
      <div class="title">注册</div>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名" 
        :prefix-icon="User" clearable></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱" 
        :prefix-icon="User" clearable></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <el-row :gutter="8" style="width: 100%; align-items: center;">
          <el-col :span="14">
            <el-input v-model="form.code" style="height: 40px;" />
          </el-col>
          <el-col :span="10">
            <el-button style="width: 100%; height: 40px;" @click="doSendCode">发送验证码</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" placeholder="请输入密码"
        :prefix-icon="Lock" :type="pwd ? 'text' : 'password'">
          <template #suffix>
            <el-icon
              style="cursor: pointer"
              @click="pwd = !pwd"
            >
              <View v-if="!pwd" />
              <Hide v-else />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="passwordConfirm">
        <el-input v-model="form.passwordConfirm" placeholder="请输入确认密码"
        :prefix-icon="Lock" :type="pwd2 ? 'text' : 'password'">
          <template #suffix>
            <el-icon
              style="cursor: pointer"
              @click="pwd2 = !pwd2"
            >
              <View v-if="!pwd2" />
              <Hide v-else />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="doRegister">注册</el-button>
        <!-- <el-button>Cancel</el-button> -->
      </el-form-item>
      <el-form-item>
        <div style="text-align: center; margin-top: 10px;">
          已有账号? <router-link to="/login" style="color: #667eea;">立即登录</router-link>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.demo-pagination-block + .demo-pagination-block {
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
    .title{
      font-size: 28px;
      font-weight: 700;
      text-align: center;
      justify-content: center;
      color: black;
    }
    .code-line {
        display: flex;
        gap: 0Px;
        width: 100%;
        height:40px;
    }
    .code-input {
      flex: 0 0 60%;   /* 60% */
    }
    .code-btn {
      flex: 0 0 40%;   /* 40% */
    }
  }
}
</style>