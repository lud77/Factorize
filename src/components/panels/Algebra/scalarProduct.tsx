import * as React from 'react';

import { Panel } from '../../../types/Panel';
import * as Matrix from '../../../domain/Matrix';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'ScalarProduct';

const inputEndpoints = [{
    name: 'Matrix',
    defaultValue: null,
    type: 'matrix',
    signal: 'Value'
}, {
    name: 'Number',
    defaultValue: null,
    type: 'number',
    signal: 'Value'
}];

const outputEndpoints = [{
    name: 'Result',
    default: null,
    type: 'matrix',
    signal: 'Value'
}];

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Matrix" panelId={panelId} {...props}>Matrix</InputEndpoint>
                <OutputEndpoint name="Result" panelId={panelId} {...props}>Result</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Number" panelId={panelId} {...props}>Number</InputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values) => {
        try {
            const outputResult = Matrix.scalarProduct(values.inputMatrix, values.inputNumber);
            return { outputResult };
        } catch (e) {
            return { outputResult: null };
        }
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        width: 134,
        height: 74,
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