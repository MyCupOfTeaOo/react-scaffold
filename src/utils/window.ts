import { remote } from 'electron';
import { router } from 'umi';

export function getWelcomeWindow() {
  const currentWin = remote.getCurrentWindow();
  currentWin.setOpacity(0);
  router.replace('/');
  currentWin.setMaximizable(true);
  currentWin.setFullScreenable(true);
  currentWin.setAlwaysOnTop(false);
  return currentWin;
}

export function getLoginWindow() {
  const currentWin = remote.getCurrentWindow();
  currentWin.setOpacity(0);
  currentWin.unmaximize();
  currentWin.setAlwaysOnTop(true);
  currentWin.setFullScreenable(false);
  currentWin.setMaximizable(false);
  currentWin.setContentSize(400, 656);
  currentWin.center();
  return currentWin;
}
