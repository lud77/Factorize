import { update } from 'immutable';
import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

import System from '../../../domain/System';

const panelType = 'Picture';

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="File" panelId={panelId} {...props}>File</InputEndpoint>
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
        name: 'File',
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

    const execute = (panel, inputs, { setPanels }) => {
        console.log('execute picture', inputs);
        if (inputs.inputFile == '') {
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

        return System.readImageFile(inputs.inputFile)
            .then((info) => {
                const res = {
                    outputPictureData: info.data,
                    outputPictureWidth: info.meta.width,
                    outputPictureHeight: info.meta.height
                };

                setPanels((panels) => {
                    const updatePanel = panels[panel.panelId];

                    return {
                        ...panels,
                        [panel.panelId]: {
                            ...updatePanel,
                            height: 109 + (111 * ((res.outputPictureHeight || 0) / (res.outputPictureWidth || 1)))
                        }
                    };
                });

                return res;
            });
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        Component,
        execute,
        height: 94
    } as Panel;
};

export default {
    type: panelType,
    create
};