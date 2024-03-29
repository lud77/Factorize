import FullyTypedPromise from "../types/FullyTypedPromise";
import SystemResponse from "../types/SystemResponse";

const { ipcRenderer } = window.require('electron');

const quit = () => {
    ipcRenderer.send('api:terminate-app');
};

const startWatchingFile = (filePath, callback) => {
    return new Promise((resolve) => {
        ipcRenderer.once('api:watcher-handler', (e, msg) => {
            console.log('received - api:watcher-handler', msg);

            ipcRenderer.on(`api:watcher-accessed:${msg}`, callback);

            resolve(msg);
        });
        ipcRenderer.send('api:watch-file', filePath);
    });
};

const stopWatchingFile = (handler) => {
    return new Promise((resolve) => {
        ipcRenderer.once('api:ack', (e, msg) => {
            console.log('received ack');

            resolve(null);
        });
        ipcRenderer.send('api:stop-watcher', handler);
        ipcRenderer.removeAllListeners(`api:watcher-accessed:${handler}`);
    });
};

const openTextFile = (filePath) => {
    return new Promise((resolve) => {
        ipcRenderer.once('api:file-handler', (e, msg) => {
            console.log('received - api:file-handler', msg);

            resolve(msg);
        });
        ipcRenderer.send('api:open-file', filePath);
    });
};

const closeTextFile = (handler) => {
    return new Promise((resolve) => {
        ipcRenderer.once('api:ack', (e, msg) => {
            console.log('received ack');

            resolve(null);
        });
        ipcRenderer.send('api:close-file', handler);
    });
};

const readTextLine = (fileHandler) => {
    return new Promise((resolve) => {
        ipcRenderer.once('api:file-line', (e, msg) => {
            console.log('received - api:file-line', msg.data);

            resolve(msg.data);
        });
        ipcRenderer.send('api:read-line-from-file', fileHandler);
    });
};

const openFileDialog = (options = {}): FullyTypedPromise<string | null, string> => {
    return new Promise((resolve) => {
        ipcRenderer.send('api:select-file-open', options);
        ipcRenderer.once('api:file-path', (e, msg) => {
            console.log(msg);
            if (msg.cancelled) return resolve(null);

            resolve(msg.path);
        });
    });
};

const saveFileDialog = (options = {}): FullyTypedPromise<string | null, string> => {
    return new Promise((resolve) => {
        ipcRenderer.send('api:select-file-save', options);
        ipcRenderer.once('api:file-path', (e, msg) => {
            console.log(msg);
            if (msg.cancelled) return resolve(null);

            resolve(msg.path);
        });
    });
};

const openFolderDialog = (options = {}) => {
    return new Promise((resolve) => {
        ipcRenderer.send('api:select-folder', options);
        ipcRenderer.once('api:folder-path', (e, msg) => {
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

const readFile = (filePath): FullyTypedPromise<SystemResponse, string> => {
    return new Promise((resolve) => {
        ipcRenderer.once('api:file-contents', (e, msg) => {
            console.log('received', msg);

            resolve(msg);
        });
        ipcRenderer.send('api:read-file', filePath);
    });
};

const readSoundFile = (filePath): FullyTypedPromise<SystemResponse, string> => {
    return new Promise((resolve) => {
        ipcRenderer.once('api:file-contents', (e, msg) => {
            console.log('received', msg);

            resolve(msg);
        });
        ipcRenderer.send('api:read-sound-file', filePath);
    });
};

const readImageFile = (filePath): FullyTypedPromise<SystemResponse, string> => {
    return new Promise((resolve) => {
        ipcRenderer.once('api:file-contents', (e, msg) => {
            console.log('received', msg);

            resolve(msg);
        });
        ipcRenderer.send('api:read-image-file', filePath);
    });
};

const consoleLog = (message) => {
    return new Promise((resolve) => {
        ipcRenderer.send('api:console-log', message);
        resolve(null);
    });
};

const saveImage = (filePath, image) => {
    const { data, width, height } = image.contents;
    const contents = { data, width, height };

    ipcRenderer.send('api:save-image', { filePath, contents });
};

export default {
    quit,
    openFileDialog,
    saveFileDialog,
    openFolderDialog,
    writeFile,
    appendToFile,
    readFile,
    readSoundFile,
    readImageFile,
    openTextFile,
    closeTextFile,
    readTextLine,
    startWatchingFile,
    stopWatchingFile,
    consoleLog,
    saveImage
};