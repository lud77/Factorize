const { program } = require('commander');

const { Client } = require('../public/js/socketman');


const onMessage = (socket, topic, data, reply) => {
	console.log('client received a response', topic, data);
};

const onSocketError = (e) => {
	console.log('socket error', e);
};

const onSocketConnect = (socket) => {
	console.log('socket connected');
};

const onSocketDisconnect = (socket) => {
	console.log('socket disconnected', socket);
};

const setup = (topic, message) => {
    Promise.resolve()
        .then(() => {
            return Client({
                path: `/tmp/factorize-${topic}.sock`
            }, {
                onMessage,
                onSocketError,
                onSocketConnect,
                onSocketDisconnect
            });
        })
        .then(({ connection, send }) => {
            if (!connection) return;

            send(topic, message);
            connection.destroy();
        });
};

program
    .name('Factorizer CLI')
    .description('Send a message to a running instance of Factorizer')
    .option('-m, --message <string>', 'message to send')
    .option('-c, --topic <string>', 'topic to use')
    .version('0.8.0');

program.parse();
const options = program.opts();

console.log('test', options);
if (options.topic && options.message) {
    setup(options.topic, options.message);
}
