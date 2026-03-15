<!-- App.vue（根组件） -->
<template>
  <div class="app-container">
    <!-- 导航栏 -->
    <header class="header-nav" :class="scrolled ? 'header-nav--scrolled' : 'header-nav--unscrolled'">
      <div class="header-nav__container">
        <div class="header-nav__logo">
          <h1 class="header-nav__logo-text">
            <a href="/">
              <img src="@/assets/logo2.png" class="header-nav__logo-img">
            </a>
            <span>出发啦</span>
          </h1>
        </div>

        <!-- 导航链接 -->
        <nav class="header-nav__desktop-nav">
          <!-- 用 router-link 替代 a 标签 -->
          <router-link to="/" class="header-nav__nav-link" exact-active-class="header-nav__nav-link--active" exact>首页</router-link>
          <router-link to="/destination" class="header-nav__nav-link" exact-active-class="header-nav__nav-link--active">客服团队</router-link>
          <router-link to="/destination" class="header-nav__nav-link" exact-active-class="header-nav__nav-link--active">全部商家</router-link>
          <router-link to="/hotel" class="header-nav__nav-link" exact-active-class="header-nav__nav-link--active">商家入驻</router-link>
          <router-link to="/flight" class="header-nav__nav-link" exact-active-class="header-nav__nav-link--active">关于我们</router-link>
          <router-link to="/package" class="header-nav__nav-link" exact-active-class="header-nav__nav-link--active">常见问题</router-link>
          <router-link to="/guide" class="header-nav__nav-link" exact-active-class="header-nav__nav-link--active">用户反馈</router-link>
        </nav>

        <!-- 用户功能 -->
        <div class="header-nav__user-actions">
          <el-dropdown placement="top" trigger="hover">
            <div class="header-nav__login-btn">
              <el-avatar :src="imageBaseUrl + userInfoStore.info.avatar" size="medium" class="user-avatar" />
              <div class="user-info-wrapper">
                <span class="user-name">{{ userInfoStore.info.username }}</span>
                <div class="member-tag" :class="`member-tag--${userInfoStore.info.vip === 1 ? 'diamond' : 'normal'}`">
                  <el-icon class="member-icon">
                    <template v-if="userInfoStore.info.vip === 1">
                      <SuperVip /> <!-- 高级会员 -->
                    </template>
                    <template v-else>
                      <NormalVip /> <!-- 普通会员 -->
                    </template>
                  </el-icon>
                  <span class="member-text">
                    {{ userInfoStore.info.vip === 1 ? '高级会员' : '普通会员' }}
                  </span>
                </div>
              </div>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="">我的积分</el-dropdown-item>
                <el-dropdown-item>我的收藏</el-dropdown-item>
                <el-dropdown-item @click="router.push('/my/order/hotel')">我的订单</el-dropdown-item>
                <el-dropdown-item>开通会员</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-icon @click="logout">
            <Logout />
          </el-icon>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
// 导航栏滚动效果（公共逻辑，放在根组件）
import { ref, onMounted, onUnmounted } from 'vue';
import { Logout, NormalVip, SuperVip } from '@/components/Icon.vue';
import { useUserInfoStore } from '@/stores/userInfo';
import { useTokenStore } from '@/stores/token';
import { getUserInfoService } from '@/api/user';
import { ElMessageBox, ElNotification } from 'element-plus';
import { imageBaseUrl } from '@/utils/request';
import router from '@/router';
import { useGeoStore } from '@/stores/geo';

const scrolled = ref(false);
const userInfoStore = useUserInfoStore();
const tokenStore = useTokenStore();
const geoStore = useGeoStore();

// 滚动监听（公共逻辑）
const handleScroll = () => {
  scrolled.value = window.scrollY > 50;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  getUserInfo();
  geoStore.getCityByBaiduMap();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const getUserInfo = async () => {
  const result = await getUserInfoService()
  userInfoStore.setInfo(result.data)
};

const logout = () => {
  ElMessageBox.confirm(
    '是否要退出登录?',
    'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      tokenStore.removeToken()
      router.push('/login')
      ElNotification.success({
        title: '提示',
        message: '您已成功退出登录！'
      })
    })
    .catch(() => {
      ElNotification.primary('您已取消 “退出登录” 操作',)
    })
}
</script>

<style scoped>
/* 只保留公共样式：导航栏、页脚、main 容器的基础样式 */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  background-color: rgb(255, 255, 255);
  flex-grow: 1;
}

/* 导航栏样式（原样式中与导航栏相关的部分） */
.header-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  transition: all 0.3s ease;
}
</style>

<style scoped>
/* 基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

.header-nav__logo-img {
  height: 54px;
  width: auto;
  vertical-align: middle;
  margin-right: 10px;
}

.root-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f9fafb;
}

.main-content {
  flex-grow: 1;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* 导航栏样式 */
.header-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  transition: all 0.3s ease;
}

.header-nav--unscrolled {
  background-color: transparent;
  padding: 1rem 0;
}

.header-nav--scrolled {
  background-color: #a5f5e5;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 0;
}

