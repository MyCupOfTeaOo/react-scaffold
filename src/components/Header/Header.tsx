import React from 'react';
import { Layout } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { inject, observer } from 'mobx-react';
import { Link } from 'umi';
import { clearToken } from '@/utils/authority';
import User from '@/stores/User';
import Global from '@/stores/Global';
import { getLoginWindow } from '@/utils/window';
import stores from '@/stores';
import { projectName } from '#/projectConfig';
import styles from './header.scss';

interface HeaderProps {
  getNode?: () => HTMLElement;
  user: User['user'];
  clearUser: User['clearUser'];
  logo?: string;
  global: Global;
}

const Header: React.FC<HeaderProps> = ({ logo }) => {
  return (
    <Layout.Header className={styles.header}>
      <Link to="/">
        <div className={styles.logo}>
          {logo && <img src={logo} alt="logo" />}
          <h1>{projectName}</h1>
        </div>
      </Link>

      <div className={styles.menu}>
        <div
          className={styles.icon}
          onClick={() => {
            clearToken();
            stores.user.clearUser();
            getLoginWindow();
          }}
        >
          <LogoutOutlined />
          <span>退出登录</span>
        </div>
      </div>
    </Layout.Header>
  );
};

export default inject(({ user }) => ({
  user: user.user,
  clearUser: user.clearUser,
}))(observer(Header));
