import { observable, flow } from 'mobx';
import { ReqResponse } from '@/utils/request';
import { respCode } from '@/constant';
import { findCascaderByDictCodeAndDictType } from '@/service/config';
import { getCascaderChain } from './utils';

export interface NodeType {
  label?: string;
  state: 'ready' | 'loading' | 'success' | 'error' | 'notFound';
  father?: NodeType;
  children: {
    [key: string]: NodeType;
  };
}

export interface CascaderCache {
  [key: string]: NodeType;
}

export class Store {
  @observable
  cascaderCache: CascaderCache = {};

  setCacheByDictTypeAndDictCode = flow(function*(
    this: Store,
    dictType: string,
    dictCode: string,
    searchFather?: boolean,
  ): any {
    if (!this.cascaderCache[dictType]) {
      this.cascaderCache[dictType] = {
        state: 'ready',
        children: {},
      };
    }
    const typeNode = this.cascaderCache[dictType];

    const chains = getCascaderChain(dictCode);
    let node: NodeType = typeNode;
    let index = 1;
    for (const code of chains) {
      if (!node.children[code]) {
        node.children[code] = {
          state: 'ready',
          children: {},
          father: node,
        };
      }
      const curNode = node.children[code];
      switch (curNode.state) {
        case 'loading':
        case 'notFound':
        case 'success':
          break;
        case 'error':
        case 'ready':
        default:
          // 加载当前节点 || 需要加载父节点
          if (index === chains.length || searchFather) {
            // 加载当前节点
            // 失败重复请求三次
            for (let i = 0; i < 3; i += 1) {
              curNode.state = 'loading';
              const resp: ReqResponse = yield findCascaderByDictCodeAndDictType(
                dictType,
                code,
              );

              if (resp.code === respCode.success) {
                if (!resp.data) {
                  curNode.state = 'notFound';
                } else {
                  curNode.state = 'success';
                  curNode.label = resp.data.dictValue;
                }
                // 中断循环
                break;
              } else {
                console.error(resp.msg);
              }
            }
            // 加载失败
            if (curNode.state === 'loading') {
              curNode.state = 'error';
            }
          }

          break;
      }
      node = node.children[code];
      index += 1;
    }
  });
}
const store = new Store();
export default store;
