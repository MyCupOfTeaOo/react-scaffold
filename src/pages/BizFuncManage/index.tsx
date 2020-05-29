import React from 'react';
import { RouteProps } from '@/typings';
import styles from './styles.scss';

export interface BizFuncManageProps extends RouteProps {}

const BizFuncManage: React.FC<BizFuncManageProps> = props => {
  return <div className={styles.layout}>{props.children}</div>;
};

export default BizFuncManage;
