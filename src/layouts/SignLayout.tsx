import React, { useEffect } from 'react';
import { Redirect } from 'umi';
import { RouteProps } from '@/typings';
import { getToken } from '@/utils/authority';
import { getCurWindow } from '@/utils/window';
import styles from './index.scss';
import { projectName } from '#/projectConfig';

export interface SignLayoutProps extends RouteProps {}

const SignLayout: React.FC<SignLayoutProps> = props => {
  useEffect(() => {
    // 进入下次循环等页面渲染好了,留点时间等图片加载
    setTimeout(() => {
      getCurWindow().setOpacity(1);
    }, 100);
  }, []);
  if (getToken()) return <Redirect to="/" />;
  return (
    <div className={styles.sign}>
      <div className={styles.title}>
        <h1>{projectName}</h1>
      </div>
      {props.children}
    </div>
  );
};

export default SignLayout;
