const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

const CRM_URL = 'https://car-service-nikol-crm.vercel.app';

function createWindow() {
  const iconPath = path.join(__dirname, 'icon.png');
  const opts = {
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    title: 'Car Service Nikol — CRM'
  };
  if (fs.existsSync(iconPath)) opts.icon = iconPath;
  const win = new BrowserWindow(opts);

  win.loadURL(CRM_URL);

  win.on('closed', () => {
    app.quit();
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});
