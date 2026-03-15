//API呢是我们用来存放和我们后端对接接口
import request from '@/utils/request'
import { Address } from '@/types/Address';

//登录注册忘记密码发送验证码
export const addAddress=(data:Address)=>{
  return request.post('address/create',data);
}
export const deleteAddress=(id:number)=>{
  return request.delete(`address/${id}`);
}
export const getAddress=(id:number)=>{
  return request.get(`address/${id}`);
}
export const getAddressList=()=>{
  return request.get('address');
}
export const updateAddress=(data:Address)=>{
  return request.put('address/update',data);
}
// ${id}  前端传输路径变量就要加上``还要${}
export const setTopAddress=(id:number)=>{
  return request.post(`address/top/${id}`);
}