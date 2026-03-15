<template>
  <div class="merchant-join-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>商家入驻申请</h1>
      <p class="page-desc">填写以下信息完成入驻申请，我们将尽快审核</p>
    </div>

    <!-- 步骤指示器 -->
    <div class="step-indicator">
      <div class="step-item" :class="{ active: currentStep === 1, completed: currentStep > 1 }">
        <div class="step-number">1</div>
        <div class="step-text">基本信息</div>
      </div>
      <div class="step-line" :class="{ completed: currentStep > 1 }"></div>
      <div class="step-item" :class="{ active: currentStep === 2, completed: currentStep > 2 }">
        <div class="step-number">2</div>
        <div class="step-text">店铺信息</div>
      </div>
      <div class="step-line" :class="{ completed: currentStep > 2 }"></div>
      <div class="step-item" :class="{ active: currentStep === 3, completed: currentStep > 3 }">
        <div class="step-number">3</div>
        <div class="step-text">资质认证</div>
      </div>
    </div>

    <!-- 表单内容区域 -->
    <div class="form-container">
      <!-- 步骤1：基本信息 -->
      <el-form 
        v-if="currentStep === 1" 
        ref="basicForm" 
        :model="basicInfo" 
        :rules="basicRules"
        label-width="120px"
      >
        <el-form-item label="联系人姓名" prop="contactName">
          <el-input v-model="basicInfo.contactName" placeholder="请输入联系人姓名"></el-input>
        </el-form-item>
        
        <el-form-item label="联系电话" prop="contactPhone">
          <el-input v-model="basicInfo.contactPhone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        
        <el-form-item label="电子邮箱" prop="contactEmail">
          <el-input v-model="basicInfo.contactEmail" type="email" placeholder="请输入电子邮箱"></el-input>
        </el-form-item>
        <!-- <el-form-item label="所在城市" prop="city">
          <el-select v-model="basicInfo.city" placeholder="请选择城市">
            <el-option label="北京" value="北京"></el-option>
            <el-option label="上海" value="上海"></el-option>
            <el-option label="广州" value="广州"></el-option>
            <el-option label="深圳" value="深圳"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-form-item> -->
        <div class="form-actions">
          <el-button type="primary" @click="nextStep">下一步</el-button>
        </div>
      </el-form>

      <!-- 步骤2：店铺信息 -->
      <el-form 
        v-if="currentStep === 2" 
        ref="shopForm" 
        :model="shopInfo" 
        :rules="shopRules"
        label-width="120px"
      >
        <el-form-item label="店铺名称" prop="shopName">
          <el-input v-model="shopInfo.shopName" placeholder="请输入店铺名称"></el-input>
        </el-form-item>
        
        <el-form-item label="店铺类别" prop="category">
          <el-select v-model="shopInfo.category" placeholder="请选择店铺类别">
            <el-option label="中餐" value="中餐"></el-option>
            <el-option label="西餐" value="西餐"></el-option>
            <el-option label="快餐" value="快餐"></el-option>
            <el-option label="火锅" value="火锅"></el-option>
            <el-option label="烧烤" value="烧烤"></el-option>
            <el-option label="饮品" value="饮品"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="店铺地址" prop="address">
          <el-input v-model="shopInfo.address" placeholder="请输入详细地址"></el-input>
        </el-form-item>
        
        <el-form-item label="营业时间" prop="businessHours">
          <el-input v-model="shopInfo.businessHours" placeholder="例如：10:00-22:00"></el-input>
        </el-form-item>
        
        <el-form-item label="店铺简介" prop="description">
          <el-input 
            v-model="shopInfo.description" 
            type="textarea" 
            rows="4" 
            placeholder="请简要描述店铺特色"
          ></el-input>
        </el-form-item>
        
        <div class="form-actions">
          <el-button @click="prevStep">上一步</el-button>
          <el-button type="primary" @click="nextStep">下一步</el-button>
        </div>
      </el-form>

      <!-- 步骤3：资质认证 -->
      <el-form 
        v-if="currentStep === 3" 
        ref="qualificationForm" 
        :model="qualification" 
        :rules="qualificationRules"
        label-width="120px"
      >
        <el-form-item label="身份证正面" prop="idCardFront">
          <el-upload
            action=""
            :show-file-list="false"
            :before-upload="beforeIdCardFrontUpload"
            accept="image/*"
          >
            <div class="upload-wrapper">
              <img :src="qualification.idCardFront" class="upload-img" v-if="qualification.idCardFront" />
              <div class="upload-placeholder" v-else>点击上传身份证正面照片</div>
            </div>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="身份证反面" prop="idCardBack">
          <el-upload
            action=""
            :show-file-list="false"
            :before-upload="beforeIdCardBackUpload"
            accept="image/*"
          >
            <div class="upload-wrapper">
              <img :src="qualification.idCardBack" class="upload-img" v-if="qualification.idCardBack" />
              <div class="upload-placeholder" v-else>点击上传身份证反面照片</div>
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
              <div class="upload-placeholder" v-else>点击上传营业执照照片</div>
            </div>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="店铺照片" prop="shopPhotos">
          <el-upload
            action=""
            :show-file-list="true"
            :on-change="handleShopPhotoChange"
            multiple
            accept="image/*"
          >
            <el-button type="primary">上传店铺照片</el-button>
          </el-upload>
          <p class="help-text">最多上传5张，展示店铺环境和特色</p>
        </el-form-item>
        
        <div class="form-actions">
          <el-button @click="prevStep">上一步</el-button>
          <el-button type="primary" :loading="submitting" @click="submitApplication">提交申请</el-button>
        </div>
      </el-form>
    </div>

    <!-- 提交成功弹窗 -->
    <el-dialog v-model="showSuccess" title="申请提交成功" :close-on-click-modal="false">
      <div class="success-content">
        <i class="el-icon-success success-icon"></i>
        <p>您的商家入驻申请已提交成功</p>
        <p>我们将在3个工作日内进行审核，请耐心等待</p>
        <p>审核结果将通过短信通知您</p>
      </div>
      <template #footer>
        <el-button type="primary" @click="gotoHome">返回首页</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

