const { app, BrowserWindow, ipcMain } = require('electron');

const { Server } = require('../socketman');

const topics = {};

const addServices = (win) => {
    ipcMain.on('api:create-server', (event, topic) => {
        console.log('create-server for topic:', topic);
        Promise.resolve()
            .then(() => {
                return Server({ path: `/tmp/factorize-${topic}.sock` });
            })
            .then(({ server, setup, start, stop }) => {
                const onMessage = (socket, topic, data, reply) => {
                    console.log('received message', topic, data);

                    win.webContents.send(`socket:${topic}`, data);
                };

                const onSocketError = (e) => {
                    console.log('socket error', e);
                };

                const onSocketConnect = (socket) => {
                    console.log('socket connected');
                };

                const onSocketDisconnect = (socket) => {
                    console.log('socket disconnected');
                };

                setup({
                    onMessage,
                    onSocketError,
                    onSocketConnect,
                    onSocketDisconnect
                });

                return { server, start, stop };
            })
            .then((serverControls) => {
                topics[topic] = serverControls;
                win.webContents.send('api:ack', {});
            });
    });

    ipcMain.on('api:stop-server', (event, topic) => {
        console.log('stop-server', topic);
        Promise.resolve()
            .then(() => {
                if (!topics[topic]) throw new Error('Server not found');

                return topics[topic].stop();
            })
            .then(() => {
                win.webContents.send('api:ack', {});
            })
            .catch((e) => {
                console.log('error while stopping server', e);
            });
    });

    ipcMain.on('api:start-server', (event, topic) => {
        console.log('start-server', topic);
        Promise.resolve()
            .then(() => {
                if (!topics[topic]) throw new Error('Server not found');

                return topics[topic].start();
            })
            .then(() => {
                win.webContents.send('api:ack', {});
            })
            .catch((e) => {
                console.log('error while restarting server', e);
            });
    });

    ipcMain.on('api:remove-server', (event, topic) => {
        console.log('remove-server', topic);
        Promise.resolve()
            .then(() => {
                if (!topics[topic]) throw new Error('Server not found');

                return topics[topic].stop()
            })
            .then(() => {
                delete topics[topic];
                win.webContents.send('api:ack', {});
            })
            .catch((e) => {
                console.log('error while removing server', e);
            });
    });

    return win;
};

module.exports = addServices;