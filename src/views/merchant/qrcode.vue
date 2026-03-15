<template>
  <div class="qr-container">
    <div class="qr-card">
      <div class="qr-header">
        <div class="qr-title">支付宝收款码</div>
        <el-button 
          size="small" 
          icon="Refresh" 
          class="refresh-btn"
          @click="handleRefresh"
        >
          刷新二维码
        </el-button>
      </div>
      
      <div class="qr-content">
        <div class="qr-wrapper">
          <qrcode-vue :value="qrCodeUrl" size="220" class="qr-code" />
          <div class="qr-mask">
            <div class="alipay-logo">
              <img src="@/assets/aliyunpay.png" alt="支付宝" />
            </div>
          </div>
        </div>
        
        <div class="qr-info">
          <p class="info-text">请使用支付宝扫描二维码</p>
          <p class="validity-text">
            二维码有效期: <span>{{ validTime }}</span>
          </p>
        </div>
      </div>
      
      <div class="qr-footer">
        <el-button 
          type="primary" 
          class="save-btn"
          @click="handleSave"
        >
          <Download /> 保存二维码
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import QrcodeVue from 'qrcode.vue'
import { ref, onMounted } from 'vue'
import { Refresh, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 二维码地址（实际项目中从接口获取）
const qrCodeUrl = ref('https://qr.alipay.com/bax02099by0swrrd28wa00f6')
// 有效期倒计时（秒）
const validTime = ref('5:00')
let countdownTimer = null

// 刷新二维码
const handleRefresh = () => {
  // 模拟接口请求刷新二维码
  qrCodeUrl.value = `https://qr.alipay.com/bax02099${Math.random().toString(36).substr(2, 10)}`
  resetCountdown()
  ElMessage.success('二维码已刷新')
}

// 保存二维码
const handleSave = () => {
  // 实际项目中实现保存图片功能
  ElMessage.info('二维码保存功能开发中')
}

// 重置倒计时
const resetCountdown = () => {
  clearInterval(countdownTimer)
  let minutes = 5
  let seconds = 0
  validTime.value = `${minutes}:${seconds.toString().padStart(2, '0')}`
  
  countdownTimer = setInterval(() => {
    if (seconds === 0) {
      if (minutes === 0) {
        clearInterval(countdownTimer)
        handleRefresh() // 过期自动刷新
        return
      }
      minutes--
      seconds = 59
    } else {
      seconds--
    }
    validTime.value = `${minutes}:${seconds.toString().padStart(2, '0')}`
  }, 1000)
}

onMounted(() => {
  resetCountdown()
})
</script>

<style scoped>
.qr-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  padding: 20px;
}

.qr-card {
  width: 100%;
  max-width: 400px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.qr-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.qr-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.refresh-btn {
  color: #1677ff;
  background-color: #e8f3ff;
}

.qr-content {
  padding: 30px 20px;
  text-align: center;
}

.qr-wrapper {
  position: relative;
  display: inline-block;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.qr-code {
  display: block;
  margin: 0 auto;
}

.alipay-logo {
  width: 48px;
  height: 48px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 8px;
  padding: 4px;
}

.alipay-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.qr-info {
  color: #666;
}

.info-text {
  font-size: 16px;
  margin-bottom: 8px;
}

.validity-text {
  font-size: 14px;
  color: #999;
}

.validity-text span {
  color: #ff4d4f;
  font-weight: 500;
}

.qr-footer {
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
}

.save-btn {
  width: 100%;
  background-color: #1677ff;
}
</style>