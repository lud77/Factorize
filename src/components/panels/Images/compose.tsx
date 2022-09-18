import * as React from 'react';
import { Image } from 'image-js';

import { Panel } from '../../../types/Panel';
import { hex2rgba } from '../../../utils/colors';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'Compose';

const composeImage = (R, G, B, A) => {
    const { width, height } = R;
    const hasAlpha = A != null;
    const channels = 4;

    const size = width * height;
    const data = new Uint8ClampedArray(size * channels);

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const i = (x + y * width);
            const o = i * channels;
            data[o] = R.data[i];
            data[o + 1] = G.data[i];
            data[o + 2] = B.data[i];
            data[o + 3] = hasAlpha ? A.data[i]: 255;
        }
    }

    return new Image({
        width,
        height,
        data,
        kind: 'RGBA'
    });
};

const inputEndpoints = [{
    name: 'R',
    defaultValue: null,
    type: 'image',
    signal: 'Value'
}, {
    name: 'G',
    defaultValue: null,
    type: 'image',
    signal: 'Value'
}, {
    name: 'B',
    defaultValue: null,
    type: 'image',
    signal: 'Value'
}, {
    name: 'A',
    defaultValue: null,
    type: 'image',
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
    width: 94,
    height: 116
};

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="R" panelId={panelId} signal="Value" {...props}>R</InputEndpoint>
                <OutputEndpoint name="Image" panelId={panelId} {...props}>Image</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="G" panelId={panelId} signal="Value" {...props}>G</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="B" panelId={panelId} signal="Value" {...props}>B</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="A" panelId={panelId} signal="Value" {...props}>A</InputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values) => {
        console.log('compose execute');

        if (values.inputR == null || values.inputG == null || values.inputB == null) return { outputImage: null };

        const hasRChanged = (panel.outputEpValues.oldR == null) || (values.inputR != panel.outputEpValues.oldR);
        const hasGChanged = (panel.outputEpValues.oldG == null) || (values.inputG != panel.outputEpValues.oldG);
        const hasBChanged = (panel.outputEpValues.oldB == null) || (values.inputB != panel.outputEpValues.oldB);
        const hasAChanged = (panel.outputEpValues.oldA == null) || (values.inputA != panel.outputEpValues.oldA);

        const hasChanged = hasRChanged || hasGChanged || hasBChanged || hasAChanged;

        if (!hasChanged) return { outputImage: null };

        const outputImage = composeImage(values.inputR, values.inputG, values.inputB, values.inputA);

        return {
            oldR: values.inputR,
            oldG: values.inputG,
            oldB: values.inputB,
            oldA: values.inputA,
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
    tags: ['picture', 'create', 'new'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};