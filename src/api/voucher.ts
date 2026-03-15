//API呢是我们用来存放和我们后端对接接口
import request from '@/utils/request'

export const getAllVoucher=(id)=>{ 
  return request.get(`/voucher/all/${id}`);
}
export const getVoucherSeckill=(id)=>{ 
  return request.get(`/voucher/${id}`);
}
export const addVoucher=(id)=>{ 
  return request.post(`/voucher-order/${id}`);
}
export const addVoucherSeckill=(id)=>{ 
  return request.post(`/voucher-order/${id}`);
}