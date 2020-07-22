import { useValue } from 'teaness';
import lodash from 'lodash';
import { useEffect, RefObject, useRef, useCallback } from 'react';
import hotkeys from 'hotkeys-js';
import { getCurWindow } from '@/utils/window';
import { MenuButtonConfig, MenuConfig } from './typings';
import { roleMap } from './role';

/* eslint-disable no-param-reassign */
const CMD = '⌘';
const CTRL = 'Ctrl';

export function replaceCtrl(str?: string) {
  return str?.replace(
    new RegExp(`${CMD}|${CTRL}`, 'gi'),
    process.platform === 'darwin' ? CMD : CTRL,
  );
}

// 转化成扁平的一维数组,并且过滤掉没有快捷键的
export function parseAcceleratorMenus(
  menus: MenuConfig[],
): {
  accelerator: string[];
  runIt(): void;
}[] {
  return menus.reduce<
    {
      accelerator: string[];
      runIt(): void;
    }[]
  >((parseMenu, menu) => {
    if (menu.accelerator) {
      const accelerator = menu.accelerator.map(str => {
        if (/ctrl|⌘/gi.test(str)) {
          return [CMD, CTRL]
            .map(item => str.replace(/ctrl|⌘/gi, item))
            .join(',');
        }
        return str;
      });
      parseMenu.push({
        runIt() {
          execMenu(menu);
        },
        accelerator,
      });
    }
    if (menu.subMenu) {
      parseMenu.push(...parseAcceleratorMenus(menu.subMenu));
    }
    return parseMenu;
  }, []);
}

export function useAccelerator(menus: MenuConfig[]) {
  useEffect(() => {
    const hasAcceleratorMenus = parseAcceleratorMenus(menus);
    hasAcceleratorMenus.forEach(menu => {
      hotkeys(menu.accelerator.join(','), menu.runIt);
    });
    return () => {
      hasAcceleratorMenus.forEach(menu => {
        hotkeys.unbind(menu.accelerator.join(','), menu.runIt);
      });
    };
  }, [menus]);
}

function genKeyshortPath(
  menus: MenuConfig[],
  selectedPath: string,
  rolePath: Record<
    string,
    {
      path: string;
      muti: boolean;
      disableOverlay: boolean;
      menu: MenuConfig;
      depth: number;
    }
  >,
  depth = 0,
  fatherPath?: string,
): Record<
  string,
  {
    path: string;
    muti: boolean;
    depth: number;
    menu: MenuConfig;
  }
> {
  menus.forEach((menu, i) => {
    if (menu.disabled || menu.type === 'separator') return;
    const path = fatherPath ? `${fatherPath}*${i}` : `${i}`;
    const realPath = menu.type === 'submenu' ? `${path}*0` : path;
    const keyshort = menu.role?.charAt(0).toUpperCase();
    if (keyshort && rolePath[keyshort]) {
      if (
        (depth > rolePath[keyshort].depth ||
          (!rolePath[keyshort]?.disableOverlay &&
            depth === rolePath[keyshort].depth)) &&
        fatherPath
      ) {
        rolePath[keyshort] = {
          path: realPath,
          muti: rolePath[keyshort]?.depth === depth,
          menu,
          depth,
          disableOverlay: true,
        };
      } else {
        rolePath[keyshort].muti = true;
      }
    } else if (keyshort) {
      rolePath[keyshort] = {
        path: realPath,
        muti: rolePath[keyshort]?.depth === depth,
        menu,
        depth,
        disableOverlay: !!fatherPath,
      };
    }
    if (keyshort && selectedPath.replace('*-1', '') === path) {
      rolePath[keyshort].disableOverlay = false;
    }

    if (
      selectedPath &&
      new RegExp(`^${path}.`.replace(/\*/g, '\\*')).test(selectedPath) &&
      menu.subMenu
    ) {
      genKeyshortPath(menu.subMenu, selectedPath, rolePath, depth + 1, path);
    }
  });
  return rolePath;
}

function getMenuConfig(selectedPath: number[], menus: MenuConfig[]) {
  return lodash.get(
    menus,
    selectedPath.reduce<string>((str, path) => {
      if (path === -1) return str;
      return `${str}${str ? '.subMenu.' : ''}${path}`;
    }, ''),
  ) as MenuConfig;
}
export function execMenu(menu: MenuConfig) {
  if (menu.disabled || menu.type !== 'separator') return;
  const win = getCurWindow();
  if (menu.onClick) {
    menu.onClick.apply(win);
  }
  if (!menu.role) return;
  const role = roleMap[menu.role];
  if (role) {
    role.apply(win);
  }
}

