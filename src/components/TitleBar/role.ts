import { BrowserWindow } from 'electron';

export const roleMap: Record<string, (this: BrowserWindow) => void> = {
  undo() {
    this.webContents.undo();
  },
  redo() {
    this.webContents.redo();
  },
  cut() {
    this.webContents.cut();
  },
  copy() {
    this.webContents.copy();
  },
  paste() {
    this.webContents.copy();
  },
  pasteAndMatchStyle() {
    this.webContents.pasteAndMatchStyle();
  },
  delete() {
    this.webContents.delete();
  },
  selectAll() {
    this.webContents.selectAll();
  },
  reload() {
    this.webContents.reload();
  },
  forceReload() {
    this.webContents.reloadIgnoringCache();
  },
  toggleDevTools() {
    this.webContents.toggleDevTools();
  },
  resetZoom() {
    this.webContents.setZoomFactor(1);
  },
  zoomIn() {
    this.webContents.setZoomFactor(this.webContents.getZoomFactor() * 1.2);
  },
  zoomOut() {
    this.webContents.setZoomFactor(this.webContents.getZoomFactor() * 0.8);
  },
  togglefullscreen() {
    this.setFullScreen(!this.fullScreen);
  },
  minimize() {
    this.minimize();
  },
  close() {
    this.close();
  },
  help() {},
  about() {},
  services() {},
  hide() {},
  hideOthers() {},
  unhide() {},
  quit() {},
  startSpeaking() {},
  stopSpeaking() {},
  zoom() {},
  front() {},
  appMenu() {},
  fileMenu() {},
  editMenu() {},
  viewMenu() {},
  recentDocuments() {},
  toggleTabBar() {},
  selectNextTab() {},
  selectPreviousTab() {},
  mergeAllWindows() {},
  clearRecentDocuments() {},
  moveTabToNewWindow() {},
  windowMenu() {},
};
