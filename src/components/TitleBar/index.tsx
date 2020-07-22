import React from 'react';
import { message } from 'antd';
import Title from './Title';
import styles from './index.scss';
import Control from './Control';
import MenuBar from './MenuBar';
import { MenuButtonConfig } from './typings';
import { useAccelerator } from './hooks';

const menus: MenuButtonConfig[] = [
  {
    label: '文件',
    role: 'file',
    type: 'submenu',
    subMenu: [
      {
        label: '退出',
        role: 'quit',
        type: 'normal',
      },
    ],
  },
  {
    label: '编辑',
    role: 'edit',
    type: 'submenu',
    subMenu: [
      {
        label: '撤销',
        role: 'undo',
        type: 'normal',
        accelerator: ['Ctrl+Z'],
      },
      {
        label: '恢复',
        role: 'redo',
        type: 'normal',
        accelerator: ['Ctrl+Shift+Z', 'Ctrl+Y'],
      },
    ],
  },
  {
    label: '帮助',
    role: 'help',
    type: 'submenu',
    subMenu: [
      {
        label: '测试',
        role: 'test',
        type: 'submenu',
        subMenu: [
          {
            label: '点击测试',
            role: 'test',
            type: 'normal',
            disabled: true,
          },
        ],
      },
      {
        type: 'separator',
      },
      {
        label: '关于',
        role: 'abort',
        type: 'normal',
        disabled: true,

        onClick() {
          message.success('暂无关于');
        },
      },
      {
        label: '检查更新',
        role: 'update',
        type: 'normal',
        accelerator: ['Ctrl+U'],
        onClick() {
          message.success('暂无更新');
        },
      },
    ],
  },
];

interface TitleBar {}

const TitleBar: React.FC<TitleBar> = () => {
  useAccelerator(menus);
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
