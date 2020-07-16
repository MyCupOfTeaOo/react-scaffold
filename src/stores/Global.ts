import { observable, action, flow } from 'mobx';
import { debounce } from 'lodash';
import { getOprs } from '@/service/permission';
import cache from '@/utils/cache';
import { ReqResponse } from '@/utils/request';
import { remote } from 'electron';
import { sysId } from '#/projectConfig';
import { RootStore } from '.';

const win = remote.getCurrentWindow();

export interface MenuId2Url {
  [key: string]: string;
}

export interface MenuId2Oprs {
  [key: string]: string[] | string;
}

export default class Global {
  rootStore: RootStore;

  @observable
  sysId = sysId;

  @observable
  isMain = true;

  @observable
  isMaximized = false;

  @observable
  menuId2Url: MenuId2Url = {};

  @observable
  menuId2Oprs: MenuId2Oprs = {};

  @observable
  collapsed: boolean = cache.getLocalCache('collapsed') ?? false;

  static triggerResizeEvent = debounce(() => {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }, 100);

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    win.on('maximize', () => {
      this.isMaximized = true;
    });
    win.on('unmaximize', () => {
      this.isMaximized = false;
    });
  }

  @action
  setCollapsed = (value: boolean) => {
    this.collapsed = value;
    cache.setLocalCache('collapsed', value);
    Global.triggerResizeEvent();
  };

  @action
  setMenuId2Url = (menuId2Url: MenuId2Url) => {
    this.menuId2Url = menuId2Url;
  };

  @action
  clearMenuId2Oprs = () => {
    this.menuId2Oprs = {};
  };

  @action
  setSysId = (newId: string) => {
    this.sysId = newId;
    this.isMain = newId === sysId;
  };

  @action
  maximize = () => {
    win.maximize();
    this.isMaximized = true;
  };

  @action
  unmaximize = () => {
    win.unmaximize();
    this.isMaximized = false;
  };

  setMenuIdOprs = flow(function*(this: Global, menuId: string): any {
    if (this.menuId2Oprs[menuId] && this.menuId2Oprs[menuId] !== 'error') {
      // 已经加载或正在加载
      return;
    } else {
      // 站位
      this.menuId2Oprs[menuId] = 'loading';
    }
    // 失败重复请求三次
    for (let i = 0; i < 3; i += 1) {
      const resp: ReqResponse = yield getOprs(menuId);
      if (resp.isSuccess) {
        if (Array.isArray(resp.data)) {
          this.menuId2Oprs[menuId] = resp.data;
        } else {
          this.menuId2Oprs[menuId] = [];
        }
        break;
      } else {
        console.error(resp.msg);
      }
    }
    // 全部失败了,loading -> error
    if (!Array.isArray(this.menuId2Oprs[menuId])) {
      this.menuId2Oprs[menuId] = 'error';
    }
  });
}
