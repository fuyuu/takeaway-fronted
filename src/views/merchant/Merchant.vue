<template>
  <div class="app-container">
    <!-- 店铺信息区域 -->
    <div class="shop-header">
      <img class="shop-banner" :src="restaurant.avatar" alt="店铺横幅广告">
      <div class="shop-info">
        <!-- 店铺logo -->
        <div class="shop-logo">
          <img v-bind:src="restaurant.avatar" alt="店铺logo">
        </div>
        <!-- 店铺详情信息 -->
        <div class="shop-details">
          <h1 class="shop-name">{{ restaurant.name }}</h1>
          <div class="shop-meta">
            <div class="shop-meta">
              <!-- 评分 -->
              <span class="meta-item">
                评分: <text class="rating">¥{{ restaurant.score }}</text>
              </span>
              <!-- 起送价 -->
              <span class="meta-item">
                起送价: <text class="red">¥{{ restaurant.minOrderAmount }}</text>
              </span>
              <!-- 配送费 -->
              <span class="meta-item">
                配送费: <text class="red">{{ restaurant.deliveryFee === 0 ? '免配送费' : `¥${restaurant.deliveryFee}` }}</text>
              </span>
            </div>
          </div>
          <div class="shop-tags">
            <span>新店特惠</span>
            <span>免配送费</span>
          </div>
        </div>
        <!-- 优惠券列表项 -->
        <div class="coupon-item" v-for="(coupon, index) in coupons" :key="index">
          <!-- 左侧信息区 -->
          <div class="coupon-info">
            <div class="coupon-title">{{ coupon.title }}</div>
            <div class="coupon-use-time">{{ coupon.subTitle }}</div>
            <div class="coupon-price">
              <span class="current-price">¥{{ (coupon.payValue / 100).toFixed(2) }}</span>
              <span class="discount">{{ (coupon.payValue / coupon.actualValue * 10).toFixed(1) }}折</span>
            </div>
          </div>
          <!-- 右侧操作区 -->
          <div class="coupon-action">
            <!-- 普通抢购按钮 -->
            <button v-if="coupon.type == 0" class="buy-btn" @click="getCoupon(coupon)">抢购</button>
            <!-- 限时抢购（含剩余数量、时间） -->
            <div v-else class="limited-group">
              <div class="limited-btn" @click="getCoupon(coupon)">限时抢购</div>
              <div class="coupon-remain">剩余{{ coupon.stock ?? 0 }}张</div>
              <!-- <div class="limit-time">{{ coupon.limitTime }}</div> -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 左侧分类导航 -->
      <aside class="category-sidebar">
        <div v-for="category in categories" :key="category.id" class="category-item"
          :class="{ active: activeId === category.id }" @click="handleCategoryClick(category)">
          {{ category.name }}
        </div>
      </aside>

      <!-- 右侧商品展示区 -->
      <div class="products-area">
        <!-- 商品分类标题 -->
        <div class="products-section">
          <h2 class="section-title">招牌推荐</h2>

          <!-- 商品网格 - 每行3个 -->
          <div class="products-grid">
            <div class="product-item" v-for="(product, index) in dishSpuList" :key="index">
              <div class="product-image">
                <img :src="product.image" :alt="product.name">
                <div v-if="product.tag" class="product-tag">{{ product.tag }}</div>
              </div>
              <div class="product-info">
                <h3 class="product-name">{{ product.name }}</h3>
                <p class="product-description">{{ product.description }}</p>
                <div class="product-price">
                  <span class="current-price">¥{{ product.price }}</span>
                  <span v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice }}</span>
                </div>
                <div class="product-sales">月售{{ product.sales }}份</div>
              </div>
              <div class="add-to-cart" @click="handleAddClick(product)">
                <span>+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部购物车栏 -->
    <div class="cart-bar" @click="toggleCart">
      <div class="cart-icon">
        <span class="cart-count" v-if="cartItems.length > 0">{{ cartTotalCount }}</span>
        🛒
      </div>
      <div class="cart-info">
        <div class="cart-text">
          <span>购物车</span>
          <span class="min-order">满{{ restaurant.minOrderAmount }}起送</span>
        </div>
        <div class="cart-total">
          <span>¥{{ cartTotalPrice }}</span>
          <span class="checkout-btn" v-if="cartItems.length > 0">去结算</span>
        </div>
      </div>
    </div>

    <!-- 购物车弹出层 -->
    <div class="cart-popup" :class="{ 'active': cartVisible }">
      <div class="cart-header">
        <h3>购物车</h3>
        <span class="close-cart" @click="toggleCart">✕</span>
      </div>

      <div class="cart-items" v-if="cartItems.length > 0">
        <div class="cart-item" v-for="(item, index) in cartItems" :key="index">
          <div class="item-info">
            <div class="item-name">{{ item.name }}</div>
            <div class="item-price">¥{{ item.price }}</div>
          </div>
          <div class="item-quantity">
            <button class="quantity-btn minus" @click="updateQuantity(item, -1)">-</button>
            <span class="quantity">{{ item.quantity }}</span>
            <button class="quantity-btn plus" @click="updateQuantity(item, 1)">+</button>
          </div>
        </div>
      </div>

      <div class="empty-cart" v-else>
        购物车还是空的哦，快去添加美食吧~
      </div>

      <div class="cart-footer" v-if="cartItems.length > 0">
        <div class="cart-summary">
          <div>合计: <span class="total-price">¥{{ cartTotalPrice }}</span></div>
          <div class="discount-info">已优惠: ¥0 | 含配送费 ¥0</div>
        </div>
        <button class="checkout-button" v-on:click="handleCheckout">去结算</button>
      </div>
    </div>
    <!-- SKU选择弹窗 -->
    <div class="sku-popup" :class="{ 'active': skuVisible }">
      <div class="sku-container">
        <div class="sku-header">
          <h3>选择商品规格</h3>
          <span class="close-sku" @click="closeSkuPopup">✕</span>
        </div>
        <div class="sku-body" v-if="currentProduct">
          <div class="sku-product-info">
            <img :src="currentProduct.image" :alt="currentProduct.name" class="sku-product-img">
            <div class="sku-product-details">
              <h4 class="sku-product-name">{{ currentProduct.name }}</h4>
              <p class="sku-product-price">¥{{ currentProduct.price }}</p>
              <p class="sku-product-desc">{{ currentProduct.description }}</p>
            </div>
          </div>

          <div class="sku-options">
            <h5 class="option-group-title">请选择规格：</h5>
            <div class="option-items">
              <div class="option-item" v-for="sku in currentProduct?.skuList" :key="sku.id"
                :class="{ selected: selectedSku?.id === sku.id }" @click="selectedSku = sku">
                {{ sku.spec2 }} -> ¥{{ sku.price }}
              </div>
            </div>
          </div>
          <div class="sku-quantity">
            <span class="quantity-label">数量</span>
            <div class="quantity-controls">
              <button class="quantity-btn minus" @click="updateSkuQuantity(-1)" :disabled="skuQuantity <= 1">-</button>
              <span class="quantity">{{ skuQuantity }}</span>
              <button class="quantity-btn plus" @click="updateSkuQuantity(1)">+</button>
            </div>
          </div>
        </div>
        <div class="sku-footer">
          <button class="add-to-cart-btn" @click="confirmSkuSelection">
            加入购物车 (¥{{ calculateSkuTotalPrice }})
          </button>
        </div>
      </div>
    </div>

    <!-- 右侧AI交互按钮 -->
    <div class="ai-chat-trigger" @click="toggleAiChat" @mouseenter="showAITooltip = true"
      @mouseleave="showAITooltip = false">
      🤖
      <!-- AI助手提示 -->
      <div class="ai-tooltip" v-if="showAITooltip">
        AI智能助手
      </div>
    </div>

    <!-- AI交互弹窗 -->
    <div class="ai-chat-popup" :class="{ 'active': aiChatVisible, 'expanded': aiChatExpanded }">
      <div class="ai-chat-header">
        <h3>AI智能助手</h3>
        <div class="ai-chat-actions">
          <button class="expand-btn" @click="" v-if="!aiChatExpanded">
            更多
          </button>
          <span class="close-ai-chat" @click="toggleAiChat">✕</span>
        </div>
      </div>

      <!-- 精简版内容 -->
      <div class="ai-chat-compact" v-if="!aiChatExpanded">
        <div class="ai-chat-messages">
          <div class="message ai-message">
            <div class="avatar">🤖</div>
            <div class="content">您好！我是AI助手，可以帮您推荐菜品、解答问题</div>
          </div>
          <div class="message user-message" v-for="(msg, index) in userMessages" :key="index">
            <div class="avatar">👤</div>
            <div class="content">{{ msg }}</div>
          </div>
          <div class="message ai-message" v-for="(msg, index) in aiResponses" :key="'ai-' + index">
            <div class="avatar">🤖</div>
            <div class="content">{{ msg }}</div>
          </div>
        </div>
        <div class="ai-chat-input">
          <input type="text" v-model="currentMessage" placeholder="输入您的问题..." @keyup.enter="sendMessage">
          <button @click="sendMessage">发送</button>
        </div>
      </div>

      <!-- 完整版内容 -->
      <div class="ai-chat-full" v-else>
        <div class="full-header">
          <h2>AI智能助手 - 全部功能</h2>
          <p>为您提供全方位的餐饮服务支持</p>
        </div>

        <div class="ai-features">
          <div class="feature-card" @click="selectFeature('recommend')">
            <div class="feature-icon">🍔</div>
            <h4>菜品推荐</h4>
            <p>根据您的口味偏好推荐合适菜品</p>
          </div>
          <div class="feature-card" @click="selectFeature('discount')">
            <div class="feature-icon">💰</div>
            <h4>优惠咨询</h4>
            <p>获取最新优惠信息和套餐推荐</p>
          </div>
          <div class="feature-card" @click="selectFeature('advice')">
            <div class="feature-icon">⏰</div>
            <h4>用餐建议</h4>
            <p>提供最佳用餐时间和人数建议</p>
          </div>
          <div class="feature-card" @click="selectFeature('nutrition')">
            <div class="feature-icon">📊</div>
            <h4>营养分析</h4>
            <p>分析菜品营养成分和热量</p>
          </div>
        </div>

        <div class="ai-chat-messages-full">
          <div class="message-section">
            <h4>对话记录</h4>
            <div class="messages-container">
              <div class="message ai-message" v-for="(msg, index) in aiResponses" :key="'full-ai-' + index">
                <div class="avatar">🤖</div>
                <div class="content">{{ msg }}</div>
              </div>
              <div class="empty-message" v-if="aiResponses.length === 0">
                暂无对话记录
              </div>
            </div>
          </div>
        </div>

        <div class="ai-chat-input-full">
          <input type="text" v-model="currentMessage" placeholder="输入您的问题或需求..." @keyup.enter="sendMessage">
          <button @click="sendMessage">发送</button>
        </div>
      </div>
    </div>

    <!-- 遮罩层 -->
    <div class="overlay" :class="{ 'active': skuVisible }" @click="closeSkuPopup"></div>
    <div class="overlay" :class="{ 'active': cartVisible }" @click="toggleCart"></div>
    <div class="overlay" :class="{ 'active': aiChatVisible }" @click="toggleAiChat"></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, onMounted } from 'vue'
