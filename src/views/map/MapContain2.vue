<template>
  <div class="info"> <el-icon><Location /></el-icon>{{ placeName }}</div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import { Location } from '@element-plus/icons-vue'

const latLng = ref(null)    // 经纬度
const placeName = ref('')   // 具体地址
let retryCount = 0
const MAX_RETRY = 5 //定位失败时最多重试 5 次

/* 1. 只加载插件，不加载地图 */
onMounted(() => {
  window._AMapSecurityConfig = { securityJsCode: 'cf0ab58ec640de4f61d31f8fe75151e0' }

  AMapLoader.load({
    key: 'fb9a8e51b905bc1aebd376fd86a8d557',
    version: '2.0',
    plugins: ['AMap.Geolocation', 'AMap.Geocoder']
  }) // 只加载定位+逆地址插件
    .then(AMap => {
      const local=localStor();
      if(local){
        reverseAddr(AMap,local);
      }else{
        tryLocate(AMap)   // 加载成功后再定位
      }
    })
    .catch(e => console.error('JSAPI 加载失败', e))
})

function localStor() { 
  const local=localStorage.getItem('myPos');
  if (local) {
    const pos = JSON.parse(local)
    console.log(pos);
    if (pos.lng && pos.lat) {
      return pos
    }
  }else{
    return null
  }
}
/* 2. 纯定位 → 存经纬度 → 逆地址 */
function tryLocate(AMap) {
  const geolocation = new AMap.Geolocation({
    enableHighAccuracy: true,
    timeout: 8000
  })

  geolocation.getCurrentPosition((status, result) => {
    if (status === 'complete') {
      const { lng, lat } = result.position  //经纬度
      latLng.value = { lng, lat }
      localStorage.setItem('myPos', JSON.stringify({ lng, lat }))
      reverseAddr(AMap, { lng, lat }) // 拿到经纬度后立即反查地址
    } else {
      retryCount++
      if (retryCount < MAX_RETRY) {
        setTimeout(() => tryLocate(AMap), 3000)
      } else {
        placeName.value = '定位失败，请检查权限或网络'
      }
    }
  })
}

/* 3. 逆地理编码 */
function reverseAddr(AMap, { lng, lat }) {
  const geocoder = new AMap.Geocoder({ radius: 300, extensions: 'all' })
  geocoder.getAddress([lng, lat], (status, result) => {
    if (status === 'complete' && result.regeocode) {
      placeName.value = result.regeocode.formattedAddress
      console.log(placeName.value);
      localStorage.setItem('placeName', placeName.value)
    } else {
      placeName.value = '未能解析出地址'
    }
  })
}
</script>


<style scoped>
.info {
  margin-top: 20px;
  font-size: 12px;
}
</style>