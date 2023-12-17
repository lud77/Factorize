import * as React from 'react';

import { Panel } from '../../../types/Panel';
import * as Matrix from '../../../domain/signal-formats/Matrix';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'DotProduct';

const inputEndpoints = [{
    name: 'Matrix1',
    defaultValue: null,
    type: 'matrix',
    signal: 'Value'
}, {
    name: 'Matrix2',
    defaultValue: null,
    type: 'matrix',
    signal: 'Value'
}];

const outputEndpoints = [{
    name: 'Result',
    defaultValue: null,
    type: 'matrix',
    signal: 'Value'
}];

const panelSizes = {
    ...defaultSizes,
    width: 134,
    height: 74
};

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Matrix1" panelId={panelId} {...props}>Matrix 1</InputEndpoint>
                <OutputEndpoint name="Result" panelId={panelId} {...props}>Result</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Matrix2" panelId={panelId} {...props}>Matrix 2</InputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values) => {
        try {
            const outputResult = Matrix.dotProduct(values.inputMatrix1, values.inputMatrix2);
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
        ...panelSizes,
        Component,
        execute
    } as unknown as Panel;
};

const PanelBundle = {
    type: panelType,
    create,
    tags: ['algebra', 'matrix', 'matrices'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};

export default PanelBundle;