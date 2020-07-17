import React from 'react';
import { MenuItemProps } from './typings';
import styles from './index.scss';

const MenuItem: React.FC<MenuItemProps> = props => {
  return (
    <div className={styles.menuItem}>
      <div className={styles.menuItemLabel}>{props.label}</div>
      <div className={styles.menuItemAccelerator}>{props.accelerator}</div>
      {props.type === 'submenu' && <div className="" />}
    </div>
  );
};

export default MenuItem;
