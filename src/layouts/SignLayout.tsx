import React from 'react';
import { Redirect } from 'umi';
import { RouteProps } from '@/typings';
import { getToken } from '@/utils/authority';
import styles from './index.scss';
import { projectName } from '#/projectConfig';

export interface SignLayoutProps extends RouteProps {}

const SignLayout: React.FC<SignLayoutProps> = props => {
  if (getToken()) return <Redirect to="/" />;
  return (
    <div className={styles.sign}>
      <header className={styles.header} />
      <div className={styles.title}>
        <h1>{projectName}</h1>
      </div>
      {props.children}
    </div>
  );
};

export default SignLayout;
