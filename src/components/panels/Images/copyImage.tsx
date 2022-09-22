import * as React from 'react';

import { Panel } from '../../../types/Panel';
import { copy } from '../../../domain/Image';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

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
    defaultValue: 0,
    type: 'number',
    signal: 'Value'
}, {
    name: 'Y',
    defaultValue: 0,
    type: 'number',
    signal: 'Value'
}];

const outputEndpoints = [{
    name: 'Image',
    defaultValue: null,
    type: 'image',
    signal: 'Value'
}];

const panelSizes = {
    ...defaultSizes,
    width: 134,
    height: 114
};

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

        if (values.inputSource.ColorModel != values.inputTarget.ColorModel) return { outputImage: null };

        const x = values.inputX ? parseInt(values.inputX) : 0;
        const y = values.inputY ? parseInt(values.inputY) : 0;
        const hasXChanged = (panel.outputEpValues.oldX == null) || (x != panel.outputEpValues.oldX);
        const hasYChanged = (panel.outputEpValues.oldY == null) || (y != panel.outputEpValues.oldY);
        const hasSourceChanged = (panel.outputEpValues.oldSource == null) || (values.inputSource != panel.outputEpValues.oldSource);
        const hasTargetChanged = (panel.outputEpValues.oldTarget == null) || (values.inputTarget != panel.outputEpValues.oldTarget);

        const hasChanged = hasXChanged || hasYChanged || hasSourceChanged || hasTargetChanged;

        if (!hasChanged) return {};

        return Promise.resolve()
            .then(() => {
                return copy(
                    values.inputSource,
                    values.inputTarget,
                    x, y
                );
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
        ...panelSizes,
        Component,
        execute
    } as Panel;
};

export default {
    type: panelType,
    create,
    tags: ['duplicate', 'picture'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};