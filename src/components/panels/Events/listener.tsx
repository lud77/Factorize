import { fas } from '@fortawesome/free-solid-svg-icons';
import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

import Sockets from '../../../domain/Sockets';

const panelType = 'Listener';

const create = (panelId: number): Panel => {
    const Component = (props) => {
         return <>
            <div className="Row">
                <InputEndpoint name="Active" panelId={panelId} {...props}>Active</InputEndpoint>
                <OutputEndpoint name="Received" panelId={panelId} signal="Pulse" description="Event received" {...props}>Received</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Topic" panelId={panelId} {...props}>Topic</InputEndpoint>
                <OutputEndpoint name="Message" panelId={panelId} {...props}>Message</OutputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [{
        name: 'Active',
        defaultValue: false,
        type: 'boolean',
        signal: 'Value'
    }, {
        name: 'Topic',
        defaultValue: 'default',
        type: 'string',
        signal: 'Value'
    }];

    const outputEndpoints = [{
        name: 'Received',
        signal: 'Pulse'
    }, {
        name: 'Message',
        defaultValue: '',
        type: 'string',
        signal: 'Value'
    }];

    const onMessage = (panel, { executePanelLogic, sendPulseTo }) => (e, receivedMessage) => {
        console.log('listener - Received message', receivedMessage);
        Promise.resolve()
            .then(() => {
                return executePanelLogic(panel.panelId, { receivedMessage })
            })
            .then(() => {
                sendPulseTo(panel.panelId, 'outputReceived');
            });
    };

    const execute = (panel, values, methods) => {
        console.log('values.receivedMessage', values.receivedMessage);
        if (values.receivedMessage) return { outputMessage: values.receivedMessage };

        return Promise.resolve()
            .then(() => {
                if (panel.outputEpValues.isCreated && values.inputTopic != panel.inputEpValues.inputTopic) {
                    console.log('removing old server');
                    return Sockets.removeServer(panel.inputEpValues.inputTopic)
                        .then(() => ({ isCreated: false }));
                }

                return { isCreated: panel.outputEpValues.isCreated };
            })
            .then((updates) => {
                if (!panel.outputEpValues.isCreated && values.inputTopic) {
                    console.log('starting server');
                    return Sockets.createServer(values.inputTopic, onMessage(panel, methods))
                        .then(() => ({ isCreated: true }));
                };

                return updates;
            })
            .then((updates) => {
                if (!panel.outputEpValues.isListening) {
                    console.log('server is not yet listening');

                    if (values.inputActive) {
                        console.log('starting server');
                        return Sockets.startServer(values.inputTopic)
                            .then(() => ({ ...updates, isListening: true }));
                    }

                    return updates;
                } else {
                    console.log('server is listening', values.inputActive);

                    if (!values.inputActive) {
                        console.log('stopping server');
                        return Sockets.stopServer(values.inputTopic)
                            .then(() => ({ ...updates, isListening: false }));
                    }

                    return updates;
                }
            })
            .then((updates) => ({ ...values, ...updates }));
    };

    // const expunge = [];

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        width: 120,
        height: 74,
        Component,
        execute
    } as Panel;
};

export default {
    type: panelType,
    create
};