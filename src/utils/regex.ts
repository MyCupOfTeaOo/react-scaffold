export const hasString = /\S+/;

export const uscc = /[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/;

export const forbiddenInclusiveSpace = /(^\S+.*\S+$)|(^\S+$)/;
// 正整数
export const positiveInteger = /^[1-9]\d*$/;

// 邮箱
export const email = /[\S!#$%&'*+/=?^_`{|}~-]+(?:\.[\S!#$%&'*+/=?^_`{|}~-]+)*@(?:[\S](?:[\S-]*[\S])?\.)+[\S](?:[\S-]*[\S])?/;

// 网站链接
export const url = /[a-zA-z]+:\/\/[^\s]*/;

// 身份证号
export const idCradNum = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;

// 电话号码
export const telephoneNum = /\d{3}-\d{8}|\d{4}-\{7,8}/;

// 手机号码
export const phoneNum = /^1(3|4|5|6|7|8|9)\d{9}$/;

// 有中文
export const hasChinese = /[\u4e00-\u9fa5]+/;

export const telephoneNumOrPhoneNum = /^1(3|4|5|6|7|8|9)\d{9}|\d{3}-\d{8}|\d{4}-\{7,8}$/;

export const bankCard = /^[1-9]\d{9,29}$/;

/* 基本用户名正则(
    最短6位，最长20位 {6,20}
    可以包含小写大母 [a-z] 和大写字母 [A-Z]
    可以包含数字 [0-9]
    可以包含下划线 [ _ ]
    首字母只能是大小写字母
  */
export const userName = /^[a-zA-Z0-9_]{6,20}$/;

// 名字正则表达式
export const name = /^[\u4e00-\u9fa5.·\u36c3\u4DAE]{0,}$/;
// 密码强度正则，6-20个大小写数字、英文或符号(#?!@$%^&*-)
export const password = /^[0-9a-zA-Z]{6,20}$/;

// 8-20位,必须包含大小写字母,数字,特殊符号(@$!%*?&)
export const strictPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

// 正浮点数正则
export const positiveFloatingNumber = /^\d*\.\d+$/;
// 整数浮点数(正数正则)
export const positiveIntegerAndFloatingNumber = /^\d*\.?\d+$/;

export const postCode = /^[0-9]{6}$/;

export const html_tag = /<(\/){0,1}.+?>/g;

export default {
  html_tag,
  hasString,
  forbiddenInclusiveSpace,
  positiveInteger,
  email,
  url,
  idCradNum,
  telephoneNum,
  phoneNum,
  telephoneNumOrPhoneNum,
  userName,
  name,
  password,
  positiveFloatingNumber,
  positiveIntegerAndFloatingNumber,
  postCode,
  hasChinese,
};
