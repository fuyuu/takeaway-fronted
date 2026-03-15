<template>
  <div class="merchant-application-container">
    <!-- 侧边栏 -->
    <aside class="sidebar">
      <h2 class="sidebar-title">商家入驻</h2>
      <ul class="menu-list">
        <li class="menu-item" :class="{ active: currentStep === 1 }" @click="goToStep(1)">
          <span>基本信息</span>
        </li>
        <li class="menu-item" :class="{ active: currentStep === 2 }" @click="goToStep(2)" v-if="stepValid[1]">
          <span>资质认证</span>
        </li>
        <li class="menu-item" :class="{ active: currentStep === 3 }" @click="goToStep(3)" v-if="stepValid[2]">
          <span>店铺信息</span>
        </li>
      </ul>
    </aside>

    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 步骤指示器 -->
      <div class="step-indicator">
        <div class="step-item" :class="{ completed: currentStep > 1 }">
          <div class="step-number">1</div>
          <div class="step-text">基本信息</div>
        </div>
        <div class="step-line" :class="{ completed: currentStep > 1 }"></div>
        <div class="step-item" :class="{ completed: currentStep > 2 }">
          <div class="step-number">2</div>
          <div class="step-text">资质认证</div>
        </div>
        <div class="step-line" :class="{ completed: currentStep > 2 }"></div>
        <div class="step-item">
          <div class="step-number">3</div>
          <div class="step-text">店铺信息</div>
        </div>
      </div>

      <!-- 步骤1：基本信息 -->
      <section class="form-section" v-if="currentStep === 1">
        <h3 class="section-title">商家基本信息</h3>
        <el-form :model="baseInfo" :rules="baseInfoRules" ref="baseFormRef">
          <el-form-item label="联系人姓名" prop="contactName">
            <el-input v-model="baseInfo.contactName" placeholder="请输入联系人姓名"></el-input>
          </el-form-item>
          
          <el-form-item label="联系电话" prop="contactPhone">
            <el-input v-model="baseInfo.contactPhone" placeholder="请输入手机号码"></el-input>
          </el-form-item>
          
          <el-form-item label="电子邮箱" prop="contactEmail">
            <el-input v-model="baseInfo.contactEmail" placeholder="请输入邮箱地址"></el-input>
          </el-form-item>
          
          <el-form-item label="所在地区">
            <MapContain @addressChanged="saveLocation"></MapContain>
          </el-form-item>
          
          <div class="form-actions">
            <el-button type="primary" @click="nextStep">下一步</el-button>
          </div>
        </el-form>
      </section>

      <!-- 步骤2：资质认证 -->
      <section class="form-section" v-if="currentStep === 2">
        <h3 class="section-title">资质认证</h3>
        <el-form :model="qualification" :rules="qualificationRules" ref="qualificationFormRef">
          <el-form-item label="身份证正面" prop="idCardFront">
            <el-upload
              action=""
              :show-file-list="false"
              :before-upload="beforeIdCardUpload"
              accept="image/*"
            >
              <div class="upload-wrapper">
                <img :src="qualification.idCardFront" class="upload-img" v-if="qualification.idCardFront" />
                <div class="upload-placeholder" v-else>点击上传身份证正面</div>
              </div>
            </el-upload>
          </el-form-item>
          
          <el-form-item label="身份证反面" prop="idCardBack">
            <el-upload
              action=""
              :show-file-list="false"
              :before-upload="beforeIdCardUpload"
              accept="image/*"
            >
              <div class="upload-wrapper">
                <img :src="qualification.idCardBack" class="upload-img" v-if="qualification.idCardBack" />
                <div class="upload-placeholder" v-else>点击上传身份证反面</div>
              </div>
            </el-upload>
          </el-form-item>
          
          <el-form-item label="营业执照" prop="businessLicense">
            <el-upload
              action=""
              :show-file-list="false"
              :before-upload="beforeLicenseUpload"
              accept="image/*"
            >
              <div class="upload-wrapper">
                <img :src="qualification.businessLicense" class="upload-img" v-if="qualification.businessLicense" />
                <div class="upload-placeholder" v-else>点击上传营业执照</div>
              </div>
            </el-upload>
          </el-form-item>
          
          <div class="form-actions">
            <el-button @click="prevStep">上一步</el-button>
            <el-button type="primary" @click="nextStep">下一步</el-button>
          </div>
        </el-form>
      </section>

      <!-- 步骤3：店铺信息 -->
      <section class="form-section" v-if="currentStep === 3">
        <h3 class="section-title">店铺信息</h3>
        <el-form :model="shopInfo" :rules="shopInfoRules" ref="shopFormRef">
          <el-form-item label="店铺名称" prop="shopName">
            <el-input v-model="shopInfo.shopName" placeholder="请输入店铺名称"></el-input>
          </el-form-item>
          
          <el-form-item label="店铺分类" prop="category">
            <el-select v-model="shopInfo.category" placeholder="请选择店铺分类">
              <el-option label="餐饮美食" value="food"></el-option>
              <el-option label="超市便利" value="market"></el-option>
              <el-option label="生鲜果蔬" value="fresh"></el-option>
              <el-option label="甜点饮品" value="dessert"></el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="店铺简介" prop="description">
            <el-input
              v-model="shopInfo.description"
              type="textarea"
              rows="4"
              placeholder="请简要描述店铺信息"
            ></el-input>
          </el-form-item>
          
          <el-form-item label="店铺logo" prop="logo">
            <el-upload
              action=""
              :show-file-list="false"
              :before-upload="beforeLogoUpload"
              accept="image/*"
            >
              <div class="logo-wrapper">
                <img :src="shopInfo.logo" class="logo-img" v-if="shopInfo.logo" />
                <div class="logo-placeholder" v-else>点击上传店铺logo</div>
              </div>
            </el-upload>
          </el-form-item>
          
          <div class="form-actions">
            <el-button @click="prevStep">上一步</el-button>
            <el-button type="primary" :loading="submitting" @click="submitApplication">提交申请</el-button>
          </div>
        </el-form>
      </section>

      <!-- 提交成功弹窗 -->
      <el-dialog v-model="showSuccess" title="申请提交成功" :close-on-click-modal="false">
        <div class="success-content">
          <i class="el-icon-success success-icon"></i>
          <p>您的商家入驻申请已提交成功</p>
          <p>我们将在3个工作日内进行审核，请耐心等待</p>
        </div>
        <template #footer>
          <el-button type="primary" @click="gotoDashboard">前往商家中心</el-button>
        </template>
      </el-dialog>
    </main>
  </div>
