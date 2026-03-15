//API呢是我们用来存放和我们后端对接接口
import request from '@/utils/request'
//定义返回的数据类型
export type Result<T=string>={
  code:number;
  msg:T;
  data:string;
  total:string;
}
//定义传输过去的参数
export type LoginFormDTO={
  id?:string;
  username:string;
  nickname?:string;
  password?:string;
  email?:string;
  code?:string;
  passwordConfirm?: string;
  avatar?: string;
  role?: number;
}
export type UserInfo={
  id:string;
  username:string;
  email:string;
  avatar:string;
  nickname:string;
  role?: number;
}

//登录注册忘记密码发送验证码
export const login=(loginInfo:LoginFormDTO)=>{
  return request.post('user/login',loginInfo);
}
export const register=(loginInfo:LoginFormDTO)=>{
  return request.post('user/register',loginInfo);
}
export const forget=(loginInfo:LoginFormDTO)=>{
  return request.post('user/forget',loginInfo);
}
export const sendCode=(loginInfo:LoginFormDTO)=>{
  return request.post('user/send-code',loginInfo);
}
export const getUserInfo =()=>{
  return request.get<Result<UserInfo>>('user/userinfo');
}
export const updateUserInfo=(loginInfo:LoginFormDTO)=>{
  return request.post('user/edit',loginInfo);
}
// export const updateAvatar =(formData)=>{
//   return request.post('user/avatar',{
//     data: formData,
//      headers: {
//       'Content-Type': 'multipart/form-data'
//     }
//   });
// }
export const updateAvatar = (formData) => {
  return request.post('/user/avatar', formData); // ✅ 不要加 headers
};
export const updatePassword = (data) => {
  return request.post('/user/update-password', data); 
};