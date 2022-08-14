const { app, BrowserWindow, ipcMain } = require('electron');

const addServices = (win) => {
    ipcMain.on('api:terminate-app', () => {
        app.quit();
    });

    return win;
};

module.exports = addServices;