</template>

<script lang="js" setup>
import { reactive, ref, watch } from 'vue';
import { ElMessage, ElForm, ElFormItem } from 'element-plus';
import { useRouter } from 'vue-router';
import MapContain from './map/MapContain3.vue';
// import { submitMerchantApplication } from '../api/merchant';

// 路由实例
const router = useRouter();

// 步骤控制
const currentStep = ref(1);
const stepValid = ref({ 1: false, 2: false });
const submitting = ref(false);
const showSuccess = ref(false);

// 表单引用
const baseFormRef = ref();
const qualificationFormRef = ref();
const shopFormRef = ref();

// 表单数据
const baseInfo = reactive({
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  location: ''
});

const qualification = reactive({
  idCardFront: '',
  idCardBack: '',
  businessLicense: ''
});

const shopInfo = reactive({
  shopName: '',
  category: '',
  description: '',
  logo: ''
});

// 表单验证规则
const baseInfoRules = reactive({
  contactName: [
    { required: true, message: '请输入联系人姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度在2-10个字符之间', trigger: 'blur' }
  ],
  contactPhone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  contactEmail: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
});

const qualificationRules = reactive({
  idCardFront: [
    { required: true, message: '请上传身份证正面', trigger: 'change' }
  ],
  idCardBack: [
    { required: true, message: '请上传身份证反面', trigger: 'change' }
  ],
  businessLicense: [
    { required: true, message: '请上传营业执照', trigger: 'change' }
  ]
});

