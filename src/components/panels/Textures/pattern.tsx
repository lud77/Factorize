import * as React from 'react';

import { Panel } from '../../../types/Panel';
import PatternTypes from '../../../domain/PatternTypes';
import { color2rgba } from '../../../utils/colors';
import * as Image from '../../../domain/Image';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'Pattern';

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
    name: 'HPeriod',
    defaultValue: 10,
    type: 'number',
    signal: 'Value'
}, {
    name: 'VPeriod',
    defaultValue: 10,
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
    defaultValue: Image.empty(100, 100, [0, 0, 0, 0]),
    type: 'image',
    signal: 'Value'
}];

const panelSizes = {
    ...defaultSizes,
    width: 134,
    height: 240
};

const create = (panelId: number): Panel => {
    const handleChange = ({ panel, machine }) => (e) => {
        machine.executePanelLogic(panelId, { tuningPatternType: e.target.value });

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
                            Object.keys(PatternTypes).map((patternType, key) => (<option key={key}>{patternType}</option>))
                        }
                    </select>
                </div>
            </div>
            <div className="Row">
                <InputEndpoint name="Width" panelId={panelId} signal="Value" editable={true} {...props}>Width</InputEndpoint>
                <OutputEndpoint name="Image" panelId={panelId} {...props}>Image</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Height" panelId={panelId} signal="Value" editable={true} {...props}>Height</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="HPeriod" panelId={panelId} signal="Value" editable={true} {...props}>X Period</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="VPeriod" panelId={panelId} signal="Value" editable={true} {...props}>Y Period</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="OffsetX" panelId={panelId} signal="Value" editable={true} {...props}>X Offset</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="OffsetY" panelId={panelId} signal="Value" editable={true} {...props}>Y Offset</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Foreground" panelId={panelId} signal="Value" editable={true} {...props}>Foreground</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Background" panelId={panelId} signal="Value" editable={true} {...props}>Background</InputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values) => {
        console.log('pattern execute');

        if (values.inputForeground == null || values.inputBackground == null) return { outputImage: null };

        const color = color2rgba(values.inputForeground);
        const bgcolor = color2rgba(values.inputBackground);

        if (color == null || bgcolor == null) return { outputImage: null };

        const patternType = values.tuningPatternType || 'Checkers';
        const patternFunction = PatternTypes[patternType];

        if (!patternFunction) return { outputImage: null };

        const width = parseInt(values.inputWidth || '0');
        const height = parseInt(values.inputHeight || '0');
        const hPeriod = parseInt(values.inputHPeriod || '10');
        const vPeriod = parseInt(values.inputVPeriod || '10');
        const offsetX = parseInt(values.inputOffsetX || '0');
        const offsetY = parseInt(values.inputOffsetY || '0');

        const hasForegroundChanged = (panel.outputEpValues.oldForeground == null) || (color.toString() != panel.outputEpValues.oldForeground.toString());
        const hasBackgroundChanged = (panel.outputEpValues.oldBackground == null) || (bgcolor.toString() != panel.outputEpValues.oldBackground.toString());
        const hasWidthChanged = (panel.outputEpValues.oldWidth == null) || (width != panel.outputEpValues.oldWidth);
        const hasHeightChanged = (panel.outputEpValues.oldHeight == null) || (height != panel.outputEpValues.oldHeight);
        const hasHPeriodChanged = (panel.outputEpValues.oldHPeriod == null) || (hPeriod != panel.outputEpValues.oldHPeriod);
        const hasVPeriodChanged = (panel.outputEpValues.oldVPeriod == null) || (vPeriod != panel.outputEpValues.oldVPeriod);
        const hasOffsetXChanged = (panel.outputEpValues.oldOffsetX == null) || (offsetX != panel.outputEpValues.oldOffsetX);
        const hasOffsetYChanged = (panel.outputEpValues.oldOffsetY == null) || (offsetY != panel.outputEpValues.oldOffsetY);
        const hasPatternChanged = (panel.outputEpValues.oldPattern == null) || (patternType != panel.outputEpValues.oldPattern);

        const hasChanged =
            hasForegroundChanged ||
            hasBackgroundChanged ||
            hasWidthChanged ||
            hasHeightChanged ||
            hasHPeriodChanged ||
            hasVPeriodChanged ||
            hasOffsetXChanged ||
            hasOffsetYChanged ||
            hasPatternChanged;

        if (!hasChanged) return {};

        const outputImage = Image.generatePattern(width, height, patternFunction(hPeriod, vPeriod, offsetX, offsetY, color, bgcolor));

        return {
            oldForeground: values.inputForeground,
            oldBackground: values.inputBackground,
            oldWidth: width,
            oldHeight: height,
            oldHPeriod: hPeriod,
            oldVPeriod: vPeriod,
            oldOffsetX: offsetX,
            oldOffsetY: offsetY,
            oldPattern: patternType,
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
    tags: ['picture', 'create', 'new', 'texture', 'generator'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};