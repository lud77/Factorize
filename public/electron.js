const path = require('path');

const { Menu, app, BrowserWindow, ipcMain, dialog } = require('electron');
const isDev = require('electron-is-dev');

const addBasicIntegrationServices = require('./js/services/basicIntegration');
const addFileIOServices = require('./js/services/fileIO');
const addFileSelectServices = require('./js/services/fileSelect');
const addSocketServices = require('./js/services/socket');

const createSplashPage = () => {
    const splash = new BrowserWindow({
        width: 500,
        height: 300,
        transparent: false,
        frame: false,
        alwaysOnTop: true
    });

    splash.loadURL(`file://${path.join(__dirname, 'splash.html')}`);
    splash.center();

    return splash;
};

const createWindow = () => {
    // Create the browser window.
    const main = new BrowserWindow({
        show: false,
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
    // main.loadFile("index.html");

    const appUrl = isDev
        ? 'http://localhost:3000'
        : `file://${path.join(__dirname, '../build/index.html')}`;

    const splash = createSplashPage();

    Promise.resolve()
        .then(() => {
            return main.loadURL(appUrl);
        })
        .then(() => {
            main.show();
            splash.close();
        })
        .catch(() => { console.log('error') });

    // Open the DevTools.
    if (isDev) {
        main.webContents.openDevTools({ /*mode: 'detach'*/ });
    }

    return main;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady()
    .then(createWindow)
    .then(addBasicIntegrationServices)
    .then(addFileIOServices)
    .then(addFileSelectServices)
    .then(addSocketServices)
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

