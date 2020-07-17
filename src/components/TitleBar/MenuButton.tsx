import React from 'react';
import classname from 'classnames';
import { MenuButtonProps } from './typings';
import styles from './index.scss';

const MenuButton: React.FC<MenuButtonProps> = props => {
  return (
    <div
      data-path={`0-${props.path}`}
      className={classname(styles.menuButton, {
        [styles.focus]: props.selectedPath?.[0] === props.path,
      })}
    >
      {props.label}({props.accelerator.replace(/Alt\+/i, '')})
    </div>
  );
};

export default MenuButton;
