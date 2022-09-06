const { app, BrowserWindow, ipcMain, dialog } = require('electron');

const filters = [
    { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
    { name: 'Factorize', extensions: ['plan'] }
];

const fileHandlers = [];

const addServices = (win) => {
    ipcMain.on('api:select-file-open', (event, arg) => {
        Promise.resolve()
            .then(() => {
                return dialog.showOpenDialogSync({
                    properties: ['openFile'],
                    filters: arg.fileTypes ? filters.filter((filter) => arg.fileTypes.includes(filter.name)) : undefined,
                    browserWindow: win
                });
            })
            .then((res) => {
                if (!res) return null;

                return res[0];
            })
            .then((filePath) => {
                if (!filePath) {
                    win.webContents.send('api:file-path', {
                        cancelled: true
                    });

                    return null;
                }

                win.webContents.send('api:file-path', {
                    cancelled: false,
                    path: filePath
                });
            })
            .catch((e) => {
                console.log('error while choosing file', e);
            });
    });

    ipcMain.on('api:select-file-save', (event, arg) => {
        Promise.resolve()
            .then(() => {
                return dialog.showSaveDialogSync({
                    title: 'Save To File...',
                    defaultPath: app.getPath('documents'),
                    filters: arg.fileTypes ? filters.filter((filter) => arg.fileTypes.includes(filter.name)) : undefined,
                    browserWindow: win
                });
            })
            .then((res) => {
                if (!res) return null;

                return res;
            })
            .then((filePath) => {
                if (!filePath) {
                    win.webContents.send('api:file-path', {
                        cancelled: true
                    });

                    return null;
                }

                win.webContents.send('api:file-path', {
                    cancelled: false,
                    path: filePath
                });
            })
            .catch((e) => {
                console.log('error while choosing file', e);
            });
    });

    ipcMain.on('api:select-folder', (event, arg) => {
        Promise.resolve()
            .then(() => {
                return dialog.showOpenDialogSync({
                    title: 'Select folder...',
                    defaultPath: app.getPath('documents'),
                    browserWindow: win,
                    properties: ['openDirectory']
                });
            })
            .then((res) => {
                if (!res) return null;

                return res;
            })
            .then((folderPath) => {
                if (!folderPath) {
                    win.webContents.send('api:folder-path', {
                        cancelled: true
                    });

                    return null;
                }

                win.webContents.send('api:folder-path', {
                    cancelled: false,
                    path: folderPath
                });
            })
            .catch((e) => {
                console.log('error while choosing folder', e);
            });
    });

    return win;
};

module.exports = addServices;