// 路由实例
const router = useRouter();

// 步骤控制
const currentStep = ref(1);
const submitting = ref(false);
const showSuccess = ref(false);

// 表单引用
const basicForm = ref();
const shopForm = ref();
const qualificationForm = ref();

// 表单数据
const basicInfo = reactive({
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  city: ''
});

const shopInfo = reactive({
  shopName: '',
  category: '',
  address: '',
  businessHours: '',
  description: ''
});

const qualification = reactive({
  idCardFront: '',
  idCardBack: '',
  businessLicense: '',
  shopPhotos: []
});

// 表单验证规则
const basicRules = reactive({
  contactName: [
    { required: true, message: '请输入联系人姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度在2-10个字符之间', trigger: 'blur' }
  ],
  contactPhone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  contactEmail: [
    { required: true, message: '请输入电子邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  city: [
    { required: true, message: '请选择所在城市', trigger: 'change' }
  ]
});

const shopRules = reactive({
  shopName: [
    { required: true, message: '请输入店铺名称', trigger: 'blur' },
    { min: 2, max: 30, message: '店铺名称长度在2-30个字符之间', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择店铺类别', trigger: 'change' }
  ],
  address: [
    { required: true, message: '请输入店铺地址', trigger: 'blur' },
    { min: 5, message: '地址请填写详细一些', trigger: 'blur' }
  ],
  businessHours: [
    { required: true, message: '请输入营业时间', trigger: 'blur' }
  ]
});

const qualificationRules = reactive({
  idCardFront: [
    { required: true, message: '请上传身份证正面照片', trigger: 'change' }
  ],
  idCardBack: [
    { required: true, message: '请上传身份证反面照片', trigger: 'change' }
  ],
  businessLicense: [
    { required: true, message: '请上传营业执照照片', trigger: 'change' }
  ],
  shopPhotos: [
    { required: true, message: '请至少上传1张店铺照片', trigger: 'change' },
    { validator: (rule, value, callback) => {
      if (value.length > 5) {
        callback(new Error('最多上传5张照片'));
      } else {
        callback();
      }
    }, trigger: 'change' }
  ]
});

// 步骤切换
const nextStep = async () => {
  if (currentStep.value === 1) {
    const valid = await basicForm.value.validate();
    if (valid) currentStep.value = 2;
  } else if (currentStep.value === 2) {
    const valid = await shopForm.value.validate();
    if (valid) currentStep.value = 3;
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

// 图片上传处理
const beforeIdCardFrontUpload = (file) => {
  return handleImageUpload(file, (url) => {
    qualification.idCardFront = url;
  });
};

const beforeIdCardBackUpload = (file) => {
  return handleImageUpload(file, (url) => {
    qualification.idCardBack = url;
  });
};

const beforeLicenseUpload = (file) => {
  return handleImageUpload(file, (url) => {
    qualification.businessLicense = url;
  });
};

const handleShopPhotoChange = (file) => {
  if (file.status === 'ready') {
    const reader = new FileReader();
    reader.onload = (e) => {
      qualification.shopPhotos.push(e.target.result);
    };
    reader.readAsDataURL(file.raw);
  }
};

// 图片上传通用处理
const handleImageUpload = (file, callback) => {
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
    callback(e.target.result);
  };
  reader.readAsDataURL(file);
  return false;
};

// 提交申请
const submitApplication = async () => {
  const valid = await qualificationForm.value.validate();
  if (!valid) return;

  submitting.value = true;
  try {
    // 组装提交数据
    const formData = {
      basicInfo,
      shopInfo,
      qualification
    };

    // 这里可以调用API提交数据
    console.log('提交入驻申请:', formData);
    
    // 模拟API请求延迟
    setTimeout(() => {
      showSuccess.value = true;
      submitting.value = false;
    }, 1000);
  } catch (error) {
    ElMessage.error('提交失败，请稍后重试');
    submitting.value = false;
  }
};

// 返回首页
const gotoHome = () => {
  router.push('/');
};
</script>

<style scoped>
.merchant-join-container {
  max-width: 800px;
  margin: 50px auto;
  padding: 0 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 28px;
  color: #333;
  margin-bottom: 10px;
}

.page-desc {
  color: #666;
  font-size: 14px;
}

/* 步骤指示器 */
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 50px;
  position: relative;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
  width: 33.333%;
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

.step-item.active .step-number {
  background-color: #ff5722;
}

.step-item.active .step-text {
  color: #ff5722;
  font-weight: 500;
}

.step-item.completed .step-number {
  background-color: #52c41a;
}

.step-line.completed {
  background-color: #52c41a;
}

/* 表单样式 */
.form-container {
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.form-actions {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 上传区域样式 */
.upload-wrapper {
  width: 200px;
  height: 150px;
  border: 1px dashed #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.upload-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-placeholder {
  color: #999;
  font-size: 14px;
  text-align: center;
  padding: 0 10px;
}

.help-text {
  margin-top: 8px;
  color: #999;
  font-size: 12px;
}

/* 成功弹窗 */
.success-content {
  text-align: center;
  padding: 20px 0;
}

.success-icon {
  font-size: 48px;
  color: #52c41a;
  margin-bottom: 20px;
}
</style>