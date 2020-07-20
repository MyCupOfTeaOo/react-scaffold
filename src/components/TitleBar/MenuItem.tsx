import React from 'react';
import classnames from 'classnames';
import { MenuItemProps } from './typings';
import styles from './index.scss';

const MenuItem: React.FC<MenuItemProps> = props => {
  const keyshort = props.role.charAt(0).toUpperCase();
  const showSubMenu =
    props.selectedPath?.[props.depth] === props.path &&
    props.selectedPath.length > props.depth + 1 &&
    (props.subMenu?.length || 0) > 0;
  return (
    <div
      className={classnames(styles.menuItem, {
        [styles.menuItemFocus]:
          props.selectedPath?.[props.depth] === props.path,
      })}
      data-path={`${props.depth}-${props.path}`}
      aria-label={props.label}
      aria-haspopup={props.subMenu ? 'true' : 'false'}
      aria-keyshortcuts={`Alt+${keyshort}`}
    >
      <span className={styles.menuItemLabel}>
        {props.label}
        <span className={styles.keyshort}>{keyshort}</span>
      </span>
      <span className={styles.menuItemAccelerator}>
        {props.accelerator?.join(' ')}
      </span>
      {showSubMenu && props.subMenu && (
        <span className={classnames(styles.menulist, styles.subMenu)}>
          {props.subMenu.map((menu, i) => (
            <MenuItem
              {...menu}
              path={i}
              key={menu.label}
              selectedPath={props.selectedPath}
              depth={props.depth + 1}
            />
          ))}
        </span>
      )}
    </div>
  );
};

export default MenuItem;
