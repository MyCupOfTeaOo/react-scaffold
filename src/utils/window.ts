import { remote } from 'electron';
import { router } from 'umi';

const currentWin = remote.getCurrentWindow();
const { app } = remote;

export function getCurWindow() {
  return currentWin;
}

export function getApp() {
  return app;
}

export function getWelcomeWindow() {
  currentWin.setOpacity(0);
  router.replace('/');
  currentWin.setMaximizable(true);
  currentWin.setFullScreenable(true);
  currentWin.setAlwaysOnTop(false);
  return currentWin;
}

export function getLoginWindow() {
  currentWin.setOpacity(0);
  currentWin.unmaximize();
  currentWin.setAlwaysOnTop(true);
  currentWin.setFullScreenable(false);
  currentWin.setMaximizable(false);
  currentWin.setSize(400, 656);
  currentWin.center();
  return currentWin;
}