import { addOrder } from '@/api/order';
import { addCart, deleteCart, getCartList, updateCart, Cart, deleteALLCart } from '@/api/cart';
import { getMerchantWithSpuOne } from '@/api/merchant';
import { getSkuBySpuId } from '@/api/dish';
import { useRoute } from 'vue-router'
import { getAllVoucher, getVoucherSeckill, addVoucher, addVoucherSeckill } from "@/api/voucher";
import { ElMessage } from 'element-plus';

const route = useRoute()
const id = route.params.id
// const categories = reactive(['全部商品', '招牌汉堡', '炸鸡系列', '小吃配菜', '饮品', '套餐组合', '甜点', '新品上市'])
/* ---- 全部分类数据 ---- */
interface Coupon {
  id: number
  title: string
  subTitle: string
  payValue: number     // 分
  actualValue: number  // 分
  type: 0 | 1
  stock?: number | null
  beginTime?: string | null
  endTime?: string | null
}
const coupons = ref<Coupon[]>([])
interface Dish {
  id: number;
  name: string;
  image: string;
  description: string;
  sales: number;//月售
  tag?: string;
  merchantId?: number;
  categoryId?: number;
  status?: number;
  price: number;
  originalPrice?: number;
  skuList?: SkuOption[]; // 新增SKU选项组
}
interface SkuOption {
  id: number;
  heft: number;
  spec2: string;
  price: number;
  stock_num: number;
  image: string;
}
interface CartItem extends Dish {
  quantity: number,
  spuId?: number;
  image: string;
  skuId?: number;
}
interface Restaurant {
  id: number;
  name: string;
  avatar: string;
  recommends: string[];
  minOrderAmount: number;
  category: string;
  score: number;
  deliveryFee: number;
  address: string;
  email: string;
  description: string;
  dishSpuList: Dish[]
}
const restaurant = ref<Restaurant>({} as Restaurant);
const dishSpuList = ref<Dish[]>([]);