const shopInfoRules = reactive({
  shopName: [
    { required: true, message: '请输入店铺名称', trigger: 'blur' },
    { min: 2, max: 30, message: '店铺名称长度在2-30个字符之间', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择店铺分类', trigger: 'change' }
  ],
  logo: [
    { required: true, message: '请上传店铺logo', trigger: 'change' }
  ]
});

// 步骤切换
const goToStep = (step) => {
  if (step < currentStep.value || (step > currentStep.value && stepValid.value[step - 1])) {
    currentStep.value = step;
  }
};

const nextStep = async () => {
  if (currentStep.value === 1) {
    const valid = await baseFormRef.value.validate();
    if (valid) {
      stepValid.value[1] = true;
      currentStep.value = 2;
    }
  } else if (currentStep.value === 2) {
    const valid = await qualificationFormRef.value.validate();
    if (valid) {
      stepValid.value[2] = true;
      currentStep.value = 3;
    }
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

// 地址选择
const saveLocation = (addr) => {
  baseInfo.location = addr;
};

// 图片上传处理
const beforeIdCardUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isJPG) {
    ElMessage.error('仅支持JPG/PNG格式');
    return false;
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过2MB');
    return false;
  }

  // 显示预览
  const reader = new FileReader();
  reader.onload = (e) => {
    if (currentStep.value === 2) {
      if (!qualification.idCardFront) {
        qualification.idCardFront = e.target.result;
      } else if (!qualification.idCardBack) {
        qualification.idCardBack = e.target.result;
      }
    }
  };
  reader.readAsDataURL(file);
  return false;
};

const beforeLicenseUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
  const isLt5M = file.size / 1024 / 1024 < 5;

  if (!isJPG) {
    ElMessage.error('仅支持JPG/PNG格式');
    return false;
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过5MB');
    return false;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    qualification.businessLicense = e.target.result;
  };
  reader.readAsDataURL(file);
  return false;
};

const beforeLogoUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isJPG) {
    ElMessage.error('仅支持JPG/PNG格式');
    return false;
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过2MB');
    return false;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    shopInfo.logo = e.target.result;
  };
  reader.readAsDataURL(file);
  return false;
};

// 提交申请
const submitApplication = async () => {
  const valid = await shopFormRef.value.validate();
  if (!valid) return;

  submitting.value = true;
  try {
    // 组装提交数据
    const formData = new FormData();
    formData.append('baseInfo', JSON.stringify(baseInfo));
    formData.append('qualification', JSON.stringify(qualification));
    formData.append('shopInfo', JSON.stringify(shopInfo));

    // const res = await submitMerchantApplication(formData);
    if (res.data.code === 200) {
      showSuccess.value = true;
    } else {
      ElMessage.error(res.data.msg || '提交失败，请重试');
    }
  } catch (error) {
    ElMessage.error('网络错误，请稍后重试');
  } finally {
    submitting.value = false;
  }
};

// 前往商家中心
const gotoDashboard = () => {
  router.push('/merchant/dashboard');
};
</script>

<style scoped>
.merchant-application-container {
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 侧边栏样式 */
.sidebar {
  width: 220px;
  background-color: #fff;
  border-right: 1px solid #e4e4e4;
  padding: 20px 0;
  margin: 30px 40px 30px 0;
}

.sidebar-title {
  color: #ff5722;
  padding: 0 20px 20px;
  border-bottom: 1px solid #e4e4e4;
  margin-bottom: 20px;
}

.menu-list {
  list-style: none;
  padding: 0;
}

.menu-item {
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.menu-item:hover {
  background-color: #f5f5f5;
}

.menu-item.active {
  color: #ff5722;
  background-color: #fff3e0;
  border-left: 3px solid #ff5722;
}

/* 主内容区 */
.main-content {
  flex: 1;
  padding: 30px;
  background-color: #fff;
  margin: 30px 40px 30px 0;
  border-radius: 8px;
}

/* 步骤指示器 */
.step-indicator {
  display: flex;
  align-items: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e4e4e4;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
}

.step-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #e4e4e4;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.step-text {
  font-size: 14px;
  color: #999;
}

.step-line {
  flex: 1;
  height: 2px;
  background-color: #e4e4e4;
  margin: 0 10px;
}

.step-item.completed .step-number {
  background-color: #67c23a;
}

.step-item.completed .step-text {
  color: #67c23a;
}

.step-line.completed {
  background-color: #67c23a;
}

/* 表单样式 */
.form-section {
  max-width: 800px;
}

.section-title {
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e4e4e4;
}

.el-form {
  margin-top: 20px;
}

.el-form-item {
  margin-bottom: 25px;
}

/* 上传区域样式 */
.upload-wrapper, .logo-wrapper {
  width: 100%;
  height: 180px;
  border: 1px dashed #ccc;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-wrapper:hover, .logo-wrapper:hover {
  border-color: #ff5722;
}

.upload-placeholder, .logo-placeholder {
  color: #999;
  text-align: center;
}

.upload-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.logo-wrapper {
  width: 200px;
  height: 200px;
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* 按钮区域 */
.form-actions {
  margin-top: 40px;
  display: flex;
  gap: 15px;
  justify-content: flex-end;
}

/* 成功弹窗 */
.success-content {
  text-align: center;
  padding: 20px 0;
}

.success-icon {
  font-size: 48px;
  color: #67c23a;
  margin-bottom: 20px;
}
</style>