/* eslint-disable no-nested-ternary */
import React, { useEffect } from 'react';
import { observable, flow } from 'mobx';
import { getCurrentDict, Dict } from '@/service/config';
import { ReqResponse } from '@/utils/request';
import { Circle } from 'teaness';
import { observer } from 'mobx-react';

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
    server: string,
    dictType: string,
    codes: string[],
    searchFather?: boolean,
  ): any {
    if (!this.cascaderCache[dictType]) {
      this.cascaderCache[dictType] = {
        state: 'ready',
        children: {},
      };
    }
    const typeNode = this.cascaderCache[dictType];

    let node: NodeType = typeNode;
    let index = 1;
    for (const code of codes) {
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
          if (index === codes.length || searchFather) {
            // 加载当前节点
            // 失败重复请求三次
            for (let i = 0; i < 3; i += 1) {
              curNode.state = 'loading';
              const resp: ReqResponse<Dict> = yield getCurrentDict(
                server,
                dictType,
                codes.slice(0, index).join('-'),
              );
              if (resp.isSuccess) {
                if (!resp.data) {
                  curNode.state = 'notFound';
                } else {
                  curNode.state = 'success';
                  curNode.label = resp.data.label;
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
export { store };

export function getTarget(
  codes?: string[],
  node?: NodeType,
  joinFather?: boolean,
): {
  state: NodeType['state'];
  labels?: string[];
} {
  if (!codes) {
    return {
      state: 'success',
      labels: [],
    };
  }

  if (!node) {
    return {
      state: 'loading',
    };
  }
  let curNode: NodeType = node;
  // 后面赋值是为了方便类型推断
  let next: NodeType = curNode.children[codes[0]];
  const strs: string[] = [];
  // 迭代 code 链,此处需要区分 joinFather 与 not join 的处理
  for (const i of codes) {
    next = curNode.children[i];

    if (next && joinFather) {
      switch (next.state) {
        case 'notFound':
          return {
            state: 'notFound',
          };
        case 'success':
          strs.push(next.label || '');
          break;
        case 'error':
          return {
            state: 'error',
          };
        case 'ready':
        case 'loading':
        default:
          return {
            state: 'loading',
          };
      }
    } else if (!next) {
      return {
        state: 'loading',
      };
    }
    curNode = next;
  }
  // 走完循环说明节点齐全
  // 补全not Join 时的label
  if (!joinFather) {
    if (next.state !== 'success') {
      return {
        state: next.state,
      };
    }
    strs.push(next.label || '');
  }
  return {
    state: 'success',
    labels: strs,
  };
}

export interface TransDictProps {
  /**
   * 当前字典编码
   */
  codes?: string[];
  /**
   * 字典类型
   */
  type: string;
  /**
   * 服务名
   */
  server: string;
  /**
   * 覆盖加载状态显示
   */
  loading?: React.ReactNode;
  /**
   * 覆盖查找失败显示
   */
  notFound?: React.ReactNode;
  /**
   * 查找错误显示(请求失败)
   */
  errorFound?: React.ReactNode;
  /**
   * 需要翻译父节点
   */
  joinFather?: boolean;
  /**
   * joinFather开启生效,多级翻译需要加分割符则设置
   */
  separator?: string;
  /**
   * joinFather开启生效,指定展示某级
   */
  showIndex?: number;
  /**
   * joinFather开启生效,指定展示某几级
   */
  rootIndex?: number;
  /**
   * 是否有div包装
   */
  notDiv?: boolean;
}

/* -------------------------------------------------------------------------- */
/* 如何使用见下方
<TransDict codes={需要翻译的字典编码} server="服务名" type="字典类型"/>
*/
/* -------------------------------------------------------------------------- */

const TransDict: React.FC<TransDictProps> = props => {
  const target = getTarget(
    props.codes,
    store.cascaderCache[props.type],
    props.joinFather,
  );
  useEffect(() => {
    if (props.codes && props.codes.length > 0 && props.type) {
      store.setCacheByDictTypeAndDictCode(
        props.server,
        props.type,
        props.codes,
        props.joinFather,
      );
    }
  }, [props.codes, props.type, props.joinFather]);
  switch (target.state) {
    case 'loading':
      return <span>{props.loading || props.codes?.join(props.separator)}</span>;
    case 'error':
      return (
        <span>{props.errorFound || props.codes?.join(props.separator)}</span>
      );
    case 'notFound':
      return (
        <span>{props.notFound || props.codes?.join(props.separator)}</span>
      );
    default: {
      const element =
        target.labels && target.labels.length > 0
          ? props.showIndex
            ? target.labels?.[props.showIndex] ??
              (props.notFound || props.codes?.join(props.separator))
            : target.labels
                .splice(
                  props.rootIndex || 0,
                  target.labels.length - (props.rootIndex || 0),
                )
                .join(props.separator)
          : props.notFound || props.codes?.join(props.separator);
      if (props.notDiv) return <React.Fragment>{element}</React.Fragment>;
      return <span>{element}</span>;
    }
  }
};
TransDict.defaultProps = {
  separator: '-',
  joinFather: false,
  loading: (
    <Circle
      style={{
        width: '1.5rem',
      }}
    />
  ),
};

export default observer(TransDict);
