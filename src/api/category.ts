import request from '@/utils/request';

/** 获取商家分类列表 */
export function getCategoryList(merchantId: number) {
  return request({
    url: '/category/list',
    method: 'get',
    params: { merchantId },
  });
}
/** 首页 获取美食分类分类列表 */
export function getCategoryMerchant() {
  return request({
    url: '/category/list-merchant',
    method: 'get',
  });
}
export function getCategoryFood(id){
  return request.get(`/category/list-food/${id}`)
}
export const addCart = (spuId: number, skuId: number, qty = 1) => {
  return request.post('cart/add', { spuId, skuId, quantity: qty });
};
//购物车删除
export const getCategory=(id: number)=>{ 
  return request.delete(`cart/${id}`);
}
