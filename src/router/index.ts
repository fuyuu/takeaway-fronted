// 引入路由器
import { createRouter, createWebHistory } from 'vue-router'

// //导入组件
// import Login from '../views/Login.vue'
// import Register from '../views/Register.vue'
// import Forget from '../views/Forget.vue'
// import MyAccount from '../views/components/MyAccount.vue'

// //定义路由关系
// const routes=[
//   {path:'/login',component:Login},
//   {path:'/register',component:Register},
//   {path:'/forget',component:Forget},
//   {path:'/account',component:MyAccount},
//   {path:'/',redirect:'/login'}
// ]
import ww from '../views/merchant/Merchant.vue'

// 移除直接导入，改为路由懒加载
const routes = [
  {
    path: '/login',
    component: () => import('../views/login/Login.vue'),
    meta:{ hideHeader: true }
  },
  {
    path: '/register',
    component: () => import('../views/login/Register.vue'),
    meta:{ hideHeader: true }
  },
  {
    path: '/forget',
    component: () => import('../views/login/Forget.vue'),
    meta:{ hideHeader: true }
  },
  {
    path: '/account',
    component: () => import('../views/Account.vue')
  },
  {
    path: '/map',
    meta: {
      showMap: true // 添加元信息标记需要显示地图
    },
    component: () => import('../views/map/MapContain3.vue')
  },
  {
    path: '/first',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/ssq',
    component: () => import('../views/Header.vue')
  },
  {
    path: '/merchant',
    component: () => import('../views/merchant/Merchant.vue')
  },
  {
    path: '/join/merchant',
    component: () => import('../views/merchant/Join.vue')
  },
  {
    path: '/qrcode',
    component: () => import('../views/merchant/qrcode.vue')
  },
  {
    path: '/alipay/pagePay/:orderNumber',
    component: () => import('../views/merchant/AlipayPagePay.vue')
  },
  {
    path: '/about-we',
    component: () => import('../views/footer/about-we.vue')
  },
  {
    path: '/merchant/:id',
    name: 'merchant',
    component: ww,
    props: true   // 会把 params.id 自动注入 ww.vue 的 props
  },
  { path: '/', redirect: '/first' }
]

//创建路由器
const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

//到处路由
export default router