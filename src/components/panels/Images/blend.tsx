import * as React from 'react';

import { Panel } from '../../../types/Panel';
import BlendModes from '../../../domain/BlendModes';
import { blend } from '../../../domain/Image';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'Blend';

const inputEndpoints = [{
    name: 'Source',
    defaultValue: null,
    type: 'image',
    signal: 'Value'
}, {
    name: 'Base',
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
}, {
    name: 'Opacity',
    defaultValue: 1,
    type: 'number',
    signal: 'Value'
}, {
    name: 'Fill',
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
    height: 179
};

const create = (panelId: number): Panel => {
    const handleChange = ({ panel, machine }) => (e) => {
        machine.executePanelLogic(panelId, { tuningBlendingMode: e.target.value });

        return true;
    };

    const Component = (props) => {
        return <>
            <div className="Row">
                <div className="InteractiveItem">
                    <select
                        onChange={handleChange(props)}
                        defaultValue={ props.panel.outputEpValues.outputBlendingMode || 'Superimpose' }
                        style={{ width: '100%', borderRadius: '5px', border: 'none' }}
                        >
                        {
                            Object.keys(BlendModes).map((blendMode, key) => (<option key={key}>{blendMode}</option>))
                        }
                    </select>
                </div>
            </div>
            <div className="Row">
                <InputEndpoint name="Source" panelId={panelId} signal="Value" {...props}>Source</InputEndpoint>
                <OutputEndpoint name="Image" panelId={panelId} {...props}>Image</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Base" panelId={panelId} signal="Value" {...props}>Base</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="X" panelId={panelId} signal="Value" editor="text" {...props}>X</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Y" panelId={panelId} signal="Value" editor="text" {...props}>Y</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Opacity" panelId={panelId} signal="Value" editor="text" {...props}>Opacity</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Fill" panelId={panelId} signal="Value" editor="text" {...props}>Fill</InputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values) => {
        console.log('blend image execute');

        if (values.inputSource == null || values.inputBase == null) return { outputImage: null };

        if (values.inputSource.ColorModel != values.inputBase.ColorModel) return { outputImage: null };

        const blendingMode = values.tuningBlendingMode || 'Superimpose';
        const blendFunction = BlendModes[blendingMode];

        if (!blendFunction) return { outputImage: null };

        const x = values.inputX ? parseInt(values.inputX) : 0;
        const y = values.inputY ? parseInt(values.inputY) : 0;
        const opacity = values.inputOpacity ? parseInt(values.inputOpacity) : 0;
        const fill = values.inputFill ? parseInt(values.inputFill) : 0;

        const hasXChanged = (panel.outputEpValues.oldX == null) || (x != panel.outputEpValues.oldX);
        const hasYChanged = (panel.outputEpValues.oldY == null) || (y != panel.outputEpValues.oldY);
        const hasOpacityChanged = (panel.outputEpValues.oldOpacity == null) || (opacity != panel.outputEpValues.oldOpacity);
        const hasFillChanged = (panel.outputEpValues.oldFill == null) || (fill != panel.outputEpValues.oldFill);
        const hasSourceChanged = (panel.outputEpValues.oldSource == null) || (values.inputSource != panel.outputEpValues.oldSource);
        const hasBaseChanged = (panel.outputEpValues.oldBase == null) || (values.inputBase != panel.outputEpValues.oldBase);
        const hasModeChanged = (panel.outputEpValues.oldMode == null) || (blendingMode != panel.outputEpValues.oldMode);

        const hasChanged =
            hasXChanged ||
            hasYChanged ||
            hasSourceChanged ||
            hasBaseChanged ||
            hasOpacityChanged ||
            hasFillChanged ||
            hasModeChanged;

        if (!hasChanged) return {};

        return Promise.resolve()
            .then(() => {
                return blend(
                    values.inputSource,
                    values.inputBase,
                    x, y,
                    blendFunction,
                    values.inputOpacity
                );
            })
            .then((outputImage) => {
                return {
                    oldX: values.inputX,
                    oldY: values.inputY,
                    oldMode: blendingMode,
                    oldSource: values.inputSource,
                    oldBase: values.inputBase,
                    outputImage
                };
            })
            .catch(() => {
                return { outputImage: null };
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