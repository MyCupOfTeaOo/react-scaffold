import md5 from 'js-md5';
import request, { ReqResponse } from '@/utils/request';

export async function getGuestUid(): Promise<ReqResponse> {
  return request.get('/user/auth/getGuestUid');
}

export async function getCurUser(): Promise<ReqResponse> {
  return request.get('/user/auth/queryCurrentInfo');
}

export async function fakeAccountLogin({
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
}): Promise<ReqResponse> {
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

export async function forgetPassword({
  captcha,
  guestUid,
  account,
  email,
}: {
  captcha: string;
  guestUid: string;
  account: string;
  email: string;
}): Promise<ReqResponse> {
  return request.post(`/tic/ticUser/prepareRetrievePassword`, {
    headers: {
      verifyCode: captcha,
      guestUid,
    },
    params: {
      account,
      email,
    },
  });
}

export async function retrievePassword({
  token,
  password,
}: {
  token: string;
  password: string;
}): Promise<ReqResponse> {
  return request.post(`/tic/ticUser/retrievePassword`, {
    params: {
      token,
      newPassword: password,
    },
  });
}
