export interface MenuConfig {
  label: string;
  onClick?(): void;
  /**
   * 同一级不能重复
   */
  role: string;
  type: 'normal' | 'separator' | 'submenu' | 'checkbox' | 'radio';
  accelerator?: string[];
  subMenu?: MenuConfig[];
  disabled?: boolean;
}

export interface MenuItemProps extends MenuConfig {
  path: number;
  depth: number;
  selectedPath?: number[];
}

export interface MenuButtonConfig
  extends Omit<MenuConfig, 'onClick' | 'accelerator'> {
  type: 'submenu';
  subMenu: MenuConfig[];
}

export interface MenuButtonProps extends MenuButtonConfig {
  path: number;
  selectedPath?: number[];
}
