import * as React from 'react';

import { Panel } from '../../../types/Panel';
import * as ImageTransforms from '../../../domain/ImageTransforms';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'Transform';

const inputEndpoints = [{
    name: 'Image',
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
    height: 74
};

const Operators = {
    'Flip Horizontally': 'flipX',
    'Flip Vertically': 'flipY',
    'Invert colors': 'invert',
    'Grey': 'grey',
    'Canny': 'cannyEdge',
    'Rotate 90° CW': 'rotate90',
    'Rotate 180°': 'rotate180',
    'Rotate 90° CCW': 'rotate270',
    // 'FFT': 'fourier',
    // 'Inverse FFT': 'inverseFourier'
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
                        defaultValue={ props.panel.outputEpValues.outputOperator || 'Flip Horizontally' }
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
        </>;
    };

    const execute = (panel, inputs) => {
        console.log('execute operator', inputs);

        if (inputs.inputImage == null) return { outputImage: null };

        const operatorName = inputs.tuningOperator || 'Flip Horizontally';
        if (!Operators[operatorName]) return { outputImage: null };

        const operatorFunc = Operators[operatorName];
        console.log('operatorFunc', operatorFunc);
        return Promise.resolve()
            .then(() => {
                return ImageTransforms[operatorFunc](inputs.inputImage);
            })
            .then((outputImage) => {
                return {
                    outputImage,
                    outputOperator: inputs.tuningOperator
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
    tags: ['image', 'picture', 'effect', 'flip', 'vertical', 'horizontal', 'invert', 'reverse'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};