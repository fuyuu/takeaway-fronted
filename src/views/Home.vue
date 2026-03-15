<template>
    <div class="container">
        <div class="main">
            <!-- 广告 -->
            <div class="banenr">
                <div class="width">
                    <ul class="cats">
                        <li v-for="category in categories" :key="category.id">
                            <!-- 主分类可点击 -->
                            <a href="#" @click.prevent="handleCategoryClick(category)">{{ category.name }}</a>

                            <!-- 子标签点击也触发主分类筛选 -->
                            <a v-for="sub in category.tags" href="#" class="sm_link"
                                @click.prevent="handleCategoryClick(category)">
                                {{ sub.name }}
                            </a>
                        </li>
                    </ul>
                    <div class="banner_img">
                        <el-carousel :interval="4000" height="400px" type="card" indicator-position="outside"
                            arrow="always">
                            <el-carousel-item v-for="(banner, index) in banners" :key="index">
                                <img :src="banner.image" :alt="banner.title" class="carousel-image">
                                <div class="carousel-caption">
                                    <h3>{{ banner.title }}</h3>
                                    <p>{{ banner.description }}</p>
                                </div>
                            </el-carousel-item>
                        </el-carousel>
                    </div>
                </div>
            </div>
            <!-- 附近推荐商家 -->
            <div class="sj ilist_wrapper">
                <div class=width>
                    <div class="tit">
                        <span>推荐附近商家</span>
                        <a href="">更多</a>
                    </div>

                    <!-- 筛选栏 -->
                    <div class="filter-bar">
                        <div v-for="cat in allCategories" :key="cat.id" class="filter-item"
                            :class="{ active: selectedCategory?.id === cat.id }" @click="handleCategoryClick(cat)">
                            {{ cat.name === 'all' ? '全部' : cat.name }}
                        </div>

                        <div style="margin-left: auto; display: flex;">
                            <div class="filter-item" :class="{ active: sortBy === 'default' }"
                                @click="sortBy = 'default'">
                                默认排序
                            </div>
                            <div class="filter-item" :class="{ active: sortBy === 'price' }" @click="sortBy = 'price'">
                                价格最低
                            </div>
                            <div class="filter-item" :class="{ active: sortBy === 'rating' }"
                                @click="sortBy = 'rating'">
                                评分最高
                            </div>
                        </div>
                    </div>

                    <div class="list">
                        <!-- <div class="item" v-for="restaurant in restaurants" :key="restaurant.id"> -->
                        <div class="item" v-for="restaurant in filteredRestaurants" :key="restaurant.id">
                            <router-link :to="{ name: 'merchant', params: { id: restaurant.id } }" class="item-link">
                                <div class="item_img">
                                    <img :src="restaurant.avatar">
                                </div>
                                <div class="item_name">
                                    {{ restaurant.name }}
                                    <span class="score">{{ restaurant.score }}</span>
                                </div>
                                <div class="item_tuijian">
                                    推荐菜：<span v-for="(rec, index) in restaurant.recommends" :key="index">{{ rec
                                    }}</span>
                                </div>
                                <div class="item_price">
                                    起送 <span>￥{{ restaurant.minOrderAmount }}</span>
                                    配送 <span>{{ restaurant.deliveryFee === 0 ? '免配送费' :
                                        `￥${restaurant.deliveryFee}` }}</span>
                                </div>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Footer></Footer>
</template>

<script setup lang="ts">
import Footer from "./footer/Footer.vue";
import { ref, computed, onMounted,nextTick } from 'vue';
import { getMerchantList, getMerchantWithSpuList, getMerchantListByCategory } from '../api/merchant';
import { ElMessage } from 'element-plus';
import { getCategoryMerchant } from '@/api/category';
import { getCategoryPhotos } from '@/api/banner';
const banners = ref([]);    // 轮播图数据
(async () => {
    try{
        const res = await getCategoryPhotos();
        if (res.data.code == 200) {
          banners.value = res.data.data;
        } else {
          console.error("banners", res);
          console.error("banners", res.data.msg);
        }
    }catch(e){
        console.log("处理错误",e);
    }
})();
getMerchantList().then(res=>{ 
    if(res.data.code==200){
        console.log("merchants",res.data.data);
    }else{
        console.error("merchants",res.data.msg);
    }
}).catch(err=>{
    console.error("处理错误",err);
})
// 数据模型定义
interface Category {
    id: number;
    name: string;
    tags?: Tag[];
}
interface Tag {
    id: number;
    name: string;
}
interface DishSpu {
    id: number;
    name: string;
    image: string;
    description: string;
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
    dishSpuList: DishSpu[];
}
// 分类数据
const categories = ref<Category[]>([]);
const allCategories = ref<Category[]>([])
const selectedCategory = ref<Category>()

