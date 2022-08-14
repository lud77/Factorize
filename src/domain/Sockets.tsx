const { ipcRenderer } = window.require('electron');

const createServer = (topic, messageReceived) => {
    console.log('Sockets - createServer', topic);
    return new Promise((resolve) => {
        ipcRenderer.once('api:ack', (e, msg) => {
            console.log('received ack');

            resolve(null);
        });
        ipcRenderer.on(`socket:${topic}`, messageReceived);
        ipcRenderer.send('api:create-server', topic);
    });
};

const stopServer = (topic) => {
    console.log('Sockets - stopServer', topic);
    return new Promise((resolve) => {
        ipcRenderer.once('api:ack', (e, msg) => {
            console.log('received ack');

            resolve(null);
        });
        ipcRenderer.send('api:stop-server', topic);
    });
};

const startServer = (topic) => {
    console.log('Sockets - startServer', topic);
    return new Promise((resolve) => {
        ipcRenderer.once('api:ack', (e, msg) => {
            console.log('received ack');

            resolve(null);
        });
        ipcRenderer.send('api:start-server', topic);
    });
};

const stopAndRemoveServer = (topic) => {
    console.log('Sockets - removeServer', topic);
    return new Promise((resolve) => {
        ipcRenderer.once('api:ack', (e, msg) => {
            console.log('received ack');

            ipcRenderer.removeAllListeners(`socket:${topic}`);
            resolve(null);
        });
        ipcRenderer.send('api:remove-server', topic);
    });
};

export default {
    createServer,
    stopServer,
    startServer,
    stopAndRemoveServer
};