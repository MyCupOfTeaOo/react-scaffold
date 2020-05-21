import React, { useEffect, useState } from 'react';
import { Spin, Layout, Modal } from 'antd';
import { MenuFoldOutlined } from '@ant-design/icons';
import Redirect from 'umi/redirect';
import { inject, observer } from 'mobx-react';
import { getMenuData } from '@/service/permission';
import pages from '@/pages/.pages';
import { getToken } from '@/utils/authority';
import { GenRoutes } from '@/utils/utils';
import Menu from '@/components/Menu';
import MyBreadcrumb from '@/components/Header/MyBreadcrumb';
import Header from '@/components/Header/Header';
import logo from '@/assets/logo.png';
import { RouteProps } from '@/typings';
import Global from '@/stores/Global';
import User from '@/stores/User';
import { projectName } from '#/projectConfig';
import styles from './index.scss';

const { Sider, Content } = Layout;
const rootIndex = window?.g_routes?.findIndex(item => item.path === '/');
const index = window?.g_routes[rootIndex]?.routes?.findIndex(
  item => item.path === '/',
) as number;

const BasicLayout: React.FC<RouteProps & {
  global: Global;
  user: User;
}> = props => {
  const [loading, setloading] = useState(true);
  useEffect(() => {
    if (!getToken()) return;
    getMenuData()
      .then(resp => {
        if (resp.isSuccess) {
          if (window.g_routes[rootIndex]?.routes?.[index]?.routes) {
            const [routes, menuId2Url] = GenRoutes(resp.data, pages);
            props.global.setMenuId2Url(menuId2Url);
            window.g_routes[rootIndex]?.routes?.[index]?.routes?.splice(
              0,
              0,
              ...routes,
            );
          }
          window.oldRender();
        } else {
          Modal.error({
            title: '加载菜单失败,请刷新页面',
            content: resp.msg,
          });
        }
      })
      .catch(err => {
        if (err) {
          Modal.error({
            title: '服务器连接异常',
            content: '加载菜单失败,请刷新页面',
          });
          console.error(err);
        }
      })
      .finally(() => {
        setloading(false);
      });
    return () => {
      if (
        window.g_routes[rootIndex].routes?.[index].routes?.length &&
        (window.g_routes[rootIndex].routes?.[index].routes?.length || 0) > 0
      ) {
        window.g_routes[rootIndex].routes?.[index].routes?.splice(
          0,
          window.g_routes[rootIndex].routes?.[index].routes?.length,
        );
      }
    };
  }, []);
  useEffect(() => {
    return () => {
      // 清除权限缓存,防止切换用户
      props.global.clearMenuId2Oprs();
    };
  }, []);
  const routes = window.g_routes[rootIndex].routes?.[index]?.routes || [];

  if (!getToken()) {
    return <Redirect push to={`/sign/signIn?${props.location.search}`} />;
  }
  if (loading) {
    return (
      <Spin size="large">
        <div className={styles.normal} />
      </Spin>
    );
  }

  if (!props.user.user) {
    return (
      <Spin size="large" tip="加载中...">
        <div className={styles.normal} />
      </Spin>
    );
  }
  return (
    <Layout className={styles.normal}>
      <Header
        logo={logo}
        title={projectName}
        // getNode={() => document.getElementById('layout') as HTMLElement}
      />
      <Layout id="layout">
        <Sider
          className={styles.sider}
          collapsedWidth={0}
          collapsible={props.global.collapsed}
          collapsed={props.global.collapsed}
          onCollapse={() => {
            props.global.setCollapsed(!props.global.collapsed);
          }}
        >
          <div
            title="收缩菜单"
            className={styles.trigger}
            onClick={() => {
              props.global.setCollapsed(!props.global.collapsed);
            }}
          >
            <span className={styles.text}>收缩菜单</span>&nbsp;
            <MenuFoldOutlined />
          </div>
          <Menu
            name={projectName}
            logo={logo}
            routes={routes}
            path={props.location.pathname}
          />
        </Sider>
        <Layout>
          <MyBreadcrumb routes={routes} location={props.location} />
          <Content className={styles.content}>{props.children}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default inject('global', 'user')(observer(BasicLayout));
