import React from 'react';
import { MenuItemProps } from './typings';
import styles from './index.scss';

const MenuItem: React.FC<MenuItemProps> = props => {
  const keyshort = props.role.charAt(0).toUpperCase();
  return (
    <div
      className={styles.menuItem}
      aria-label={props.label}
      aria-haspopup={props.subMenu ? 'true' : 'false'}
      aria-keyshortcuts={`Alt+${keyshort}`}
    >
      <span className={styles.menuItemLabel}>{props.label}</span>
      <span className={styles.menuItemAccelerator}>
        {props.accelerator?.join(' ')}
      </span>
      <span className={styles.subMenu} />
    </div>
  );
};

export default MenuItem;
