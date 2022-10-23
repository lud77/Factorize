
import * as React from 'react';

import { Panel } from '../../../types/Panel';
import * as Sound from '../../../domain/types/Sound';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

import System from '../../../domain/System';

const panelType = 'SampleLoad';

const inputEndpoints = [{
    name: 'File',
    defaultValue: '',
    type: 'string',
    signal: 'Value'
}];

const outputEndpoints = [{
    name: 'Sound',
    defaultValue: '',
    type: 'sound',
    signal: 'Value'
}];

const panelSizes = {
    ...defaultSizes,
    height: 53
};

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="File" panelId={panelId} {...props}>File</InputEndpoint>
                <OutputEndpoint name="Sound" panelId={panelId} {...props}>Sound</OutputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values) => {
        console.log('execute soundLoad', values);
        if (values.inputFile == '') return { outputSound: null };

        const hasFileChanged = (panel.outputEpValues.oldFile == null) || (values.inputFile != panel.outputEpValues.oldFile);

        const hasChanged = hasFileChanged;

        if (!hasChanged) return {};

        return Promise.resolve()
            .then(() => System.readSoundFile(values.inputFile))
            .then((info) => Sound.loadSample(info.data))
            .then((loadedSound) => {
                return {
                    oldFile: values.inputFile,
                    outputSound: loadedSound
                };
            });
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        ...panelSizes,
        Component,
        execute
    } as Panel;
};

export default {
    type: panelType,
    create,
    tags: ['audio', 'import'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};