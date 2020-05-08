import { CancelToken } from 'umi-request';
import { stringify } from 'querystring';
import request, { ReqResponse } from '@/utils/request';
import { respCode, enableState } from '@/constant';

export async function findAllByDictTypeEnable(
  dictType: string,
  cancelToken?: CancelToken,
  queryAll: boolean = false,
): Promise<ReqResponse> {
  return request.post('/config/dict/common/findAllByDictTypeEnable', {
    data: stringify({
      dictType,
      queryAll,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    cancelToken,
  });
}

export async function switchCommonDict(
  id: string,
  enable: enableState,
): Promise<ReqResponse> {
  return request.post('/config/dict/common/switch', {
    data: stringify({
      id,
      enable,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
}

export async function getCommonDict(id: string): Promise<ReqResponse> {
  return request.post('/config/dict/common/get', {
    data: stringify({
      id,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
}

export async function newCommonDict(): Promise<ReqResponse> {
  return request.get('/config/dict/common/new');
}

export async function addCommonDict(data: any): Promise<ReqResponse> {
  return request.post('/config/dict/common/add', {
    data,
  });
}

export async function updateCommonDict(data: any): Promise<ReqResponse> {
  return request.post('/config/dict/common/update', {
    data,
  });
}

export const loadDict = (dictType: string) => {
  return () => {
    const { token, cancel } = request.CancelToken.source();
    const r = findAllByDictTypeEnable(dictType, token).then(resp => {
      if (resp.code === respCode.success) {
        if (Array.isArray(resp.data)) {
          return resp.data.map(item => ({
            label: item.dictValue,
            value: item.dictCode,
          }));
        } else {
          return [];
        }
      } else {
        return Promise.reject(resp);
      }
    }) as Promise<{ label: string; value: any }[]> & {
      cancel: () => void;
    };
    r.cancel = cancel;
    return r;
  };
};

export async function newCascadeDict(): Promise<ReqResponse> {
  return request.get('/config/dict/cascade/new');
}

export async function addCascadeDict(data: any): Promise<ReqResponse> {
  return request.post('/config/dict/cascade/add', {
    data,
  });
}

export async function updateCascadeDict(data: any): Promise<ReqResponse> {
  return request.post('/config/dict/cascade/update', {
    data,
  });
}

export async function switchCascadeDict(
  id: string,
  enable: enableState,
): Promise<ReqResponse> {
  return request.post('/config/dict/cascade/switch', {
    data: stringify({
      id,
      enable,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
}

export async function getCascadeDict(id: string): Promise<ReqResponse> {
  return request.post('/config/dict/cascade/get', {
    data: stringify({
      id,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
}

export async function findByFather(
  dictType: string,
  fatherCode?: string,
  cancelToken?: CancelToken,
): Promise<ReqResponse> {
  return request.post('/config/dict/cascade/findByFather', {
    data: stringify({
      fatherCode,
      dictType,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    cancelToken,
  });
}

export async function findAllCascaderByDictTypeEnable(
  dictType: string,
  cancelToken?: CancelToken,
  queryAll: boolean = false,
): Promise<ReqResponse> {
  return request.get('/config/dict/cascade/findByDictType', {
    params: {
      dictType,
      queryAll,
    },

    cancelToken,
  });
}

export async function findCascaderByDictCodeAndDictType(
  dictType: string,
  dictCode: string,
  cancelToken?: CancelToken,
): Promise<ReqResponse> {
  return request.post('/config/dict/cascade/findByDictCodeAndDictType', {
    data: stringify({
      dictCode,
      dictType,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    cancelToken,
  });
}
export const loadChildDict = (dictType: string) => {
  return (fatherCode?: string) => {
    const { token, cancel } = request.CancelToken.source();
    const r = findByFather(dictType, fatherCode, token).then(resp => {
      if (resp.code === respCode.success) {
        if (Array.isArray(resp.data)) {
          return resp.data.map(item => ({
            label: item.dictValue,
            value: item.dictCode,
            isLeaf: !item.notLeaf,
          }));
        } else {
          return [];
        }
      } else {
        return Promise.reject(resp);
      }
    }) as Promise<{ label: string; value: string; isLeaf: boolean }[]> & {
      cancel: () => void;
    };
    r.cancel = cancel;
    return r;
  };
};

export type CasDictOption = {
  label: string;
  value: string;
  children?: CasDictOption[];
};

export function reduceCascaderDict(
  data?: [
    {
      dictValue: string;
      dictCode: string;
      notLeaf: boolean;
      fatherCode?: string;
    },
  ],
  fatherCode?: string,
): CasDictOption[] {
  return (data || [])
    .filter(item => {
      if (!fatherCode) {
        return !item.fatherCode;
      } else {
        return item.fatherCode === fatherCode;
      }
    })
    .map(item => ({
      label: item.dictValue,
      value: item.dictCode,
      children: !item.notLeaf
        ? undefined
        : reduceCascaderDict(data, item.dictCode),
    }));
}

export const loadAllDict = (dictType: string) => {
  return () => {
    const { token, cancel } = request.CancelToken.source();
    const r = findAllCascaderByDictTypeEnable(dictType, token).then(resp => {
      if (resp.code === respCode.success) {
        if (Array.isArray(resp.data)) {
          return reduceCascaderDict(
            resp.data as [
              {
                dictValue: string;
                dictCode: string;
                notLeaf: boolean;
                fatherCode?: string;
              },
            ],
          );
        } else {
          return [];
        }
      } else {
        return Promise.reject(resp);
      }
    }) as Promise<CasDictOption[]> & {
      cancel: () => void;
    };
    r.cancel = cancel;
    return r;
  };
};
