import * as React from 'react';

import { Panel } from '../../../types/Panel';
import { createHeightmap } from '../../../domain/types/Image';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'Heightmap';

const inputEndpoints = [{
    name: 'Heightmap',
    defaultValue: null,
    type: 'image',
    signal: 'Value'
}, {
    name: 'Gradient',
    defaultValue: null,
    type: 'gradient',
    signal: 'Value'
}];

const outputEndpoints = [{
    name: 'Result',
    defaultValue: null,
    type: 'image',
    signal: 'Value'
}];

const panelSizes = {
    ...defaultSizes,
    width: 134,
    height: 74
};

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Heightmap" panelId={panelId} signal="Value" {...props}>Heightmap</InputEndpoint>
                <OutputEndpoint name="Result" panelId={panelId} {...props}>Result</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Gradient" panelId={panelId} signal="Value" {...props}>Gradient</InputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values) => {
        console.log('heightmap execute');

        if (values.inputHeightmap == null || values.inputGradient == null || values.inputGradient.contents == null) return { outputResult: null };

        const gradientText = JSON.stringify(values.inputGradient.contents);

        const hasHeightmapChanged = (panel.outputEpValues.oldHeightmap == null) || (values.inputHeightmap != panel.outputEpValues.oldHeightmap);
        const hasGradientChanged = (panel.outputEpValues.oldGradient == null) || (gradientText != panel.outputEpValues.oldGradient);

        const hasChanged =
            hasHeightmapChanged ||
            hasGradientChanged;

        if (!hasChanged) return {};

        return Promise.resolve()
            .then(() => {
                return createHeightmap(
                    values.inputHeightmap,
                    values.inputGradient
                );
            })
            .then((outputResult) => ({
                oldHeightmap: values.inputHeightmap,
                oldGradient: gradientText,
                outputResult
            }))
            .catch(() => {
                return { outputResult: null };
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
    tags: ['picture', 'colorize', 'blend'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};