# Takeaway 外卖点餐系统 - 技术文档

## 项目概述

Takeaway 是一个基于现代前端技术栈构建的外卖点餐系统，采用 Vue 3 + TypeScript + Element Plus 开发，提供完整的用户点餐、商家管理、购物车、订单支付等功能。

### 版本信息
- **项目名称**: takeaway
- **版本**: 0.0.0
- **开发环境**: Node.js ^20.19.0 || >=22.12.0

## 技术架构

### 前端技术栈
- **框架**: Vue 3.5.18 (组合式API)
- **构建工具**: Vite 7.0.6
- **UI组件库**: Element Plus 2.11.4
- **状态管理**: Pinia 3.0.4 + Pinia持久化插件
- **路由管理**: Vue Router 4.5.1
- **HTTP客户端**: Axios 1.12.1
- **地图服务**: 高德地图JSAPI
- **二维码生成**: qrcode.vue 3.6.0

### 开发工具
- **TypeScript支持**: 类型系统
- **开发调试**: Vite Plugin Vue DevTools 8.0.0
- **IDE推荐**: VSCode + Volar插件

## 项目结构

```
takeaway/
├── public/                    # 静态资源
├── src/
│   ├── api/                  # API接口模块
│   │   ├── address.ts        # 地址管理API
│   │   ├── banner.ts         # 广告轮播API
│   │   ├── cart.ts           # 购物车API
│   │   ├── category.ts       # 分类管理API
│   │   ├── dish.ts           # 菜品管理API
│   │   ├── merchant.ts       # 商家管理API
│   │   ├── order.ts          # 订单管理API
│   │   ├── pay.ts            # 支付API
│   │   ├── user.ts           # 用户管理API
│   │   └── voucher.ts        # 优惠券API
│   │
│   ├── assets/               # 静态资源
│   │
│   ├── router/               # 路由配置
│   │   └── index.ts
│   │
│   ├── types/                # TypeScript类型定义
│   │   └── Address.ts        # 地址相关类型
│   │
│   ├── utils/                # 工具函数
│   │   ├── amap.js           # 高德地图工具
│   │   ├── pcas-code.json    # 行政区划代码
│   │   └── request.js        # Axios请求封装
│   │
│   ├── views/                # 页面组件
│   │   ├── components/       # 公共组件
│   │   ├── footer/           # 底部组件
│   │   │   └── about-we.vue
│   │   │
│   │   ├── header/           # 头部组件
│   │   │   └── Header.vue
│   │   │
│   │   ├── login/            # 登录相关
│   │   │   ├── Login.vue
│   │   │   ├── Register.vue
│   │   │   └── Forget.vue
│   │   │
│   │   ├── map/              # 地图相关
│   │   │   ├── MapContain.vue
│   │   │   ├── MapContain2.vue
│   │   │   ├── MapContain3.vue
│   │   │   └── MapEdit.vue
│   │   │
│   │   ├── merchant/         # 商家相关
│   │   │   ├── Merchant.vue
│   │   │   ├── Join.vue
│   │   │   ├── qrcode.vue
│   │   │   └── AlipayPagePay.vue
│   │   │
│   │   ├── Account.vue       # 用户账户
│   │   ├── ai.vue            # AI功能
│   │   ├── Application.vue   # 应用入口
│   │   ├── Home.vue          # 首页
│   │   └── qwe.vue           # 测试页面
│   │
│   ├── App.vue               # 应用根组件
│   └── main.js               # 应用入口
│
├── index.html                # HTML模板
├── vite.config.js            # Vite配置
├── package.json              # 依赖配置
├── jsconfig.json             # JS配置
└── README.md                 # 项目说明
```

## 核心功能模块

### 1. 用户模块
- **用户认证**: 登录/注册/忘记密码
- **用户信息管理**: 个人信息修改、头像上传
- **权限管理**: 基于角色的访问控制
- **Token管理**: JWT双令牌机制（accessToken + refreshToken）

