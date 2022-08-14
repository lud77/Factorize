const fs = require('fs');
const net = require('net');
const xpipe = require('xpipe');

const separator = '<<<EOM\0';

const attachListeners = (socket, listeners) => {
    listeners.onSocketConnect(socket);

    socket.setEncoding('utf8');

    socket.on('error', listeners.onSocketError);
    socket.on('close', listeners.onSocketDisconnect);
    socket.on('data', listeners.onData(listeners.onMessage, listeners.onSocketError, socket));

    return socket;
};

const send = (socket) => (topic, data) => {
    console.log('sending', topic, data);
    try {
        const packet = JSON.stringify({ topic, data }) + separator;
        socket.write(packet);
        return true;
    } catch (e) {
        return false;
    }
};

const parse = (onMessage, onSocketError, socket, message) => {
    console.log('parsing message', message);
    try {
        const { topic, data } = JSON.parse(message);

        if (topic) {
            onMessage(socket, topic, data, send(socket));
        } else {
            onSocketError(new Error('Invalid data received.'));
        }
    } catch (e) {
        onSocketError(e);
    }
};

const onData = (onMessage, onSocketError, socket) => {
    let buffer = null;

    return (data) => {
        console.log('data received', data);

        if (buffer) {
            buffer += data;
        } else {
            buffer = data;
        }

        if (data.indexOf(separator) !== -1) {
            while(buffer.indexOf(separator) !== -1) {
                const message = buffer.substring(0, buffer.indexOf(separator));
                buffer = buffer.substring(buffer.indexOf(separator) + separator.length);

                if (message) {
                    parse(onMessage, onSocketError, socket, message);
                }
            }
        }
    };
};

const Client = (opts, socketListeners) => {
    const path = xpipe.eq(opts.path);
    console.log(path);

    if (!fs.existsSync(path)) return Promise.resolve({ connection: null });

    return new Promise((res, rej) => {
        const socket = net.createConnection({ path }, () => {
            console.log('connected', socket);

            const connection = attachListeners(socket, {
                ...socketListeners,
                onData
            });

            res({
                connection,
                send: send(connection)
            });
        });
    });
};

const Server = (opts) => {
    const path = xpipe.eq(opts.path);

    let connection = null;

    return Promise.resolve()
        .then(() => {
            return fs.existsSync(path);
        })
        .then((exists) => {
            if (exists) return fs.promises.unlink(path);
        })
        .then(() => {
            const onServerError = (e) => {
                console.log('server error', e);
            };

            const onServerClose = () => {
                console.log('server closing');
            };

            const server = net.createServer();

            server.on('error', onServerError);
            server.on('close', onServerClose);

            const setup = (socketListeners) => {
                server.on('connection', (socket) => {
                    console.log('connection');

                    connection = attachListeners(socket, {
                        ...socketListeners,
                        onData
                    });
                });
            };

            const start = () => {
                return new Promise((res) => {
                    server.listen({ path }, () => {
                        console.log('listening');
                        res(null);
                    });
                });
            };

            const stop = () => {
                return new Promise((res) => {
                    res(server.close());
                });
            };

            return {
                server,
                setup,
                start,
                stop
            };
        });
};

module.exports = {
    Server,
    Client
};