// 添加"全部"分类并设置为默认选中
const initializeCategories = (categoriesData: Category[]) => {
    const allCategory = { id: 0, name: 'all' };
    allCategories.value = [allCategory, ...categoriesData];
    selectedCategory.value = allCategory;
};
onMounted(async () => {
    try {
        const response = await getMerchantList();
        const res = await getMerchantWithSpuList();
        console.log("response", response);
        console.log("res", res);
        // 假设接口返回格式为 { code: 0, data: [...] }
        if (res.data.code === 200) {
            restaurants.value = res.data.data;
            console.log("餐馆信息加载成功");
            return;
        } else {
            console.log("response.data.code", response.data.code);
            console.log(`加载失败：${response.data.msg}`);
        }
    } catch (error) {
        console.error('请求餐馆列表出错：', error);
        ElMessage.error('网络错误，无法加载餐馆信息');
    }
})
const sortBy = ref<string>('default');
const restaurants = ref<Restaurant[]>([]);
// 用计算属性替代watch，更简洁高效

// 加载状态
const loading = ref(false);

// 加载商家数据（核心改造）
const loadRestaurants = async (categoryId?: number) => {
    loading.value = true;
    try {
        let res;
        // 如果有分类ID且不是"全部"分类，调用分类接口
        if (categoryId && categoryId !== 0) {
            // 假设存在按分类获取商家的API
            res = await getMerchantListByCategory(categoryId);
        } else {
            // 加载全部商家
            res = await getMerchantWithSpuList();
        }

        if (res.data.code === 200) {
            restaurants.value = res.data.data;
            console.log(`分类${categoryId || '全部'}的餐馆信息加载成功`, restaurants.value);
        } else {
            console.error(`加载失败：${res.data.msg}`);
            ElMessage.error('加载餐馆信息失败');
        }
    } catch (error) {
        console.error('请求餐馆列表出错：', error);
        ElMessage.error('网络错误，无法加载餐馆信息');
    } finally {
        loading.value = false;
    }
};
const handleCategoryClick = (cat: Category) => {
  selectedCategory.value = cat;
  loadRestaurants(cat.id);

  // 滚动到“推荐附近商家”区域
  nextTick(() => {
    const target = document.querySelector('.sj.ilist_wrapper');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
};
// 初始化
onMounted(async () => {
    try {
        // 加载分类
        const foodCategory = await getCategoryMerchant();
        if (foodCategory.data?.data) {
            categories.value = foodCategory.data.data;
            initializeCategories(foodCategory.data.data);
        } else {
            console.error(3);
            console.error('获取分类失败：', foodCategory.data.msg);
            ElMessage.error('获取分类失败：' + foodCategory.data.msg);
        }
        // 初始加载全部商家
        await loadRestaurants();
    } catch (error) {
        console.error('初始化数据出错：', error);
        ElMessage.error('初始化数据失败');
    }
});

// 过滤和排序（注意：现在数据已经是后端过滤过的了）
const filteredRestaurants = computed(() => {
    let list = [...restaurants.value];

    // 前端只做排序，不过滤（过滤由后端完成）
    if (sortBy.value === 'price') {
        list.sort((a, b) => a.minOrderAmount - b.minOrderAmount);
    } else if (sortBy.value === 'rating') {
        list.sort((a, b) => b.score - a.score);
    }

    return list;
});
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

body {
    background-color: #f5f5f5;
    color: #333;
    line-height: 1.6;
    margin: 0;
}

a {
    text-decoration: none;
    color: #333;
}

ul,
li {
    list-style: none;
}

img {
    max-width: 100%;
    display: block;
}

.header-nav__desktop-nav {
    display: none;
    align-items: center;
    gap: 2rem;
}

.width {
    width: 1400px;
    margin: 0 auto;
}

.logo img {
    height: 50px;
}

.search {
    display: flex;
    width: 400px;
    height: 46px;
    border: 2px solid #ff6633;
    border-radius: 23px;
    overflow: hidden;
}

.search input {
    flex: 1;
    border: none;
    padding: 0 15px;
    font-size: 16px;
    outline: none;
}

.search button {
    width: 80px;
    background-color: #ff6633;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.search button .icon {
    width: 20px;
    height: 20px;
}

/* 广告横幅区域 */
.banenr {
    background-color: #fff;
    padding: 0 20px 0;
}

.banenr .width {
    display: flex;
}

.cats {
    width: 240px;
    /* background-color: #f8f8f8; */
    border-radius: 4px;
    padding: 8px 0;
}

.cats li {
    padding: 10px 15px;
    position: relative;
    cursor: pointer;
}

.cats li:hover {
    background-color: #f0f0f0;
}

.cats li a:first-child {
    font-weight: bold;
    font-size: 15px;
}

.sm_link {
    font-size: 12px;
    color: #666;
    margin-left: 10px;
}

.sm_link:hover {
    color: #ff6633;
}

.banner_img {
    width: 100%;
    /* 让它填满容器 */
    max-width: 2000px;
    /* 你可以调大一点，比如 400px */
    height: auto;
    /* 保持比例 */
    border-radius: 12px;
}

/* 轮播图样式 */
.carousel-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
}

.carousel-caption {
    position: absolute;
    bottom: 20px;
    left: 20px;
    color: white;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
}

.carousel-caption h3 {
    font-size: 24px;
    margin-bottom: 8px;
    font-weight: bold;
}

.carousel-caption p {
    font-size: 16px;
}

/* 推荐商家 */
.sj {
    background-color: #fff;
    padding: 20px 0;
    border-radius: 4px;
}

.tit {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 15px;
    border-bottom: 1px solid #e5e5e5;
    margin-bottom: 20px;
}

.tit span {
    font-size: 20px;
    font-weight: bold;
    color: #333;
}

.tit a {
    color: #999;
    font-size: 14px;
}

.tit a:hover {
    color: #ff6633;
}

.list {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
}

.item {
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.08);
    transition: transform 0.3s;
    cursor: pointer;
}

