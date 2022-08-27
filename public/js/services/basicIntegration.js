const { app, BrowserWindow, ipcMain } = require('electron');

const addServices = (win) => {
    ipcMain.on('api:terminate-app', () => {
        app.quit();
    });

    ipcMain.on('api:console-log', (event, message) => {
        console.log(message);
    });

    return win;
};

module.exports = addServices;