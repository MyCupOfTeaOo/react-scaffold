/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/axios/axios
 */
import axios, {
  AxiosRequestConfig,
  AxiosPromise,
  AxiosInterceptorManager,
} from 'axios';
import * as Sentry from '@sentry/browser';
import stores from '@/stores';
import { stringify } from 'qs';
import { apiPrefix } from '#/projectConfig';
import { safeParse } from './utils';
import { getToken, clearToken } from './authority';

export enum respCode {
  success = 200,
  cancel = 0,
}

export const codeMessage: { [n: number]: string } = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '请求被禁止。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
/**
 * 异常处理程序
 */

export interface ReqResponse<T = any> {
  msg: string;
  code: number;
  isSuccess?: boolean;
  isCancel?: boolean;
  data?: T;
}

export type CancellablePromise<T> = Promise<T> & {
  cancel: (str?: string) => void;
};

const errorHandler = async (error: {
  response: Response;
  message: string | undefined;
}): Promise<ReqResponse> => {
  const { response, message } = error;
  if (response && response.status) {
    if (response.status === 403) {
      stores.user.clearUser();
      clearToken();
      window.location.href = `/sign/signIn?${stringify({
        sysId: stores.global.sysId,
      })}`;
    }
    const respText = await response.text?.();
    const respJson = safeParse(respText);
    const errortext =
      (respJson && (respJson.msg || respJson.message)) ||
      respText ||
      codeMessage[response.status] ||
      response.statusText;
    Sentry.setContext('response', response);
    Sentry.captureException(errortext);
    return {
      code: response.status,
      msg: errortext,
    };
  }
  return {
    code: respCode.cancel,
    msg: message || '',
    isCancel: true,
  };
};

type AxiosResponse<T = any> = T;

const request = axios.create({
  baseURL: `/${apiPrefix || ''}`,
}) as {
  (config: AxiosRequestConfig): AxiosPromise;
  (url: string, config?: AxiosRequestConfig): AxiosPromise;
  defaults: AxiosRequestConfig;
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>;
    response: AxiosInterceptorManager<AxiosResponse>;
  };
  getUri(config?: AxiosRequestConfig): string;
  request<T = ReqResponse, R = AxiosResponse<T>>(
    config: AxiosRequestConfig,
  ): Promise<R>;
  get<T = ReqResponse, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R>;
  delete<T = ReqResponse, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R>;
  head<T = ReqResponse, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R>;
  options<T = ReqResponse, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R>;
  post<T = ReqResponse, R = AxiosResponse<T>>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<R>;
  put<T = ReqResponse, R = AxiosResponse<T>>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<R>;
  patch<T = ReqResponse, R = AxiosResponse<T>>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<R>;
};

request.interceptors.request.use(config => {
  return {
    ...config,
    headers: {
      token: getToken(),
      ...config.headers,
    },
  };
});
request.interceptors.response.use(response => {
  return {
    ...response.data,
    isSuccess: response.data?.code === respCode.success,
  };
}, errorHandler);

export default request;