.item:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.item_img {
    height: 180px;
    overflow: hidden;
}

.item_img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s;
}

.item:hover .item_img img {
    transform: scale(1.05);
}

.item_name {
    font-size: 16px;
    font-weight: bold;
    padding: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.item_name .score {
    margin-left: 20px;
    color: red;
    font-size: 24px;
}

.item_tuijian {
    padding: 0 10px;
    font-size: 13px;
    color: #666;
    height: 40px;
    overflow: hidden;
}

.item_tuijian span {
    margin-right: 5px;
    background-color: #f5f5f5;
    padding: 2px 5px;
    border-radius: 3px;
}

.item_price {
    padding: 10px;
    font-size: 14px;
    color: #999;
    border-top: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
}

.item_price span {
    color: #ff6633;
    font-weight: bold;
}


/* 响应式设计 */
@media (max-width: 1200px) {
    .width {
        width: 960px;
    }

    .list {
        grid-template-columns: repeat(4, 1fr);
    }
}

@media (max-width: 992px) {
    .width {
        width: 720px;
    }

    .list {
        grid-template-columns: repeat(3, 1fr);
    }

    .nav li {
        margin: 0 8px;
    }
}

@media (max-width: 768px) {
    .width {
        width: 100%;
        padding: 0 15px;
    }

    .header .width {
        flex-direction: column;
    }

    .logo {
        margin-bottom: 15px;
    }

    .search {
        width: 100%;
        margin-bottom: 15px;
    }

    .nav {
        flex-wrap: wrap;
        margin-left: 0;
        margin-top: 10px;
    }

    .nav li {
        margin: 5px 10px;
    }

    .banenr .width {
        flex-direction: column;
    }

    .cats {
        width: 100%;
        margin-bottom: 15px;
    }

    .banner_img {
        margin-left: 0;
    }

    .list {
        grid-template-columns: repeat(2, 1fr);
    }

    .footer_list a,
    .footer_list span {
        display: block;
        margin: 5px 0;
    }
}

@media (max-width: 576px) {
    .list {
        grid-template-columns: 1fr;
    }

    .item_img {
        height: 200px;
    }
}

/* Vue 3 特定样式 */
.active-city {
    color: #ff6633;
    font-weight: bold;
}

.login-status {
    display: flex;
    align-items: center;
}

.user-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 10px;
}

.search-highlight {
    background-color: #fff8e1;
    color: #ff6633;
    font-weight: bold;
}

.filter-bar {
    display: flex;
    margin-bottom: 20px;
    background: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-item {
    margin-right: 20px;
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 15px;
}

.filter-item.active {
    background-color: #ff6633;
    color: white;
}
</style>