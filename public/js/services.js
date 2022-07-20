const { app, BrowserWindow, ipcMain, dialog } = require('electron');

const { getImageDimensions } = require('./utils');

const filters = [
    { name: 'Images', extensions: ['jpg', 'png', 'gif'] }
];

const addServices = (win) => {
    ipcMain.on('app:terminate', () => {
        app.quit();
    });

    ipcMain.on('api:select-file', (event, arg) => {
        Promise.resolve()
            .then(() => {
                return dialog.showOpenDialog({
                    properties: ['openFile'],
                    filters: arg.fileTypes ? filters.filter((filter) => arg.fileTypes.contains(filter.name)) : undefined,
                    browserWindow: win
                });
            })
            .then((res) => {
                if (res.cancelled) return null;
                return res.filePaths[0];
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

    ipcMain.on('api:read-file', (event, filePath) => {
        Promise.all([filePath, fs.readFile(filePath, 'base64'), getImageDimensions(filePath)])
            .then(([filePath, fileContents, meta]) => {
                console.log('size', meta);
                if (!filePath) {
                    win.webContents.send('api:file-contents', {
                        cancelled: true
                    });

                    return null;
                }

                const data = `data:${meta.type};base64,${fileContents}`;

                win.webContents.send('api:file-contents', { data, meta });
            })
            .catch((e) => {
                console.log('error while choosing file', e);
            });
    });

    return win;
};

module.exports = addServices;