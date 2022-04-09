const { app, BrowserWindow, nativeTheme } = require('electron');
const path = require('path');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 900,
    height: 750,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  });
  win.loadFile('index.html');
};

app.whenReady().then(() => {
  nativeTheme.themeSource = 'dark';
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
