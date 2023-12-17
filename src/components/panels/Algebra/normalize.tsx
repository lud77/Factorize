import * as React from 'react';

import { Panel } from '../../../types/Panel';
import * as Matrix from '../../../domain/signal-formats/Matrix';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'Normalize';

const inputEndpoints = [{
    name: 'Matrix',
    defaultValue: null,
    type: 'matrix',
    signal: 'Value'
}];

const outputEndpoints = [{
    name: 'Normalized',
    defaultValue: null,
    type: 'matrix',
    signal: 'Value'
}];

const panelSizes = {
    ...defaultSizes,
    width: 144,
    height: 53
};

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Matrix" panelId={panelId} {...props}>Matrix</InputEndpoint>
                <OutputEndpoint name="Normalized" panelId={panelId} {...props}>Normalized</OutputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values) => {
        try {
            const outputNormalized = Matrix.scalarProduct(values.inputMatrix, 1 / (Matrix.grandSum(values.inputMatrix) || 1));
            return { outputNormalized };
        } catch (e) {
            return { outputNormalized: null };
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