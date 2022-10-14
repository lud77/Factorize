import * as React from 'react';

import { Panel } from '../../../types/Panel';
import { color2rgba } from '../../../utils/colors';
import { toImage } from '../../../domain/types/Image';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'PaintText';

const inputEndpoints = [{
    name: 'Image',
    defaultValue: null,
    type: 'image',
    signal: 'Value'
}, {
    name: 'Label',
    defaultValue: '',
    type: 'string',
    signal: 'Value'
}, {
    name: 'Color',
    defaultValue: '#ffff',
    type: 'string',
    signal: 'Value'
}, {
    name: 'Font',
    defaultValue: 'Helvetica',
    type: 'string',
    signal: 'Value'
}, {
    name: 'Size',
    defaultValue: 12,
    type: 'number',
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
}, {
    name: 'Angle',
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
    height: 179
};

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Image" panelId={panelId} signal="Value" {...props}>Image</InputEndpoint>
                <OutputEndpoint name="Image" panelId={panelId} {...props}>Image</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Label" panelId={panelId} signal="Value" editor="text" {...props}>Label</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Color" panelId={panelId} signal="Value" editor="text" {...props}>Color</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Font" panelId={panelId} signal="Value" editor="text" {...props}>Font</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Size" panelId={panelId} signal="Value" editor="text" {...props}>Size</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="X" panelId={panelId} signal="Value" editor="text" {...props}>X</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Y" panelId={panelId} signal="Value" editor="text" {...props}>Y</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Angle" panelId={panelId} signal="Value" editor="text" {...props}>Angle</InputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values) => {
        console.log('paint text execute');

        if (
            values.inputImage == null ||
            values.inputColor == null ||
            values.inputLabel == null ||
            values.inputFont == null ||
            values.inputSize == null ||
            values.inputX == null ||
            values.inputY == null ||
            values.inputAngle == null
        ) return { outputImage: null };

        if (values.inputImage.contents.colorModel != 'RGB') return { outputImage: null };

        const color = color2rgba(values.inputColor);

        if (color == null) return { outputImage: null };

        const x = values.inputX ? parseInt(values.inputX) : 0;
        const y = values.inputY ? parseInt(values.inputY) : 0;
        const angle = values.inputAngle ? parseInt(values.inputAngle) : 0;

        const hasColorChanged = (panel.outputEpValues.oldColor == null) || (values.inputColor != panel.outputEpValues.oldColor);
        const hasLabelChanged = (panel.outputEpValues.oldLabel == null) || (values.inputLabel != panel.outputEpValues.oldLabel);
        const hasFontChanged = (panel.outputEpValues.oldFont == null) || (values.inputFont != panel.outputEpValues.oldFont);
        const hasSizeChanged = (panel.outputEpValues.oldSize == null) || (values.inputSize != panel.outputEpValues.oldSize);
        const hasXChanged = (panel.outputEpValues.oldX == null) || (x != panel.outputEpValues.oldX);
        const hasYChanged = (panel.outputEpValues.oldY == null) || (y != panel.outputEpValues.oldY);
        const hasAngleChanged = (panel.outputEpValues.oldAngle == null) || (values.inputAngle != panel.outputEpValues.oldAngle);
        const hasImageChanged = (panel.outputEpValues.oldImage == null) || (values.inputImage != panel.outputEpValues.oldImage);

        const hasChanged =
            hasXChanged ||
            hasYChanged ||
            hasImageChanged ||
            hasColorChanged ||
            hasLabelChanged ||
            hasFontChanged ||
            hasSizeChanged ||
            hasAngleChanged;

        if (!hasChanged) return {};

        return Promise.resolve()
            .then(() => {
                const result = values.inputImage.contents.clone();

                result.paintLabels([values.inputLabel], [[x, y]], {
                    color,
                    font: `${values.inputSize}px ${values.inputFont}`,
                    rotate: angle
                });

                return toImage(result);
            })
            .then((outputImage) => {
                return {
                    oldX: values.inputX,
                    oldY: values.inputY,
                    oldColor: values.inputColor,
                    oldLabel: values.inputLabel,
                    oldFont: values.inputFont,
                    oldSize: values.inputSize,
                    oldImage: values.inputImage,
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
    tags: ['image', 'picture', 'font', 'label'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};