### 2. 商家模块
- **商家列表**: 分类筛选、附近商家推荐
- **商家详情**: 店铺信息、评分、配送信息
- **菜品展示**: SPU/SKU商品展示
- **优惠券**: 限时抢购、折扣优惠

### 3. 购物车模块
- **商品添加**: 加入购物车
- **购物车管理**: 数量修改、删除
- **批量操作**: 清空购物车

### 4. 订单模块
- **下单流程**: 购物车结算
- **订单管理**: 订单列表、详情
- **配送地址**: 地址选择/管理

### 5. 支付模块
- **支付集成**: 支付宝支付
- **支付回调**: 支付结果处理
- **订单状态**: 支付状态跟踪

### 6. 地图模块
- **位置服务**: 高德地图集成
- **地址选择**: 地图选点
- **配送范围**: 配送区域展示

### 7. 首页模块
- **广告轮播**: Banner展示
- **分类导航**: 菜品分类
- **商家推荐**: 智能推荐算法

## API接口规范

### 请求封装
- **基础URL**: `/api`（开发环境代理到`http://localhost:8080`）
- **请求拦截**: 自动添加Authorization Header
- **响应拦截**: 统一错误处理、Token自动刷新

### Token管理机制
```javascript
// Token刷新流程
1. 401错误触发Token刷新
2. 使用refreshToken获取新的accessToken
3. 更新本地存储的Token
4. 重试原始请求
```

### 接口模块
| 模块 | 功能 | 主要接口 |
|------|------|----------|
| user | 用户管理 | 登录、注册、用户信息、Token刷新 |
| merchant | 商家管理 | 商家列表、商家详情、菜品列表 |
| cart | 购物车 | 添加、删除、修改、列表 |
| order | 订单管理 | 下单、订单列表 |
| pay | 支付 | 支付宝支付表单 |
| address | 地址管理 | 地址CRUD操作 |
| banner | 广告管理 | Banner列表 |
| category | 分类管理 | 分类列表 |
| voucher | 优惠券 | 优惠券列表、领取 |

## 路由配置

### 主要路由路径
```typescript
{
  path: '/login',       // 登录页（隐藏Header）
  path: '/register',    // 注册页（隐藏Header）
  path: '/forget',      // 忘记密码（隐藏Header）
  path: '/account',     // 用户账户
  path: '/map',         // 地图页面（显示地图）
  path: '/first',       // 首页
  path: '/merchant',    // 商家列表
  path: '/merchant/:id', // 商家详情
  path: '/join/merchant', // 商家入驻
  path: '/qrcode',      // 二维码生成
  path: '/alipay/pagePay/:orderNumber', // 支付宝支付
  path: '/about-we',    // 关于我们
}
```

### 路由懒加载
所有页面组件使用动态导入，优化首屏加载性能：
```typescript
component: () => import('../views/login/Login.vue')
```

## 状态管理

### Pinia Store设计
1. **用户状态**: 登录状态、用户信息
2. **购物车状态**: 商品列表、总价计算
3. **地址状态**: 配送地址、默认地址
4. **订单状态**: 当前订单、历史订单

### 持久化配置
- **存储策略**: localStorage
- **序列化**: JSON序列化/反序列化
- **白名单**: 关键状态持久化

## 开发配置

### 环境要求
```json
{
  "node": "^20.19.0 || >=22.12.0",
  "npm": ">=7.0.0"
}
```

### 项目脚本
```json
{
  "dev": "vite",           // 开发服务器
  "build": "vite build",   // 生产构建
  "preview": "vite preview" // 构建预览
}
```

### Vite配置
```javascript
// vite.config.js
{
  alias: {
    '@': './src'           // 路径别名
  },
  proxy: {
    '/api': {              // API代理配置
      target: "http://localhost:8080",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

## 组件设计规范

### 1. Vue组件结构
```vue
<template>
  <!-- 模板部分 -->
</template>

<script setup lang="ts">
  // 组合式API
</script>

<style scoped>
  /* 样式部分 */
