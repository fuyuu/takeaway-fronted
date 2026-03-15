<template>
  <div class="smart-customer-service" :class="sizeClass">
    <!-- 尺寸选择器 -->
    <div class="size-selector">
      <button 
        v-for="sizeOption in sizeOptions" 
        :key="sizeOption.value"
        :class="['size-btn', { active: currentSize === sizeOption.value }]"
        @click="changeSize(sizeOption.value)"
      >
        {{ sizeOption.label }}
      </button>
    </div>

    <!-- 客服头部 -->
    <div class="service-header">
      <div class="header-left">
        <div class="avatar">🤖</div>
        <div class="service-info">
          <h3>智能外卖助手</h3>
          <span class="status online">在线</span>
        </div>
      </div>
      <div class="header-actions">
        <button class="action-btn" @click="minimizeChat">
          <span>−</span>
        </button>
        <button class="action-btn" @click="closeChat">
          <span>×</span>
        </button>
      </div>
    </div>

    <!-- 客服主体 -->
    <div class="service-body">
      <!-- 欢迎区域 -->
      <div class="welcome-section" v-if="showWelcome">
        <div class="welcome-card">
          <h4>您好！我是您的智能外卖助手</h4>
          <p>我可以帮您：推荐美食、解答疑问、处理订单问题</p>
          <div class="quick-actions" :class="currentSize">
            <button class="quick-btn" @click="quickAction('recommend')">
              🍔 菜品推荐
            </button>
            <button class="quick-btn" @click="quickAction('order')">
              📦 订单查询
            </button>
            <button class="quick-btn" @click="quickAction('discount')">
              💰 优惠活动
            </button>
            <button class="quick-btn" @click="quickAction('contact')" v-if="currentSize !== 'small'">
              📞 联系客服
            </button>
          </div>
        </div>
      </div>

      <!-- 对话区域 -->
      <div class="chat-container">
        <div class="messages-wrapper">
          <div 
            v-for="(message, index) in messages" 
            :key="index" 
            :class="['message', message.type, currentSize]"
          >
            <div class="message-avatar">
              {{ message.type === 'user' ? '👤' : '🤖' }}
            </div>
            <div class="message-content">
              <div class="message-text">{{ message.text }}</div>
              <div class="message-time">{{ message.time }}</div>
            </div>
          </div>

          <!-- 输入建议 -->
          <div class="suggestions" v-if="showSuggestions && messages.length > 0" :class="currentSize">
            <div 
              v-for="suggestion in currentSuggestions" 
              :key="suggestion.text"
              class="suggestion-item"
              @click="selectSuggestion(suggestion)"
            >
              {{ suggestion.text }}
            </div>
          </div>
        </div>
      </div>

      <!-- 功能面板 -->
      <div class="function-panel" v-if="showFunctionPanel" :class="currentSize">
        <div class="panel-section">
          <h5>常用功能</h5>
          <div class="function-grid" :class="currentSize">
            <div class="function-item" @click="openFunction('track')">
              <div class="function-icon">🚚</div>
              <span>配送跟踪</span>
            </div>
            <div class="function-item" @click="openFunction('refund')">
              <div class="function-icon">↩️</div>
              <span>申请退款</span>
            </div>
            <div class="function-item" @click="openFunction('complaint')">
              <div class="function-icon">📝</div>
              <span>投诉建议</span>
            </div>
            <div class="function-item" @click="openFunction('contact')">
              <div class="function-icon">📞</div>
              <span>联系客服</span>
            </div>
            <div class="function-item" @click="openFunction('address')" v-if="currentSize === 'large'">
              <div class="function-icon">📍</div>
              <span>地址管理</span>
            </div>
            <div class="function-item" @click="openFunction('payment')" v-if="currentSize === 'large'">
              <div class="function-icon">💳</div>
              <span>支付方式</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="input-section" :class="currentSize">
      <div class="input-tools" v-if="currentSize !== 'small'">
        <button class="tool-btn" @click="toggleFunctionPanel">
          📁
        </button>
        <button class="tool-btn" @click="showOrderList">
          🛒
        </button>
        <button class="tool-btn" @click="showCoupons">
          🎫
        </button>
        <button class="tool-btn" @click="showHistory" v-if="currentSize === 'large'">
          📋
        </button>
      </div>
      <div class="input-wrapper">
        <input 
          v-model="inputText" 
          type="text" 
          placeholder="输入您的问题..."
          @keyup.enter="sendMessage"
          @input="handleInput"
        />
        <button class="send-btn" @click="sendMessage" :disabled="!inputText.trim()">
          <span v-if="currentSize !== 'small'">发送</span>
          <span v-else>➤</span>
        </button>
      </div>
    </div>

    <!-- 订单列表弹窗 -->
    <div class="modal" v-if="showOrderModal">
      <div class="modal-content" :class="currentSize">
        <div class="modal-header">
          <h4>我的订单</h4>
          <button class="close-btn" @click="showOrderModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="order-list">
            <div class="order-item" v-for="order in recentOrders" :key="order.id">
              <div class="order-info">
                <div class="order-title">{{ order.title }}</div>
                <div class="order-status" :class="order.status">{{ order.statusText }}</div>
              </div>
              <div class="order-time">{{ order.time }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 优惠券弹窗 -->
    <div class="modal" v-if="showCouponModal">
      <div class="modal-content" :class="currentSize">
        <div class="modal-header">
          <h4>我的优惠券</h4>
          <button class="close-btn" @click="showCouponModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="coupon-list">
            <div class="coupon-item" v-for="coupon in availableCoupons" :key="coupon.id">
              <div class="coupon-amount">¥{{ coupon.amount }}</div>
              <div class="coupon-info">
                <div class="coupon-title">{{ coupon.title }}</div>
                <div class="coupon-desc">{{ coupon.description }}</div>
                <div class="coupon-expiry">{{ coupon.expiry }}</div>
              </div>
              <button class="use-coupon-btn">立即使用</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue'

// 尺寸选项
const sizeOptions = [
  { label: '小', value: 'small' },
  { label: '中', value: 'medium' },
  { label: '大', value: 'large' },
  { label: '全屏', value: 'fullscreen' }
]

const currentSize = ref('medium')

const sizeClass = computed(() => `size-${currentSize.value}`)

const changeSize = (size: string) => {
  currentSize.value = size
}

// 消息数据
interface Message {
  type: 'user' | 'assistant'
  text: string
  time: string
}

const messages = ref<Message[]>([])
const inputText = ref('')
const showWelcome = ref(true)
const showFunctionPanel = ref(false)
const showOrderModal = ref(false)
const showCouponModal = ref(false)
const showSuggestions = ref(false)

// 输入建议
const currentSuggestions = ref([
  { text: '推荐附近的餐厅', action: 'recommend' },
  { text: '查看我的订单', action: 'order' },
  { text: '有什么优惠活动', action: 'discount' },
  { text: '配送时间多久', action: 'delivery' }
])

// 模拟订单数据
const recentOrders = ref([
  {
    id: 1,
    title: '肯德基套餐 × 1',
    status: 'delivering',
    statusText: '配送中',
    time: '今天 18:30'
  },
  {
    id: 2,
    title: '麦当劳汉堡 × 2',
    status: 'completed',
    statusText: '已完成',
    time: '昨天 12:15'
  }
])

// 模拟优惠券数据
const availableCoupons = ref([
  {
    id: 1,
    amount: 10,
    title: '新用户专享',
    description: '满30元可用',
    expiry: '2024-12-31到期'
  },
  {
    id: 2,
    amount: 5,
    title: '周末特惠',
    description: '无门槛使用',
    expiry: '2024-11-30到期'
  }
])

// 获取当前时间
const getCurrentTime = () => {
  const now = new Date()
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
}

// 发送消息
const sendMessage = () => {
  if (!inputText.value.trim()) return

  // 添加用户消息
  messages.value.push({
    type: 'user',
    text: inputText.value,
    time: getCurrentTime()
  })

  const userMessage = inputText.value.toLowerCase()
  inputText.value = ''
  showSuggestions.value = false
  showWelcome.value = false

  // 模拟AI回复
  setTimeout(() => {
    let response = ''
    
    if (userMessage.includes('推荐') || userMessage.includes('吃什么')) {
      response = '根据您的口味偏好，我为您推荐：\n🍔 招牌牛肉汉堡\n🍗 香辣鸡腿堡\n🥗 健康沙拉套餐\n您想了解哪个菜品的详细信息？'
    } else if (userMessage.includes('订单') || userMessage.includes('我的订单')) {
      response = '您最近的订单：\n1. 肯德基套餐 - 配送中\n2. 麦当劳汉堡 - 已完成\n需要查看订单详情吗？'
    } else if (userMessage.includes('优惠') || userMessage.includes('折扣')) {
      response = '当前优惠活动：\n🎉 新用户立减10元\n💰 满50减8元\n🍕 指定餐厅8折优惠\n需要我帮您筛选适合的优惠吗？'
    } else if (userMessage.includes('配送') || userMessage.includes('时间')) {
      response = '通常配送时间30-45分钟，具体取决于：\n• 餐厅准备时间\n• 配送距离\n• 天气情况\n• 订单高峰期\n您可以选择"立即配送"或"预约配送"'
    } else if (userMessage.includes('退款') || userMessage.includes('退货')) {
      response = '如需申请退款，请提供：\n1. 订单号码\n2. 退款原因\n3. 相关照片证据\n我将协助您处理退款申请'
    } else {
      response = '感谢您的咨询！我可以帮您：\n• 推荐美食\n• 查询订单\n• 优惠信息\n• 配送跟踪\n• 售后服务\n请告诉我您需要什么帮助？'
    }

    messages.value.push({
      type: 'assistant',
      text: response,
      time: getCurrentTime()
    })
  }, 1000)
}

// 快速操作
const quickAction = (action: string) => {
  const actionMessages = {
    recommend: '请帮我推荐一些好吃的',
    order: '查看我的订单',
    discount: '有什么优惠活动',
    contact: '联系人工客服'
  }
  
  inputText.value = actionMessages[action as keyof typeof actionMessages]
  sendMessage()
}

// 选择建议
const selectSuggestion = (suggestion: any) => {
  inputText.value = suggestion.text
  sendMessage()
}

// 处理输入
const handleInput = () => {
  showSuggestions.value = inputText.value.length === 0
}

// 功能面板操作
const toggleFunctionPanel = () => {
  showFunctionPanel.value = !showFunctionPanel.value
}

const openFunction = (functionType: string) => {
  const functionMessages = {
    track: '查看配送进度',
    refund: '如何申请退款',
    complaint: '我要投诉建议',
    contact: '联系人工客服',
    address: '管理收货地址',
    payment: '设置支付方式'
  }
  
  inputText.value = functionMessages[functionType as keyof typeof functionMessages]
  sendMessage()
  showFunctionPanel.value = false
}

// 显示订单列表
const showOrderList = () => {
  showOrderModal.value = true
}

// 显示优惠券
const showCoupons = () => {
  showCouponModal.value = true
}

// 显示历史记录
const showHistory = () => {
  // 实现历史记录功能
  console.log('显示历史记录')
}

// 窗口控制
const minimizeChat = () => {
  console.log('最小化聊天窗口')
}

const closeChat = () => {
  console.log('关闭聊天窗口')
}

// 初始化欢迎消息
onMounted(() => {
  setTimeout(() => {
    messages.value.push({
      type: 'assistant',
      text: '您好！我是您的智能外卖助手，可以帮您推荐美食、查询订单、了解优惠信息等。请问有什么可以帮您的？',
      time: getCurrentTime()
    })
  }, 500)
})
</script>

<style scoped>
.smart-customer-service {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow: hidden;
  transition: all 0.3s ease;
}

/* 尺寸选择器 */
.size-selector {
  display: flex;
  padding: 8px;
  background: #f8f9fa;
  border-bottom: 1px solid #e1e5e9;
  gap: 4px;
}

.size-btn {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #e1e5e9;
  background: white;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.size-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.size-btn:hover:not(.active) {
  background: #f1f3f4;
}

/* 小尺寸 */
.size-small {
  width: 300px;
  height: 400px;
}

.size-small .service-header {
  padding: 12px 16px;
}

.size-small .avatar {
  width: 32px;
  height: 32px;
  font-size: 16px;
}

.size-small .service-info h3 {
  font-size: 14px;
}

.size-small .welcome-section {
  padding: 12px;
}

.size-small .welcome-card h4 {
  font-size: 13px;
}

.size-small .welcome-card p {
  font-size: 11px;
}

.size-small .quick-actions.small {
  flex-direction: column;
  gap: 6px;
}

.size-small .quick-btn {
  padding: 6px 10px;
  font-size: 11px;
}

.size-small .messages-wrapper {
  padding: 12px;
  gap: 12px;
}

.size-small .message-avatar {
  width: 28px;
  height: 28px;
  font-size: 12px;
}

.size-small .message-content {
  padding: 8px 12px;
}

.size-small .message-text {
  font-size: 13px;
}

.size-small .input-section.small {
  padding: 12px;
}

.size-small .input-wrapper input {
  padding: 10px 14px;
  font-size: 13px;
}

.size-small .send-btn {
  padding: 10px 16px;
  font-size: 13px;
  min-width: 40px;
}

/* 中尺寸 (默认) */
.size-medium {
  width: 380px;
  height: 500px;
}

.size-medium .service-header {
  padding: 15px 20px;
}

.size-medium .avatar {
  width: 40px;
  height: 40px;
  font-size: 18px;
}

.size-medium .service-info h3 {
  font-size: 16px;
}

.size-medium .welcome-section {
  padding: 16px;
}

.size-medium .welcome-card h4 {
  font-size: 14px;
}

.size-medium .welcome-card p {
  font-size: 12px;
}

.size-medium .quick-actions.medium {
  gap: 8px;
}

.size-medium .quick-btn {
  padding: 8px 12px;
  font-size: 12px;
}

.size-medium .messages-wrapper {
  padding: 16px;
  gap: 16px;
}

.size-medium .message-avatar {
  width: 32px;
  height: 32px;
  font-size: 14px;
}

.size-medium .message-content {
  padding: 12px;
}

.size-medium .message-text {
  font-size: 14px;
}

.size-medium .input-section.medium {
  padding: 16px;
}

.size-medium .input-wrapper input {
  padding: 12px 16px;
  font-size: 14px;
}

.size-medium .send-btn {
  padding: 12px 20px;
  font-size: 14px;
}

/* 大尺寸 */
.size-large {
  width: 500px;
  height: 600px;
}

.size-large .service-header {
  padding: 18px 24px;
}

.size-large .avatar {
  width: 48px;
  height: 48px;
  font-size: 20px;
}

.size-large .service-info h3 {
  font-size: 18px;
}

.size-large .welcome-section {
  padding: 20px;
}

.size-large .welcome-card h4 {
  font-size: 16px;
}

.size-large .welcome-card p {
  font-size: 14px;
}

.size-large .quick-actions.large {
  gap: 12px;
}

.size-large .quick-btn {
  padding: 10px 16px;
  font-size: 14px;
}

.size-large .messages-wrapper {
  padding: 20px;
  gap: 20px;
}

.size-large .message-avatar {
  width: 36px;
  height: 36px;
  font-size: 16px;
}

.size-large .message-content {
  padding: 14px 16px;
}

.size-large .message-text {
  font-size: 15px;
}

.size-large .input-section.large {
  padding: 20px;
}

.size-large .input-wrapper input {
  padding: 14px 18px;
  font-size: 15px;
}

.size-large .send-btn {
  padding: 14px 24px;
  font-size: 15px;
}

.size-large .function-grid.large {
  grid-template-columns: repeat(3, 1fr);
}

/* 全屏尺寸 */
.size-fullscreen {
  width: 100vw;
  height: 100vh;
  border-radius: 0;
}

.size-fullscreen .service-header {
  padding: 20px 30px;
}

.size-fullscreen .avatar {
  width: 56px;
  height: 56px;
  font-size: 24px;
}

.size-fullscreen .service-info h3 {
  font-size: 20px;
}

.size-fullscreen .welcome-section {
  padding: 30px;
}

.size-fullscreen .welcome-card h4 {
  font-size: 18px;
}

.size-fullscreen .welcome-card p {
  font-size: 16px;
}

.size-fullscreen .quick-actions.fullscreen {
  gap: 16px;
}

.size-fullscreen .quick-btn {
  padding: 12px 20px;
  font-size: 16px;
}

.size-fullscreen .messages-wrapper {
  padding: 30px;
  gap: 24px;
}

.size-fullscreen .message-avatar {
  width: 44px;
  height: 44px;
  font-size: 18px;
}

.size-fullscreen .message-content {
  padding: 16px 20px;
}

.size-fullscreen .message-text {
  font-size: 16px;
  line-height: 1.6;
}

.size-fullscreen .input-section.fullscreen {
  padding: 24px 30px;
}

.size-fullscreen .input-wrapper input {
  padding: 16px 20px;
  font-size: 16px;
}

.size-fullscreen .send-btn {
  padding: 16px 28px;
  font-size: 16px;
}

.size-fullscreen .function-grid.fullscreen {
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.size-fullscreen .function-item {
  padding: 16px;
}

.size-fullscreen .function-icon {
  font-size: 24px;
}

.size-fullscreen .function-item span {
  font-size: 14px;
}

/* 弹窗尺寸适配 */
.modal-content.small {
  max-width: 320px;
}

.modal-content.medium {
  max-width: 400px;
}

.modal-content.large {
  max-width: 500px;
}

.modal-content.fullscreen {
  max-width: 600px;
}

/* 其他原有样式保持不变 */
.service-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
}

.service-info h3 {
  margin: 0;
  font-weight: 600;
}

.status {
  font-size: 12px;
  opacity: 0.9;
}

.status.online::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  background: #4ade80;
  border-radius: 50%;
  margin-right: 4px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.service-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.welcome-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

.welcome-card h4 {
  margin: 0 0 8px 0;
  color: #333;
}

.welcome-card p {
  margin: 0 0 16px 0;
  color: #666;
}

.quick-actions {
  display: flex;
  justify-content: center;
}

.quick-btn {
  border: 1px solid #e1e5e9;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-btn:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.chat-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.messages-wrapper {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.message {
  display: flex;
  gap: 8px;
  max-width: 85%;
}

.message.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar {
  border-radius: 50%;
  background: #f1f3f4;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message-content {
  background: #f1f3f4;
  border-radius: 12px;
  position: relative;
}

.message.user .message-content {
  background: #667eea;
  color: white;
}

.message-text {
  line-height: 1.4;
  white-space: pre-line;
}

.message-time {
  font-size: 10px;
  opacity: 0.6;
  margin-top: 4px;
}

.suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.suggestion-item {
  padding: 6px 12px;
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.suggestion-item:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.function-panel {
  border-top: 1px solid #e1e5e9;
  background: #f8f9fa;
}

.panel-section h5 {
  margin: 0 0 12px 0;
  color: #333;
}

.function-grid {
  display: grid;
  gap: 12px;
}

.function-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.2s;
}

.function-item:hover {
  background: white;
}

.function-icon {
  font-size: 20px;
}

.function-item span {
  color: #666;
}

.input-section {
  border-top: 1px solid #e1e5e9;
  background: white;
}

.input-tools {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.tool-btn {
  padding: 6px 12px;
  border: 1px solid #e1e5e9;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.tool-btn:hover {
  background: #f1f3f4;
}

.input-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
}

.input-wrapper input {
  flex: 1;
  border: 1px solid #e1e5e9;
  border-radius: 24px;
  outline: none;
}

.input-wrapper input:focus {
  border-color: #667eea;
}

.send-btn {
  background: #667eea;
  color: white;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-btn:not(:disabled):hover {
  opacity: 0.9;
}

/* 弹窗样式 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e1e5e9;
}

.modal-header h4 {
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 16px;
  max-height: 400px;
  overflow-y: auto;
}

/* 订单列表 */
.order-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
}

.order-title {
  font-weight: 500;
}

.order-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  background: #f1f3f4;
}

.order-status.delivering {
  background: #fff3cd;
  color: #856404;
}

.order-status.completed {
  background: #d1edff;
  color: #0c5460;
}

.order-time {
  font-size: 12px;
  color: #666;
}

/* 优惠券列表 */
.coupon-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.coupon-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
}

.coupon-amount {
  font-weight: bold;
  color: #ff6b6b;
}

.coupon-info {
  flex: 1;
}

.coupon-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.coupon-desc {
  color: #666;
  margin-bottom: 2px;
}

.coupon-expiry {
  color: #999;
}

.use-coupon-btn {
  padding: 6px 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}
</style>