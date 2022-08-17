import os from 'os';
import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

import System from '../../../domain/System';

const panelType = 'TextFile';

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Read" panelId={panelId} signal="Pulse" description="Read a [Line] from the text [File]" {...props}>Read</InputEndpoint>
                <OutputEndpoint name="EOF" panelId={panelId} signal="Pulse" description="End of file" {...props}>EOF</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="File" panelId={panelId} {...props}>File</InputEndpoint>
                <OutputEndpoint name="Next" panelId={panelId} signal="Pulse" description="Line read" {...props}>Next</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Rewind" panelId={panelId} signal="Pulse" description="Restart from beginning of text [File]" {...props}>Rewind</InputEndpoint>
                <OutputEndpoint name="Line" panelId={panelId} {...props}>Line</OutputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [{
        name: 'Read',
        signal: 'Pulse'
    }, {
        name: 'File',
        defaultValue: '',
        type: 'string',
        signal: 'Value'
    }, {
        name: 'Rewind',
        signal: 'Pulse'
    }];

    const outputEndpoints = [{
        name: 'EOF',
        signal: 'Pulse'
    }, {
        name: 'Next',
        signal: 'Pulse'
    }, {
        name: 'Line',
        defaultValue: '',
        type: 'string',
        signal: 'Value'
    }];

    const expunge = ['outputFileHandler'];

    const onPulse = (ep, panel, { sendPulseTo, executePanelLogic }) => {
        switch (ep) {
            case 'inputRead':
                if (panel.inputEpValues.inputFile === '') return {};

                System.readTextLine(panel.outputEpValues.outputFileHandler)
                    .then((receivedLine) => {
                        executePanelLogic(panel.panelId, { receivedLine })
                            .then(() => {
                                if (receivedLine == null) {
                                    sendPulseTo(panel.panelId, 'outputEOF');
                                } else {
                                    sendPulseTo(panel.panelId, 'outputNext');
                                }
                            });
                    });

                return {};

            case 'inputRewind':
                if (panel.inputEpValues.inputFile === '') return {};
                if (panel.outputEpValues.outputFileHandler == null) return {};

                Promise.resolve()
                    .then(() => {
                        return System.closeTextFile(panel.outputEpValues.outputFileHandler);
                    })
                    .then(() => {
                        return System.openTextFile(panel.inputEpValues.inputFile);
                    })
                    .then((receivedFileHandler) => {
                        return executePanelLogic(panel.panelId, { receivedFileHandler });
                    });

                return {};
        }
    };

    const execute = (panel, values) => {
        console.log('execute textFile', panel.outputEpValues, values);
        if (values.receivedFileHandler) {
            console.log('values.receivedFileHandler', values.receivedFileHandler);
            return { outputFileHandler: values.receivedFileHandler };
        }

        if (panel.outputEpValues.outputFileHandler != null) {
            console.log('handler already set', panel.inputEpValues.inputFile);
            if (panel.inputEpValues.inputFile == '') {
                console.log('filePath is empty - closing file');
                return Promise.resolve()
                    .then(() => {
                        return System.closeTextFile(panel.outputEpValues.outputFileHandler);
                    })
                    .then(() => {
                        return { outputFileHandler: null };
                    });
            }
        } else {
            console.log('handler not set yet', panel.inputEpValues.inputFile);
            if (panel.inputEpValues.inputFile !== '') {
                console.log('filePath is set - opening file');
                return Promise.resolve()
                    .then(() => {
                        return System.openTextFile(panel.inputEpValues.inputFile)
                    })
                    .then((outputFileHandler) => {
                        return { outputFileHandler };
                    });
            }
        }

        console.log('values.receivedLine', values.receivedLine);
        if (values.receivedLine) return { outputLine: values.receivedLine };
        return values;
    };

    const dispose = (panel) => {
        if (panel.outputEpValues.outputFileHandler != null) {
            return System.closeTextFile(panel.outputEpValues.outputFileHandler)
        }
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        Component,
        execute,
        onPulse,
        height: 95,
        expunge,
        dispose
    } as Panel;
};

export default {
    type: panelType,
    create
};