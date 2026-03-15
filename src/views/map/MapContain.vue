<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import { ref } from 'vue'

const latLng = ref(null)    // 经纬度
const placeName = ref('')   // 具体地址

let map = null
let geolocation = null
let retryCount = 0
const MAX_RETRY = 5

//地图带定位
onMounted(() => {
  window._AMapSecurityConfig = { securityJsCode: 'cf0ab58ec640de4f61d31f8fe75151e0' }

  AMapLoader.load({
    key: 'fb9a8e51b905bc1aebd376fd86a8d557',
    version: '2.0',
    plugins: ['AMap.Scale', 'AMap.Geolocation', 'AMap.Geocoder']   // ① 新增定位插件
  })
    .then(AMap => {
      map = new AMap.Map('container', {
        viewMode: '3D',
        zoom: 16,                      // 定位成功后会缩放到 16 级
        center: [116.397428, 39.90923]
      })

      geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,       // 高精度
        timeout: 8000,                  // 8 秒超时
        showMarker: true,               // 定位成功自动打点
        showCircle: true,               // 显示精度圆
        panToLocation: true,            // 自动把地图中心移过去
        zoomToAccuracy: true            // 自动缩放到合适级别
      })

      map.addControl(geolocation)        // ② 把定位按钮挂到地图上（可选）

      tryLocate()                        // ③ 立即开始第一次定位
    })
    .catch(e => console.error('地图加载失败', e))
})

/* 递归重试定位 */
function tryLocate() {
  geolocation.getCurrentPosition((status, result) => {
    if (status === 'complete') {
      const { lng, lat } = result.position          // ① 取出经纬度
      latLng.value = { lat, lng }     // 先存经纬度
      localStorage.setItem('myPos', JSON.stringify({ lng, lat }))
      console.log('定位成功', result.position, '地址：', result.formattedAddress)
      onLocate({ lat, lng })                        // ② 手动触发逆查
    } else {
      console.warn(`第 ${retryCount + 1} 次定位失败`, result)
      retryCount++
      if (retryCount < MAX_RETRY) {
        setTimeout(tryLocate, 3000)
      } else {
        console.error('已达最大重试次数，停止定位')
      }
    }
  })
}
function onLocate({ lat, lng }) {
  // ② 创建逆地理实例
  const geocoder = new AMap.Geocoder({ radius: 300, extensions: 'all' })

  geocoder.getAddress([lng, lat], (status, result) => {
    if (status === 'complete' && result.regeocode) {
      placeName.value = result.regeocode.formattedAddress
      console.log('你当前在：', placeName.value)
    } else {
      placeName.value = '未能解析出地址'
    }
  })
}
onUnmounted(() => {
  map?.destroy()
})
watch(placeName,(newValue,oldValue) => {
  console.log('placeName变化了-新值',newValue,"原来的值",oldValue)
});

</script>

<template>
  <div id="container"></div>
  <div class="info">你当前在：{{ placeName }}</div>
</template>

<style scoped>
#container {
  width: 100%;
  height: 800px;
}
</style>