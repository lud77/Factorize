import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

import System from '../../../domain/System';

const panelType = 'WatchFile';

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="File" panelId={panelId} {...props}>File</InputEndpoint>
                <OutputEndpoint name="Changed" panelId={panelId} signal="Pulse" description="File has changed" {...props}>Changed</OutputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [{
        name: 'File',
        defaultValue: '',
        type: 'string',
        signal: 'Value'
    }];

    const outputEndpoints = [{
        name: 'Changed',
        signal: 'Pulse'
    }];

    const expunge = ['watchedFile', 'watcherHandler', 'isWatching'];

    const execute = (panel, values, { sendPulseTo }) => {
        console.log('execute watchFile', panel.outputEpValues, values);
        const { watchedFile, watcherHandler, isWatching } = panel.outputEpValues;

        return Promise.resolve({ watchedFile, watcherHandler, isWatching })
            .then((updates) => {
                console.log('old vs new file', updates.watchedFile, values.inputFile);
                if (updates.isWatching && updates.watchedFile != values.inputFile) {
                    console.log('removing old watcher as the filePath has changed');
                    return System.stopWatchingFile(panel.outputEpValues.watcherHandler)
                        .then(() => ({
                            watchedFile: undefined,
                            watcherHandler: undefined,
                            isWatching: false
                        }));
                }

                return updates;
            })
            .then((updates) => {
                console.log('should we create a watcher?', 'isWatching', updates.isWatching,  'inputFile', values.inputFile);
                if (!updates.isWatching && values.inputFile) {
                    console.log('starting watcher because it\'s not on, but we have a file');
                    return Promise.resolve()
                        .then(() => {
                            return System.startWatchingFile(panel.inputEpValues.inputFile, () => {
                                console.log('change detected');
                                sendPulseTo(panel.panelId, 'outputChanged');
                            });
                        })
                        .then((watcherHandler) => ({
                            watchedFile: values.inputFile,
                            watcherHandler,
                            isWatching: true
                        }));
                };

                return updates;
            })
            .then((updates) => ({ ...values, ...updates }));
    };

    const dispose = (panel) => {
        if (panel.outputEpValues.isWatching) {
            return System.stopWatchingFile(panel.outputEpValues.watcherHandler);
        }
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        Component,
        execute,
        height: 53,
        expunge,
        dispose
    } as Panel;
};

export default {
    type: panelType,
    create
};