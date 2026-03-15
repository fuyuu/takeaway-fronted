<template>
  <div>
    <div id="mapContainer" style="width: 100%; height: 400px;"></div>
    <p>当前定位：{{ location.lng }}, {{ location.lat }}</p>
    <button @click="reLocate">重新定位</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'

const location = ref({ lng: 116.397428, lat: 39.90923 }) // 默认天安门
let map = null
let marker = null

const initMap = () => {
  AMapLoader.load({
    key: '你的高德Key', // 替换为你的Key
    version: '2.0',
    plugins: ['AMap.Geolocation', 'AMap.Marker']
  }).then(AMap => {
    map = new AMap.Map('mapContainer', {
      zoom: 14,
      center: [location.value.lng, location.value.lat]
    })

    marker = new AMap.Marker({
      position: new AMap.LngLat(location.value.lng, location.value.lat),
      map: map
    })

    // 点击地图修改位置
    map.on('click', e => {
      const lnglat = e.lnglat
      location.value = { lng: lnglat.lng, lat: lnglat.lat }
      marker.setPosition(lnglat)
      map.setCenter(lnglat)
    })

    // 自动定位
    reLocate()
  }).catch(e => console.error(e))
}

const reLocate = () => {
  AMap.plugin('AMap.Geolocation', () => {
    const geolocation = new AMap.Geolocation({
      enableHighAccuracy: true,
      timeout: 10000
    })
    geolocation.getCurrentPosition((status, result) => {
      if (status === 'complete') {
        const { lng, lat } = result.position
        location.value = { lng, lat }
        marker.setPosition([lng, lat])
        map.setCenter([lng, lat])
      } else {
        alert('定位失败，请检查权限或网络')
      }
    })
  })
}

onMounted(() => {
  initMap()
})
</script>