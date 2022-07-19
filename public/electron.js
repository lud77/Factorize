const path = require('path');
const fs = require('fs').promises;

const { Menu, app, BrowserWindow, ipcMain, dialog } = require('electron');
const isDev = require('electron-is-dev');
const { compose } = require('react-app-rewired');
const sizeOf = require('image-size');
const { rejects } = require('assert');

const getImageDimensions = (filePath) => {
    return new Promise((resolve, reject) => {
        sizeOf(filePath, function (err, dimensions) {
            if (err) {
                reject(err);
                return;
            }

            resolve(dimensions);
        })
    });
};

const createWindow = () => {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        frame: true, // title bar
        autoHideMenuBar: true
    });

    // and load the index.html of the app.
    // win.loadFile("index.html");
    win.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../build/index.html')}`
    );

    // Open the DevTools.
    if (isDev) {
        win.webContents.openDevTools({ mode: 'detach' });
    }

    return win;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady()
    .then(createWindow)
    .then((win) => {
        ipcMain.handle('app:terminate', () => {
            app.quit();
        });

        ipcMain.on('api:select-file', (event, arg) => {
            console.log(arg)
            Promise.resolve()
                .then(() => {
                    return dialog.showOpenDialog({
                        properties: ['openFile'],
                        filters: [
                            { name: 'Images', extensions: ['jpg', 'png', 'gif'] }
                        ],
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
    });

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on('ready', () => {
    const isMac = process.platform === 'darwin'

    const template = [...(isMac ? [{
        label: app.name,
        submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideOthers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
        ]
    }] : []),
    {
        label: 'File',
        submenu: [
            {
                label: 'New file...',
                accelerator: process.platform === 'darwin' ? 'Cmd+N' : 'Ctrl+N'
            },
            { type: 'separator' },
            {
                label: 'Open file...',
                accelerator: process.platform === 'darwin' ? 'Cmd+O' : 'Ctrl+O',
                click: () => {
                    dialog
                        .showOpenDialog({ properties: ['openFile'] })
                        // .then((res) => console.log(res));
                }
            },
            { type: 'separator' },
            {
                label: 'Save',
                accelerator: process.platform === 'darwin' ? 'Cmd+S' : 'Ctrl+S'
            },
            {
                label: 'Save as...',
                accelerator: process.platform === 'darwin' ? 'Cmd+Shift+S' : 'Ctrl+Shift+S',
                click: () => {
                    dialog
                        .showSaveDialog({ properties: ['openFile'] })
                        // .then((res) => console.log(res));
                }
            },
            // {
            //     label: 'Save all'
            // },
            { type: 'separator' },
            { role: isMac ? 'close' : 'quit' }
        ]
    }];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
});

