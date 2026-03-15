//API呢是我们用来存放和我们后端对接接口
import request from '@/utils/request'

export const getSkuBySpuId=(spuId)=>{ 
  return request.get(`/dish/spu/${spuId}/sku`);
}
