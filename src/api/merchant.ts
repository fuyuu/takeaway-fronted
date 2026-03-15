//API呢是我们用来存放和我们后端对接接口
import request from '@/utils/request'

//登录注册忘记密码发送验证码
export const getMerchantList=()=>{ 
  return request.get('merchant/list');
}
// 所有商家列表 + 所有spu
export const getMerchantWithSpuList=()=>{ 
  return request.get('merchant/list-with-dishes');
}
export const getMerchantListByCategory=(categoryId)=>{ 
  return request.get(`merchant/list-with-category/${categoryId}`);
}

// 单一商家详情 + 所有spu
export const getMerchantWithSpuOne=(id)=>{ 
  return request.get(`merchant/${id}/spu`);
}