// 添加SKU相关的响应式变量
const skuVisible = ref(false)
const currentProduct = ref<Dish>(null)
const skuQuantity = ref(1)
/* 购物车 购物车弹出层 遮罩层 */
const cartItems = reactive<CartItem[]>([])
const cartVisible = ref(false)
/* 计算购物车中的商品数量和总价 */
const cartTotalCount = computed(() => cartItems.reduce((total, item) => total + item.quantity, 0))
const cartTotalPrice = computed(() => cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2))
onMounted(async () => {
  // ===== 1. 先拉取商家和商品 =====
  try {
    const categoryRes = await getCategoryFood(id);
    if (categoryRes.data.code === 200) {
      categories.value = categoryRes.data.data;
      console.log("categoryRes===,", categoryRes);
      console.log(categories.value);
    } else {
      console.error("获取分类列表失败：" + categoryRes.data.msg)
    }
  } catch (error) {
    console.log("获取分类列表失败：" + error);
  }
  try {
    const res = await getMerchantWithSpuOne(id);
    console.log("res", res);
    if (res.data.code !== 200) {
      alert("获取商品列表失败：" + res.data.msg);
    }
    // 商家 商品 列表 
    restaurant.value = res.data.data
    console.log("restaurants", restaurant.value);
    dishSpuList.value = res.data.data.dishSpuList;
    console.log("dishSpuList", dishSpuList.value);
    // 购物车 优惠卷
    const result = await getCartList(id);
    if (result.data.code !== 200) {
      console.log('获取购物车列表失败：' + result.data.msg)
      return
    }
    console.log('result', result);
    const responseVoucher = await getAllVoucher(restaurant.value.id);
    if (responseVoucher.data.code !== 200) {
      console.log('获取优惠券列表失败：' + responseVoucher.data.msg)
      return
    }
    coupons.value = responseVoucher.data.data;
    console.log("responseVoucher优惠卷在这里看", responseVoucher.data.data);

    if (!result.data.data) return
    cartItems.push(...result.data.data)
    console.log('这是打点处', cartItems);
  } catch (error) {
    console.warn('购物车拉取失败，使用本地降级', error)
  }
})
/* 更新购物车商品数量 + - 按钮 */
async function updateQuantity(item: CartItem, change: number) {
  item.quantity += change;
  if (item.quantity <= 0) {
    const index = cartItems.indexOf(item);// 获取索引
    try {
      await remoteDelte(item.id)
    } catch (e) {
      console.error('删除失败', e)
    } finally {
      cartItems.splice(index, 1);// 删除页面的购物车
    }
    return;
  }
  // ✅ 判断是新增还是更新
  const isExisting = item.id && item.id !== 0;

  try {
    if (isExisting) {
      // ✅ 更新已有商品
      await remoteUpdate(item);
    } else {
      // ✅ 新增商品（之前没加过）
      const { data } = await addCart(item.spuId!, item.skuId!, item.quantity);
      item.id = data.data.id; // ✅ 保存后端返回的购物车项 ID
    }
  } catch (e) {
    console.error('操作失败', e);
    item.quantity -= change; // 回滚
  }
}
async function remoteUpdate(item: CartItem) {
  try {
    await updateCart(item.id, item.quantity);
  } catch (error) {
    console.error('更新数量失败', error)
  }
}
async function remoteDelte(id: number) {
  try {
    await deleteCart(id);
  } catch (error) {
    console.error('删除商品失败', error)
  }
}
function toggleCart() {
  cartVisible.value = !cartVisible.value;
  // 2. 如果弹层出来了，就禁止页面滚动；收回去就恢复滚动
  document.body.style.overflow = cartVisible.value ? 'hidden' : 'auto';
}
async function handleCheckout() {
  // 1. 收集结算所需数据
  const orderData = {
    merchantId: id, // 商家ID（从路由参数获取）
    deliveryFee: restaurant.value.minOrderAmount, // 配送费
    totalPrice: cartTotalPrice.value, // 订单总价（可选，后端也可自行计算）
    carts: cartItems.map(item => ({
      spuId: item.spuId, // 商品ID（对应购物车中的商品ID）
      quantity: item.quantity, // 购买数量
      skuId: item.skuId, // SKU ID（对应购物车中的SKU ID）,
    })),
  };
  console.log('记得发请求给后端,后面需要用支付宝收款码,', orderData);
  try {
    const res = await addOrder(orderData);
    if (res.data.code === 200) {
      ElMessage.success('下单成功');
      console.log("res.data.data", res.data.data);
      const orderNumber = res.data.data;
      window.location.href = `/alipay/pagePay/${orderNumber}`;
      cartItems.length = 0        // 清空购物车
      cartVisible.value = false   // 关闭弹层
      await deleteALLCart();
    } else {
      alert('下单失败！')
      console.log(res.data.msg);
    }
    console.log("res.data.code", res.data.code);
    console.log(res.data.code, "===" + res.data.msg);
  } catch (error) {
    console.error('下单请求失败', error);
    alert('网络错误，下单失败');
  }
}
async function handleAddClick(product: Dish) {
  try {
    console.log("product.id", product.id);
    const res = await getSkuBySpuId(product.id); // 你提供的 API

    const skuList: SkuOption[] = res.data.data;
    product.skuList = skuList; // 缓存起来
    // 缓存 SKU 列表到当前商品
    console.log("skuList", skuList);
    openSkuPopup(product);
  } catch (error) {
    alert('获取SKU失败')
    console.error('获取SKU失败', error)
  }
}
const selectedSku = ref<SkuOption | null>(null);
const openSkuPopup = (product: Dish) => {
  console.log(product);

  currentProduct.value = product;
  skuVisible.value = true;
  skuQuantity.value = 1;
  // 默认选中第一个 SKU
  selectedSku.value = product.skuList?.[0] || null;
  document.body.style.overflow = 'hidden';
};
const closeSkuPopup = () => {
  skuVisible.value = false
  currentProduct.value = null
  document.body.style.overflow = 'auto'
}

