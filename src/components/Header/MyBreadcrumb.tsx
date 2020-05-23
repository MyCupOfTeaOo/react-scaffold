import React, { useMemo } from 'react';
import { GRoute, Location } from '@/typings';
import pathToRegexp from 'path-to-regexp';
import { Breadcrumb } from 'antd';
import classnames from 'classnames';
import { HomeOutlined } from '@ant-design/icons';
import { router } from 'umi';
import { observer } from 'mobx-react';
import stores from '@/stores';
import styles from './Breadcrumb.scss';

/* eslint-disable no-nested-ternary */

export interface BreadcrumbProps {
  routes: GRoute[];
  location: Location<
    any,
    {
      [key: string]: any;
    }
  >;
}

interface TargetRoute extends GRoute {
  father?: TargetRoute;
  notLink?: boolean;
}

export function getRouteList(
  routes: TargetRoute[],
  path: string,
  father?: TargetRoute,
): TargetRoute | undefined {
  for (const route of routes) {
    if (route.path && pathToRegexp(route.path).test(path)) {
      return {
        ...route,
        father,
      };
    } else if (route.routes) {
      const target = getRouteList(route.routes, path, {
        ...route,
        father,
      });
      if (target) return target;
    }
  }
}

export function downPath(
  routes: TargetRoute[],
  path: string,
): TargetRoute | undefined {
  const routerList = getRouteList(routes, path);
  if (routerList) return routerList;
  const paths = path.split('/');
  return downPath(routes, paths.splice(0, paths.length - 1).join('/'));
}

export function filterFather(route?: TargetRoute): TargetRoute | undefined {
  if (
    route &&
    !route.father?.routes?.some(
      itemRoute =>
        (route.father?.path === itemRoute.path ||
          `${route.father?.path}/` === itemRoute.path) &&
        !itemRoute.redirect,
    )
  ) {
    // eslint-disable-next-line
    if (route.father) route.father.notLink = true;
  }
  if (route) filterFather(route?.father);
  return route;
}

export interface BreadcrumbMap {
  name?: string;
  path?: string;
  params?: any;
  notLink?: boolean;
}

export function getBreadCrumbMaps(
  targetRoute?: TargetRoute,
  memoList: BreadcrumbMap[] = [],
): BreadcrumbMap[] {
  if (targetRoute) {
    memoList.unshift({
      name: targetRoute.title,
      path: targetRoute.path,
      params: targetRoute.params,
      notLink: targetRoute.notLink,
    });
    if (targetRoute.father) return getBreadCrumbMaps(targetRoute.father, memoList);
  }
  return memoList;
}

const MyBreadcrumb: React.FC<BreadcrumbProps> = props => {
  const breadCrumbMaps = useMemo<BreadcrumbMap[]>(() => {
    const maps = getBreadCrumbMaps(
      downPath(props.routes, props.location.pathname),
    ).filter(map => map.name);
    if (maps?.[0]?.path !== '/') {
      maps.unshift({
        path: '/',
      });
    }
    return maps;
  }, [props.routes, props.location]);
  const items = useMemo(() => {
    return breadCrumbMaps.map((breadCrumbMap, i) => (
      <Breadcrumb.Item key={breadCrumbMap.path}>
        {i === breadCrumbMaps.length - 1 ? (
          breadCrumbMap.name
        ) : i === 0 ? (
          <a
            onClick={() =>
              router.push({
                pathname: breadCrumbMap.path,
                query: breadCrumbMap.params,
              })
            }
          >
            <HomeOutlined />
          </a>
        ) : breadCrumbMap.notLink ? (
          <span>{breadCrumbMap.name}</span>
        ) : (
          <a
            onClick={() =>
              router.push({
                pathname: breadCrumbMap.path,
                query: breadCrumbMap.params,
              })
            }
          >
            {breadCrumbMap.name}
          </a>
        )}
      </Breadcrumb.Item>
    ));
  }, [breadCrumbMaps]);
  return (
    <Breadcrumb
      className={classnames(styles.breadcrumb, {
        [styles.siderZero]: stores.global.collapsed,
      })}
    >
      {items}
    </Breadcrumb>
  );
};

export default observer(MyBreadcrumb);
