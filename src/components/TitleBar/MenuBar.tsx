import React, { useRef } from 'react';
import classnames from 'classnames';
import styles from './index.scss';
import { MenuButtonConfig } from './typings';
import MenuButton from './MenuButton';
import { useSelectedPath } from './hooks';

interface MenuProps {
  menus: MenuButtonConfig[];
}

const MenuBar: React.FC<MenuProps> = ({ menus }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { selectedPath, altPress } = useSelectedPath(ref);
  return (
    <div
      ref={ref}
      className={classnames(styles.menubar, {
        [styles.altPress]: altPress.value,
      })}
      role="menubar"
    >
      {menus.map((menu, i) => (
        <MenuButton
          key={`${menu.label}+${i}`}
          selectedPath={selectedPath.value}
          path={i}
          {...menu}
        />
      ))}
    </div>
  );
};

export default MenuBar;