const updateSkuQuantity = (change: number) => {
  skuQuantity.value += change
  if (skuQuantity.value < 1) {
    skuQuantity.value = 1
  }
}
// 计算选中的SKU总价
const calculateSkuTotalPrice = computed(() => {
  if (!selectedSku.value) return '0.00'
  return (selectedSku.value.price * skuQuantity.value).toFixed(2)
})
// 确认选择SKU并添加到购物车
const confirmSkuSelection = async () => {
  if (!currentProduct.value || !selectedSku.value) return

  const product = currentProduct.value
  const sku = selectedSku.value
  const quantity = skuQuantity.value

  const finalPrice = sku.price

  const cartItem: CartItem = {
    ...product,
    id: 0,
    quantity,
    price: finalPrice,
    skuId: sku.id,
    spuId: product.id, // ✅ 添加这一行
    image: product.image,
    name: `${product.name} (${sku.spec2})`,
  };

  const existingItem = cartItems.find(item =>
    item.id === product.id && item.skuId === sku.id
  )

  if (existingItem) {
    existingItem.quantity += quantity
    await remoteUpdate(existingItem)
  } else {
    cartItems.push(cartItem)
    try {
      const { data } = await addCart(product.id, sku.id, quantity)
      cartItem.id = data.data.id
    } catch (e) {
      const idx = cartItems.indexOf(cartItem)
      if (idx > -1) cartItems.splice(idx, 1)
    }
  }

  closeSkuPopup()
}
async function addToCartWithSku(product: Dish & { quantity: number; skuId?: number }) {
  const tempItem: CartItem = {
    ...product,
    id: 0,
    quantity: product.quantity,
    price: product.price,
    skuId: product.skuId,
    image: product.image,
    name: product.name,
  };

  cartItems.push(tempItem);

  try {
    // ✅ 传入 skuId
    const { data } = await addCart(product.id, product.skuId!, product.quantity);
    tempItem.id = data.data.id;
  } catch (e) {
    const idx = cartItems.indexOf(tempItem);
    if (idx > -1) cartItems.splice(idx, 1);
  }
}
// 领取优惠券方法
const getCoupon = async (coupon: Coupon) => {
  try {
    const api = coupon.type === 1 ? addVoucherSeckill : addVoucher;
    const res = await api(coupon.id);

    if (res.data.code === 200) {
      // 替换成功提示
      ElMessage.success({
        message: '领取成功',
        duration: 2000, // 2秒后自动关闭
        center: true // 居中显示
      });
      if (coupon.stock) coupon.stock--;
    } else if (res.data.code === 401) {
      // 替换失败提示
      ElMessage.error({
        message: '领取失败：' + res.data.msg,
        duration: 3000
      });
    } else {
      ElMessage.error({
        message: '领取失败：' + res.data.msg,
        duration: 3000
      });
    }
  } catch (e: any) {
    ElMessage.error({
      message: e?.message || '领取失败',
      duration: 3000
    });
  }
};

