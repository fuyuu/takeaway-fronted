<template>
  <header class="takeaway-header">
    <!-- 顶部导航主栏 -->
    <div class="header-container">
      <div class="map-nav-wrap">
        <router-link to="/">
          <MapContain2></MapContain2>
        </router-link>
        <nav class="quick-nav">
          <router-link to="/">首页</router-link>
          <router-link to="/join/merchant">商家入驻</router-link>
          <router-link to="/merchant/dashboard">商家中心</router-link>
          <router-link to="/feedback">订单中心</router-link>
          <router-link to="/contact">客服中心</router-link>
          <router-link to="/faq">常见问题</router-link>
        </nav>
      </div>
      <div class="header-content">
        <!-- 品牌标识 -->
        <div class="brand-container">
          <i class="brand-icon"></i>
          <img src="../assets/image.png" class="logo" @click="switchPage"></img>
        </div>

        <!-- 搜索框 -->
        <div class="search-box">
          <input type="text" placeholder="搜素商家或美食" v-model="searchText">
          <button @click="search">搜索</button>
        </div>

        <!-- 右侧用户信息区（替换为头像和用户名） -->
        <div class="user-info">
          <!-- 未登录 -->
          <template v-if="!isLogin">
            <span>你好，请</span>
            <el-link type="primary" @click="handleLogin">登录</el-link>
            <span>/</span>
            <el-link type="primary" @click="handleRegister">注册</el-link>
          </template>

          <!-- 已登录 -->
          <div v-else class="avatar-wrapper" @mouseenter="showMenu = true" @mouseleave="showMenu = false">
            <el-avatar :size="32" class="avatar">
              <img :src="userInfo.avatar || '../assets/today.jpg'" alt="用户头像">
            </el-avatar>
            <span class="user-nickname">{{ userInfo.nickname }}</span>

            <!-- 下拉菜单 -->
            <transition name="fade">
              <div v-show="showMenu" class="drop-menu">
                <div class="menu-item" @click="router.push(userRole === 0 ? '/account' : '/merchant/dashboard')">
                  {{ userRole === 0 ? '个人中心' : '商家中心' }}
                </div>
                <div class="menu-item" @click="handleLogout">退出</div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
    <!-- 下划线 + 空白占位区（关键！） -->
    <div class="header-bottom-space"></div>
  </header>
</template>

<script setup lang="ts">
import MapContain2 from './map/MapContain2.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUserInfo } from '@/api/user';
const switchPage = () => {
  console.log('回到首页页面')
  window.location.href = '/first'
}
// 搜索相关
const searchText = ref('')
const search = () => {
  // 搜索逻辑
  console.log('搜索内容:', searchText.value);
  // 这里可以添加实际的搜索功能，比如跳转到搜索结果页
  router.push(`/search?q=${encodeURIComponent(searchText.value)}`);
};

const router = useRouter()
const isLogin = ref(false);
const userRole = ref(0); // 0-用户 1-商家
const userInfo = ref<any>({
  nickname: '',
  avatar: ''
});

const showMenu = ref(false)   // 控制个人中心/退出菜单显隐
// 初始化登录状态
onMounted(() => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    isLogin.value = true;
    userRole.value = parseInt(localStorage.getItem('userRole') || '0');
    // 获取用户信息
    getUserInfo().then(res => {
      if (res.data.code === 200) {
        userInfo.value = res.data.data;
      } else {
        console.log("res.data.code错误", res.data.code);
      }
      return;
    });
  }
});

// 处理登录
const handleLogin = () => {
  router.push('login')
};
// 处理注册
const handleRegister = () => {
  router.push('/register')
};
// 退出登录
const handleLogout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userRole');
  isLogin.value = false;
  router.push('/login');
};
</script>

<style scoped>
/* 基础样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 导航栏整体样式 */
.takeaway-header {
  position: sticky;
  /* 改为 fixed 定位，确保始终固定在顶部 */
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  /* 提高层级，避免被其他内容覆盖 */
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 容器样式 */
.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 16px;
}

/* 定位右边的 */
.map-nav-wrap {
  display: flex;
  align-items: center;
  /* 垂直居中 */
  justify-content: space-between;
  /* 两端对齐 */
}

.map-nav-wrap a {
  text-decoration: none;
  color: #333;
  white-space: wrap;
  transition: color 0.2s;
}

.quick-nav {
  display: flex;
  flex-wrap: wrap;
  /* 超窄屏不允许换行 */
  gap: 30px;
  /* 链接之间间隔 */
  font-size: 14px;
}

.quick-nav a {
  text-decoration: none;
  color: #333;
  white-space: nowrap;
  transition: color 0.2s;
}

.quick-nav a:hover {
  color: #ff4d4f;
}

/*  */
.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
}

/* 品牌标识样式 */
.brand-container {
  display: flex;
  align-items: center;
}

.logo {
  height: 48px;
}

.brand-icon {
  color: #ff4d4f;
  font-size: 20px;
  margin-right: 8px;
}

.search-box {
  display: flex;
  height: 40px;
  width: 40%;
  border: 1px solid rgb(255, 80, 0);
  margin-top: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.search-box input {
  border: none;
  flex: 1;
  padding: 0 12px;
  font-size: 14px;
  outline: none;
}

.search-box button {
  background-color: rgb(255, 80, 0);
  padding: 0 20px;
  /* 按需留点内边距，视觉舒服 */
  border: none;
  /* 去掉外围线条 */
  outline: none;
  /* 取消去掉部分浏览器的焦点外框 */
  color: #fff;
  /* 白字更配橙色背景 */
  cursor: pointer;
  /* 鼠标悬停手型 */
}

/* 用户信息样式 头像之类的 */
.avatar-wrapper {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.user-nickname {
  margin-left: 8px;
  font-size: 14px;
  color: #333;
  vertical-align: middle;
}

/* 下拉菜单 */
.drop-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 110px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 999;
}

.menu-item {
  padding: 8px 12px;
  text-align: center;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

.menu-item:hover {
  background: #f5f5f5;
}
/* 下划线 + 下方空白 */
.header-bottom-space {
  height: 20px; /* 占位高度 = 头部高度 */
  border-bottom: 1px solid #e5e5e5; /* 下划线 */
}
</style>
