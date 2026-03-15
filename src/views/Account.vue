<template>
  <div class="account-management-container">
    <!-- 侧边栏 -->
    <aside class="sidebar">
      <h2 class="sidebar-title">账号管理</h2>
      <ul class="menu-list">
        <li class="menu-item" :class="{ active: currentTab === 1 }" @click="currentTab = 1">
          <span>个人资料</span>
        </li>
        <li class="menu-item" :class="{ active: currentTab === 2 }" @click="currentTab = 2">
          <span>安全设置</span>
        </li>
        <li class="menu-item" :class="{ active: currentTab === 3 }" @click="currentTab = 3">
          <span>收货地址</span>
        </li>
      </ul>
    </aside>
    <!-- 主内容区 - 根据currentTab显示不同内容 -->
    <main class="main-content">
      <!-- 个人资料 (默认显示) -->
      <section class="info-section" v-if="currentTab === 1">
        <div class="avatar-section">
          <!-- 头像区域 -->
          <div class="avatar-section">
            <el-upload action="" :show-file-list="false" :before-upload="beforeAvatarUpload" accept="image/*">
              <div class="avatar-wrapper">
                <img v-bind:src="avatarUrl" class="avatar" />
                <!-- <img v-bind:src="userInfo.avatar" class="avatar"/> -->
                <div class="avatar-mask">点击更换头像</div>
              </div>
            </el-upload>

            <div class="nickname-section">
              <h3 class="nickname">{{ userInfo.nickname }}</h3>
            </div>
          </div>

          <!-- 预览弹窗 -->
          <el-dialog v-model="showPreview" title="头像预览" width="400px" :close-on-click-modal="false">
            <div class="preview-box">
              <img :src="previewUrl" />
            </div>
            <template #footer>
              <el-button @click="showPreview = false">取消</el-button>
              <el-button type="primary" :loading="uploading" @click="doUpload">保存</el-button>
            </template>
          </el-dialog>
        </div>

        <h3 class="section-title">基本信息</h3>
        <!-- 账号名 -->
        <div class="info-item">
          <span class="info-label">账号名：</span>
          <input class="info-input" v-model="userInfo.username" placeholder="请输入账号名" />
        </div>
        <!-- 登录邮箱 -->
        <div class="info-item">
          <span class="info-label">登录邮箱：</span>
          <input class="info-input" v-model="userInfo.email" placeholder="请输入邮箱" />
        </div>
        <!-- 昵称 -->
        <div class="info-item">
          <span class="info-label">昵称：</span>
          <input class="info-input" v-model="userInfo.nickname" placeholder="请输入昵称" />
        </div>
        <!-- 简介 -->
        <div class="info-item">
          <span class="info-label">简介：</span>
          <input class="info-input-info" v-model="userInfo.info" placeholder="介绍一下自己吧" />
        </div>
        <!-- 更新 个人信息 按钮 -->
        <div class="info-actions">
          <button class="save-btn" @click="saveProfile">更新个人信息</button>
        </div>
      </section>

      <section class="password-reset-card" v-if="currentTab === 2">
        <div class="password-reset-card" v-if="currentTab === 2">
          <h3 class="card-title">修改密码</h3>
          <p class="card-desc">请设置包含字母和数字的密码，长度至少8位</p>

          <form class="password-form" @submit.prevent="handleSubmit">
            <!-- 账号名 -->
            <div class="form-group">
              <label for="username" class="form-label">账号名：</label>
              <input type="text" id="username" v-model="userInfo.username" class="form-input" placeholder="请输入账号名" />
            </div>
            <!-- 登录邮箱 -->
            <div class="form-group">
              <label for="loginEmail" class="form-label">登录邮箱：</label>
              <input type="email" id="loginEmail" v-model="userInfo.email" class="form-input" placeholder="请输入邮箱" />
            </div>

            <div class="form-group">
              <label for="oldPassword" class="form-label">当前密码</label>
              <input type="password" id="oldPassword" v-model="form.oldPassword" class="form-input" placeholder="请输入当前密码"
                required>
            </div>

            <div class="form-group">
              <label for="newPassword" class="form-label">新密码</label>
              <input type="password" id="newPassword" v-model="form.password" class="form-input" placeholder="请输入新密码"
                required>
              <p class="password-tip" :class="{ valid: isPasswordValid }">
                <i :class="isPasswordValid ? 'icon-valid' : 'icon-invalid'"></i>
                {{ isPasswordValid ? '密码强度良好' : '建议包含字母、数字和特殊字符' }}
              </p>
            </div>

            <div class="form-group">
              <label for="confirmPassword" class="form-label">确认新密码</label>
              <input type="password" id="confirmPassword" v-model="form.passwordConfirm" class="form-input"
                placeholder="请再次输入新密码" required>
              <p class="password-tip" v-if="confirmPassword" :class="{ valid: isPasswordMatch }">
                <i :class="isPasswordMatch ? 'icon-valid' : 'icon-invalid'"></i>
                {{ isPasswordMatch ? '两次输入一致' : '两次输入的密码不一致' }}
              </p>
            </div>

            <div class="form-actions">
              <button type="button" class="btn cancel-btn" @click="handleCancel">取消</button>
              <button type="submit" class="btn submit-btn" @click="doModify">确认修改</button>
            </div>
          </form>
        </div>
      </section>
      <!-- 收货地址 -->
      <section v-if="currentTab === 3" class="address-section">
        <div class="address-header">
          <h3 class="section-title">我的收货地址</h3>
          <el-button plain @click="showAddAddress = true" class="add-address-btn">
            + 添加新地址
          </el-button>
          <!-- 新增地址弹窗 -->
          <el-dialog v-model="showAddAddress" title="新增收货地址" size="600px">
            <el-form :model="addressForm" label-width="80px">
              <el-form-item label="收货人">
                <el-input v-model="addressForm.name" placeholder="请输入姓名" />
              </el-form-item>

              <el-form-item label="邮箱">
                <el-input v-model="addressForm.email" placeholder="邮箱" maxlength="40" />
              </el-form-item>

              <el-form-item label="所在地区">
                <MapContain :key="mapKey" @addressChanged="saveLocation" />
              </el-form-item>

              <el-form-item label="详细地址">
                <el-input v-model="addressForm.location" type="textarea" rows="3" placeholder="街道、门牌号" />
              </el-form-item>

              <el-form-item label="默认">
                <el-switch v-model="addressForm.isDefault" :active-value="1" :inactive-value="0" />
              </el-form-item>
            </el-form>

            <template #footer>
              <el-button @click="showAddAddress = false">取消</el-button>
              <el-button type="primary" :loading="submitting" @click="handleAddAddress">保存</el-button>
            </template>
          </el-dialog>
          <el-dialog v-model="showEditAddress" title="新增收货地址" size="600px">
            <el-form :model="editForm" label-width="80px">
              <el-form-item label="收货人">
                <el-input v-model="editForm.name" placeholder="请输入姓名" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="editForm.email" placeholder="邮箱" maxlength="40" />
              </el-form-item>
              <el-form-item label="所在地区">
                <MapContain :key="mapKey" @addressChanged="saveLocation" />
              </el-form-item>
              <el-form-item label="详细地址">
                <el-input v-model="editForm.location" type="textarea" rows="3" placeholder="街道、门牌号" />
              </el-form-item>
              <el-form-item label="默认">
                <el-switch v-model="editForm.isDefault" :active-value="1" :inactive-value="0" />
              </el-form-item>
            </el-form>
            <template #footer>
              <el-button @click="showEditAddress = false">取消</el-button>
              <el-button type="primary" :loading="EditStatus" @click="confirmEdit">保存</el-button>
            </template>
          </el-dialog>
        </div>

        <!-- 地址列表 -->
        <div class="address-list">
          <div class="address-card" v-for="(addr, index) in addressList" :key="index">
            <div class="address-info">
              <div class="address-name-phone">
                <span class="address-name">{{ addr.name }}</span>
                <span class="address-phone">{{ addr.email }}</span>
              </div>
              <div class="address-detail">{{ addr.location }}</div>
              <div class="address-tag" v-if="addr.isDefault">默认地址</div>
            </div>
            <div class="address-actions">
              <div class="button-example">
                <div class="button-row">
                  <el-button type="primary" @click="openEdit(addr)">编辑</el-button>
                  <el-button type="primary" @click="removeAddress(addr)">删除</el-button>
                  <el-button type="primary" @click="setDefault(addr)">默认</el-button>
                </div>
              </div>
            </div>
          </div>
          <!-- 空状态 -->
          <div class="address-empty" v-if="addressList.length === 0">
            暂无收货地址，请添加新地址
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script lang="js" setup>
import { reactive, ref, watch, onMounted } from 'vue';
import { updateAddress, getAddressList, addAddress, deleteAddress, setTopAddress } from '../api/address';
import { updateUserInfo, getUserInfo, updateAvatar } from '../api/user';
import { ElMessage } from 'element-plus';
import MapContain from './map/MapContain.vue';
import { updatePassword } from '../api/user';
import { useRouter } from 'vue-router';
const router = useRouter();
async function loadAddressList() {
  try {
    const res = await getAddressList(); // 返回 [{...}, {...}]
    console.log("resList", res);
    if (res.data.code === 200) {
      addressList.splice(0, addressList.length, ...res.data.data); // 正确更新 reactive 数组
    } else {
      ElMessage.error(res.data.msg || '获取地址列表失败');
    }
  } catch (e) {
    ElMessage.error('获取地址列表异常');
  }
}
const userInfo = reactive({
  id: '',
  username: '',
  email: '',
  avatar: '',
  nickname: '',
  info: ''
});
const avatarUrl = ref(userInfo.avatar || '../assets/image.png')
watch(avatarUrl, (newValue, oldValue) => {
  console.log('avatarUrl--变化了-新值', newValue.value, "原来的值", oldValue);
});
//测试传输的userInfo信息
onMounted(async () => {
  try {
    const res = await getUserInfo();
    console.log("getUserInfo", res);
    if (res.data.code === 200) {
      ElMessage.success('获取用户信息成功：');
      console.log("获取用户信息成功：", res.data.data);

      Object.assign(userInfo, res.data.data)
    }
  } catch (err) {
    ElMessage.error('获取用户信息失败');
  }
  avatarUrl.value = userInfo.avatar;
  await loadAddressList();
})
// 弹窗开关 & 预览 
async function saveProfile() {
  try{
    const res = await updateUserInfo(userInfo);
    console.log("updateUserInfo=" + res);
    console.log(res);
    if (res.data.code === 200) {
      ElMessage.success('用户信息更新成功');
    }else{
      ElMessage.error('用户信息更新失败');
    }
  }catch (err) {
    ElMessage.error('用户信息更新失败');
  }
}
const showEditAddress = ref(false);   // 添加   地址弹窗
const showAddAddress = ref(false);  // 修改   地址弹窗
const mapKey = ref(0);              // 地图
const mapEdotKey = ref(10000000);  //  修改   地址地图
watch(showAddAddress, (newValue, oldValue) => {
  if (newValue) mapKey.value++;
  console.log('showAddAddress--变化了-新值', newValue, mapKey.value, "原来的值", oldValue, mapKey.value);
});
watch(showEditAddress, (newValue, oldValue) => {
  if (newValue) mapEdotKey.value--;
  console.log('showEditAddress--变化了-新值', newValue, mapEdotKey.value, "原来的值", oldValue, mapEdotKey.value);
});

