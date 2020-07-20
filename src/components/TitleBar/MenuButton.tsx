import React from 'react';
import classname from 'classnames';
import { MenuButtonProps } from './typings';
import styles from './index.scss';
import MenuItem from './MenuItem';

const MenuButton: React.FC<MenuButtonProps> = props => {
  const keyshort = props.role.charAt(0).toUpperCase();
  const showSubMenu =
    props.selectedPath?.[0] === props.path &&
    props.selectedPath.length > 0 &&
    props.subMenu.length > 0;
  return (
    <div
      data-path={`0-${props.path}`}
      aria-label={props.label}
      aria-haspopup="true"
      aria-keyshortcuts={`Alt+${keyshort}`}
      className={classname(styles.menuButton, {
        [styles.focus]: props.selectedPath?.[0] === props.path,
      })}
    >
      {props.label}(<span className={styles.menurole}>{keyshort}</span>)
      {showSubMenu && (
        <div className={styles.menulist}>
          {props.subMenu.map((item, i) => (
            <MenuItem {...item} depth={1} path={i} key={item.role} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuButton;