export function getUpPath(menus: MenuConfig[], curPath: number): number {
  const curLength = menus.length;
  if (curPath < 1) {
    const next = curLength - 1;
    if (menus[next].disabled || menus[next].type === 'separator') {
      return getUpPath(menus, next);
    }
    return next;
  } else {
    const next = curPath - 1;
    if (menus[next].disabled || menus[next].type === 'separator') {
      return getUpPath(menus, next);
    }
    return next;
  }
}

export function getDownPath(menus: MenuConfig[], curPath: number): number {
  const curLength = menus.length;
  if (curPath > curLength - 2) {
    const next = 0;
    if (menus[next].disabled || menus[next].type === 'separator') {
      return getDownPath(menus, next);
    }
    return next;
  } else {
    const next = curPath + 1;
    if (menus[next].disabled || menus[next].type === 'separator') {
      return getDownPath(menus, next);
    }
    return next;
  }
}

export function useKeyshortPath(menus: MenuConfig[], selectedPath: string) {
  const rolePath = useValue<
    Record<
      string,
      {
        path: string;
        muti: boolean;
        menu: MenuConfig;
      }
    >
  >({});
  useEffect(() => {
    rolePath.value = genKeyshortPath(menus, selectedPath, {});
  }, [menus, selectedPath]);
  return rolePath;
}

