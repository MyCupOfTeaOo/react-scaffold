import { observable, action, flow } from 'mobx';
import { message } from 'antd';
import * as Sentry from '@sentry/browser';
import { getCurUser } from '@/service/login';
import { ReqResponse } from '@/utils/request';
import { RootStore } from '.';

export interface AuthType {
  userId: string;
  userAccount: string;
  userDesc?: string;
  userSource?: string;
  userStatusCode: number;
  userStatusValue: string;
  email?: string;
  extendInfo?: string;
  gender?: string;
  lastDate?: string;
  lastIp?: string;
  lastOs?: string;
  mobile?: string;
  createTime?: string;
  creatorId?: string;
  modifierId?: string;
  modifyTime?: string;
  realName: string;
  roleCode: string;
  roleValue: string;
  siPrioUser: number;
  sysId?: string;
  tel?: string;
  deptCode?: string;
  deptId?: string;
  deptName?: string;
}

export default class User {
  rootStore: RootStore;

  @observable
  user?: AuthType;

  @observable
  loaded?: boolean = false;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @action
  clearUser = () => {
    this.user = undefined;
  };

  @action
  setUser = (user: AuthType) => {
    Sentry.setUser(user);
    this.user = user;
  };

  loadUser = flow(function*(this: User): any {
    const res = (yield getCurUser()) as ReqResponse<AuthType>;
    if (res.isSuccess) {
      this.setUser(res.data as AuthType);
    } else {
      message.error(res.msg);
    }
    this.loaded = true;
  });
}
