import * as React from 'react';

import { Panel } from '../../../types/Panel';
import * as Matrix from '../../../domain/Matrix';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'Transpose';

const inputEndpoints = [{
    name: 'Matrix',
    defaultValue: null,
    type: 'matrix',
    signal: 'Value'
}];

const outputEndpoints = [{
    name: 'Transpose',
    defaultValue: null,
    type: 'matrix',
    signal: 'Value'
}];

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Matrix" panelId={panelId} {...props}>Matrix</InputEndpoint>
                <OutputEndpoint name="Transpose" panelId={panelId} {...props}>Transpose</OutputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values) => {
        try {
            const outputTranspose = Matrix.transpose(values.inputMatrix);
            return { outputTranspose };
        } catch (e) {
            return { outputTranspose: null };
        }
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        width: 134,
        height: 53,
        Component,
        execute
    } as Panel;
};

export default {
    type: panelType,
    create,
    tags: ['algebra', 'matrix', 'matrices'],
    inputEndpoints,
    outputEndpoints
};