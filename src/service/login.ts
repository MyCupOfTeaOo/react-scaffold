import md5 from 'js-md5';
import request from '@/utils/request';

export function getGuestUid() {
  return request.get('/user/auth/getGuestUid');
}

export function getCurUser() {
  return request.get('/user/auth/queryCurrentInfo');
}

export function fakeAccountLogin({
  captcha,
  guestUid,
  username,
  password,
  sysId,
}: {
  captcha: string;
  guestUid: string;
  username: string;
  password: string;
  sysId: string;
}) {
  return request.post(
    `/user/auth/login`,
    {},
    {
      headers: {
        verifyCode: captcha,
        guestUid,
      },

      params: {
        username,
        password: md5(password),
        sysId,
      },
    },
  );
}
