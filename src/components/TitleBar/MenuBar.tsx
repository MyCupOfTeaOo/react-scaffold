import React, { useRef } from 'react';
import styles from './index.scss';
import { MenuButtonConfig } from './typings';
import MenuButton from './MenuButton';
import { useSelectedPath } from './hooks';

interface MenuProps {
  menus: MenuButtonConfig[];
}

const MenuBar: React.FC<MenuProps> = ({ menus }) => {
  const ref = useRef<HTMLDivElement>(null);
  const selectedPath = useSelectedPath(ref);
  return (
    <div ref={ref} className={styles.menubar} role="menubar">
      {menus.map((menu, i) => (
        <MenuButton
          key={`${menu.label}+${i}`}
          selectedPath={selectedPath}
          path={i}
          {...menu}
        />
      ))}
    </div>
  );
};

export default MenuBar;
