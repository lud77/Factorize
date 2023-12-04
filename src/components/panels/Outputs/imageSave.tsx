import os from 'os';
import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

import System from '../../../domain/System';

const panelType = 'ImageSave';

const inputEndpoints = [{
    name: 'Save',
    signal: 'Pulse'
}, {
    name: 'Image',
    defaultValue: null,
    type: 'image',
    signal: 'Value'
}, {
    name: 'File',
    defaultValue: '',
    type: 'string',
    signal: 'Value'
}];

const outputEndpoints = [];

const panelSizes = {
    ...defaultSizes,
    height: 94
};

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Save" panelId={panelId} signal="Pulse" description="Save [Image] to the [File]" {...props}>Save</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Image" panelId={panelId} {...props}>Image</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="File" panelId={panelId} {...props}>File</InputEndpoint>
            </div>
        </>;
    };

    const onPulse = (ep, panel) => {
        switch (ep) {
            case 'inputSave':
                if (panel.inputEpValues.inputFile === '' || panel.inputEpValues.inputImage == null) return {};
                console.log('input save');
                return Promise.resolve()
                    .then(() => System.saveImage(panel.inputEpValues.inputFile, panel.inputEpValues.inputImage))
                    .then(() => ({}));
        }
    };

    const execute = (panel, values) => values;

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        ...panelSizes,
        Component,
        execute,
        onPulse
    } as Panel;
};

const PanelBundle = {
    type: panelType,
    create,
    tags: ['output', 'export', 'tiff', 'jpg', 'png', 'bmp', 'gif'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};

export default PanelBundle;