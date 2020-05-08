import { CancelToken } from 'umi-request';
import { stringify } from 'querystring';
import request, { ReqResponse } from '@/utils/request';
import { respCode } from '../constant';

export async function getGuestUid(): Promise<ReqResponse> {
  return request.get('/user/auth/getGuestUid');
}

export async function getMenuData(): Promise<ReqResponse> {
  return request.get(`/permission/api/SysRole2menu/getMenus`);
}

export async function getRoleTreeList(
  cancelToken?: CancelToken,
): Promise<ReqResponse> {
  return request.post(`/permission/api/SysRole/getRoleTreeList`, {
    cancelToken,
  });
}

export const loadRoleList = () => {
  const { token, cancel } = request.CancelToken.source();
  const r = getRoleTreeList(token).then(resp => {
    if (resp.code === respCode.success) {
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
  return request.post(`/permission/api/SysRole2menu/getOprs`, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: stringify({
      menuId,
    }),
  });
}
