import * as React from 'react';

import { Panel } from '../../../types/Panel';
import GradientTypes from '../../../domain/GradientTypes';
import * as Image from '../../../domain/types/Image';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'CircularGradient';

const inputEndpoints = [{
    name: 'Width',
    defaultValue: 100,
    type: 'number',
    signal: 'Value'
}, {
    name: 'Height',
    defaultValue: 100,
    type: 'number',
    signal: 'Value'
}, {
    name: 'OffsetX',
    defaultValue: 0,
    type: 'number',
    signal: 'Value'
}, {
    name: 'OffsetY',
    defaultValue: 0,
    type: 'number',
    signal: 'Value'
}, {
    name: 'Angle',
    defaultValue: 0,
    type: 'number',
    signal: 'Value'
}, {
    name: 'Length',
    defaultValue: 100,
    type: 'number',
    signal: 'Value'
}, {
    name: 'Gradient',
    defaultValue: null,
    type: 'gradient',
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
    height: 177
};

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Gradient" panelId={panelId} signal="Value" {...props}>Gradient</InputEndpoint>
                <OutputEndpoint name="Image" panelId={panelId} {...props}>Image</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Width" panelId={panelId} signal="Value" editor="text" {...props}>Width</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Height" panelId={panelId} signal="Value" editor="text" {...props}>Height</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="OffsetX" panelId={panelId} signal="Value" editor="text" {...props}>X Offset</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="OffsetY" panelId={panelId} signal="Value" editor="text" {...props}>Y Offset</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Angle" panelId={panelId} signal="Value" editor="text" {...props}>Angle</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Length" panelId={panelId} signal="Value" editor="text" {...props}>Length</InputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values) => {
        console.log('gradient execute');

        if (
            values.inputGradient == null ||
            values.inputGradient.contents == null ||
            !values.inputGradient.contents.length ||
            values.inputGradient.contents.length < 2
        ) return { outputImage: null };

        const width = parseInt(values.inputWidth || '0');
        const height = parseInt(values.inputHeight || '0');
        const offsetX = parseInt(values.inputOffsetX || '0');
        const offsetY = parseInt(values.inputOffsetY || '0');
        const length = parseInt(values.inputLength || '1');
        const angle = parseInt(values.inputAngle || '0');
        const gradientText = JSON.stringify(values.inputGradient.contents);

        const hasOffsetXChanged = (panel.outputEpValues.oldOffsetX == null) || (offsetX != panel.outputEpValues.oldOffsetX);
        const hasOffsetYChanged = (panel.outputEpValues.oldOffsetY == null) || (offsetY != panel.outputEpValues.oldOffsetY);
        const hasWidthChanged = (panel.outputEpValues.oldWidth == null) || (width != panel.outputEpValues.oldWidth);
        const hasHeightChanged = (panel.outputEpValues.oldHeight == null) || (height != panel.outputEpValues.oldHeight);
        const hasAngleChanged = (panel.outputEpValues.oldAngle == null) || (angle != panel.outputEpValues.oldAngle);
        const hasLengthChanged = (panel.outputEpValues.oldLength == null) || (length != panel.outputEpValues.oldLength);
        const hasGradientChanged = (panel.outputEpValues.oldGradient == null) || (gradientText != panel.outputEpValues.oldGradient);

        const hasChanged =
            hasOffsetXChanged ||
            hasOffsetYChanged ||
            hasWidthChanged ||
            hasHeightChanged ||
            hasAngleChanged ||
            hasLengthChanged ||
            hasGradientChanged;

        if (!hasChanged) return {};

        const outputImage = Image.generatePattern(width, height, GradientTypes.Circular(offsetX, offsetY, angle, length, values.inputGradient));

        return {
            oldOffsetX: offsetX,
            oldOffsetY: offsetY,
            oldWidth: width,
            oldAngle: angle,
            oldLength: length,
            oldGradient: gradientText,
            outputImage
        };
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        ...panelSizes,
        Component,
        execute
    } as unknown as Panel;
};

const PanelBundle = {
    type: panelType,
    create,
    tags: ['picture', 'create', 'new', 'rainbow'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};

export default PanelBundle;