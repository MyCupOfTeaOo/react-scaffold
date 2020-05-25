import request from '@/utils/request';
import { enableState } from '@/constant';
import Axios, { CancelToken } from 'axios';

export function findAllByDictTypeEnable(
  dictType: string,
  cancelToken?: CancelToken,
  queryAll: boolean = false,
) {
  return request.post(
    '/config/dict/common/findAllByDictTypeEnable',
    {},
    {
      params: {
        dictType,
        queryAll,
      },
      cancelToken,
    },
  );
}

export function switchCommonDict(id: string, enable: enableState) {
  return request.post(
    '/config/dict/common/switch',
    {},
    {
      params: {
        id,
        enable,
      },
    },
  );
}

export function getCommonDict(id: string) {
  return request.post(
    '/config/dict/common/get',
    {},
    {
      params: {
        id,
      },
    },
  );
}

export function newCommonDict() {
  return request.get('/config/dict/common/new');
}

export function addCommonDict(data: any) {
  return request.post('/config/dict/common/add', data);
}

export function updateCommonDict(data: any) {
  return request.post('/config/dict/common/update', data);
}

export const loadDict = (dictType: string) => {
  return () => {
    const { token, cancel } = Axios.CancelToken.source();
    const r = findAllByDictTypeEnable(dictType, token).then(resp => {
      if (resp.isSuccess) {
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

export function newCascadeDict() {
  return request.get('/config/dict/cascade/new');
}

export function addCascadeDict(data: any) {
  return request.post('/config/dict/cascade/add', data);
}

export function updateCascadeDict(data: any) {
  return request.post('/config/dict/cascade/update', data);
}

export function switchCascadeDict(id: string, enable: enableState) {
  return request.post(
    '/config/dict/cascade/switch',
    {},
    {
      params: {
        id,
        enable,
      },
    },
  );
}

export function getCascadeDict(id: string) {
  return request.post(
    '/config/dict/cascade/get',
    {},
    {
      params: {
        id,
      },
    },
  );
}

export function findByFather(
  dictType: string,
  fatherCode?: string,
  cancelToken?: CancelToken,
) {
  return request.post(
    '/config/dict/cascade/findByFather',
    {},
    {
      params: {
        fatherCode,
        dictType,
      },
      cancelToken,
    },
  );
}

export function findAllCascaderByDictTypeEnable(
  dictType: string,
  cancelToken?: CancelToken,
  queryAll: boolean = false,
) {
  return request.get('/config/dict/cascade/findByDictType', {
    params: {
      dictType,
      queryAll,
    },
    cancelToken,
  });
}

export function findCascaderByDictCodeAndDictType(
  dictType: string,
  dictCode: string,
  cancelToken?: CancelToken,
) {
  return request.post(
    '/config/dict/cascade/findByDictCodeAndDictType',
    {},
    {
      params: {
        dictCode,
        dictType,
      },
      cancelToken,
    },
  );
}
export const loadChildDict = (dictType: string) => {
  return (fatherCode?: string) => {
    const { token, cancel } = Axios.CancelToken.source();
    const r = findByFather(dictType, fatherCode, token).then(resp => {
      if (resp.isSuccess) {
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
    const { token, cancel } = Axios.CancelToken.source();
    const r = findAllCascaderByDictTypeEnable(dictType, token).then(resp => {
      if (resp.isSuccess) {
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