const submitting = ref(false);        // 新增地址表单的 按钮 提交 状态
const EditStatus = ref(false);
watch(submitting, (newValue, oldValue) => {
  console.log('submitting变化了-新值', newValue, "原来的值", oldValue)
});
watch(EditStatus, (newValue, oldValue) => {
  console.log('EditStatus变化了-新值', newValue, "原来的值", oldValue)
});
// 控制当前显示的标签页，1-个人资料，2-安全设置，3-收货地址，默认1
const currentTab = ref(1);
watch(currentTab, (newValue, oldValue) => {
  console.log('currentTab变化了-新值', newValue, "原来的值", oldValue, "1-个人资料，2-安全设置，3-收货地址，默认1")
});
// 其他逻辑（如地址管理等）
const addressList = reactive([]); // 示例：地址数据列表
const showPreview = ref(false)  // 示例：是否显示预览图片
const previewUrl = ref('')      // 示例：预览图片的URL
const selectedFile = ref(null)  // 示例：选择的文件对象
function beforeAvatarUpload(file) {
  const isImg = file.type.startsWith('image/') && file.size / 1024 / 1024 < 2
  if (!isImg) {
    ElMessage.error('仅支持 <2MB 图片')
    return false
  }
  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
  showPreview.value = true
  return false   // 关键：阻止 el-upload 自动上传
}
const uploading = ref(false)
async function doUpload() {
  uploading.value = true
  const fd = new FormData()
  fd.append('avatar', selectedFile.value)
  console.log("selectedFile.value", selectedFile.value);

  const res = await updateAvatar(fd)           // 你已有的接口
  console.log('上传结果:', res);

  avatarUrl.value = previewUrl.value
  ElMessage.success('头像已更新')
  showPreview.value = false
  uploading.value = false
}
const form = reactive({
  username: '',
  oldPassword: '',
  password: '',
  email: '',
  passwordConfirm: ''
})
function handleCancel() {
  // 1. 清空密码相关字段
  Object.assign(form, {
    oldPassword: '',
    password: '',
    confirmPassword: ''
  })
  // 2. 切回默认页（个人资料），保持用户仍在账号管理内
  currentTab.value = 2
}
const doModify = async () => {
  console.log('Sending verification code to:', form)
  try {
    let result = await updatePassword(form);
    if (result.data.code === 200) {
      ElMessage.success('密码重置成功-即将跳转到登录页')
      router.push('/login')
    } else {
      ElMessage.error('密码重置失败,可能是验证码错误或者中途修改邮箱+' + result.data.msg);
    }
  } catch (error) {
    console.log("密码重置失败" + error)
  }
}
const addressForm = reactive({
  name: '',
  email: '',
  location: '',
  isDefault: 0,
  userId: ''
});
const editForm = reactive({
  name: '',
  email: '',
  location: '',
  isDefault: 0,
  userId: ''
});
/* ===== 1. 添加地址 ===== */
const handleAddAddress = async () => {
  console.log('表单内容:', addressForm.name, addressForm.email, addressForm.location, addressForm.isDefault);
  if (!addressForm.name.trim() || !addressForm.email.trim() || !addressForm.location.trim()) {
    ElMessage.error('请填写完整信息');
    return;
  }
  addressForm.userId = userInfo.id;
  //已经点击了添加地址
  submitting.value = true;
  try {
    console.log("addressForm", addressForm);

    const res = await addAddress(addressForm)
    console.log("res", res);

    if (res.data.code === 200) {
      ElMessage.success('地址添加成功');
      await loadAddressList();
    }
  } catch (err) {
    ElMessage.success('地址添加失败');
    ElMessage.error(err.msg);
  } finally {
    // 添加地址 复原吧
    submitting.value = false;
    // 关闭新增地址表单
    showAddAddress.value = false;
    await resetAddressForm();
  }
}
function resetAddressForm() {
  Object.assign(addressForm, {
    name: '',
    email: '',
    location: '',
    isDefault: false
  });
}
/* ===== 2. 编辑 ===== */
function openEdit(addr) {
  showEditAddress.value = true;
  console.log("addr=", addr);
  Object.assign(editForm, addr)   // 深拷贝
}
async function confirmEdit() {
  EditStatus.value = true;
  try {
    const res = await updateAddress(editForm) // 你的更新接口
    if (res.data.code === 200) {
      ElMessage.success('修改成功')
      showEditAddress.value = false
      await loadAddressList()            // 重新拉列表
    } else {
      ElMessage.error('修改失败')
    }
  } finally {
    EditStatus.value = false
  }
}
/* ===== 3. 删除（软删）===== */
async function removeAddress(addr) {
  console.log("删除（软删）id", addr.id);

  const res = await deleteAddress(addr.id)   // 后端只需把状态置为已删除
  if (res.data.code === 200) {
    ElMessage.success('已删除')
    await loadAddressList()
  } else {
    ElMessage.error(res.data.msg || '删除失败')
  }
}
/* ===== 4. 设默认（唯一置顶）===== */
async function setDefault(addr) {
  const res = await setTopAddress(addr.id) // 后端：先全部置 0，再置 1
  if (res.data.code === 200) {
    ElMessage.success('已设为默认地址')
    await loadAddressList()
  } else {
    ElMessage.error(res.data.msg || '设为默认地址失败')
  }
}

