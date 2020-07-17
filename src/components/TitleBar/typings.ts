import { roleMap } from './role';

export interface MenuConfig {
  label: string;
  onClick?(props: MenuItemProps): void;
  role?: keyof typeof roleMap;
  type: 'normal' | 'separator' | 'submenu' | 'checkbox' | 'radio';
  accelerator?: string;
  subMenu?: MenuConfig[];
  disabled?: boolean;
}

export interface MenuItemProps extends MenuConfig {
  path: number;
  depth: number;
  selectedPath?: number[];
}

export interface MenuButtonConfig
  extends Omit<MenuConfig, 'onClick' | 'role' | 'type'> {
  /**
   * 快捷键必须是 Alt+任意字幕
   */
  accelerator: string;
  subMenu: MenuConfig[];
}

export interface MenuButtonProps extends MenuButtonConfig {
  path: number;
  selectedPath?: number[];
}
