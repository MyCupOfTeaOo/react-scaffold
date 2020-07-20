import React from 'react';
import { message } from 'antd';
import Title from './Title';
import styles from './index.scss';
import Control from './Control';
import MenuBar from './MenuBar';
import { MenuButtonConfig } from './typings';

const menus: MenuButtonConfig[] = [
  {
    label: '文件',
    role: 'file',
    type: 'submenu',
    subMenu: [
      {
        label: '新建文件',
        role: 'newFile',
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
        label: '新建文件',
        role: 'newFile',
        type: 'normal',
        onClick() {
          message.success('新建文件');
        },
        accelerator: ['Ctrl+N'],
      },
      {
        label: '文件打开',
        role: 'fileOpen',
        type: 'submenu',
        accelerator: ['Ctrl+O'],
        subMenu: [
          {
            label: '新建文件111',
            role: 'newFile',
            type: 'submenu',
            onClick() {
              message.success('新建文件');
            },
            accelerator: ['Ctrl+N'],
            subMenu: [
              {
                label: '新建文件',
                role: 'newFile',
                type: 'normal',
                onClick() {
                  message.success('新建文件');
                },
                accelerator: ['Ctrl+N'],
              },
              {
                label: '文件打开',
                role: 'fileOpen',
                type: 'normal',
                accelerator: ['Ctrl+O'],
              },
              {
                label: '文件上传',
                role: 'fileUpload',
                type: 'normal',
                onClick() {
                  message.success('新建文件');
                },
                accelerator: ['Ctrl+U'],
              },
            ],
          },
          {
            label: '文件打开1111',
            role: 'fileOpen',
            type: 'normal',
            accelerator: ['Ctrl+O'],
          },
          {
            label: '文件上传',
            role: 'fileUpload',
            type: 'normal',
            onClick() {
              message.success('新建文件');
            },
            accelerator: ['Ctrl+U'],
          },
        ],
      },
      {
        label: '文件上传',
        role: 'fileUpload',
        type: 'normal',
        onClick() {
          message.success('新建文件');
        },
        accelerator: ['Ctrl+U'],
      },
    ],
  },
  {
    label: '选择',
    role: 'select',
    type: 'submenu',
    subMenu: [],
  },
  {
    label: '查看',
    role: 'view',
    type: 'submenu',
    subMenu: [],
  },
  {
    label: '转到',
    role: 'go',
    type: 'submenu',
    subMenu: [],
  },
  {
    label: '运行',
    role: 'run',
    type: 'submenu',
    subMenu: [],
  },
  {
    label: '终端',
    role: 'terminal',
    type: 'submenu',
    subMenu: [],
  },
  {
    label: '帮助',
    role: 'help',
    type: 'submenu',
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
