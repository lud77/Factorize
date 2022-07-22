const { ipcRenderer } = window.require('electron');

const quit = () => {
    ipcRenderer.send('api:terminate-app');
};

const openFileDialog = (fileType = '') => {
    return new Promise((resolve) => {
        ipcRenderer.send('api:select-file', fileType);
        ipcRenderer.once('api:file-path', (e, msg) => {
            console.log(msg);
            if (msg.cancelled) return resolve(null);

            resolve(msg.path);
        });
    });
};



export default {
    openFileDialog,
    quit
};