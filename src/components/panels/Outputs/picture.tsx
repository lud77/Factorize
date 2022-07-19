import { update } from 'immutable';
import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const { ipcRenderer } = window.require('electron');

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Path" panelId={panelId} {...props}>Path</InputEndpoint>
                <OutputEndpoint name="PictureData" panelId={panelId} {...props}>Picture</OutputEndpoint>
            </div>
            <div className="Row">
                <OutputEndpoint name="PictureWidth" panelId={panelId} {...props}>Width</OutputEndpoint>
            </div>
            <div className="Row">
                <OutputEndpoint name="PictureHeight" panelId={panelId} {...props}>Height</OutputEndpoint>
            </div>
            <div className="Row">
                {
                    props.panel.outputEpValues.outputPictureData
                        ? <img
                            src={props.panel.outputEpValues.outputPictureData}
                            style={{
                                width: '100%',
                                marginTop: '6px',
                                backgroundColor: 'black'
                            }}
                            />
                        : null
                }
            </div>
        </>;
    };

    const inputEndpoints = [{
        name: 'Path',
        defaultValue: '',
        signal: 'Value'
    }];

    const outputEndpoints = [{
        name: 'PictureData',
        defaultValue: '',
        signal: 'Value'
    }, {
        name: 'PictureWidth',
        defaultValue: '',

        signal: 'Value'
    }, {
        name: 'PictureHeight',
        defaultValue: '',
        signal: 'Value'
    }];

    const execute = (panel, inputs, setPanels) => {
        console.log('execute picture', inputs);
        if (inputs.inputPath == '') {
            setPanels((panels) => {
                const updatePanel = panels[panel.panelId];

                return {
                    ...panels,
                    [panel.panelId]: {
                        ...updatePanel,
                        height: 94
                    }
                };
            });

            return {
                outputPictureData: '',
                outputPictureWidth: '',
                outputPictureHeight: ''
            };
        }

        return new Promise((resolve, reject) => {
            ipcRenderer.once('api:file-contents', (e, msg) => {
                console.log('received', msg);

                setPanels((panels) => {
                    const updatePanel = panels[panel.panelId];

                    return {
                        ...panels,
                        [panel.panelId]: {
                            ...updatePanel,
                            height: 109 + (111 * ((msg.meta.height || 0) / (msg.meta.width || 1)))
                        }
                    };
                });

                resolve({
                    outputPictureData: msg.data,
                    outputPictureWidth: msg.meta.width,
                    outputPictureHeight: msg.meta.height
                });
            });
            ipcRenderer.send('api:read-file', inputs.inputPath);
        });
    };

    return {
        type: 'Picture',
        starter: true,
        inputEndpoints,
        outputEndpoints,
        Component,
        execute,
        height: 94
    } as Panel;
};

export default {
    create
};