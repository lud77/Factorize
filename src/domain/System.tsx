const { ipcRenderer } = window.require('electron');

const quit = () => {
    ipcRenderer.send('api:terminate-app');
};

const openFileDialog = (fileType = []) => {
    return new Promise((resolve) => {
        ipcRenderer.send('api:select-file-open', fileType);
        ipcRenderer.once('api:file-path', (e, msg) => {
            console.log(msg);
            if (msg.cancelled) return resolve(null);

            resolve(msg.path);
        });
    });
};

const saveFileDialog = (fileType = []) => {
    return new Promise((resolve) => {
        ipcRenderer.send('api:select-file-save', fileType);
        ipcRenderer.once('api:file-path', (e, msg) => {
            console.log(msg);
            if (msg.cancelled) return resolve(null);

            resolve(msg.path);
        });
    });
};

const writeFile = (filePath, contents) => {
    ipcRenderer.send('api:write-file', { filePath, contents });
};

const appendToFile = (filePath, contents) => {
    ipcRenderer.send('api:append-to-file', { filePath, contents });
};

const readFile = (filePath) => {
    return new Promise((resolve) => {
        ipcRenderer.once('api:file-contents', (e, msg) => {
            console.log('received', msg);

            resolve(msg);
        });
        ipcRenderer.send('api:read-file', filePath);
    });
};

const readImageFile = (filePath) => {
    return new Promise((resolve) => {
        ipcRenderer.once('api:file-contents', (e, msg) => {
            console.log('received', msg);

            resolve(msg);
        });
        ipcRenderer.send('api:read-image-file', filePath);
    });
};

export default {
    quit,
    openFileDialog,
    saveFileDialog,
    writeFile,
    appendToFile,
    readFile,
    readImageFile
};