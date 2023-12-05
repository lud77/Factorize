import * as React from 'react';

import { Panel } from '../../../types/Panel';
import * as ColorAdjustments from '../../../domain/ColorAdjustments';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'ColorAdjust';

const inputEndpoints = [{
    name: 'Image',
    defaultValue: null,
    type: 'image',
    signal: 'Value'
}, {
    name: 'Amount',
    defaultValue: 100,
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
    height: 95
};

const Operators = {
    'Brightness': 'brightness',
    'Contrast': 'contrast',
    'Saturation': 'saturation',
    'Hue': 'hue',
    'Lighten': 'lighten',
    'Darken': 'darken',
    // 'Posterize': 'posterize',
    'Fade': 'fade'
};

const create = (panelId: number): Panel => {
    const handleChange = ({ panel, machine }) => (e) => {
        machine.executePanelLogic(panelId, { tuningOperator: e.target.value });

        return true;
    };

    const Component = (props) => {
        return <>
            <div className="Row">
                <div className="InteractiveItem">
                    <select
                        onChange={handleChange(props)}
                        defaultValue={ props.panel.outputEpValues.outputOperator || 'Lighten' }
                        style={{ width: '100%', borderRadius: '5px', border: 'none' }}
                        >
                        {
                            Object.keys(Operators).map((op, key) => (<option key={key}>{op}</option>))
                        }
                    </select>
                </div>
            </div>
            <div className="Row">
                <InputEndpoint name="Image" panelId={panelId} {...props}>Image</InputEndpoint>
                <OutputEndpoint name="Image" panelId={panelId} {...props}>Image</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Amount" panelId={panelId} editor="text" {...props}>Amount</InputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, inputs) => {
        console.log('execute operator', inputs);

        if (inputs.inputImage == null || inputs.inputAmount == null) return { outputImage: null };

        const hasImageChanged = (panel.outputEpValues.oldImage == null) || (inputs.inputImage != panel.outputEpValues.oldImage);
        const hasAmountChanged = (panel.outputEpValues.oldAmount == null) || (inputs.inputAmount != panel.outputEpValues.oldAmount);
        const hasOperatorChanged = (panel.outputEpValues.oldOperator == null) || (inputs.tuningOperator != panel.outputEpValues.oldOperator);

        const hasChanged = hasImageChanged || hasAmountChanged || hasOperatorChanged;

        if (!hasChanged) return {};

        const operatorName = inputs.tuningOperator || 'Lighten';
        if (!Operators[operatorName]) return { outputImage: null };

        const operatorFunc = Operators[operatorName];
        console.log('operatorFunc', operatorFunc);

        return Promise.resolve()
            .then(() => {
                return ColorAdjustments[operatorFunc](inputs.inputImage, inputs.inputAmount);
            })
            .then((outputImage) => {
                return {
                    outputImage,
                    oldImage: inputs.inputImage,
                    oldAmount: inputs.inputAmount,
                    oldOperator: inputs.tuningOperator
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
    } as unknown as Panel;
};

const PanelBundle = {
    type: panelType,
    create,
    tags: ['image', 'picture', 'effect', 'level'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};

export default PanelBundle;