function saveLocation(addr) {
  console.log('父组件收到地址：', addr)
  // 直接写到表单里即可
  addressForm.location = addr
}
</script>
<style scoped>
/* 账号管理总样式 */
.account-management-container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  border: 1px solid #e4e4e4;
  /* 新增 */
  margin: 30px 40px;
  width: 200px;
  background-color: #fff;
  padding: 20px;
}

.sidebar-title {
  color: #ff5722;
  margin-bottom: 20px;
}

.menu-list {
  list-style: none;
  padding: 0;
}

.menu-item {
  padding: 10px 0;
  cursor: pointer;
  /* font-weight: bold; */
}

.menu-item:hover {
  color: #ff5722;
}

.menu-item.active {
  color: #ff5722;
  font-weight: bold;
}

/* 个人资料 */

.avatar-section {
  margin-left: 700px;
  display: flex;
  align-items: center;
  margin-left: 50px;
  margin-top: 30px;
  margin-bottom: 50px;
}

.nickname-section {
  margin-left: 20px;
}

.nickname {
  font-size: 24px;
  font-weight: bold;
}

/* 头像 */
.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  left: 100px;
  object-fit: cover;
}

/* 正方形预览盒 */
.preview-box {
  position: relative;
  width: 240px;
  /* 想多大改多大 */
  height: 240px;
  margin: 0 auto;
  /* 居中 */
  border-radius: 50%;
  /* 圆形；不想要就改成 8px */
  overflow: hidden;
  /* 必须，防止图片溢出 */
  background: #f5f5f5;
  /* 加载前底色 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, .15);
}

.preview-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* 填满并居中，多余裁剪 */
  display: block;
}