.header-nav__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-nav__logo-text {
  outline: none;
  font-size: 1.5rem;
  font-weight: bold;
  color: #2563eb;
  display: flex;
  align-items: center;
}

.header-nav__logo-icon {
  margin-right: 0.5rem;
}

.header-nav__desktop-nav {
  display: none;
  align-items: center;
  gap: 2rem;
}

@media (min-width: 768px) {
  .header-nav__desktop-nav {
    display: flex;
  }
}

.header-nav__nav-link {
  font-weight: 500;
  color: #4b5563;
  transition: color 0.2s ease;
  text-decoration: none;
}

.header-nav__nav-link:hover {
  color: #2563eb;
}

.header-nav__nav-link--active {
  color: #2563eb;
}

.header-nav__user-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}


.header-nav__login-btn {
  outline: none;
  display: none;
  align-items: center;
  color: #4b5563;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
  gap: 0.5rem;
}

@media (min-width: 768px) {
  .header-nav__login-btn {
    display: flex;
  }
}

.header-nav__login-btn:hover {
  color: #2563eb;
}

.header-nav__mobile-btn {
  display: block;
  color: #4b5563;
  background: none;
  border: none;
  cursor: pointer;
}

@media (min-width: 768px) {
  .header-nav__mobile-btn {
    display: none;
  }
}

.header-nav__mobile-menu {
  display: block;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #ffffff;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transform: translateY(-100%);
  transition: transform 0.3s ease-in-out;
  z-index: -1;
}

@media (min-width: 768px) {
  .header-nav__mobile-menu {
    display: none;
  }
}

.mobile-menu--open {
  transform: translateY(0);
  z-index: 40;
}

.header-nav__mobile-menu-container {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.header-nav__mobile-link {
  padding: 0.5rem 0;
  font-weight: 500;
  color: #4b5563;
  text-decoration: none;
  transition: color 0.2s ease;
}

.header-nav__mobile-link:hover {
  color: #2563eb;
}

.header-nav__mobile-link--active {
  color: #2563eb;
}

.header-nav__mobile-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 0.5rem;
  margin-top: 0.5rem;
  border-top: 1px solid #f3f4f6;
}

/* 英雄区域样式 */
.hero-section {
  position: relative;
  height: 500px;
  overflow: hidden;
}

@media (min-width: 768px) {
  .hero-section {
    height: 600px;
  }
}

.hero-section__slides {
  position: absolute;
  inset: 0;
}

.hero-slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 1s ease;
  background-image: var(--slide-image);
}

.hero-slide--active {
  position: relative;
  opacity: 1;
}

.hero-section__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
}

.hero-section__content {
  position: relative;
  z-index: 10;
  height: 100%;
  display: flex;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.hero-section__text {
  max-width: 4xl;
}

.hero-section__title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: bold;
  color: #ffffff;
  line-height: 1.2;
  margin-bottom: 0.5rem;
}

.hero-section__desc {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: #f3f4f6;
  margin-bottom: 2rem;
  max-width: 2xl;
}

.hero-section__controls {
  position: absolute;
  bottom: 1.5rem;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  z-index: 10;
}

.hero-control__dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.hero-control__dot--active {
  background-color: #ffffff;
  width: 1.5rem;
}

/* 3. 核心样式：调整用户区域布局+会员标签美观度 */
.header-nav__user-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  /* 退出图标与用户区域的间距 */
}

/* 下拉触发区：头像与用户信息横向对齐 */
.header-nav__login-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  /* 头像与文字的间距 */
  padding: 4px 8px;
  cursor: pointer;
}

/* 用户名+会员等级：垂直居中排列 */
.user-info-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  /* 文字与会员标签居中对齐 */
}

/* 用户名样式：简洁清晰 */
.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

/* 会员标签基础样式：圆角+内边距+紧凑布局 */
.member-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  /* 图标与文字的间距 */
  padding: 1px 6px;
  border-radius: 12px;
  /* 大圆角更显柔和 */
  font-size: 12px;
  font-weight: 400;
}

/* 会员图标大小控制 */
.member-icon {
  font-size: 20px;
}

/* 4. 不同会员等级的颜色方案（美观且区分度高） */
/* 普通会员：浅灰 */
.member-tag--normal {
  background-color: #f5f7fa;
  color: #666;
}

/* 白银会员：浅蓝 */
.member-tag--silver {
  background-color: #e6f4ff;
  color: #1890ff;
}

/* 黄金会员：浅金 */
.member-tag--gold {
  background: linear-gradient(120deg, #fffbe6, #fff1cc);
  /* 渐变更美观 */
  color: #fa8c16;
}

/* 钻石会员：深蓝渐变 */
.member-tag--diamond {
  background: linear-gradient(120deg, #e6f7ff, #bae7ff);
  color: #1890ff;
}

/* 退出图标样式：与整体协调 */
.logout-icon {
  font-size: 18px;
  color: #666;
  cursor: pointer;
  transition: color 0.2s;
}

.logout-icon:hover {
  color: #1890ff;
}
</style>