import request, { ReqResponse } from '@/utils/request';
import Axios, { CancelToken } from 'axios';

export async function getGuestUid(): Promise<ReqResponse> {
  return request.get('/user/auth/getGuestUid');
}

export async function getMenuData(): Promise<ReqResponse> {
  return request.get(`/permission/api/SysRole2menu/getMenus`);
}

export async function getRoleTreeList(
  cancelToken?: CancelToken,
): Promise<ReqResponse> {
  return request.post(
    `/permission/api/SysRole/getRoleTreeList`,
    {},
    {
      cancelToken,
    },
  );
}

export const loadRoleList = () => {
  const { token, cancel } = Axios.CancelToken.source();
  const r = getRoleTreeList(token).then(resp => {
    if (resp.isSuccess) {
      if (Array.isArray(resp.data)) {
        return resp.data.map(item => ({
          label: item.roleName,
          value: item.roleCode,
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

export async function getOprs(menuId: string): Promise<ReqResponse> {
  return request.post(
    `/permission/api/SysRole2menu/getOprs`,
    {},
    {
      params: {
        menuId,
      },
    },
  );
}
