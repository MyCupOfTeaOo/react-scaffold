import { useValue } from 'teaness';
import lodash from 'lodash';
import { useEffect, RefObject, useRef, useCallback } from 'react';
import { MenuButtonConfig, MenuConfig } from './typings';

/* eslint-disable no-param-reassign */

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
    const path = fatherPath ? `${fatherPath}*${i}` : `${i}`;
    const realPath = menu.type === 'submenu' ? `${path}*0` : path;
    const keyshort = menu.role.charAt(0).toUpperCase();
    if (rolePath[keyshort]) {
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
    } else {
      rolePath[keyshort] = {
        path: realPath,
        muti: rolePath[keyshort]?.depth === depth,
        menu,
        depth,
        disableOverlay: !!fatherPath,
      };
    }
    if (selectedPath.replace('*-1', '') === path) {
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
  const roleMap = useKeyshortPath(menus, selectedPath.value.join('*'));
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
          if (focus.value) {
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
          tp.splice(depth, tp.length - depth);
          tp.push(index);
          selectedPath.value = tp;
          return;
        }
      }
    }
    function keydown(e: KeyboardEvent) {
      switch (e.keyCode) {
        /* enter */
        case 13: {
          const target = lodash.get(
            menus,
            selectedPath.value.reduce<string>((str, path) => {
              return `${str}${str ? '.subMenu.' : ''}${path}`;
            }, ''),
          ) as MenuConfig;

          if (target) {
            clear();
            target.onClick?.();
          }
          break;
        }
        /* esc */
        case 27: {
          clear();
          break;
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
              const curLength = target.subMenu?.length || 0;
              if (curPath > curLength - 2) {
                selectedPath.value = [
                  ...selectedPath.value.slice(0, selectedPath.value.length - 1),
                  0,
                ];
              } else {
                selectedPath.value = [
                  ...selectedPath.value.slice(0, selectedPath.value.length - 1),
                  curPath + 1,
                ];
              }
            }
          }
          break;
        }
        /* right */
        case 39: {
          if (!altPressing.current && altPress.value) {
            if (
              selectedPath.value.length === 1 ||
              (selectedPath.value.length === 2 && selectedPath.value[1] === -1)
            ) {
              const curPath = selectedPath.value[0];
              if (curPath > menus.length - 2) {
                selectedPath.value = [0, 0];
              } else {
                selectedPath.value = [curPath + 1, 0];
              }
            } else {
              const target =
                selectedPath.value.length > 2 &&
                selectedPath.value[selectedPath.value.length - 1] === -1
                  ? (lodash.get(
                      menus,
                      selectedPath.value
                        .slice(0, selectedPath.value.length - 1)
                        .reduce<string>((str, path) => {
                          return `${str}${str ? '.subMenu.' : ''}${path}`;
                        }, ''),
                    ) as MenuConfig)
                  : (lodash.get(
                      menus,
                      selectedPath.value
                        .slice(0, selectedPath.value.length)
                        .reduce<string>((str, path) => {
                          return `${str}${str ? '.subMenu.' : ''}${path}`;
                        }, ''),
                    ) as MenuConfig);
              if (target) {
                if (target.subMenu) {
                  const tempPath =
                    selectedPath.value[selectedPath.value.length - 1] === -1
                      ? selectedPath.value.slice(
                          0,
                          selectedPath.value.length - 1,
                        )
                      : selectedPath.value;
                  selectedPath.value = [...tempPath, 0];
                } else {
                  const curPath = selectedPath.value[0];
                  if (curPath > menus.length - 2) {
                    selectedPath.value = [0, 0];
                  } else {
                    selectedPath.value = [curPath + 1, 0];
                  }
                }
              } else {
                const curPath = selectedPath.value[0];
                if (curPath > menus.length - 2) {
                  selectedPath.value = [0, 0];
                } else {
                  selectedPath.value = [curPath + 1, 0];
                }
              }
            }
          }
          break;
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
              const curLength = target.subMenu?.length || 0;

              if (curPath < 1) {
                selectedPath.value = [
                  ...selectedPath.value.slice(0, selectedPath.value.length - 1),
                  curLength - 1,
                ];
              } else {
                selectedPath.value = [
                  ...selectedPath.value.slice(0, selectedPath.value.length - 1),
                  curPath - 1,
                ];
              }
            }
          }
          break;
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
              if (curPath < 1) {
                selectedPath.value = [menus.length - 1, 0];
              } else {
                selectedPath.value = [curPath - 1, 0];
              }
            }
          }
          break;
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
            const target = roleMap.value[e.key.toUpperCase()];
            if (target) {
              if (target.muti || target.menu.subMenu) {
                selectedPath.value = target.path
                  .split('*')
                  .map(item => parseInt(item, 10));
                // }
              } else {
                clear();
                target.menu.onClick?.();
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
