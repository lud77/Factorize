import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'Morphology';

const inputEndpoints = [{
    name: 'Image',
    defaultValue: null,
    type: 'image',
    signal: 'Value'
}, {
    name: 'Iterations',
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
    height: 95
};

const MorphologicalOperators = {
    'Dilate': 'dilate',
    'Erode': 'erode',
    'Open': 'open',
    'Close': 'close',
    'Black Hat': 'blackHat',
    'Top Hat': 'topHat'
};

const create = (panelId: number): Panel => {
    const handleChange = ({ panel, machine }) => (e) => {
        machine.executePanelLogic(panelId, { tuningMorphologicalOperator: e.target.value });

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
                            Object.keys(MorphologicalOperators).map((op, key) => (<option key={key}>{op}</option>))
                        }
                    </select>
                </div>
            </div>
            <div className="Row">
                <InputEndpoint name="Image" panelId={panelId} {...props}>Image</InputEndpoint>
                <OutputEndpoint name="Image" panelId={panelId} {...props}>Image</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Iterations" panelId={panelId} editable={true} {...props}>Iterations</InputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, inputs) => {
        console.log('execute morphological operator', inputs);

        if (!inputs.inputIterations || isNaN(inputs.inputIterations) || !inputs.inputImage) return { outputImage: null };
        if (inputs.inputImage.components > 1) return { outputImage: null };

        const operatorName = inputs.tuningMorphologicalOperator || 'Dilate';
        if (!MorphologicalOperators[operatorName]) return { outputImage: null };

        const operatorFunc = MorphologicalOperators[operatorName];

        return Promise.resolve()
            .then(() => inputs.inputImage[operatorFunc]({ iterations: parseInt(inputs.inputIterations) }))
            .then((outputImage) => {
                return { outputImage };
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
    tags: ['image', 'picture', 'filter', 'effect'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};