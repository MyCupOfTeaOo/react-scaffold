import React from 'react';
import { Icon } from 'antd';
import { GlobalFooter } from 'teaness';
import { Redirect } from 'umi';
import { RouteProps } from '@/typings';
import { getToken } from '@/utils/authority';
import styles from './index.scss';
import { copyright, projectName } from '#/projectConfig';

const Copyright: React.FC<{ text?: string }> = ({ text }) => (
  <React.Fragment>
    <div style={{ color: 'white' }}>
      Copyright <Icon type="copyright" /> {text}
    </div>
  </React.Fragment>
);

export interface SignLayoutProps extends RouteProps {}

const SignLayout: React.FC<SignLayoutProps> = props => {
  if (getToken()) return <Redirect to="/" />;
  return (
    <div className={styles.sign}>
      <h1 className={styles.title}>{projectName}</h1>
      {props.children}
      <GlobalFooter copyright={<Copyright text={copyright} />} />
    </div>
  );
};

export default SignLayout;
