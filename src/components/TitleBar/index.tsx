import React from 'react';
import Title from './Title';
import styles from './index.scss';
import Control from './Control';
import MenuBar from './MenuBar';
import { MenuButtonConfig } from './typings';

const menus: MenuButtonConfig[] = [
  {
    label: '文件',
    accelerator: 'Alt+F',
    subMenu: [],
  },
  {
    label: '编辑',
    accelerator: 'Alt+E',
    subMenu: [],
  },
  {
    label: '选择',
    accelerator: 'Alt+S',
    subMenu: [],
  },
  {
    label: '查看',
    accelerator: 'Alt+V',
    subMenu: [],
  },
  {
    label: '转到',
    accelerator: 'Alt+G',
    subMenu: [],
  },
  {
    label: '运行',
    accelerator: 'Alt+R',
    subMenu: [],
  },
  {
    label: '终端',
    accelerator: 'Alt+T',
    subMenu: [],
  },
  {
    label: '帮助',
    accelerator: 'Alt+H',
    subMenu: [],
  },
];

interface TitleBar {}

const TitleBar: React.FC<TitleBar> = () => {
  return (
    <div className={styles.container}>
      <div className={styles.drag} />
      <MenuBar menus={menus} />
      <Title />
      <Control />
    </div>
  );
};

export default TitleBar;