// 分类列表
interface Category {
  id: number;
  name: string;
  nickname: string;
  sort: number;
  type: number;
}
const categories = ref<Category[]>([]);
const activeId = ref<number>(0);   // 当前高亮分类 id，0 表示“全部商品”
import { getCategoryFood } from '@/api/category';

// AI助手相关状态
const aiChatVisible = ref(false)
const aiChatExpanded = ref(false) // 控制是否展开完整界面
const showAITooltip = ref(false) // 控制悬停提示显示
const currentMessage = ref('')
const userMessages = ref<string[]>([])
const aiResponses = ref<string[]>([])

const toggleAiChat = () => {
  aiChatVisible.value = !aiChatVisible.value
  document.body.style.overflow = aiChatVisible.value ? 'hidden' : 'auto'
  // 关闭时重置展开状态
  if (!aiChatVisible.value) {
    aiChatExpanded.value = false
  }
}
const selectFeature = (feature: string) => {
  const featureMessages = {
    recommend: "请告诉我您的口味偏好，我来为您推荐合适的菜品",
    discount: "我们店铺目前有以下优惠活动：新用户立减10元，满50减8元",
    advice: "建议您避开用餐高峰期（12:00-13:00，18:00-19:00）以获得更好的用餐体验",
    nutrition: "请选择您感兴趣的菜品，我来为您分析营养成分"
  }

  currentMessage.value = featureMessages[feature as keyof typeof featureMessages]
  sendMessage()
}

