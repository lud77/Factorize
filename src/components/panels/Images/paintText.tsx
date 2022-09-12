import * as React from 'react';

import { Panel } from '../../../types/Panel';
import { hex2rgba } from '../../../utils/colors';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

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
    name: 'Hex',
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

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Image" panelId={panelId} signal="Value" {...props}>Image</InputEndpoint>
                <OutputEndpoint name="Image" panelId={panelId} {...props}>Image</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Label" panelId={panelId} signal="Value" editable={true} {...props}>Label</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Hex" panelId={panelId} signal="Value" editable={true} {...props}>Hex</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Font" panelId={panelId} signal="Value" editable={true} {...props}>Font</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Size" panelId={panelId} signal="Value" editable={true} {...props}>Size</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="X" panelId={panelId} signal="Value" editable={true} {...props}>X</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Y" panelId={panelId} signal="Value" editable={true} {...props}>Y</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Angle" panelId={panelId} signal="Value" editable={true} {...props}>Angle</InputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values) => {
        console.log('paint text execute');

        if (
            values.inputImage == null ||
            values.inputHex == null ||
            values.inputLabel == null ||
            values.inputFont == null ||
            values.inputSize == null ||
            values.inputX == null ||
            values.inputY == null ||
            values.inputAngle == null
        ) return { outputImage: null };

        const color = hex2rgba(values.inputHex);

        if (color == null) return { outputImage: null };

        const x = values.inputX ? parseInt(values.inputX) : 0;
        const y = values.inputY ? parseInt(values.inputY) : 0;
        const angle = values.inputAngle ? parseInt(values.inputAngle) : 0;

        const hasHexChanged = (panel.outputEpValues.oldHex == null) || (values.inputHex != panel.outputEpValues.oldHex);
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
            hasHexChanged ||
            hasLabelChanged ||
            hasFontChanged ||
            hasSizeChanged ||
            hasAngleChanged;

        if (!hasChanged) return { outputImage: null };

        return Promise.resolve()
            .then(() => {
                const result = values.inputImage.clone();

                result.paintLabels([values.inputLabel], [[x, y]], {
                    color,
                    font: `${values.inputSize}px ${values.inputFont}`,
                    rotate: angle
                });

                return result;
            })
            .then((outputImage) => {
                return {
                    oldX: values.inputX,
                    oldY: values.inputY,
                    oldHex: values.inputHex,
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
        width: 134,
        height: 179,
        Component,
        execute
    } as Panel;
};

export default {
    type: panelType,
    create,
    inputEndpoints,
    outputEndpoints
};