/* 安全设置了 */
.section-title {
  margin-top: 50px;
  margin-bottom: 15px;
  font-size: 24px;
  color: #070504;
}

.info-section {
  border: 1px solid #e4e4e4;
  /* 新增 */
  border-radius: 8px;
  /* 可选：圆角 */
  padding: 24px;
  /* 可选：内边距 */
  background-color: #fff;
  /* 可选：白底 */
}

.info-section,
.setting-section,
.security-section {
  margin-bottom: 30px;
}

.info-item,
.setting-item,
.security-item {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.info-label,
.setting-label,
.level-label,
.security-name {
  width: 120px;
}

/* 输入框样式 */
.info-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color .2s;
}

.info-input:focus {
  outline: none;
  border-color: #409eff;
}

.info-input-info {
  flex: 1;
  padding: 12px 16px;
  /* 原来 8px12px → 12px16px */
  height: 48px;
  /* 新增：整体更高 */
  font-size: 16px;
  /* 字变大 */
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  /* 圆角也稍微放大 */
  transition: border-color .2s;
}

.info-input-info:focus {
  outline: none;
  border-color: #409eff;
}

/* 项间距 */
.info-item {
  margin-bottom: 20px;
  /* 需要多大改多大 */
  display: flex;
  align-items: center;
}

