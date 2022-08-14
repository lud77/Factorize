const fs = require('fs').promises;
const { app, BrowserWindow, ipcMain } = require('electron');
const nreadlines = require('n-readlines');

const { getImageDimensions } = require('../utils');

const filters = [
    { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
    { name: 'Factorize', extensions: ['plan'] }
];

const fileHandlers = [];

const addServices = (win) => {
    ipcMain.on('api:read-image-file', (event, filePath) => {
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
                console.log('error while reading image file', e);
            });
    });

    ipcMain.on('api:read-file', (event, filePath) => {
        Promise.all([filePath, fs.readFile(filePath, 'utf-8')])
            .then(([filePath, fileContents]) => {
                if (!filePath) {
                    win.webContents.send('api:file-contents', {
                        cancelled: true
                    });

                    return null;
                }

                win.webContents.send('api:file-contents', { data: fileContents });
            })
            .catch((e) => {
                console.log('error while reading file', e);
            });
    });

    ipcMain.on('api:open-file', (event, filePath) => {
        console.log('open-file', filePath);
        Promise.resolve()
            .then(() => {
                const lineReader = new nreadlines(filePath);
                const fileHandler = fileHandlers.push(lineReader) - 1;
                console.log('generated new fileHandler', fileHandler);
                console.log('fileHandlers', fileHandlers);
                return fileHandler;
            })
            .then((fileHandler) => {
                win.webContents.send('api:file-handler', fileHandler);
            })
            .catch((e) => {
                console.log('error while opening file', e);
            });
    });

    ipcMain.on('api:close-file', (event, fileHandler) => {
        console.log('close-file', fileHandler);
        Promise.resolve()
            .then(() => {
                if (!fileHandlers[fileHandler]) throw new Error('Line reader not found');

                delete fileHandlers[fileHandler];
                win.webContents.send('api:ack', {});
            })
            .catch((e) => {
                console.log('error while closing file', e);
            });
    });

    ipcMain.on('api:read-line-from-file', (event, fileHandler) => {
        Promise.resolve()
            .then(() => {
                console.log('fileHandlers', fileHandlers);
                console.log('fileHandler', fileHandler);
                if (!fileHandlers[fileHandler]) throw new Error('Line reader not found');

                const line = fileHandlers[fileHandler].next();

                if (!line) return null;
                return line.toString('utf-8');
            })
            .then((textLine) => {
                win.webContents.send('api:file-line', { data: textLine });
            })
            .catch((e) => {
                console.log('error while reading from file', e);
            });
    });

    ipcMain.on('api:write-file', (event, { filePath, contents }) => {
        fs.writeFile(filePath, contents, (err) => {
            console.log('error while writing file', e);
        });
    });

    ipcMain.on('api:append-to-file', (event, { filePath, contents }) => {
        fs.appendFile(filePath, contents, (err) => {
            console.log('error while appending to file', e);
        });
    });

    return win;
};

module.exports = addServices;