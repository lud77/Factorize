const fs = require('fs').promises;
const { app, BrowserWindow, ipcMain, dialog } = require('electron');

const { getImageDimensions } = require('./utils');

const filters = [
    { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
    { name: 'Factorize', extensions: ['plan'] }
];

const addServices = (win) => {
    ipcMain.on('api:terminate-app', () => {
        app.quit();
    });

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
                console.log('error while reading file', e);
            });
    });

    ipcMain.on('api:write-file', (event, { filePath, contents }) => {
        console.log('writing file', filePath, contents);
        fs.writeFile(filePath, contents, (err) => {
            console.log('error while writing file', e);
        });
    });

    return win;
};

module.exports = addServices;