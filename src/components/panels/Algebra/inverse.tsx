import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'Inverse';

const inputEndpoints = [{
    name: 'Value',
    defaultValue: 0,
    type: 'number',
    signal: 'Value'
}];

const outputEndpoints = [{
    name: 'Inverse',
    defaultValue: 0,
    type: 'number',
    signal: 'Value'
}];

const panelSizes = {
    ...defaultSizes,
    width: 134,
    height: 54
};

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Value" panelId={panelId} {...props}>Value</InputEndpoint>
                <OutputEndpoint name="Inverse" panelId={panelId} {...props}>1/Value</OutputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values) => {
        if (isNaN(values.inputValue)) return { outputInverse: '' };
        return { outputInverse: 1/parseFloat(values.inputValue) };
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
    tags: ['algebra'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};

export default PanelBundle;