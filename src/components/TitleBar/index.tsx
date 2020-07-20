import React from 'react';
import Title from './Title';
import styles from './index.scss';
import Control from './Control';
import MenuBar from './MenuBar';
import { MenuButtonConfig } from './typings';

const menus: MenuButtonConfig[] = [
  {
    label: '文件',
    role: 'file',
    subMenu: [
      // {
      //   label: '新建文件',
      //   role: 'newFile',
      //   type: 'normal',
      // },
    ],
  },
  {
    label: '编辑',
    role: 'edit',
    subMenu: [
      {
        label: '新建文件',
        role: 'newFile',
        type: 'normal',
        accelerator: ['Ctrl+N'],
      },
    ],
  },
  {
    label: '选择',
    role: 'select',
    subMenu: [],
  },
  {
    label: '查看',
    role: 'view',
    subMenu: [],
  },
  {
    label: '转到',
    role: 'go',
    subMenu: [],
  },
  {
    label: '运行',
    role: 'run',
    subMenu: [],
  },
  {
    label: '终端',
    role: 'terminal',
    subMenu: [],
  },
  {
    label: '帮助',
    role: 'help',
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
