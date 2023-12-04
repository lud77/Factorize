import * as React from 'react';

import { Panel } from '../../../types/Panel';
import { color2rgba } from '../../../utils/colors';
import * as Image from '../../../domain/types/Image';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'Resize';

const inputEndpoints = [{
    name: 'Image',
    defaultValue: null,
    type: 'image',
    signal: 'Value'
}, {
    name: 'Color',
    defaultValue: '#ffff',
    type: 'string',
    signal: 'Value'
}, {
    name: 'VAlign',
    defaultValue: 'center',
    type: 'string',
    signal: 'Value'
}, {
    name: 'HAlign',
    defaultValue: 'center',
    type: 'string',
    signal: 'Value'
}, {
    name: 'Width',
    defaultValue: 200,
    type: 'number',
    signal: 'Value'
}, {
    name: 'Height',
    defaultValue: 200,
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
    height: 156
};

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Image" panelId={panelId} signal="Value" {...props}>Image</InputEndpoint>
                <OutputEndpoint name="Image" panelId={panelId} {...props}>Image</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="VAlign" panelId={panelId} signal="Value" editor="text" {...props}>Vert Align</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="HAlign" panelId={panelId} signal="Value" editor="text" {...props}>Horiz Align</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Color" panelId={panelId} signal="Value" editor="text" {...props}>Color</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Width" panelId={panelId} signal="Value" editor="text" {...props}>Width</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Height" panelId={panelId} signal="Value" editor="text" {...props}>Height</InputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values) => {
        console.log('resize image execute');

        if (values.inputImage == null || values.inputVAlign == null || values.inputHAlign == null) return { outputImage: null };

        if (Image.vAnchorMultiplier[values.inputVAlign] == null || Image.hAnchorMultiplier[values.inputHAlign] == null) return { outputImage: null };

        if (values.inputColor == null) return { outputImage: null };

        const color = color2rgba(values.inputColor);

        if (color == null) return { outputImage: null };

        const width = values.inputWidth ? parseInt(values.inputWidth) : undefined;
        const height = values.inputHeight ? parseInt(values.inputHeight) : undefined;

        const hasImageChanged = (panel.outputEpValues.oldImage == null) || (values.inputImage != panel.outputEpValues.oldImage);
        const hasColorChanged = (panel.outputEpValues.oldColor == null) || (values.inputColor != panel.outputEpValues.oldColor);
        const hasVAlignChanged = (panel.outputEpValues.oldVAlign == null) || (values.inputVAlign != panel.outputEpValues.oldVAlign);
        const hasHAlignChanged = (panel.outputEpValues.oldHAlign == null) || (values.inputHAlign != panel.outputEpValues.oldHAlign);
        const hasWidthChanged = (panel.outputEpValues.oldWidth == null) || (width != panel.outputEpValues.oldWidth);
        const hasHeightChanged = (panel.outputEpValues.oldHeight == null) || (height != panel.outputEpValues.oldHeight);

        const hasChanged =
            hasImageChanged ||
            hasColorChanged ||
            hasWidthChanged ||
            hasHeightChanged ||
            hasVAlignChanged ||
            hasHAlignChanged;

        if (!hasChanged) return {};

        return Promise.resolve()
            .then(() => Image.resize(
                values.inputImage,
                width,
                height,
                values.inputHAlign,
                values.inputVAlign,
                color
            ))
            .then((outputImage) => {
                return {
                    oldImage: values.inputImage,
                    oldWidth: width,
                    oldHeight: height,
                    oldColor: values.inputColor,
                    oldVAlign: values.inputVAlign,
                    oldHAlign: values.inputHAlign,
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

const PanelBundle = {
    type: panelType,
    create,
    tags: ['image', 'perlin', 'size', 'zoom'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};

export default PanelBundle;