import { remote, BrowserWindow } from 'electron';

export interface ReloadOptions {
  maximize?: boolean;
}

export function getMyWindow(
  options: ReloadOptions = {},
  ...config: ConstructorParameters<typeof BrowserWindow>
) {
  const { maximize } = options;
  const win = new remote.BrowserWindow(...config);
  const currentWin = remote.getCurrentWindow();
  win.loadURL(remote.getCurrentWindow().webContents.getURL());
  win.on('ready-to-show', () => {
    currentWin.close();
    maximize && win.maximize();
    win.show();
  });
  return win;
}

export function getWelcomeWindow() {
  return getMyWindow(
    { maximize: true },
    {
      webPreferences: {
        nodeIntegration: true,
      },
      backgroundColor: '#ffffff',
      titleBarStyle: 'hidden',
      resizable: true,
      maximizable: true,
      show: false,
    },
  );
}

export function getLoginWindow() {
  return getMyWindow(
    {},
    {
      height: 656,
      width: 400,
      webPreferences: {
        nodeIntegration: true,
      },
      backgroundColor: '#00ffffff',
      titleBarStyle: 'hidden',
      resizable: false,
      frame: false,
      show: false,
      alwaysOnTop: true,
      transparent: true,
    },
  );
}
