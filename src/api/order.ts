//API呢是我们用来存放和我们后端对接接口
import request from '@/utils/request'

//下单
export const addOrder=(orderData: any)=>{
  return request.post('order/add',orderData);
}