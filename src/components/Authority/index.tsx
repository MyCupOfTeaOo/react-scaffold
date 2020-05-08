import React, { useEffect, useContext } from 'react';
import { observer } from 'mobx-react';
import { Circle } from 'teaness';
import lodash from 'lodash';
import rootStore from '@/stores';
import { AuthContext } from './context';
import { bindMenuId } from './decorator';

/* eslint-disable no-param-reassign */

interface AuthorityProps {
  menuId?: string;
  operate?: string;
  /**
   * 无权限时替换的组件
   */
  alert?: React.ReactNode;
  children?: React.ReactNode | ((hasAuth: boolean) => React.ReactNode);
}

interface UseAuthorityOptions {
  menuId?: string;
}

type AuthRes = 'access' | 'noAccess' | 'loading' | 'error';

export function useAuthority(
  operate?: string,
  options?: UseAuthorityOptions,
): AuthRes;

export function useAuthority(
  operate?: string[],
  options?: UseAuthorityOptions,
): {
  [key: string]: AuthRes;
};

/**
 * 使用的组件需要配合 observer
 * @param options
 */
export function useAuthority(
  operate?: string | string[],
  options?: UseAuthorityOptions,
) {
  const context = useContext(AuthContext);
  const menuId = options?.menuId || context.menuId;
  useEffect(() => {
    if (menuId) rootStore.global.setMenuIdOprs(menuId);
  }, []);
  if (!operate) return 'access';
  const operates = menuId ? rootStore.global.menuId2Oprs[menuId] : undefined;
  if (Array.isArray(operate)) {
    if (Array.isArray(operates)) {
      return operate.reduce<{
        [key: string]: AuthRes;
      }>((authMap, curOpr) => {
        const hasAuth = operates.findIndex(item => item === curOpr) > -1;
        if (hasAuth) {
          // 有权限
          authMap[curOpr] = 'access';
        } else {
          // 无权限
          authMap[curOpr] = 'noAccess';
        }
        return authMap;
      }, {});
    } else if (operates === 'loading') {
      return operate.reduce<{
        [key: string]: AuthRes;
      }>((authMap, curOpr) => {
        authMap[curOpr] = 'loading';
        return authMap;
      }, {});
    } else if (operates === 'error') {
      return operate.reduce<{
        [key: string]: AuthRes;
      }>((authMap, curOpr) => {
        authMap[curOpr] = 'error';
        return authMap;
      }, {});
    } else {
      return operate.reduce<{
        [key: string]: AuthRes;
      }>((authMap, curOpr) => {
        authMap[curOpr] = 'loading';
        return authMap;
      }, {});
    }
  } else if (Array.isArray(operates)) {
    const hasAuth = operates.findIndex(item => item === operate) > -1;

    if (hasAuth) {
      // 有权限
      return 'access';
    } else {
      // 无权限
      return 'noAccess';
    }
  } else if (operates === 'loading') {
    return 'loading';
  } else if (operates === 'error') {
    return 'error';
  } else {
    return 'loading';
  }
}

const Authority: React.FC<AuthorityProps> & {
  bindMenuId: typeof bindMenuId;
} = props => {
  const context = useContext(AuthContext);
  const menuId = props.menuId || context.menuId;
  useEffect(() => {
    if (menuId) rootStore.global.setMenuIdOprs(menuId);
  }, []);

  // 没有传递操作 直接显示
  if (!props.operate) return <React.Fragment>{props.children}</React.Fragment>;

  const operates = menuId ? rootStore.global.menuId2Oprs[menuId] : undefined;
  if (Array.isArray(operates)) {
    const hasAuth = operates.findIndex(item => item === props.operate) > -1;
    if (lodash.isFunction(props.children)) {
      return <React.Fragment>{props.children(hasAuth)}</React.Fragment>;
    }
    if (hasAuth) {
      // 有权限
      return <React.Fragment>{props.children}</React.Fragment>;
    } else {
      // 无权限
      return <React.Fragment>{props.alert}</React.Fragment>;
    }
  } else if (operates === 'loading') {
    return (
      <Circle
        style={{
          width: '2rem',
        }}
      />
    );
  } else if (operates === 'error') {
    // 加载失败
    return <React.Fragment />;
  } else {
    return (
      <Circle
        style={{
          width: '2rem',
        }}
      />
    );
  }
};

Authority.bindMenuId = bindMenuId;

export default observer(Authority);
