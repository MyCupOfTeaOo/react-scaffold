import { NodeType } from './store';

export const separator = '-';

export function getCascaderChain(dictCode: string): string[] {
  return dictCode.split(separator).reduce<string[]>((prev, cur) => {
    if (prev.length > 0) {
      prev.push(`${prev[prev.length - 1]}${separator || '-'}${cur}`);
    } else {
      prev.push(cur);
    }
    return prev;
  }, []);
}

export function getTarget(
  code?: string,
  node?: NodeType,
  joinFather?: boolean,
): {
  state: NodeType['state'];
  labels?: string[];
} {
  if (!code) {
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
  const chains = getCascaderChain(code);
  let curNode: NodeType = node;
  // 后面赋值是为了方便类型推断
  let next: NodeType = curNode.children[chains[0]];
  const strs: string[] = [];
  // 迭代 code 链,此处需要区分 joinFather 与 not join 的处理
  for (const i of chains) {
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
