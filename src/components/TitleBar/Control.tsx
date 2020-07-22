import React from 'react';
import classname from 'classnames';
import { observer } from 'mobx-react';
import stores from '@/stores';
import { getCurWindow } from '@/utils/window';
import styles from './index.scss';

interface ControlProps {}

const Control: React.FC<ControlProps> = () => {
  return (
    <div className={styles.controlLayout}>
      <div
        onClick={() => {
          getCurWindow().minimize();
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
          getCurWindow().close();
        }}
      />
    </div>
  );
};

export default observer(Control);
