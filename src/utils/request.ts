/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend, RequestOptionsInit } from 'umi-request';
import axios, {
  AxiosRequestConfig,
  AxiosPromise,
  AxiosInterceptorManager,
} from 'axios';
import { stringify } from 'qs';
import stores from '@/stores';
import { apiPrefix } from '#/projectConfig';
import { respCode } from '../constant';
import { getToken, clearToken } from './authority';
import { safeParse } from './utils';

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
  data?: T;
}

const errorHandler = async (error: {
  response: Response;
  message: string | undefined;
}): Promise<ReqResponse> => {
  const { response, message } = error;
  if (response && response.status) {
    if (response.status === 403) {
      stores.user.clearUser();
      clearToken();
      // 可能是盐城的
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
    return {
      code: response.status,
      msg: errortext,
    };
  }
  return {
    code: respCode.cancel,
    msg: message || '',
  };
};

/**
 * 配置request请求时的默认参数
 */

const request = extend({
  errorHandler,
  // 默认错误处理
  prefix: apiPrefix ? `/${apiPrefix}` : undefined,

  credentials: 'include', // 默认请求是否带上cookie
});
request.use(async (ctx, next) => {
  const token = getToken();
  if (token) {
    ctx.req.options.headers = {
      ...ctx.req.options.headers,
      token,
    };
  }
  await next();
});

type AxiosResponse<T = any> = T;

const eRequest = axios.create({
  baseURL: apiPrefix ? `/${apiPrefix}` : undefined,
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
eRequest.interceptors.request.use(config => {
  return {
    ...config,
    headers: {
      ...config.headers,
      token: getToken(),
    },
  };
});
eRequest.interceptors.response.use(response => {
  return response.data;
}, errorHandler);

export function cancellableRequestPromise<T>(
  response: Promise<ReqResponse>,
  cancel: () => void,
) {
  const r = response.then(resp => {
    if (resp.code === respCode.success) {
      return resp.data;
    } else {
      return Promise.reject(resp);
    }
  }) as Promise<T> & {
    cancel: () => void;
  };
  r.cancel = cancel;
  return r;
}

export type CancellablePromise<T> = Promise<T> & {
  cancel: (str?: string) => void;
};

export function download<T = any>(
  url: string,
  options?: RequestOptionsInit & {
    filename?: string;
  },
): Promise<ReqResponse<T>> {
  return request
    .post(url, {
      ...options,
      parseResponse: false,
    })
    .then((res: Response) => {
      const disposition = res.headers.get('content-disposition');
      if (disposition) {
        const sourceFilename = /filename=(?<filename>[^;]+)/.exec(disposition)
          ?.groups?.filename;
        if (sourceFilename) {
          return res.blob().then(blob => {
            const a = document.createElement('a');
            const turl = window.URL.createObjectURL(blob);
            a.href = turl;
            a.download = options?.filename || sourceFilename;
            a.click();
            window.URL.revokeObjectURL(turl);
            return {
              msg: '下载成功',
              code: respCode.success,
            };
          });
        }
      } else {
        return res.json().then(response => {
          if (response.error) {
            return errorHandler(response);
          }
          return response;
        });
      }
    });
}

export { eRequest };
export default request;
