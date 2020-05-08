import React, { useState, useEffect, useCallback } from 'react';
import Link from 'umi/link';
import { Menu as AMenu } from 'antd';
import { GRoute } from '@/typings';
import { isInboundLink } from '@/utils/utils';

import rootStore from '@/stores';
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

export function getSelectPath(path: string): string {
  if (Object.values(rootStore.global.menuId2Url).some(item => item === path)) {
    return path;
  } else {
    const newPaths = path.split('/');
    if (newPaths.length < 2) return path;
    return getSelectPath(newPaths.splice(0, newPaths.length - 1).join('/'));
  }
}

const Menu: React.FC<MenuType> = props => {
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [rootSubmenuKeys, setRootSubmenuKeys] = useState<string[]>([]);
  const [item, setItem] = useState<JSX.Element[]>([]);
  useEffect(() => {
    setRootSubmenuKeys(getAllRootPath(props.routes));
    setItem(menuItem(props.routes));
  }, [props.routes]);
  useEffect(() => {
    setOpenKeys(getPathAllRoot(props.path));
    setSelectedKeys([getSelectPath(props.path)]);
  }, [props.path]);

  const onOpenChange = useCallback(
    (keys: string[]) => {
      setOpenKeys(preOpenKeys => {
        const latestOpenKey = keys.find(
          key => preOpenKeys.indexOf(key) === -1,
        ) as string;
        if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
          return keys;
        } else {
          return latestOpenKey
            ? keys
                .filter(key => latestOpenKey.indexOf(key) !== -1)
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
    <React.Fragment>
      <AMenu
        mode="inline"
        openKeys={openKeys}
        selectedKeys={selectedKeys}
        onSelect={onSelect}
        onOpenChange={onOpenChange}
      >
        {item}
      </AMenu>
    </React.Fragment>
  );
};

export default Menu;
