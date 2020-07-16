import React from 'react';
import classname from 'classnames';
import { observer } from 'mobx-react';
import stores from '@/stores';
import { remote } from 'electron';
import styles from './index.scss';

const win = remote.getCurrentWindow();

interface ControlProps {}

const Control: React.FC<ControlProps> = () => {
  return (
    <div className={styles.controlLayout}>
      <div
        onClick={() => {
          win.minimize();
        }}
        className={classname(
          styles.controlIcon,
          styles.minimize,
          'codicon codicon-chrome-minimize',
        )}
      />
      <div
        onClick={() => {
          if (stores.global.isMaximized) {
            stores.global.unmaximize();
          } else {
            stores.global.maximize();
          }
        }}
        className={classname(styles.controlIcon, styles.maximize, 'codicon', {
          'codicon-chrome-maximize': !stores.global.isMaximized,
          'codicon-chrome-restore': stores.global.isMaximized,
        })}
      />
      <div
        className={classname(
          styles.controlIcon,
          styles.close,
          'codicon codicon-chrome-close',
        )}
        onClick={() => {
          win.close();
        }}
      />
    </div>
  );
};

export default observer(Control);
