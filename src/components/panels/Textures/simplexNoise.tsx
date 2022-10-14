import * as React from 'react';

import { Panel } from '../../../types/Panel';
import NoiseTypes from '../../../domain/NoiseTypes';
import * as Image from '../../../domain/types/Image';
import { color2rgba } from '../../../utils/colors';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'SimplexNoise';

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
    name: 'Seed',
    defaultValue: 0,
    type: 'number',
    signal: 'Value'
}, {
    name: 'Octaves',
    defaultValue: 1,
    type: 'number',
    signal: 'Value'
}, {
    name: 'HPeriod',
    defaultValue: 1,
    type: 'number',
    signal: 'Value'
}, {
    name: 'VPeriod',
    defaultValue: 1,
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
    name: 'Foreground',
    defaultValue: '#ffff',
    type: 'string',
    signal: 'Value'
}, {
    name: 'Background',
    defaultValue: '#000f',
    type: 'string',
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
    height: 261
};

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Seed" panelId={panelId} signal="Value" editor="text" {...props}>Seed</InputEndpoint>
                <OutputEndpoint name="Image" panelId={panelId} {...props}>Image</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Octaves" panelId={panelId} signal="Value" editor="text" {...props}>Octaves</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Width" panelId={panelId} signal="Value" editor="text" {...props}>Width</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Height" panelId={panelId} signal="Value" editor="text" {...props}>Height</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="HPeriod" panelId={panelId} signal="Value" editor="text" {...props}>X Scale</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="VPeriod" panelId={panelId} signal="Value" editor="text" {...props}>Y Scale</InputEndpoint>
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
                <InputEndpoint name="Foreground" panelId={panelId} signal="Value" editor="text" {...props}>Foreground</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Background" panelId={panelId} signal="Value" editor="text" {...props}>Background</InputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values) => {
        console.log('simplex noise execute');

        if (values.inputForeground == null || values.inputBackground == null) return { outputImage: null };

        const color = color2rgba(values.inputForeground);
        const bgcolor = color2rgba(values.inputBackground);

        if (color == null || bgcolor == null) return { outputImage: null };

        const seed = parseInt(values.inputSeed || '0');
        const width = parseInt(values.inputWidth || '0');
        const height = parseInt(values.inputHeight || '0');
        const hPeriod = parseFloat(values.inputHPeriod || '0') / 100;
        const vPeriod = parseFloat(values.inputVPeriod || '0') / 100;
        const octaves = parseInt(values.inputOctaves || '1');
        const offsetX = parseFloat(values.inputOffsetX || '0');
        const offsetY = parseFloat(values.inputOffsetY || '0');
        const angle = parseInt(values.inputAngle || '0');

        const hasForegroundChanged = (panel.outputEpValues.oldForeground == null) || (color.toString() != panel.outputEpValues.oldForeground.toString());
        const hasBackgroundChanged = (panel.outputEpValues.oldBackground == null) || (bgcolor.toString() != panel.outputEpValues.oldBackground.toString());
        const hasSeedChanged = (panel.outputEpValues.oldSeed == null) || (seed != panel.outputEpValues.oldSeed);
        const hasWidthChanged = (panel.outputEpValues.oldWidth == null) || (width != panel.outputEpValues.oldWidth);
        const hasHeightChanged = (panel.outputEpValues.oldHeight == null) || (height != panel.outputEpValues.oldHeight);
        const hasHPeriodChanged = (panel.outputEpValues.oldHPeriod == null) || (hPeriod != panel.outputEpValues.oldHPeriod);
        const hasVPeriodChanged = (panel.outputEpValues.oldVPeriod == null) || (vPeriod != panel.outputEpValues.oldVPeriod);
        const hasOctavesChanged = (panel.outputEpValues.oldOctaves == null) || (octaves != panel.outputEpValues.oldOctaves);
        const hasOffsetXChanged = (panel.outputEpValues.oldOffsetX == null) || (offsetX != panel.outputEpValues.oldOffsetX);
        const hasOffsetYChanged = (panel.outputEpValues.oldOffsetY == null) || (offsetY != panel.outputEpValues.oldOffsetY);
        const hasAngleChanged = (panel.outputEpValues.oldAngle == null) || (angle != panel.outputEpValues.oldAngle);

        const hasChanged =
            hasForegroundChanged ||
            hasBackgroundChanged ||
            hasWidthChanged ||
            hasHeightChanged ||
            hasHPeriodChanged ||
            hasVPeriodChanged ||
            hasOffsetXChanged ||
            hasOffsetYChanged ||
            hasSeedChanged ||
            hasOctavesChanged ||
            hasAngleChanged;

        if (!hasChanged) return {};

        if (width <= 0 || height <= 0 || vPeriod < 0 || hPeriod < 0 || octaves <= 0) return {};

        const outputImage = Image.generatePattern(width, height, NoiseTypes.Simplex(seed, octaves, hPeriod, vPeriod, offsetX, offsetY, angle, color, bgcolor));

        return {
            oldSeed: seed,
            oldForeground: values.inputForeground,
            oldBackground: values.inputBackground,
            oldWidth: width,
            oldHeight: height,
            oldOffsetX: offsetX,
            oldOffsetY: offsetY,
            oldHPeriod: hPeriod,
            oldVPeriod: vPeriod,
            oldOctaves: octaves,
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
    } as Panel;
};

export default {
    type: panelType,
    create,
    tags: ['picture', 'image', 'perlin', 'generative'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};