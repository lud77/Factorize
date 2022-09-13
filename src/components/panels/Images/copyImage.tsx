import * as React from 'react';
import copy from 'image-js/src/image/internal/copy';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'CopyImage';

const inputEndpoints = [{
    name: 'Source',
    defaultValue: null,
    type: 'image',
    signal: 'Value'
}, {
    name: 'Target',
    defaultValue: null,
    type: 'image',
    signal: 'Value'
}, {
    name: 'X',
    defaultValue: null,
    type: 'number',
    signal: 'Value'
}, {
    name: 'Y',
    defaultValue: null,
    type: 'number',
    signal: 'Value'
}];

const outputEndpoints = [{
    name: 'Image',
    defaultValue: null,
    type: 'image',
    signal: 'Value'
}];

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Source" panelId={panelId} signal="Value" {...props}>Source</InputEndpoint>
                <OutputEndpoint name="Image" panelId={panelId} {...props}>Image</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Target" panelId={panelId} signal="Value" {...props}>Target</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="X" panelId={panelId} signal="Value" editable={true} {...props}>X</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Y" panelId={panelId} signal="Value" editable={true} {...props}>Y</InputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values) => {
        console.log('copy image execute');

        if (values.inputSource == null || values.inputTarget == null) return { outputImage: null };

        const x = values.inputX ? parseInt(values.inputX) : 0;
        const y = values.inputY ? parseInt(values.inputY) : 0;
        const hasXChanged = (panel.outputEpValues.oldX == null) || (x != panel.outputEpValues.oldX);
        const hasYChanged = (panel.outputEpValues.oldY == null) || (y != panel.outputEpValues.oldY);
        const hasSourceChanged = (panel.outputEpValues.oldSource == null) || (values.inputSource != panel.outputEpValues.oldSource);
        const hasTargetChanged = (panel.outputEpValues.oldTarget == null) || (values.inputTarget != panel.outputEpValues.oldTarget);

        const hasChanged = hasXChanged || hasYChanged || hasSourceChanged || hasTargetChanged;

        if (!hasChanged) return { outputImage: null };

        return Promise.resolve()
            .then(() => {
                const result = values.inputTarget.clone();

                copy(
                    values.inputSource,
                    result,
                    x, y
                );

                return result;
            })
            .then((outputImage) => {
                return {
                    oldX: values.inputX,
                    oldY: values.inputY,
                    oldSource: values.inputSource,
                    oldTarget: values.inputTarget,
                    outputImage
                };
            });
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        width: 134,
        height: 93,
        Component,
        execute
    } as Panel;
};

export default {
    type: panelType,
    create,
    tags: ['duplicate', 'picture'],
    inputEndpoints,
    outputEndpoints
};