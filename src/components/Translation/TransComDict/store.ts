import { observable, flow } from 'mobx';
import { ReqResponse } from '@/utils/request';
import { findAllByDictTypeEnable } from '@/service/config';

export interface CommonDictCache {
  [key: string]:
    | 'loading'
    | 'error'
    | 'notFound'
    | {
        [key: string]: {
          label: string;
          // 先不实现 方便以后单个加载扩展
          state: 'loading' | 'success' | 'error' | 'notFound';
        };
      };
}
export class Store {
  @observable
  commonDictCache: CommonDictCache = {};

  setCacheByDictType = flow(function*(this: Store, dictType: string): any {
    // 查询节点是在加载
    if (this.commonDictCache[dictType] === 'loading') return;
    // 加载过但是无法找到
    if (this.commonDictCache[dictType] === 'notFound') return;

    // 没有加载或加载是失败
    if (
      !this.commonDictCache[dictType] ||
      this.commonDictCache[dictType] === 'error'
    ) {
      // 开始加载
      this.commonDictCache[dictType] = 'loading';

      // 失败重复请求三次
      for (let i = 0; i < 3; i += 1) {
        const resp: ReqResponse = yield findAllByDictTypeEnable(
          dictType,
          undefined,
          true,
        );
        if (resp.isSuccess) {
          if (Array.isArray(resp.data)) {
            const temp: {
              [key: string]: {
                label: string;
                // 先不实现 方便以后单个加载扩展
                state: 'loading' | 'success' | 'error' | 'notFound';
              };
            } = {};
            resp.data.forEach(item => {
              temp[item.dictCode] = {
                label: item.dictValue,
                state: 'success',
              };
            });
            this.commonDictCache[dictType] = temp;
          } else {
            this.commonDictCache[dictType] = 'notFound';
          }
          break;
        } else {
          console.error(resp.msg);
        }
      }
      // 说明加载失败
      if (this.commonDictCache[dictType] === 'loading') this.commonDictCache[dictType] = 'error';
    }
  });
}
const store = new Store();
export default store;
