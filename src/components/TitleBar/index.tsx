import React from 'react';
import Title from './Title';
import styles from './index.scss';
import Control from './Control';
import MenuBar from './MenuBar';
import { MenuButtonConfig } from './typings';
import { useAccelerator } from './hooks';

interface TitleBar {
  logo?: string;
  menus?: MenuButtonConfig[];
}

const TitleBar: React.FC<TitleBar> = ({ logo, menus = [] }) => {
  useAccelerator(menus);
  return (
    <div className={styles.container}>
      <div className={styles.drag} />
      <div className={styles.logo}>
        <img alt="" src={logo} />
      </div>
      <MenuBar menus={menus} />
      <Title />
      <Control />
    </div>
  );
};

export default TitleBar;
