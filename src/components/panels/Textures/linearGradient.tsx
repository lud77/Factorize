import * as React from 'react';

import { Panel } from '../../../types/Panel';
import GradientTypes from '../../../domain/GradientTypes';
import { color2rgba } from '../../../utils/colors';
import * as Image from '../../../domain/Image';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'Gradient';

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
    name: 'Offset',
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
    defaultValue: [],
    type: 'array',
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
    height: 93
};

const create = (panelId: number): Panel => {
    const handleChange = ({ panel, machine }) => (e) => {
        machine.executePanelLogic(panelId, { tuningGradientType: e.target.value });

        return true;
    };

    const Component = (props) => {
        return <>
            <div className="Row">
                <div className="InteractiveItem">
                    <select
                        onChange={handleChange(props)}
                        defaultValue={ props.panel.outputEpValues.outputPatternType || 'Checkers' }
                        style={{ width: '100%', borderRadius: '5px', border: 'none' }}
                        >
                        {
                            Object.keys(GradientTypes).map((gradientType, key) => (<option key={key}>{gradientType}</option>))
                        }
                    </select>
                </div>
            </div>
            <div className="Row">
                <InputEndpoint name="Color" panelId={panelId} signal="Value" editable={true} {...props}>Color</InputEndpoint>
                <OutputEndpoint name="Image" panelId={panelId} {...props}>Image</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Width" panelId={panelId} signal="Value" editable={true} {...props}>Width</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Height" panelId={panelId} signal="Value" editable={true} {...props}>Height</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Offset" panelId={panelId} signal="Value" editable={true} {...props}>Offset</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Angle" panelId={panelId} signal="Value" editable={true} {...props}>Angle</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Length" panelId={panelId} signal="Value" editable={true} {...props}>Length</InputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values) => {
        console.log('gradient execute');

        if (values.inputGradient == null) return { outputImage: null };

        const width = parseInt(values.inputWidth || '0');
        const height = parseInt(values.inputHeight || '0');
        const offset = parseInt(values.inputOffset || '0');
        const length = parseInt(values.inputLength || '0');
        const angle = parseInt(values.inputAngle || '0');

        const hasOffsetChanged = (panel.outputEpValues.oldOffset == null) || (offset != panel.outputEpValues.oldOffset);
        const hasWidthChanged = (panel.outputEpValues.oldWidth == null) || (width != panel.outputEpValues.oldWidth);
        const hasHeightChanged = (panel.outputEpValues.oldHeight == null) || (height != panel.outputEpValues.oldHeight);
        const hasAngleChanged = (panel.outputEpValues.oldAngle == null) || (angle != panel.outputEpValues.oldAngle);
        const hasLengthChanged = (panel.outputEpValues.oldLength == null) || (length != panel.outputEpValues.oldLength);
        const hasGradientChanged = (panel.outputEpValues.oldGradient == null) || (values.inputGradient != panel.outputEpValues.oldGradient);

        const hasChanged =
            hasOffsetChanged ||
            hasWidthChanged ||
            hasHeightChanged ||
            hasAngleChanged ||
            hasLengthChanged ||
            hasGradientChanged;

        if (!hasChanged) return {};

        const outputImage = Image.generatePattern(width, height, GradientTypes.Linear(offset, angle, length, values.inputGradient));

        return {
            oldOffset: offset,
            oldWidth: width,
            oldAngle: angle,
            oldLength: length,
            oldGradient: values.inputGradient,
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
    tags: ['picture', 'create', 'new', 'rainbow'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};