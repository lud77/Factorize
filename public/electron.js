const path = require('path');

const { Menu, app, BrowserWindow, ipcMain, dialog } = require('electron');
const isDev = require('electron-is-dev');

const addServices = require('./js/services');

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
    .then(addServices)
    .then(() => {

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
                        .showOpenDialogSync({ properties: ['openFile'] })
                        // .then((res) => console.log(res));
                }
            },
            { type: 'separator' },
            {
                label: 'Save',
                accelerator: process.platform === 'darwin' ? 'Cmd+S' : 'Ctrl+S',
                click: () => {
                    dialog
                        .showSaveDialogSync({ properties: ['openFile'] })
                        // .then((res) => console.log(res));
                }
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

