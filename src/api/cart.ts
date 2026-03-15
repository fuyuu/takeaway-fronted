//API呢是我们用来存放和我们后端对接接口
import request from '@/utils/request'
export interface Cart {
  id: number;
  quantity: number;
  skuId: number;
}
//添加至购物车
export const addCart = (spuId: number, skuId: number, qty = 1) => {
  return request.post('cart/add', { spuId, skuId, quantity: qty });
};
//购物车删除
export const deleteCart=(id: number)=>{ 
  return request.delete(`cart/${id}`);
}
//购物车修改
export const updateCart=(id: number, qty: number)=>{ 
  return request.put(`cart/${id}`,{ id, quantity: qty });
}
//购物车列表
export const getCartList=(id: any)=>{ 
  return request.get(`cart/list/${id}`);
}
export const deleteALLCart=()=>{ 
  return request.delete(`cart`);
}