export function useSelectedPath(
  ref: RefObject<HTMLDivElement>,
  menus: MenuButtonConfig[],
) {
  const selectedPath = useValue<number[]>([]);
  const altPress = useValue(false);
  const altPressing = useRef(false);
  const focus = useValue(false);
  const shortkeyMap = useKeyshortPath(menus, selectedPath.value.join('*'));
  const clear = useCallback(() => {
    focus.value = false;
    altPress.value = false;
    selectedPath.value = [];
  }, []);
  useEffect(() => {
    function mouseover(e: Event) {
      for (const target of (e as any).path) {
        const path = (target as HTMLDivElement).dataset?.path;
        if (path) {
          const [depthStr, indexStr] = path.split('-');
          const depth = parseInt(depthStr, 10);
          const index = parseInt(indexStr, 10);
          const tp = [...selectedPath.value];
          tp.splice(depth, tp.length - depth);
          tp.push(index);
          const menu = getMenuConfig(tp, menus);
          if (focus.value && menu.type === 'submenu') {
            tp.push(-1);
          }
          selectedPath.value = tp;
          return;
        }
      }
    }
    function mouseleave() {
      if (!focus.value) selectedPath.value = [];
    }
    function mousedown(e: HTMLElementEventMap['mousedown']) {
      altPress.value = true;
      for (const target of (e as any).path) {
        const path = (target as HTMLDivElement).dataset?.path;
        if (path) {
          const [depthStr, indexStr] = path.split('-');
          const depth = parseInt(depthStr, 10);
          const index = parseInt(indexStr, 10);
          if (depth < 1) {
            focus.value = !focus.value;
          }
          const tp = [...selectedPath.value];
          if (selectedPath.value.length < 2) {
            tp.splice(depth, tp.length - depth);
            tp.push(index, -1);
            selectedPath.value = tp;
            return;
          }
          const menu = getMenuConfig(
            selectedPath.value.slice(0, depth + 1),
            menus,
          );
          if (menu) {
            if (menu.type === 'submenu') {
              const thePath = path
                .split('-')
                .map(p => parseInt(p, 10))
                .filter(p => p !== -1);
              selectedPath.value = [...thePath, 0];
            } else {
              if (menu.disabled || menu.type === 'separator') return;
              clear();
              execMenu(menu);
            }
          }

          return;
        }
      }
    }
    function keydown(e: KeyboardEvent) {
      switch (e.keyCode) {
        /* enter */
        case 13: {
          const target = getMenuConfig(
            selectedPath.value.filter(item => item !== -1),
            menus,
          );
          if (target && !target.disabled && target.type !== 'separator') {
            clear();
            execMenu(target);
          }
          return;
        }
        /* esc */
        case 27: {
          clear();
          return;
        }
        /* down */
        case 40: {
          if (!altPressing.current && altPress.value) {
            const target =
              selectedPath.value.length > 2 &&
              selectedPath.value[selectedPath.value.length - 1] === -1
                ? (lodash.get(
                    menus,
                    selectedPath.value
                      .slice(0, selectedPath.value.length - 2)
                      .reduce<string>((str, path) => {
                        return `${str}${str ? '.subMenu.' : ''}${path}`;
                      }, ''),
                  ) as MenuConfig)
                : (lodash.get(
                    menus,
                    selectedPath.value
                      .slice(0, selectedPath.value.length - 1)
                      .reduce<string>((str, path) => {
                        return `${str}${str ? '.subMenu.' : ''}${path}`;
                      }, ''),
                  ) as MenuConfig);

            if (target) {
              const curPath = selectedPath.value[selectedPath.value.length - 1];
              selectedPath.value = [
                ...selectedPath.value.slice(0, selectedPath.value.length - 1),
                getDownPath(target.subMenu || [], curPath),
              ];
            }
          }
          return;
        }
        /* right */
        case 39: {
          if (!altPressing.current && altPress.value) {
            if (selectedPath.value.filter(item => item !== -1).length > 1) {
              const target = getMenuConfig(selectedPath.value, menus);
              if (target) {
                if (target.subMenu) {
                  const tempPath =
                    selectedPath.value[selectedPath.value.length - 1] === -1
                      ? selectedPath.value.slice(
                          0,
                          selectedPath.value.length - 1,
                        )
                      : selectedPath.value;
                  const index = target.subMenu.findIndex(
                    menu => !menu.disabled && menu.type === 'separator',
                  );
                  selectedPath.value = [...tempPath, index];
                  return;
                }
              }
            }
            const curPath = selectedPath.value[0];
            const nextMenuBtnIndex = getDownPath(menus, curPath);
            selectedPath.value = [
              getDownPath(menus, curPath),
              menus[nextMenuBtnIndex].subMenu.findIndex(
                menu => !menu.disabled && menu.type === 'separator',
              ),
            ];
          }
          return;
        }
        /* up */
        case 38: {
          if (!altPressing.current && altPress.value) {
            const target =
              selectedPath.value.length > 2 &&
              selectedPath.value[selectedPath.value.length - 1] === -1
                ? (lodash.get(
                    menus,
                    selectedPath.value
                      .slice(0, selectedPath.value.length - 2)
                      .reduce<string>((str, path) => {
                        return `${str}${str ? '.subMenu.' : ''}${path}`;
                      }, ''),
                  ) as MenuConfig)
                : (lodash.get(
                    menus,
                    selectedPath.value
                      .slice(0, selectedPath.value.length - 1)
                      .reduce<string>((str, path) => {
                        return `${str}${str ? '.subMenu.' : ''}${path}`;
                      }, ''),
                  ) as MenuConfig);
            if (target) {
              const curPath = selectedPath.value[selectedPath.value.length - 1];
              selectedPath.value = [
                ...selectedPath.value.slice(0, selectedPath.value.length - 1),
                getUpPath(target.subMenu || [], curPath),
              ];
            }
          }
          return;
        }
        /* left */
        case 37: {
          if (!altPressing.current && altPress.value) {
            if (selectedPath.value.length > 2) {
              selectedPath.value = selectedPath.value.slice(
                0,
                selectedPath.value.length - 1,
              );
            } else {
              const curPath = selectedPath.value[0];
              const nextMenuBtnIndex = getUpPath(menus, curPath);
              selectedPath.value = [
                nextMenuBtnIndex,
                menus[nextMenuBtnIndex].subMenu.findIndex(
                  menu => !menu.disabled && menu.type !== 'separator',
                ),
              ];
            }
          }
          return;
        }
        default: {
          if (e.key === 'Alt') {
            if (altPressing.current) {
              ref.current?.focus();
              return;
            }
            altPressing.current = true;
            if (altPress.value) {
              selectedPath.value = [];
            }
            altPress.value = !altPress.value;
            if (altPress.value) {
              ref.current?.focus();
            }
          } else if (altPress.value && /^[a-z]$/i.test(e.key)) {
            const target = shortkeyMap.value[e.key.toUpperCase()];
            if (target) {
              if (target.muti || target.menu.subMenu) {
                selectedPath.value = target.path
                  .split('*')
                  .map(item => parseInt(item, 10));
                // }
              } else {
                clear();
                execMenu(target.menu);
              }
            }
          }
        }
      }
    }
    function keyup(e: KeyboardEvent) {
      if (e.key === 'Alt') {
        altPressing.current = false;
        if (altPress.value) {
          if (selectedPath.value.length < 1) {
            selectedPath.value = [0];
          }
        }
      }
    }

    ref.current?.addEventListener('mouseover', mouseover);
    ref.current?.addEventListener('mouseleave', mouseleave);
    ref.current?.addEventListener('mousedown', mousedown);
    ref.current?.addEventListener('blur', clear, true);
    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);
    return () => {
      ref.current?.removeEventListener('mouseover', mouseover);
      ref.current?.removeEventListener('mouseleave', mouseleave);
      ref.current?.removeEventListener('mousedown', mousedown);
      ref.current?.removeEventListener('blur', clear);
      document.removeEventListener('keydown', keydown);
      document.removeEventListener('keyup', keyup);
    };
  }, [menus]);
  return {
    selectedPath,
    altPress,
  };
}
