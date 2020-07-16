import { remote } from 'electron';
import { router } from 'umi';

export function getWelcomeWindow() {
  const currentWin = remote.getCurrentWindow();
  currentWin.hide();
  router.replace('/');
  currentWin.setResizable(true);
  currentWin.setMaximizable(true);
  currentWin.setFullScreenable(true);
  currentWin.setAlwaysOnTop(false);
  return currentWin;
}

export function getLoginWindow() {
  const currentWin = remote.getCurrentWindow();
  currentWin.hide();
  currentWin.setResizable(false);
  currentWin.setMaximizable(false);
  currentWin.setAlwaysOnTop(true);
  currentWin.setContentSize(400, 656);
  currentWin.center();
  router.replace('/');
  return currentWin;
}
