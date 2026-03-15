import AMapLoader from '@amap/amap-jsapi-loader'

//地图带定位
export function getAMap() {
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
}

// 新增定位函数：获取当前位置信息
export async function getCurrentLocation() {
  try {
    const AMap = await getAMap()
    return new Promise((resolve, reject) => {
      const geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, // 高精度定位
        timeout: 10000, // 超时时间
        buttonPosition: 'RB' // 定位按钮位置
      })

      geolocation.getCurrentPosition((status, result) => {
        if (status === 'complete') {
          // 定位成功，解析地址信息
          resolve({
            success: true,
            position: {
              lat: result.position.lat,
              lng: result.position.lng
            },
            address: result.formattedAddress || '未知位置'
          })
        } else {
          // 定位失败
          reject({
            success: false,
            message: `定位失败: ${result.message}`
          })
        }
      })
    })
  } catch (error) {
    return {
      success: false,
      message: `地图加载失败: ${error.message}`
    }
  }
}
//经纬度 → 街道名称（逆地理）
/**
 * 把 { lat, lng } 转成人类可读的地址
 * @param {{lat:number, lng:number}} pos
 * @returns {Promise<{addr:string, road:string}>}
 */
export async function lnglat2Address({ lat, lng }) {
  const geocoder = new AMap.Geocoder({ radius: 300, extensions: 'all' })
  return new Promise((resolve, reject) => {
    geocoder.getAddress([lng, lat], (status, result) => {
      if (status === 'complete') {
        const addr = result.regeocode.formattedAddress
        const road = result.regeocode.addressComponent.streetNumber?.street // 街道名
        resolve({ addr, road })
      } else {
        reject('逆地理失败')
      }
    })
  })
}
//街道名称 → 经纬度（地理编码）
/**
 * 把“北京市朝阳区阜通东大街6号”转成坐标
 * @param {string} address
 * @param {string} [city=''] 指定城市可提升精度
 * @returns {Promise<{lat:number, lng:number}>}
 */
export async function address2Lnglat(address) {
  const geocoder = new AMap.Geocoder({ city: '湖南省张家界市永定区大庸桥街道吉首大学张家界校区(南门)吉首大学(张家界校区)' }) // 限定城市可提升精度
  return new Promise((resolve, reject) => {
    geocoder.getLocation(address, (status, result) => {
      if (status === 'complete' && result.geocodes.length) {
        const { lng, lat } = result.geocodes[0].location
        resolve({ lat, lng })
      } else {
        reject('地理编码失败')
      }
    })
  })
}
/**
 * 关键词模糊搜索 → 返回带坐标的候选数组
 * @param {string} keyword
 * @param {string} [city='全国']
 * @returns {Promise<Array<{name:string, district:string, lat:number, lng:number}>>}
 */
export async function searchKeyword(keyword) {
  const auto = new AMap.Autocomplete({ city: '全国' })
  return new Promise(resolve => {
    auto.search(keyword, (status, result) => {
      if (status === 'complete') {
        const list = result.tips.map(t => ({
          name: t.name,
          district: t.district,
          lat: t.location?.lat,
          lng: t.location?.lng
        }))
        resolve(list)   // 数组，直接绑 select / dropdown
      } else {
        resolve([])
      }
    })
  })
}