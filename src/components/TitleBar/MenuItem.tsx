import React from 'react';
import classnames from 'classnames';
import { MenuItemProps } from './typings';
import styles from './index.scss';
import { replaceCtrl } from './hooks';

const MenuItem: React.FC<MenuItemProps> = props => {
  const keyshort = props.role?.charAt(0).toUpperCase();
  const showSubMenu =
    props.selectedPath?.[props.depth] === props.path &&
    props.selectedPath.length > props.depth + 1 &&
    (props.subMenu?.length || 0) > 0 &&
    !props.disabled;
  if (props.type === 'separator') {
    return (
      <div
        data-path={`${props.depth}-${props.path}`}
        className={classnames(styles.menuItem, styles.separator)}
      />
    );
  }
  return (
    <div
      className={classnames(styles.menuItem, {
        [styles.menuItemFocus]:
          props.selectedPath?.[props.depth] === props.path,
        [styles.disabled]: props.disabled,
      })}
      data-path={`${props.depth}-${props.path}`}
      aria-label={props.label}
      aria-haspopup={props.subMenu ? 'true' : 'false'}
      aria-keyshortcuts={keyshort ? `Alt+${keyshort}` : keyshort}
    >
      {props.checked && props.type === 'checkbox' && (
        <span className={classnames(styles.check, 'codicon codicon-check')} />
      )}
      <span className={styles.menuItemLabel}>
        {props.label}
        {!props.disabled && keyshort && (
          <span className={styles.keyshort}>{keyshort}</span>
        )}
      </span>
      <span className={styles.menuItemAccelerator}>
        {replaceCtrl(props.accelerator?.join(' '))}
      </span>

      {!props.disabled && props.type === 'submenu' && (
        <span
          className={classnames(
            styles.rightArrow,
            'codicon codicon-chevron-right',
          )}
        />
      )}
      {showSubMenu && props.subMenu && (
        <span className={classnames(styles.menulist, styles.subMenu)}>
          {props.subMenu.map((menu, i) => (
            <MenuItem
              {...menu}
              path={i}
              key={menu.label || i}
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