const sendMessage = () => {
  if (!currentMessage.value.trim()) return

  // 添加用户消息
  userMessages.value.push(currentMessage.value)

  // 模拟AI回复
  setTimeout(() => {
    const responses = [
      "请问您需要了解什么商品信息吗？",
      "我们店铺有很多优惠活动，需要为您介绍吗？",
      "您可以告诉我您的需求，我会尽力帮助您",
      "请问您对哪个商品感兴趣呢？",
      "根据您的需求，我建议您可以尝试我们的招牌汉堡套餐",
      "这个菜品很受欢迎，月销量超过500份"
    ]
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    aiResponses.value.push(randomResponse)
  }, 800)

  currentMessage.value = ''
}

</script>

<style scoped>
/* 基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}

.app-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  min-height: 100vh;
}

/* 顶部导航栏 */
.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
}

/* 店铺头部区域 */
.shop-header {
  background-color: white;
}

.shop-banner {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.shop-info {
  display: flex;
  padding: 15px;
}

.shop-logo img {
  width: 90px;
  height: 90px;
  border-radius: 8px;
  object-fit: cover;
}

.shop-details {
  margin-left: 15px;
  flex: 1;
}

.shop-name {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5px;
}

.shop-meta {
  display: flex;
  gap: 10px;
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
}

.rating {
  font-weight: 600;
  color: #ff8800;
  font-weight: bold;
}

.red {
  color: #ff3300;
  font-weight: 600;
  font-weight: bold;
}

.shop-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.shop-tags span {
  background-color: #fff0e6;
  color: #ff6600;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
}

/* 调整店铺信息容器为flex布局 */
/* 优惠卷 */
.shop-info {
  display: flex;
  padding: 15px;
  align-items: center;
  /* 垂直居中对齐 */
}

/* 优惠券区域样式 */
.coupon-item {
  background-color: #fff5f5;
  /* 浅粉色背景 */
  border-radius: 8px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.coupon-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.coupon-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.coupon-use-time {
  font-size: 12px;
  color: #666;
}

.coupon-price {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.current-price {
  font-size: 14px;
  color: #ff4d4f;
  /* 红色价格 */
  font-weight: bold;
}

.discount {
  font-size: 12px;
  color: #ff4d4f;
  background-color: #ffefef;
  padding: 1px 4px;
  border-radius: 3px;
}

.coupon-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 400px;
}

.buy-btn {
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
}

.limited-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.limited-btn {
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
}

.coupon-remain,
.limit-time {
  font-size: 10px;
  color: #666;
}

/* 主内容区域 */
.main-content {
  display: flex;
  background-color: #f5f5f5;
  padding-bottom: 80px;
  /* 为底部购物车留出空间 */
}

/* 左侧分类导航 */
.category-sidebar {
  width: 100px;
  background-color: white;
  height: calc(100vh - 270px);
  position: sticky;
  top: 60px;
  overflow-y: auto;
}

.category-item {
  padding: 15px 10px;
  text-align: center;
  font-size: 14px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: all 0.2s;
}

.category-item.active {
  background-color: #fff0e6;
  color: #ff6600;
  font-weight: bold;
  border-left: 3px solid #ff6600;
}

.category-item:hover {
  background-color: #f9f9f9;
}

/* 右侧商品展示区 */
.products-area {
  flex: 1;
  padding: 15px;
}

.section-title {
  font-size: 18px;
  margin-bottom: 15px;
  padding-left: 5px;
  border-left: 3px solid #ff6600;
}

/* 商品网格 - 每行3个 */
.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.product-item {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  position: relative;
  display: flex;
  flex-direction: column;
}

.product-image {
  position: relative;
  height: 120px;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-tag {
  position: absolute;
  top: 5px;
  left: 5px;
  background-color: #ff6600;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 3px;
}

.product-info {
  padding: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-description {
  font-size: 12px;
  color: #999;
  margin-bottom: 5px;
  flex: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  display: flex;
  align-items: center;
  margin-bottom: 3px;
}

.current-price {
  font-size: 15px;
  font-weight: bold;
  color: #ff4400;
}

.original-price {
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
  margin-left: 5px;
}

.product-sales {
  font-size: 11px;
  color: #999;
}

.add-to-cart {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 26px;
  height: 26px;
  background-color: #ff6600;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(255, 102, 0, 0.3);
  transition: transform 0.2s;
}

.add-to-cart:hover {
  transform: scale(1.1);
}

/* 底部购物车栏 */
.cart-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 20;
}

.cart-icon {
  width: 50px;
  height: 50px;
  background-color: #ff6600;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  position: relative;
  margin-right: 15px;
  cursor: pointer;
}

.cart-count {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 20px;
  height: 20px;
  background-color: #ff3300;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-text {
  font-size: 14px;
}

.min-order {
  color: #ff6600;
  margin-left: 10px;
  font-size: 12px;
}

.cart-total {
  display: flex;
  align-items: center;
}

.cart-total span:first-child {
  font-size: 18px;
  font-weight: bold;
  color: #ff4400;
  margin-right: 15px;
}

.checkout-btn {
  background-color: #ff6600;
  color: white;
  padding: 8px 25px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
}

/* 购物车弹出层 */
.cart-popup {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  border-radius: 15px 15px 0 0;
  box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transform: translateY(100%);
  transition: transform 0.3s ease-out;
  max-height: 80vh;
  overflow-y: auto;
  z-index: 100;
}

.cart-popup.active {
  transform: translateY(0);
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.cart-header h3 {
  font-size: 18px;
  font-weight: bold;
}

.close-cart {
  font-size: 20px;
  cursor: pointer;
  color: #666;
}

.cart-items {
  margin-bottom: 20px;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 16px;
  margin-bottom: 5px;
}

.item-price {
  font-size: 14px;
  color: #ff4400;
  font-weight: bold;
}

.item-quantity {
  display: flex;
  align-items: center;
}

.quantity-label {
  font-size: 14px;
  color: #333;
  margin-right: 15px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.quantity-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #ddd;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
}

.quantity-btn.minus {
  color: #666;
}

.quantity-btn.plus {
  color: #ff6600;
  border-color: #ff6600;
}

.quantity {
  margin: 0 15px;
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.empty-cart {
  text-align: center;
  padding: 40px 0;
  color: #999;
  font-size: 16px;
}

.cart-footer {
  padding-top: 15px;
  border-top: 1px solid #eee;
  position: sticky;
  bottom: 0;
  background-color: white;
}

.cart-summary {
  margin-bottom: 15px;
}

.total-price {
  font-size: 18px;
  font-weight: bold;
  color: #ff4400;
}

.discount-info {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}

.checkout-button {
  width: 100%;
  background-color: #ff6600;
  color: white;
  border: none;
  padding: 12px 0;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

/* 遮罩层 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 90;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
}

.overlay.active {
  opacity: 1;
  pointer-events: auto;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }

  .category-sidebar {
    width: 80px;
  }

  .category-item {
    font-size: 12px;
    padding: 12px 5px;
  }
}

/* 添加SKU弹窗样式 */
.sku-popup {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  z-index: 100;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  max-height: 90vh;
  overflow-y: auto;
}

.sku-popup.active {
  transform: translateY(0);
}

.sku-container {
  padding: 20px;
}

.sku-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.close-sku {
  font-size: 24px;
  cursor: pointer;
}

.sku-product-info {
  display: flex;
  margin-bottom: 20px;
}

.sku-product-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 15px;
}

.sku-product-details {
  flex: 1;
}

.sku-product-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
}

.sku-product-price {
  font-size: 18px;
  color: #ff4400;
  margin-bottom: 8px;
}

.sku-options {
  margin-bottom: 20px;
}

.option-group-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
}

.option-items {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

.option-item {
  padding: 8px 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
}

.option-item.selected {
  border-color: #ff6600;
  background-color: rgba(255, 102, 0, 0.1);
  color: #ff6600;
}

.sku-quantity {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}


.sku-footer {
  padding: 15px 0;
  border-top: 1px solid #eee;
}

.add-to-cart-btn {
  width: 100%;
  padding: 15px;
  background-color: #ff6600;
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

/* 添加以下样式 */
/* AI助手按钮样式 */
.ai-chat-trigger {
  position: fixed;
  right: 30px;
  bottom: 80px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  z-index: 30;
  transition: all 0.3s ease;
}

.ai-chat-trigger:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

/* AI助手悬停提示 */
.ai-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  margin-bottom: 10px;
  z-index: 31;
}

.ai-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: rgba(0, 0, 0, 0.8);
}

/* AI弹窗样式调整 */
.ai-chat-popup {
  position: fixed;
  right: 30px;
  bottom: 80px;
  width: 320px;
  height: 480px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  z-index: 40;
  transform: translateX(120%);
  transition: all 0.3s ease-out;
  display: flex;
  flex-direction: column;
}

.ai-chat-popup.active {
  transform: translateX(0);
}

.ai-chat-popup.expanded {
  width: 500px;
  height: 600px;
  right: 50%;
  bottom: 50%;
  transform: translate(50%, 50%);
}

.ai-chat-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 0 0;
}

.ai-chat-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.ai-chat-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.expand-btn,
.back-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.expand-btn:hover,
.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.close-ai-chat {
  cursor: pointer;
  font-size: 18px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transition: background 0.3s ease;
}

.close-ai-chat:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 精简版内容 */
.ai-chat-compact {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.ai-chat-messages {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background-color: #f9f9f9;
  max-height: 300px;
}

/* 完整版内容 */
.ai-chat-full {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.full-header {
  text-align: center;
  margin-bottom: 20px;
}

.full-header h2 {
  color: #333;
  margin-bottom: 8px;
  font-size: 18px;
}

.full-header p {
  color: #666;
  font-size: 14px;
}

.ai-features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.feature-card {
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.feature-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.feature-card h4 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 14px;
}

.feature-card p {
  margin: 0;
  color: #666;
  font-size: 12px;
  line-height: 1.4;
}

.ai-chat-messages-full {
  flex: 1;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  background: #f9f9f9;
}

.message-section h4 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 14px;
}

.messages-container {
  max-height: 200px;
  overflow-y: auto;
}

.empty-message {
  text-align: center;
  color: #999;
  font-size: 14px;
  padding: 20px;
}

/* 输入框样式 */
.ai-chat-input,
.ai-chat-input-full {
  padding: 15px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
  background: white;
}

.ai-chat-input input,
.ai-chat-input-full input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
}

.ai-chat-input button,
.ai-chat-input-full button {
  padding: 10px 18px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: opacity 0.3s ease;
}

.ai-chat-input button:hover,
.ai-chat-input-full button:hover {
  opacity: 0.9;
}

/* 消息样式 */
.message {
  margin-bottom: 15px;
  display: flex;
  max-width: 80%;
}

.ai-message {
  align-self: flex-start;
}

.user-message {
  margin-left: auto;
  flex-direction: row-reverse;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  flex-shrink: 0;
}

.user-message .avatar {
  margin-right: 0;
  margin-left: 10px;
}

.content {
  padding: 10px 15px;
  border-radius: 18px;
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  font-size: 14px;
}

.user-message .content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

/* 遮罩层 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 35;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
}

.overlay.active {
  opacity: 1;
  pointer-events: auto;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .ai-chat-popup {
    width: 90%;
    right: 5%;
    bottom: 50%;
    transform: translateY(50%) translateX(120%);
  }

  .ai-chat-popup.active {
    transform: translateY(50%) translateX(0);
  }

  .ai-chat-popup.expanded {
    width: 95%;
    height: 80%;
    right: 2.5%;
    bottom: 10%;
    transform: translateY(0) translateX(0);
  }

  .ai-features {
    grid-template-columns: 1fr;
  }

  .ai-chat-trigger {
    right: 20px;
    bottom: 100px;
  }
}
</style>