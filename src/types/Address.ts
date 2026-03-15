//定义返回的数据类型
// types/address.ts
export interface Address {
  id?: number;
  name: string;   // 收件人姓名
  email: string;  // 收件人邮箱
  location: string;
  isDefault: number;       // 1 是默认shi详细地址在的，0 没有详细地址
  userId?: number;
  createTime?: string;
  updateTime?: string;
  status?: number;         // 0正常 1删除 2异常
}

export interface AddressNode {
  code: string; // 行政区域编码（参考国家标准）
  name: string; // 区域名称（如"北京市"、"朝阳区"）
  level: number; // 层级：1-省/直辖市，2-市，3-县/区，4-镇/街道
  children?: AddressNode[]; // 子区域
}

export interface DetailedAddress {
  province: AddressNode; // 省/直辖市
  city?: AddressNode; // 市
  district?: AddressNode; // 县/区
  town?: AddressNode; // 镇/街道
  detail: string; // 详细地址（门牌号等）
}