</style>
```

### 2. 组件分类
- **页面组件**: `/views/` 目录下的完整页面
- **布局组件**: Header、Footer等布局组件
- **业务组件**: 可复用的业务功能组件
- **UI组件**: 基础UI组件（优先使用Element Plus）

### 3. Props类型定义
使用TypeScript接口明确定义Props类型

## 样式设计

### 1. 样式方案
- **CSS预处理器**: 原生CSS
- **样式作用域**: Vue Scoped Styles
- **响应式设计**: 移动端优先

### 2. 设计规范
- **颜色规范**: 主色、辅色、文字色
- **间距系统**: 统一的间距单位
- **字体系统**: 字体大小、行高规范

## 安全配置

### 1. 前端安全
- **XSS防护**: 输出编码、Content Security Policy
- **CSRF防护**: Token验证、SameSite Cookie
- **敏感信息**: 本地存储加密

### 2. 高德地图安全
```html
<script>
  window._AMapSecurityConfig = { 
    securityJsCode: 'cf0ab58ec640de4f61d31f8fe75151e0' 
  }
</script>
```

## 性能优化

### 1. 加载性能
- **代码分割**: 路由懒加载
- **图片优化**: 图片压缩、懒加载
- **Tree Shaking**: 未使用代码消除

### 2. 运行时性能
- **组件复用**: 合理使用v-if和v-show
- **虚拟滚动**: 长列表优化
- **防抖节流**: 高频操作优化

### 3. 缓存策略
- **HTTP缓存**: 静态资源缓存
- **应用缓存**: Service Worker支持
- **API缓存**: 接口数据缓存

## 开发指南

### 1. 环境搭建
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 2. 代码规范
- **命名规范**: 组件使用PascalCase，其他使用camelCase
- **目录规范**: 按功能模块组织
- **提交规范**: Conventional Commits

### 3. 调试技巧
- **Vue DevTools**: 组件状态调试
- **网络调试**: API请求监控
- **性能分析**: Chrome DevTools性能面板

## 部署说明

### 1. 构建配置
```bash
# 生产环境构建
npm run build

# 构建产物位于 dist/ 目录
```

### 2. 服务器配置
- **Web服务器**: Nginx/Apache
- **HTTPS**: SSL证书配置
- **反向代理**: API请求代理

### 3. CDN配置
- **静态资源**: CDN加速
- **缓存策略**: 合理的缓存时间

## 故障排除

### 常见问题
1. **Token过期**: 检查Token刷新逻辑
2. **跨域问题**: 检查代理配置
3. **地图加载失败**: 检查安全密钥配置
4. **样式异常**: 检查CSS作用域冲突

### 调试工具
- **浏览器控制台**: 错误日志查看
- **网络面板**: 请求响应分析
- **Vue DevTools**: 组件状态调试

## 扩展计划

### 1. 功能扩展
- [ ] 实时聊天客服
- [ ] 用户评价系统
- [ ] 智能推荐算法
- [ ] 多店铺管理后台

### 2. 技术优化
- [ ] PWA支持
- [ ] 服务端渲染(SSR)
- [ ] 微前端架构
- [ ] 性能监控系统

### 3. 移动端适配
- [ ] 微信小程序版本
- [ ] React Native移动应用
- [ ] Flutter跨平台应用

## 依赖包说明

### 主要依赖
| 包名 | 版本 | 用途 |
|------|------|------|
| vue | ^3.5.18 | Vue框架核心 |
| element-plus | ^2.11.4 | UI组件库 |
| pinia | ^3.0.4 | 状态管理 |
| vue-router | ^4.5.1 | 路由管理 |
| axios | ^1.12.1 | HTTP客户端 |
| @amap/amap-jsapi-loader | ^1.0.1 | 高德地图加载器 |
| qrcode.vue | ^3.6.0 | 二维码生成 |

### 开发依赖
| 包名 | 版本 | 用途 |
|------|------|------|
| @vitejs/plugin-vue | ^6.0.1 | Vite Vue插件 |
| vite | ^7.0.6 | 构建工具 |
| vite-plugin-vue-devtools | ^8.0.0 | Vue开发工具 |

---

*文档最后更新: 2026年3月15日*
*项目负责人: Takeaway开发团队*