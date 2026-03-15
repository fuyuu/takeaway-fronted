<template>
  <div class="map-edit-wrapper">
    <div class="map-box">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <input v-model="keyword" placeholder="请输入地址（例：吉首大学）" @keyup.enter="search" />
        <button @click="search">搜索</button>
      </div>

      <!-- 地图容器 -->
      <div id="mapContainer" class="map-container"></div>

      <!-- 当前位置信息 -->
      <div class="info">
        <el-icon><Location /></el-icon>
        {{ placeName }} （{{ currentPos.lng?.toFixed(6) }}, {{ currentPos.lat?.toFixed(6) }}）
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import { Location } from '@element-plus/icons-vue'
const currentPos = ref({ lng: 112.953697, lat: 28.235395 }) // 默认兜底

// 本地状态
const keyword = ref('')
const placeName = ref('加载中...')

let map = null
let marker = null
let AMap = null
let geocoder = null
let placeSearch = null

// 📦 从 localStorage 读取位置
function loadLocationFromStorage() {
  try {
    const posStr = JSON.parse(localStorage.getItem('myPos'))
    console.log(posStr.lat, posStr.lng) // 能正常输出
    const addr = localStorage.getItem('placeName')
    if (posStr) {
      const pos = posStr
      if (pos.lng && pos.lat) {
        currentPos.value = pos
        placeName.value = addr || '未知位置'
        return pos;
      }
    }
  } catch (e) {
    console.warn('localStorage 位置解析失败', e)
  }
  return null
}

// 💾 保存位置到 localStorage
function saveLocation(lng, lat, address) {
  localStorage.setItem('myPos', JSON.stringify({ lng, lat }))
  localStorage.setItem('placeName', address)
  currentPos.value = { lng, lat }
  placeName.value = address
}

// 🌍 自动定位（兜底）
function autoLocate(AM) {
  const geolocation = new AM.Geolocation({
    enableHighAccuracy: true,
    timeout: 8000
  })

  geolocation.getCurrentPosition((status, result) => {
    if (status === 'complete') {
      const { lng, lat } = result.position
      const gc = new AM.Geocoder()
      gc.getAddress([lng, lat], (s, res) => {
        const addr = s === 'complete' && res.regeocode
          ? res.regeocode.formattedAddress
          : '定位成功，地址未知'
        saveLocation(lng, lat, addr)
        initMapAndMarker({ lng, lat })
      })
    } else {
      console.error('自动定位失败:', result)
      // 使用默认位置初始化
      initMapAndMarker(currentPos.value)
    }
  })
}

// 🗺️ 初始化地图和标记
function initMapAndMarker(center) {
  map = new AMap.Map('mapContainer', {
    viewMode: '3D',
    zoom: 14,
    center: [center.lng, center.lat],
    // 👇 添加控件配置
    resizeEnable: true, // 允许窗口大小改变时自动重绘
    showZoomControl: false, // 不显示默认缩放控件，我们自己加
    showScale: false, // 不显示默认比例尺
  })

  marker = new AMap.Marker({
    position: new AMap.LngLat(center.lng, center.lat),
    map: map,
    draggable: true
  })
  // 👇 添加所有控件
  addControls(map)
  // 点击地图
  map.on('click', e => {
    const { lng, lat } = e.lnglat
    updatePosition(lng, lat)
  })

  // 拖动标记
  marker.on('dragend', e => {
    const { lng, lat } = e.lnglat
    updatePosition(lng, lat)
  })
}
function addControls(map) {
  // 🔹 缩放控件
  const toolbar = new AMap.ToolBar({
    position: 'top-left' // 可选：top-left / top-right / bottom-left / bottom-right
  })
  map.addControl(toolbar)

  // 🔹 比例尺控件
  const scale = new AMap.Scale()
  map.addControl(scale)

  // 🔹 控制罗盘控件（旋转 + 倾斜）
  const controlBar = new AMap.ControlBar({
    position: 'top-right'
  })
  map.addControl(controlBar)

  // 🔹 定位控件
  const geolocation = new AMap.Geolocation({
    position: 'top-right',
    enableHighAccuracy: true,
    timeout: 5000,
    buttonOffset: new AMap.Pixel(10, 20),
    showButton: true,
    showLocation: true
  })
  map.addControl(geolocation)

  // 🔹 鹰眼控件
  const hawkEye = new AMap.HawkEye({
    position: 'bottom-right'
  })
  map.addControl(hawkEye)

  // 🔹 图层切换控件
  const mapType = new AMap.MapType({
    position: 'top-right',
    mapTypes: ['road', 'satellite'] // 可选：road, satellite, terrain, indoor
  })
  map.addControl(mapType)
}

// 🔄 更新位置（含保存）
function updatePosition(lng, lat) {
  marker.setPosition(new AMap.LngLat(lng, lat))
  map.setCenter([lng, lat])

  geocoder.getAddress([lng, lat], (status, result) => {
    const addr = status === 'complete' && result.regeocode
      ? result.regeocode.formattedAddress
      : '未解析到地址'
    saveLocation(lng, lat, addr)
  })
}

// 🔍 地址搜索
function search() {
  if (!keyword.value.trim()) return
  placeSearch.search(keyword.value, (status, result) => {
    if (status === 'complete' && result.poiList.pois.length) {
      const poi = result.poiList.pois[0]
      const { lng, lat } = poi.location
      const addr = `${poi.name} · ${poi.address}`
      saveLocation(lng, lat, addr)
      // 重新初始化地图（或直接移动）
      marker.setPosition([lng, lat])
      map.setCenter([lng, lat])
    } else {
      placeName.value = '未找到相关地址'
    }
  })
}

// 🚀 组件挂载
onMounted(() => {
  window._AMapSecurityConfig = { securityJsCode: 'cf0ab58ec640de4f61d31f8fe75151e0' }

  AMapLoader.load({
    key: 'fb9a8e51b905bc1aebd376fd86a8d557',
    version: '2.0',
    plugins: ['AMap.Geocoder', 'AMap.PlaceSearch', 'AMap.Geolocation',
      'AMap.ToolBar','AMap.Scale','AMap.ControlBar','AMap.HawkEye','AMap.MapType'
    ]
  }).then(AM => {
    AMap = AM
    geocoder = new AMap.Geocoder()
    placeSearch = new AMap.PlaceSearch({ pageSize: 1, pageIndex: 1 })

    // 1. 尝试从 localStorage 加载
    const saved = loadLocationFromStorage()
    if (saved) {
      initMapAndMarker(saved)
    } else {
      autoLocate(AM)
    }
  }).catch(e => {
    console.error('高德地图加载失败', e)
    placeName.value = '地图加载失败'
  })
})
</script>

<style scoped>
.search-bar {
  display: flex;
  margin-bottom: 6px;
}

.search-bar input {
  flex: 1;
  padding: 4px 6px;
}

.search-bar button {
  margin-left: 6px;
}

.map-container {
  width: 100%;
  height: 500px;
  /* 电脑端更舒展 */
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #ebeef5;
}

.info {
  margin-top: 6px;
  font-size: 13px;
}

.map-edit-wrapper {
  display: flex;
  justify-content: center;
  padding: 24px 16px;
}

.map-box {
  width: 80%;
  max-width: 900px;
  /* 防止在超宽屏上过宽 */
}
</style>