/* 保存按钮（可选） */
.info-actions {
  text-align: right;
  margin-top: 10px;
}

.save-btn {
  background: #ff5722;
  color: #fff;
  border: none;
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.save-btn:hover {
  background: #e04e1c;
}

/* 主内容区样式 */
.main-content {
  flex: 1;
  padding: 30px;
}

.password-reset-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 30px;
  max-width: 600px;
  margin: 0 auto;
}

.card-title {
  margin: 0 0 10px;
  font-size: 20px;
  color: #333;
}

.card-desc {
  color: #666;
  margin: 0 0 25px;
  font-size: 14px;
}

/* 表单样式 */
.password-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.form-input {
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #409eff;
}

.password-tip {
  margin: 5px 0 0;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.password-tip.valid {
  color: #67c23a;
}

.password-tip:not(.valid) {
  color: #f56c6c;
}

.icon-valid::before {
  content: "✓";
  display: inline-block;
  width: 16px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  background-color: #67c23a;
  color: white;
  border-radius: 50%;
}

.icon-invalid::before {
  content: "!";
  display: inline-block;
  width: 16px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  background-color: #f56c6c;
  color: white;
  border-radius: 50%;
}

/* 按钮样式 */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 10px;
}

.btn {
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #666;
}

.cancel-btn:hover {
  background-color: #e9e9e9;
}

.submit-btn {
  background-color: #ff5722;
  color: white;
}

.submit-btn:hover {
  background-color: #e04e1c;
}

.submit-btn:disabled {
  background-color: #ffb89f;
  cursor: not-allowed
}

/* 收货地址样式 */
.address-section {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  padding: 30px;
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.add-address-btn {
  background-color: #ff5722;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  outline: none;
  gap: 5px;
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.address-card {
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.address-name-phone {
  display: flex;
  gap: 20px;
  margin-bottom: 8px;
}

.address-name {
  font-weight: 500;
}

.address-tag {
  display: inline-block;
  background-color: #fff0e6;
  color: #ff5722;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  margin-top: 8px;
}

/* 编辑收获地址 按钮的样式 */
.address-actions {
  display: flex;
  flex-direction: row;
  gap: 8px;
}

.button-example {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
  margin-top: 1.2rem;
}

.button-row>* {
  margin: 0;
}

.address-empty {
  text-align: center;
  padding: 50px 0;
  color: #999;
  border: 1px dashed #eee;
  border-radius: 6px;
}

/* 收货地址的终点 */
.avatar-wrapper {
  position: relative;
  cursor: pointer
}

.avatar-mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, .4);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity .3s;
  border-radius: 50%
}

.avatar-wrapper:hover .avatar-mask {
  opacity: 1
}
</style>