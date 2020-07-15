import { app, BrowserWindow } from 'electron';
import * as path from 'path';
// import getWindow from '@/utils/window'

const createWindow = () => {
  const mainWindow = new BrowserWindow({
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
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:8000');
  } else {
    mainWindow.loadFile(path.join(__dirname, './dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.webContents.session.clearStorageData();
    mainWindow.show();
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
