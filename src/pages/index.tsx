import React from 'react';

import { RouteProps } from '@/typings';

import styles from './index.scss';

const Home: React.FC<RouteProps> = () => {
  return <div className={styles.welcome}>hello world</div>;
};
export default Home;
