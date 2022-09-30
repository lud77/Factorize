import * as React from 'react';
import { Image } from 'image-js';
import { createNoise2D } from 'simplex-noise';
import alea from 'alea';

import { Panel } from '../../../types/Panel';
import { toImage } from '../../../domain/Image';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'DirectionalNoise';

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
    name: 'Seed',
    defaultValue: 0,
    type: 'number',
    signal: 'Value'
}, {
    name: 'Scale',
    defaultValue: 1,
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
    height: 187
};

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Seed" panelId={panelId} signal="Value" editor="text" {...props}>Seed</InputEndpoint>
                <OutputEndpoint name="Image" panelId={panelId} {...props}>Image</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Width" panelId={panelId} signal="Value" editor="text" {...props}>Width</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Height" panelId={panelId} signal="Value" editor="text" {...props}>Height</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Scale" panelId={panelId} signal="Value" editor="text" {...props}>Scale</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="OffsetX" panelId={panelId} signal="Value" editor="text" {...props}>X Offset</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="OffsetY" panelId={panelId} signal="Value" editor="text" {...props}>Y Offset</InputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values) => {
        console.log('simplex noise execute');

        const seed = parseInt(panel.inputEpValues.inputSeed || '0');
        const width = parseInt(panel.inputEpValues.inputWidth || '0');
        const height = parseInt(panel.inputEpValues.inputHeight || '0');
        const scale = parseFloat(panel.inputEpValues.inputScale || '1') / 100;
        const offsetX = parseFloat(panel.inputEpValues.inputOffsetX || '0');
        const offsetY = parseFloat(panel.inputEpValues.inputOffsetY || '0');

        const hasSeedChanged = (panel.outputEpValues.oldSeed == null) || (seed != panel.outputEpValues.oldSeed);
        const hasWidthChanged = (panel.outputEpValues.oldWidth == null) || (width != panel.outputEpValues.oldWidth);
        const hasHeightChanged = (panel.outputEpValues.oldHeight == null) || (height != panel.outputEpValues.oldHeight);
        const hasScaleChanged = (panel.outputEpValues.oldScale == null) || (scale != panel.outputEpValues.oldScale);
        const hasOffsetXChanged = (panel.outputEpValues.oldOffsetX == null) || (offsetX != panel.outputEpValues.oldOffsetX);
        const hasOffsetYChanged = (panel.outputEpValues.oldOffsetY == null) || (offsetY != panel.outputEpValues.oldOffsetY);

        const hasChanged =
            hasSeedChanged ||
            hasWidthChanged ||
            hasHeightChanged ||
            hasScaleChanged ||
            hasOffsetXChanged ||
            hasOffsetYChanged;

        if (!hasChanged) return {};

        if (width <= 0 || height <= 0 || scale <= 0) return {};

        console.log('create image', hasSeedChanged, seed, width, height, offsetX, offsetY);

        const prng = alea(seed);

        const noise = hasSeedChanged
            ? createNoise2D(prng)
            : panel.outputEpValues.oldNoise

        const size = width * height;
        const data = new Uint8ClampedArray(size);

        const frequency = scale / Math.PI;

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const i = x + y * width;

                const value = Math.ceil(
                    32 + Math.sin(
                        (noise(Math.floor(x - offsetX), 0) * 100 + y - offsetY) * frequency
                    ) * 223
                );

                data[i] += value;
            }
        }

        const outputImage = toImage(new Image({
            width,
            height,
            data,
            kind: 'GREY'
        }));

        return {
            oldSeed: seed,
            oldWidth: width,
            oldHeight: height,
            oldOffsetX: offsetX,
            oldOffsetY: offsetY,
            oldNoise: noise,
            oldScale: scale,
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