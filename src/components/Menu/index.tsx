import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'umi/link';
import { Menu as AMenu } from 'antd';
import { observer } from 'mobx-react';
import stores from '@/stores';
import { GRoute } from '@/typings';
import { isInboundLink } from '@/utils/utils';
import { getToken } from '@/utils/authority';
import './styles.scss';

export interface MenuType {
  routes: GRoute[];
  path: string;
  logo: string;
  name: string;
}

export const urlTemplateRegex = /\${.+?}/g;

export const urlTemplateInject = (url: string) => {
  const urlTemplateInjectObj: {
    [key: string]: any;
  } = {
    token: getToken(),
  };
  return url.replace(urlTemplateRegex, substring => {
    const target = substring.substring(2, substring.length - 1);
    return urlTemplateInjectObj[target] || substring;
  });
};

export const menuItem = (routes: GRoute[]) => {
  return routes
    .filter(route => !!route.menuId && route.isMenu)
    .map(route => {
      if (
        Array.isArray(route.routes) &&
        route.routes.length > 1 &&
        route.routes.filter(item => item.isMenu).length > 0
      ) {
        return (
          <AMenu.SubMenu key={route.path} title={route.title}>
            {menuItem(route.routes)}
          </AMenu.SubMenu>
        );
      }
      const path = route.path as string;
      const link = !isInboundLink.test(path) ? (
        <Link to={path}>{route.title}</Link>
      ) : (
        <a
          href={urlTemplateInject(path)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {route.title}
        </a>
      );
      return <AMenu.Item key={route.path}>{link}</AMenu.Item>;
    });
};

export const getAllRootPath = (routes: GRoute[]): string[] => {
  const array = [];
  for (const route of routes) {
    if (route.path && Array.isArray(route.routes) && route.routes.length > 0) {
      array.push(route.path);
      for (const key of getAllRootPath(route.routes)) {
        array.push(key);
      }
    }
  }
  return array;
};

export function getPathAllRoot(path: string): string[] {
  const pathArray = path.split('/');
  return pathArray
    .map((item, index, array) => array.slice(0, index + 1).join('/'))
    .splice(1);
}

export function filterNotChildPath(
  paths: string[],
  routes: GRoute[],
): string[] {
  let node = routes;
  const nextPaths: string[] = [];
  for (const path of paths) {
    const nextNode = node.find(
      route =>
        route.path === path &&
        route.isMenu &&
        route.routes?.some(item => item.isMenu),
    )?.routes;
    if (!nextNode) {
      break;
    }
    node = nextNode;
    nextPaths.push(path);
  }
  return nextPaths;
}

export function getUrlMap(
  urlMap: { [key: string]: boolean } = {},
  routes?: GRoute<{
    [key: string]: any;
  }>[],
) {
  routes?.forEach(route => {
    // eslint-disable-next-line
    if (route.path && route.isMenu) urlMap[route.path] = true;
    getUrlMap(urlMap, route.routes);
  });
  return urlMap;
}

export function getSelectPath(
  urlMap: { [key: string]: boolean } = {},
  path: string,
): string {
  if (urlMap[path]) {
    return path;
  } else {
    const newPaths = path.replace(/\/(?=.)/g, '//').split(/\/(?!\/)/g);
    if (newPaths.length < 2) return path;
    return getSelectPath(
      urlMap,
      newPaths.splice(0, newPaths.length - 1).join(''),
    );
  }
}

const Menu: React.FC<MenuType> = props => {
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [rootSubmenuKeys, setRootSubmenuKeys] = useState<string[]>([]);
  const [item, setItem] = useState<JSX.Element[]>([]);
  const urlMap = useMemo<{ [key: string]: boolean }>(() => {
    return getUrlMap({}, props.routes);
  }, [props.routes]);
  useEffect(() => {
    setRootSubmenuKeys(getAllRootPath(props.routes));
    setItem(menuItem(props.routes));
  }, [props.routes]);
  useEffect(() => {
    setOpenKeys(filterNotChildPath(getPathAllRoot(props.path), props.routes));
    setSelectedKeys([getSelectPath(urlMap, props.path)]);
  }, [props.path, props.routes]);

  const onOpenChange = useCallback(
    (keys: React.ReactText[]) => {
      if (stores.global.collapsed) return;
      setOpenKeys(preOpenKeys => {
        const theKeys = keys as string[];
        const latestOpenKey = theKeys.find(
          key => preOpenKeys.indexOf(key) === -1,
        ) as string;
        if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
          return theKeys;
        } else {
          return latestOpenKey
            ? theKeys
                .filter(
                  key =>
                    latestOpenKey.indexOf(key) !== -1 ||
                    key.indexOf(latestOpenKey) !== -1,
                )
                .filter(key => key !== latestOpenKey)
                .concat([latestOpenKey])
            : [];
        }
      });
    },
    [rootSubmenuKeys],
  );
  const onSelect = useCallback(({ selecteds }) => {
    setSelectedKeys(selecteds);
  }, []);
  return (
    <AMenu
      mode="inline"
      openKeys={openKeys}
      selectedKeys={selectedKeys}
      onSelect={onSelect}
      onOpenChange={onOpenChange}
    >
      {!stores.global.collapsed && item}
    </AMenu>
  );
};

export default observer(Menu);
