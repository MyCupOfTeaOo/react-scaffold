import request, { ReqResponse, CancellablePromise } from '@/utils/request';
import Axios from 'axios';

export interface Dict {
  label: string;
  value: string;
  isLeaf: boolean;
  description?: string;
  children?: Dict[];
}

export function getCurrentDict(
  server: string,
  dictType: string,
  code?: string | number,
  queryAll?: boolean,
) {
  const source = Axios.CancelToken.source();
  const req = request.get(`/${server}/dicts/${dictType}`, {
    params: { queryAll, code },
    cancelToken: source.token,
  }) as CancellablePromise<ReqResponse<Dict>>;
  req.cancel = source.cancel;
  return req;
}

export function getChildDict(
  server: string,
  dictType: string,
  code?: string | number,
  queryAll?: boolean,
) {
  const source = Axios.CancelToken.source();
  const req = request.get(`/${server}/dicts/${dictType}/children`, {
    params: { queryAll, code },
    cancelToken: source.token,
  }) as CancellablePromise<ReqResponse<Dict[]>>;
  req.cancel = source.cancel;
  return req;
}
